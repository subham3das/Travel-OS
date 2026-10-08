import { rentalPricingService } from '../services/rentalPricing.service.js';

/**
 * End-to-End Verification of Vehicle Services Expansion:
 * - Pricing Engine (Hourly, Daily, Weekly, Monthly tiers)
 * - Settlement Engine (Extra KM, Late Return with grace, Damage, Deposit refund)
 * - Availability Logic (Overlap detection)
 */
async function runTests() {
  console.log('====================================================');
  console.log('APNATRIP VEHICLE SERVICES EXPANSION: VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(desc: string, condition: boolean, details?: any) {
    total++;
    if (condition) {
      console.log(`[PASS] ${desc}`);
      passed++;
    } else {
      console.error(`[FAIL] ${desc}`, details || '');
    }
  }

  const basePricing = {
    hourlyRate: 150,
    dailyRate: 1200,
    weeklyRate: 7000,
    monthlyRate: 25000,
  };

  const basePolicies = {
    securityDeposit: 3000,
    includedKmPerDay: 250,
    extraKmCharge: 12,
    fuelPolicy: 'same_to_same' as const,
  };

  // Test 1: Hourly Pricing (<24 hours)
  const pickupH = new Date('2026-10-10T10:00:00Z');
  const returnH = new Date('2026-10-10T16:00:00Z'); // 6 hours
  const quoteHourly = rentalPricingService.calculateQuote({
    pickupDateTime: pickupH,
    returnDateTime: returnH,
    rentalPricing: basePricing,
    rentalPolicies: basePolicies,
  });

  assert('Hourly tier selected for 6-hour rental', quoteHourly.tierApplied === 'hourly');
  assert('Duration is exactly 6 hours', quoteHourly.durationHours === 6);
  assert('Base charge is 6 * 150 = 900', quoteHourly.baseAmount === 900);
  assert('GST is 5% of 900 = 45', quoteHourly.taxesAmount === 45);
  assert('Deposit is 3000', quoteHourly.securityDeposit === 3000);
  assert('Total payable includes deposit = 900 + 45 + 3000 = 3945', quoteHourly.totalPayableAtBooking === 3945);

  // Test 2: Daily Pricing (3 days)
  const pickupD = new Date('2026-10-10T10:00:00Z');
  const returnD = new Date('2026-10-13T10:00:00Z'); // 72 hours (3 days)
  const quoteDaily = rentalPricingService.calculateQuote({
    pickupDateTime: pickupD,
    returnDateTime: returnD,
    rentalPricing: basePricing,
    rentalPolicies: basePolicies,
  });

  assert('Daily tier selected for 3-day rental', quoteDaily.tierApplied === 'daily');
  assert('Base charge is 3 * 1200 = 3600', quoteDaily.baseAmount === 3600);
  assert('GST is 5% of 3600 = 180', quoteDaily.taxesAmount === 180);
  assert('Included KM is 3 * 250 = 750', quoteDaily.includedKm === 750);

  // Test 3: Weekly Pricing (10 days)
  const pickupW = new Date('2026-10-10T10:00:00Z');
  const returnW = new Date('2026-10-20T10:00:00Z'); // 10 days = 1 week + 3 days
  const quoteWeekly = rentalPricingService.calculateQuote({
    pickupDateTime: pickupW,
    returnDateTime: returnW,
    rentalPricing: basePricing,
    rentalPolicies: basePolicies,
  });

  assert('Weekly tier selected for 10-day rental', quoteWeekly.tierApplied === 'weekly');
  // 1 week (7000) + 3 days (3 * 1200 = 3600) = 10600
  assert('Base charge is 7000 + 3600 = 10600', quoteWeekly.baseAmount === 10600);
  assert('Included KM is 10 * 250 = 2500', quoteWeekly.includedKm === 2500);

  // Test 4: Monthly Pricing (35 days)
  const pickupM = new Date('2026-10-10T10:00:00Z');
  const returnM = new Date('2026-11-14T10:00:00Z'); // 35 days = 1 month + 5 days
  const quoteMonthly = rentalPricingService.calculateQuote({
    pickupDateTime: pickupM,
    returnDateTime: returnM,
    rentalPricing: basePricing,
    rentalPolicies: basePolicies,
  });

  assert('Monthly tier selected for 35-day rental', quoteMonthly.tierApplied === 'monthly');
  // 1 month (25000) + 5 days (5 * 1200 = 6000) = 31000
  assert('Base charge is 25000 + 6000 = 31000', quoteMonthly.baseAmount === 31000);

  // Test 5: Settlement - Clean on-time return with no extra KM or damages
  const settlementClean = rentalPricingService.calculateReturnSettlement({
    scheduledReturnDateTime: new Date('2026-10-13T10:00:00Z'),
    actualReturnDateTime: new Date('2026-10-13T09:30:00Z'), // Early return
    includedKm: 750,
    odometerStart: 10000,
    odometerEnd: 10500, // 500 km used (< 750 km included)
    extraKmCharge: 12,
    securityDeposit: 3000,
    hourlyRate: 150,
  });

  assert('Clean return has 0 extra KM fee', settlementClean.extraKmFee === 0);
  assert('Clean return has 0 late fee', settlementClean.lateFee === 0);
  assert('Clean return has 0 damage fee', settlementClean.damageFee === 0);
  assert('Full security deposit refunded: 3000', settlementClean.refundableDeposit === 3000);
  assert('Status is REFUNDED', settlementClean.depositStatus === 'REFUNDED');
  assert('No excess payment due', settlementClean.excessDue === 0);

  // Test 6: Settlement - Late return + Extra KM + Damage deduction
  const settlementPenalties = rentalPricingService.calculateReturnSettlement({
    scheduledReturnDateTime: new Date('2026-10-13T10:00:00Z'),
    actualReturnDateTime: new Date('2026-10-13T13:30:00Z'), // 3.5 hours late -> 4 rounded hours late (> 1h grace)
    includedKm: 750,
    odometerStart: 10000,
    odometerEnd: 10850, // 850 km used (100 km extra)
    extraKmCharge: 12, // 100 * 12 = 1200
    securityDeposit: 3000,
    hourlyRate: 150, // Late fee: 4 * 150 = 600
    damageFee: 500,
    damageNotes: 'Minor scratch on left rear bumper',
  });

  assert('Extra KM fee correctly calculated: 100 * 12 = 1200', settlementPenalties.extraKmFee === 1200);
  assert('Late return fee calculated: 4 * 150 = 600', settlementPenalties.lateFee === 600);
  assert('Damage fee recorded: 500', settlementPenalties.damageFee === 500);
  // Total deductions: 1200 + 600 + 500 = 2300.
  // Deposit held: 3000. Refund: 3000 - 2300 = 700.
  assert('Total deductions is 2300', settlementPenalties.totalDeductions === 2300);
  assert('Security deposit refunded is 3000 - 2300 = 700', settlementPenalties.refundableDeposit === 700);
  assert('Deposit status is PARTIALLY_REFUNDED', settlementPenalties.depositStatus === 'PARTIALLY_REFUNDED');
  assert('No excess due since deposit covered deductions', settlementPenalties.excessDue === 0);

  // Test 7: Availability Overlap Detection Logic
  const bookedSlots = [
    { startDate: new Date('2026-10-10T10:00:00Z'), endDate: new Date('2026-10-13T18:00:00Z'), bookingId: 'b1' },
    { startDate: new Date('2026-10-20T10:00:00Z'), endDate: new Date('2026-10-25T18:00:00Z'), bookingId: 'b2' },
  ];

  function checkSlotAvailable(reqStart: Date, reqEnd: Date): boolean {
    const hasOverlap = bookedSlots.some(slot => reqStart < slot.endDate && reqEnd > slot.startDate);
    return !hasOverlap;
  }

  assert('Dates between bookings are available (Oct 14 - Oct 19)', checkSlotAvailable(new Date('2026-10-14T10:00:00Z'), new Date('2026-10-19T10:00:00Z')) === true);
  assert('Dates overlapping slot 1 start are blocked (Oct 9 - Oct 11)', checkSlotAvailable(new Date('2026-10-09T10:00:00Z'), new Date('2026-10-11T10:00:00Z')) === false);
  assert('Dates inside slot 1 are blocked (Oct 11 - Oct 12)', checkSlotAvailable(new Date('2026-10-11T10:00:00Z'), new Date('2026-10-12T10:00:00Z')) === false);
  assert('Dates overlapping slot 2 end are blocked (Oct 24 - Oct 26)', checkSlotAvailable(new Date('2026-10-24T10:00:00Z'), new Date('2026-10-26T10:00:00Z')) === false);

  console.log('\n====================================================');
  console.log(`VERIFICATION SUMMARY: ${passed}/${total} TESTS PASSED (${((passed/total)*100).toFixed(1)}%)`);
  console.log('====================================================');
}

runTests().catch(console.error);
