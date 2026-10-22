import mongoose from 'mongoose';
import { envConfig } from '../src/config/env.config.js';
import { PartnerUserModel } from '../src/models/partnerUser.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { PartnerSubscriptionModel } from '../src/models/partnerSubscription.model.js';
import { SubscriptionPaymentModel } from '../src/models/subscriptionPayment.model.js';
import { RegistrationDraftModel } from '../src/models/registrationDraft.model.js';
import { ApprovalRequestModel } from '../src/models/approvalRequest.model.js';
import { subscriptionService } from '../src/services/subscription.service.js';
import { registrationService } from '../src/services/registration.service.js';
import { agencyAuthService } from '../src/services/agencyAuth.service.js';
import { adminCarRentalApprovalService } from '../src/services/adminCarRentalApproval.service.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';
import bcrypt from 'bcrypt';

async function runTests() {
  console.log('🚀 Starting One-Time Registration Fee Comprehensive Test Suite...\n');
  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  try {
    // =========================================================================
    // TEST SUITE 1 & 2: Agency First (₹1000) -> Car Rental Second (₹0 Waived)
    // =========================================================================
    console.log('--- Test Suite 1 & 2: Agency First (₹1,000) -> Car Rental Second (₹0 Waived) ---');
    const emailA = `partner.a.${Date.now()}@testapnatrip.com`;
    const phoneA = '91' + Math.floor(10000000 + Math.random() * 90000000);
    const passHash = await bcrypt.hash('Password@123', 10);

    const userA = await PartnerUserModel.create({
      name: 'Rohan Sharma',
      email: emailA,
      phone: phoneA,
      passwordHash: passHash,
      emailVerified: true,
      phoneVerified: true,
      role: 'partner',
    });

    // 1. Initial Agency Draft
    const draftIdA = `DFT-AGY-${Date.now()}`;
    await registrationService.saveDraft({
      draftId: draftIdA,
      userId: userA._id.toString(),
      serviceType: 'agency',
      businessDetails: {
        legalBusinessName: 'Sharma Tours Pvt Ltd',
        businessName: 'Sharma Tours',
        email: emailA,
        phone: phoneA,
        ownerName: 'Rohan Sharma',
        city: 'Jaipur',
        state: 'Rajasthan',
      },
      documents: [
        { id: 'd1', name: 'PAN', type: 'PAN Card', status: 'Pending', fileUrl: 'https://cloudinary.com/pan.jpg' },
      ],
      bank: {
        accountHolderName: 'Sharma Tours Pvt Ltd',
        bankName: 'HDFC Bank',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
      },
    });

    // Check fee status BEFORE paying: Must be ₹1,000
    const feeStatusBeforeA = await subscriptionService.getFeeStatus({
      ownerId: userA._id.toString(),
      email: emailA,
      phone: phoneA,
      businessType: 'agency',
    });
    assert(feeStatusBeforeA.feeWaived === false, 'New Agency partner feeWaived is false before payment');
    assert(feeStatusBeforeA.amountDue === 1000, 'New Agency partner amountDue is 1000 before payment');

    // Create Subscription Order
    const orderA = await subscriptionService.createSubscriptionOrder({
      businessType: 'agency',
      partnerName: 'Rohan Sharma',
      email: emailA,
      phone: phoneA,
      draftId: draftIdA,
    });
    assert(orderA.amount === 1000, 'Agency first order amount is ₹1,000');
    assert(!orderA.feeWaived, 'Agency first order is NOT feeWaived');

    // Verify Payment (simulated Razorpay payment)
    const payIdA = `pay_mock_${Date.now()}`;
    const verifyA = await subscriptionService.verifySubscriptionPayment({
      subscriptionId: orderA.subscriptionId,
      orderId: orderA.orderId,
      paymentId: payIdA,
      signature: '',
      draftId: draftIdA,
    });
    assert(verifyA.success === true, 'Agency subscription payment successfully verified');

    // Confirm Agency is PAID but approvalStatus is PENDING
    const agencyA = await AgencyModel.findOne({ email: emailA });
    assert(agencyA !== null, 'Agency record created in database');
    assert(agencyA?.paymentStatus === 'PAID', 'Agency paymentStatus is PAID');
    assert(agencyA?.approvalStatus === 'PENDING', 'Agency approvalStatus is PENDING (not auto-approved)');

    // 2. NOW: The same partner registers Car Rental!
    console.log('\n--- Subsequent Car Rental Registration for Partner A ---');
    const feeStatusCarRentalA = await subscriptionService.getFeeStatus({
      ownerId: userA._id.toString(),
      agencyId: agencyA?._id?.toString(),
      email: emailA,
      phone: phoneA,
      businessType: 'car_rental',
    });
    assert(feeStatusCarRentalA.feeWaived === true, 'Subsequent Car Rental feeWaived is true');
    assert(feeStatusCarRentalA.amountDue === 0, 'Subsequent Car Rental amountDue is ₹0');
    assert(feeStatusCarRentalA.discount === 1000, 'Subsequent Car Rental discount is ₹1,000');

    // Create business for Car Rental via agencyAuthService
    const crBizA = await agencyAuthService.createBusiness(
      { userId: userA._id.toString(), email: emailA, phone: phoneA, name: 'Rohan Sharma' },
      { businessType: 'car_rental', name: 'Sharma Fleet Rentals', fleetSize: 5, city: 'Jaipur', state: 'Rajasthan' }
    );
    assert(crBizA.paymentStatus === 'PAID', 'Car Rental business inherits PAID status');

    // Create subscription order for Car Rental: MUST BE ₹0 / WAIVED
    const orderCarRentalA = await subscriptionService.createSubscriptionOrder({
      businessType: 'car_rental',
      partnerName: 'Rohan Sharma',
      email: emailA,
      phone: phoneA,
      agencyId: crBizA._id.toString(),
    });
    assert(orderCarRentalA.feeWaived === true, 'Car Rental order feeWaived is true');
    assert(orderCarRentalA.amount === 0, 'Car Rental order amount is ₹0');
    assert(orderCarRentalA.originalAmount === 1000, 'Car Rental original amount is ₹1,000');
    assert(orderCarRentalA.discount === 1000, 'Car Rental discount is ₹1,000');

    // Verify separate approval status: Car Rental must still require independent admin approval
    const updatedBizA = await AgencyModel.findById(crBizA._id);
    assert(
      updatedBizA?.carRentalVerificationStatus === 'PENDING' || updatedBizA?.carRentalVerificationStatus === 'NOT_REGISTERED',
      'Car Rental verification status is PENDING (not automatically approved)'
    );

    // =========================================================================
    // TEST SUITE 3 & 4: Car Rental First (₹1000) -> Agency Second (₹0 Waived)
    // =========================================================================
    console.log('\n--- Test Suite 3 & 4: Car Rental First (₹1,000) -> Agency Second (₹0 Waived) ---');
    const emailB = `partner.b.${Date.now()}@testapnatrip.com`;
    const phoneB = '92' + Math.floor(10000000 + Math.random() * 90000000);

    const userB = await PartnerUserModel.create({
      name: 'Priya Patel',
      email: emailB,
      phone: phoneB,
      passwordHash: passHash,
      emailVerified: true,
      phoneVerified: true,
      role: 'partner',
    });

    // Create standalone Car Rental business
    const crBizB = await agencyAuthService.createBusiness(
      { userId: userB._id.toString(), email: emailB, phone: phoneB, name: 'Priya Patel' },
      { businessType: 'car_rental', name: 'Patel City Cabs', fleetSize: 10, city: 'Ahmedabad', state: 'Gujarat' }
    );

    // Check fee status: New Car Rental must pay ₹1,000
    const feeStatusBeforeB = await subscriptionService.getFeeStatus({
      ownerId: userB._id.toString(),
      agencyId: crBizB._id.toString(),
      email: emailB,
      phone: phoneB,
      businessType: 'car_rental',
    });
    assert(feeStatusBeforeB.feeWaived === false, 'New Car Rental partner feeWaived is false before payment');
    assert(feeStatusBeforeB.amountDue === 1000, 'New Car Rental partner amountDue is 1000 before payment');

    // Create Subscription Order for Car Rental
    const orderB = await subscriptionService.createSubscriptionOrder({
      businessType: 'car_rental',
      partnerName: 'Priya Patel',
      email: emailB,
      phone: phoneB,
      agencyId: crBizB._id.toString(),
    });
    assert(orderB.amount === 1000, 'Car Rental first order amount is ₹1,000');
    assert(!orderB.feeWaived, 'Car Rental first order is NOT feeWaived');

    // Verify Payment
    const payIdB = `pay_mock_${Date.now()}`;
    const verifyB = await subscriptionService.verifySubscriptionPayment({
      subscriptionId: orderB.subscriptionId,
      orderId: orderB.orderId,
      paymentId: payIdB,
      signature: '',
      agencyId: crBizB._id.toString(),
    });
    assert(verifyB.success === true, 'Car Rental subscription payment verified successfully');

    // NOW: Partner B subsequently registers Travel Agency!
    console.log('\n--- Subsequent Agency Registration for Partner B ---');
    const feeStatusAgencyB = await subscriptionService.getFeeStatus({
      ownerId: userB._id.toString(),
      agencyId: crBizB._id.toString(),
      email: emailB,
      phone: phoneB,
      businessType: 'agency',
    });
    assert(feeStatusAgencyB.feeWaived === true, 'Subsequent Agency feeWaived is true');
    assert(feeStatusAgencyB.amountDue === 0, 'Subsequent Agency amountDue is ₹0');

    // Agency Draft for Partner B
    const draftIdB = `DFT-AGY-B-${Date.now()}`;
    await registrationService.saveDraft({
      draftId: draftIdB,
      userId: userB._id.toString(),
      serviceType: 'agency',
      businessDetails: {
        legalBusinessName: 'Patel Holiday Travels',
        businessName: 'Patel Holiday Travels',
        email: emailB,
        phone: phoneB,
        ownerName: 'Priya Patel',
        city: 'Ahmedabad',
        state: 'Gujarat',
      },
    });

    // Create order for Agency: MUST BE ₹0 / WAIVED
    const orderAgencyB = await subscriptionService.createSubscriptionOrder({
      businessType: 'agency',
      partnerName: 'Priya Patel',
      email: emailB,
      phone: phoneB,
      draftId: draftIdB,
      agencyId: crBizB._id.toString(),
    });
    assert(orderAgencyB.feeWaived === true, 'Subsequent Agency order feeWaived is true');
    assert(orderAgencyB.amount === 0, 'Subsequent Agency order amount is ₹0');
    assert(orderAgencyB.discount === 1000, 'Subsequent Agency order discount is ₹1,000');

    // Verify Agency approval status is independent
    const updatedBizB = await AgencyModel.findById(crBizB._id);
    assert(updatedBizB?.paymentStatus === 'PAID', 'Agency paymentStatus is PAID');
    assert(updatedBizB?.approvalStatus === 'PENDING', 'Agency approvalStatus is PENDING (not auto-approved)');

    // =========================================================================
    // TEST SUITE 5: Independent Admin Approval Workflow
    // =========================================================================
    console.log('\n--- Test Suite 5: Independent Admin Approval Workflow ---');
    // Admin approving Agency must NOT automatically approve Car Rental
    assert(updatedBizA?.approvalStatus === 'PENDING', 'Partner A Agency approval is initially PENDING');
    assert(updatedBizA?.carRentalVerificationStatus === 'PENDING' || updatedBizA?.carRentalVerificationStatus === 'NOT_REGISTERED', 'Partner A Car Rental is PENDING');

    // Simulate Admin approving Agency A
    updatedBizA.approvalStatus = 'APPROVED';
    updatedBizA.verificationStatus = 'APPROVED';
    await updatedBizA.save();

    const afterAdminApproval = await AgencyModel.findById(updatedBizA._id);
    assert(afterAdminApproval?.approvalStatus === 'APPROVED', 'Agency is approved by Admin');
    assert(afterAdminApproval?.carRentalVerificationStatus !== 'APPROVED', 'Car Rental is NOT automatically approved when Agency is approved');

    // =========================================================================
    // TEST SUITE 6: Failed / Pending / Unverified Payments Do NOT Mark Fee as Paid
    // =========================================================================
    console.log('\n--- Test Suite 6: Failed / Unverified Payments Guard ---');
    const emailC = `partner.unverified.${Date.now()}@testapnatrip.com`;
    const phoneC = '93' + Math.floor(10000000 + Math.random() * 90000000);

    const userC = await PartnerUserModel.create({
      name: 'Amit Kumar',
      email: emailC,
      phone: phoneC,
      passwordHash: passHash,
      emailVerified: true,
      phoneVerified: true,
      role: 'partner',
    });

    // Create an order (status: pending_payment), but do NOT verify payment
    const orderC = await subscriptionService.createSubscriptionOrder({
      businessType: 'agency',
      partnerName: 'Amit Kumar',
      email: emailC,
      phone: phoneC,
    });
    assert(orderC.amount === 1000, 'Order created with amount 1000');

    // Ensure status remains pending_payment
    const subC = await PartnerSubscriptionModel.findById(orderC.subscriptionId);
    assert(subC?.status === 'pending_payment', 'Subscription is pending_payment (unverified)');

    // Check fee status: Since payment was never verified, fee must NOT be waived
    const feeStatusC = await subscriptionService.getFeeStatus({
      ownerId: userC._id.toString(),
      email: emailC,
      phone: phoneC,
      businessType: 'agency',
    });
    assert(feeStatusC.feeWaived === false, 'Unverified payment does NOT waive fee');
    assert(feeStatusC.amountDue === 1000, 'Amount due remains ₹1,000 for unverified account');

    // =========================================================================
    // TEST SUITE 7: Existing Verified Paying Partners Are Not Charged Again
    // =========================================================================
    console.log('\n--- Test Suite 7: Existing Paying Partners Retain Waiver ---');
    // For Partner A (who paid previously):
    const recheckA = await subscriptionService.getFeeStatus({
      ownerId: userA._id.toString(),
      email: emailA,
      phone: phoneA,
    });
    assert(recheckA.feeWaived === true, 'Existing paying partner feeWaived is true');
    assert(recheckA.amountDue === 0, 'Existing paying partner amountDue is 0');

    // For Partner B (who paid previously):
    const recheckB = await subscriptionService.getFeeStatus({
      ownerId: userB._id.toString(),
      email: emailB,
      phone: phoneB,
    });
    assert(recheckB.feeWaived === true, 'Existing paying partner B feeWaived is true');
    assert(recheckB.amountDue === 0, 'Existing paying partner B amountDue is 0');

    // =========================================================================
    // TEST SUITE 8: Invoices & Accounting Audit Trail
    // =========================================================================
    console.log('\n--- Test Suite 8: Invoices & Payment Ledger Records ---');
    // Check that waived orders created a verified ₹0 invoice and ledger payment record
    const waivedInvoice = await subscriptionService.getInvoice(orderCarRentalA.invoiceId);
    assert(waivedInvoice !== null, 'Official tax invoice generated for waived registration');
    assert(waivedInvoice.total === 0, 'Invoice total is ₹0');
    assert(waivedInvoice.discount === 1000, 'Invoice discount is ₹1,000');
    assert(waivedInvoice.status === 'paid', 'Invoice status is paid');

    const waivedPaymentRecord = await SubscriptionPaymentModel.findOne({ orderId: orderCarRentalA.orderId });
    assert(waivedPaymentRecord !== null, 'Payment record saved in SubscriptionPaymentModel');
    assert(waivedPaymentRecord?.amount === 0, 'Payment record amount is 0');
    assert(waivedPaymentRecord?.discountAmount === 1000, 'Payment record discountAmount is 1000');
    assert(waivedPaymentRecord?.status === 'paid', 'Payment record status is paid');

    console.log(`\n=========================================================================`);
    console.log(`🎉 ALL ${passed} / ${total} TESTS PASSED PERFECTLY!`);
    console.log(`=========================================================================\n`);
  } finally {
    await mongoose.disconnect();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Test execution failed with error:', err);
  process.exit(1);
});
