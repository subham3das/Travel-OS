import { IRentalPricing, IRentalPolicies } from '../models/car.model.js';

export interface CalculateRentalPriceParams {
  pickupDateTime: Date | string;
  returnDateTime: Date | string;
  rentalPricing?: IRentalPricing;
  rentalPolicies?: IRentalPolicies;
  dailyPriceFallback?: number;
}

export interface RentalPricingQuote {
  durationHours: number;
  totalDays: number;
  tierApplied: 'hourly' | 'daily' | 'weekly' | 'monthly';
  unitRate: number;
  baseAmount: number;
  taxesAmount: number;
  securityDeposit: number;
  totalRentalAmount: number; // baseAmount + taxesAmount
  totalPayableAtBooking: number; // totalRentalAmount + securityDeposit
  includedKm: number;
  extraKmCharge: number;
  fuelPolicy: string;
  breakdown: {
    label: string;
    rateDescription: string;
    subtotal: number;
  };
}

export interface ReturnSettlementParams {
  securityDeposit: number;
  scheduledReturnDateTime: Date;
  actualReturnDateTime: Date;
  odometerStart?: number;
  odometerEnd?: number;
  includedKm: number;
  extraKmCharge: number;
  hourlyRate?: number;
  dailyRate?: number;
  damageFee?: number;
  damageNotes?: string;
  fuelDifferenceFee?: number;
}

export interface ReturnSettlementResult {
  extraKm: number;
  extraKmFee: number;
  lateHours: number;
  lateFee: number;
  damageFee: number;
  fuelDifferenceFee: number;
  totalDeductions: number;
  refundableDeposit: number;
  excessDue: number; // if deductions exceed deposit
  depositStatus: 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'DEDUCTED';
}

export class RentalPricingService {
  private readonly GST_RATE = 0.05; // 5% GST for vehicle rentals in India

  /**
   * Automatically select best pricing tier (hourly, daily, weekly, monthly)
   * based on duration and configured rental pricing.
   */
  public calculateQuote(params: CalculateRentalPriceParams): RentalPricingQuote {
    const pickup = new Date(params.pickupDateTime);
    const drop = new Date(params.returnDateTime);

    const diffMs = drop.getTime() - pickup.getTime();
    if (isNaN(diffMs) || diffMs <= 0) {
      throw new Error('Return time must be after pickup time.');
    }

    const durationHours = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60)));
    const totalDays = Math.max(1, Math.ceil(durationHours / 24));

    const pricing = params.rentalPricing;
    const policies = params.rentalPolicies;
    const fallbackDaily = params.dailyPriceFallback || 2000;

    const hourlyRate = pricing?.hourlyRate;
    const dailyRate = pricing?.dailyRate || fallbackDaily;
    const weeklyRate = pricing?.weeklyRate;
    const monthlyRate = pricing?.monthlyRate;

    const securityDeposit = policies?.securityDeposit ?? 3000;
    const includedKmPerDay = policies?.includedKmPerDay ?? 300;
    const extraKmCharge = policies?.extraKmCharge ?? 12;
    const fuelPolicy = policies?.fuelPolicy || 'same_to_same';
    const totalIncludedKm = totalDays * includedKmPerDay;

    let tierApplied: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily';
    let baseAmount = 0;
    let unitRate = dailyRate;
    let rateDescription = `₹${dailyRate}/day x ${totalDays} day(s)`;

    // 1. Tier selection
    if (durationHours < 24 && hourlyRate && hourlyRate > 0) {
      const minHours = policies?.minRentalDurationHours || 4;
      const billableHours = Math.max(minHours, durationHours);
      const hourlyTotal = billableHours * hourlyRate;
      // Cap at daily rate if hourly is more expensive
      if (hourlyTotal < dailyRate) {
        tierApplied = 'hourly';
        unitRate = hourlyRate;
        baseAmount = hourlyTotal;
        rateDescription = `₹${hourlyRate}/hr x ${billableHours} hr(s)`;
      } else {
        tierApplied = 'daily';
        unitRate = dailyRate;
        baseAmount = dailyRate;
        rateDescription = `₹${dailyRate}/day (Full Day Cap)`;
      }
    } else if (totalDays >= 30 && monthlyRate && monthlyRate > 0) {
      tierApplied = 'monthly';
      const months = Math.floor(totalDays / 30);
      const remDays = totalDays % 30;
      baseAmount = months * monthlyRate + remDays * dailyRate;
      unitRate = monthlyRate;
      rateDescription = `₹${monthlyRate}/mo x ${months} mo + ₹${dailyRate}/day x ${remDays} day(s)`;
    } else if (totalDays >= 7 && weeklyRate && weeklyRate > 0) {
      tierApplied = 'weekly';
      const weeks = Math.floor(totalDays / 7);
      const remDays = totalDays % 7;
      baseAmount = weeks * weeklyRate + remDays * dailyRate;
      unitRate = weeklyRate;
      rateDescription = `₹${weeklyRate}/wk x ${weeks} wk + ₹${dailyRate}/day x ${remDays} day(s)`;
    } else {
      tierApplied = 'daily';
      unitRate = dailyRate;
      baseAmount = totalDays * dailyRate;
      rateDescription = `₹${dailyRate}/day x ${totalDays} day(s)`;
    }

    const taxesAmount = Math.round(baseAmount * this.GST_RATE);
    const totalRentalAmount = baseAmount + taxesAmount;
    const totalPayableAtBooking = totalRentalAmount + securityDeposit;

    return {
      durationHours,
      totalDays,
      tierApplied,
      unitRate,
      baseAmount,
      taxesAmount,
      securityDeposit,
      totalRentalAmount,
      totalPayableAtBooking,
      includedKm: totalIncludedKm,
      extraKmCharge,
      fuelPolicy,
      breakdown: {
        label: `${tierApplied.toUpperCase()} Rental Package`,
        rateDescription,
        subtotal: baseAmount,
      },
    };
  }

  /**
   * Calculate checkout settlement, extra KM, late return fees, and deposit refund.
   */
  public calculateReturnSettlement(params: ReturnSettlementParams): ReturnSettlementResult {
    // 1. Extra KM calculation
    let extraKm = 0;
    let extraKmFee = 0;
    if (params.odometerStart !== undefined && params.odometerEnd !== undefined) {
      const totalKmDriven = Math.max(0, params.odometerEnd - params.odometerStart);
      if (totalKmDriven > params.includedKm) {
        extraKm = totalKmDriven - params.includedKm;
        extraKmFee = Math.round(extraKm * params.extraKmCharge);
      }
    }

    // 2. Late Return calculation (1 hour grace period)
    let lateHours = 0;
    let lateFee = 0;
    const scheduledEnd = new Date(params.scheduledReturnDateTime).getTime();
    const actualEnd = new Date(params.actualReturnDateTime).getTime();

    if (actualEnd > scheduledEnd) {
      const delayMs = actualEnd - scheduledEnd;
      const delayMinutes = delayMs / (1000 * 60);
      if (delayMinutes > 60) {
        // Exceeded 1 hour grace
        lateHours = Math.ceil(delayMinutes / 60);
        const hourlyLateRate = params.hourlyRate || Math.round((params.dailyRate || 2000) / 10);
        lateFee = lateHours * hourlyLateRate;
      }
    }

    // 3. Damage fee & Fuel difference fee
    const damageFee = Math.max(0, params.damageFee || 0);
    const fuelDifferenceFee = Math.max(0, params.fuelDifferenceFee || 0);

    // 4. Net settlement
    const totalDeductions = extraKmFee + lateFee + damageFee + fuelDifferenceFee;
    const securityDeposit = params.securityDeposit || 0;

    let refundableDeposit = 0;
    let excessDue = 0;
    let depositStatus: 'REFUNDED' | 'PARTIALLY_REFUNDED' | 'DEDUCTED' = 'REFUNDED';

    if (totalDeductions === 0) {
      refundableDeposit = securityDeposit;
      depositStatus = 'REFUNDED';
    } else if (totalDeductions < securityDeposit) {
      refundableDeposit = securityDeposit - totalDeductions;
      depositStatus = 'PARTIALLY_REFUNDED';
    } else {
      refundableDeposit = 0;
      excessDue = totalDeductions - securityDeposit;
      depositStatus = 'DEDUCTED';
    }

    return {
      extraKm,
      extraKmFee,
      lateHours,
      lateFee,
      damageFee,
      fuelDifferenceFee,
      totalDeductions,
      refundableDeposit,
      excessDue,
      depositStatus,
    };
  }
}

export const rentalPricingService = new RentalPricingService();
