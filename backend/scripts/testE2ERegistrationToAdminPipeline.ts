import mongoose from 'mongoose';
import { RegistrationDraftModel } from '../src/models/registrationDraft.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { ApprovalRequestModel } from '../src/models/approvalRequest.model.js';
import { PartnerSubscriptionModel } from '../src/models/partnerSubscription.model.js';
import { registrationService } from '../src/services/registration.service.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';
import { envConfig } from '../src/config/env.config.js';

async function main() {
  console.log('🧪 RUNNING END-TO-END PIPELINE AUDIT TEST: Draft -> Agency -> ApprovalRequest -> Admin DTO');

  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas');

  const testEmail = `test.e2e.${Date.now()}@apnatrip.com`;
  const draftId = `DFT-TEST-${Date.now()}`;

  try {
    // 1. Create a full draft with documents and bank details (Simulating Onboarding Steps 1-5)
    console.log('\n--- STEP 1: Saving Registration Draft with 6 Documents & Full Bank Details ---');
    const draft = await registrationService.saveDraft({
      draftId,
      serviceType: 'agency',
      businessDetails: {
        legalBusinessName: 'Himalayan Escapes Pvt Ltd',
        businessName: 'Himalayan Escapes',
        agencyDisplayName: 'Himalayan Escapes',
        email: testEmail,
        loginEmail: testEmail,
        phone: '+91 9876543210',
        ownerName: 'Subham Das',
        businessType: 'Travel Agency',
        gstNumber: '07AAAAA0000A1Z5',
        panNumber: 'ABCDE1234F',
        businessAddress: '101 Himalayan Tower, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
      },
      profileDetails: {
        logoUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/logo.jpg',
        coverUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/cover.jpg',
        about: 'Premium luxury Himalayan trekking and tour operators.',
      },
      documents: [
        {
          id: 'doc-reg-cert',
          name: 'Business Registration Certificate',
          type: 'Business Registration',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/reg_cert.pdf',
          size: 102400,
        },
        {
          id: 'doc-gst-cert',
          name: 'GST Certificate',
          type: 'GST Certificate',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/gst_cert.pdf',
          size: 102400,
        },
        {
          id: 'doc-pan-card',
          name: 'Company PAN Card',
          type: 'PAN Card',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/pan_card.pdf',
          size: 102400,
        },
        {
          id: 'doc-gov-id',
          name: 'Owner Government ID (Aadhaar)',
          type: 'Government ID',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/aadhaar.pdf',
          size: 102400,
        },
        {
          id: 'doc-selfie',
          name: 'Owner Photo / Selfie',
          type: 'Owner Photo',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/selfie.jpg',
          size: 102400,
        },
        {
          id: 'doc-address-proof',
          name: 'Office Address Proof',
          type: 'Address Proof',
          fileUrl: 'https://res.cloudinary.com/apnatrip/image/upload/v12345/address_proof.pdf',
          size: 102400,
        },
      ],
      bank: {
        accountHolderName: 'Himalayan Escapes Pvt Ltd',
        bankName: 'HDFC Bank',
        accountNumber: '50200098765432',
        ifscCode: 'HDFC0001234',
        branch: 'Connaught Place Branch',
        upiId: 'himalayan@hdfcbank',
        accountType: 'Current Account',
        payoutMethod: 'bank',
      },
      currentStep: 5,
    });

    console.log('✅ Draft Created: draftId =', draft.draftId);

    // 2. Verify partial updates do not wipe documents
    console.log('\n--- STEP 2: Verifying Blind Overwrite Protection (sending empty documents & partial update) ---');
    await registrationService.saveDraft({
      draftId,
      serviceType: 'agency',
      businessDetails: {
        legalBusinessName: 'Himalayan Escapes Private Limited',
      },
      documents: [], // should NOT wipe existing 6 documents
    });

    const draftAfterProtection = await RegistrationDraftModel.findOne({ draftId }).lean();
    console.log('✅ Documents preserved after empty array save:', draftAfterProtection?.documents?.length, 'docs');
    if (draftAfterProtection?.documents?.length !== 6) {
      throw new Error(`Expected 6 documents, but found ${draftAfterProtection?.documents?.length}`);
    }

    // 3. Create simulated subscription record
    console.log('\n--- STEP 3: Simulating Subscription & Payment ---');
    const subscription = await PartnerSubscriptionModel.create({
      businessType: 'agency',
      partnerName: 'Himalayan Escapes',
      email: testEmail,
      phone: '+91 9876543210',
      planId: 'plan_agency_onetime',
      planName: 'One-Time Agency Registration',
      billingCycle: 'yearly',
      amount: 1000,
      discount: 0,
      amountPaid: 1000,
      status: 'active',
      paymentId: `pay_test_${Date.now()}`,
      orderId: `order_test_${Date.now()}`,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    // 4. Call submitRegistration()
    console.log('\n--- STEP 4: Calling submitRegistration() ---');
    const submitRes = await registrationService.submitRegistration({
      draftId,
      subscriptionId: subscription._id.toString(),
      paymentId: subscription.paymentId,
      orderId: subscription.orderId,
    });
    console.log('✅ submitRegistration result:', submitRes);

    // 5. Query MongoDB Agency Document
    console.log('\n--- STEP 5: Verifying MongoDB Agency Document ---');
    const agency = await AgencyModel.findOne({ email: testEmail }).lean();
    if (!agency) throw new Error('Agency document not found in MongoDB!');
    console.log('✅ Agency Name:', agency.name);
    console.log('✅ Agency Application ID:', agency.applicationId);
    console.log('✅ Agency Documents Count:', agency.documents?.length);
    console.log('✅ Agency Bank Details:', {
      accountHolderName: agency.bankDetails?.accountHolderName,
      bankName: agency.bankDetails?.bankName,
      accountNumber: agency.bankDetails?.accountNumber,
      ifscCode: agency.bankDetails?.ifscCode,
      branch: agency.bankDetails?.branch,
    });

    if (agency.documents?.length !== 6) {
      throw new Error(`Expected 6 agency documents in DB, found ${agency.documents?.length}`);
    }
    if (agency.bankDetails?.bankName !== 'HDFC Bank' || agency.bankDetails?.accountNumber !== '50200098765432') {
      throw new Error('Bank details mismatch in MongoDB Agency record!');
    }

    // 6. Query MongoDB ApprovalRequest Document
    console.log('\n--- STEP 6: Verifying MongoDB ApprovalRequest Document ---');
    const approvalReq = await ApprovalRequestModel.findOne({ email: testEmail }).lean();
    if (!approvalReq) throw new Error('ApprovalRequest document not found in MongoDB!');
    console.log('✅ ApprovalRequest Application ID:', approvalReq.applicationId);
    console.log('✅ ApprovalRequest Documents Count:', approvalReq.documents?.length);
    console.log('✅ ApprovalRequest Bank Details:', approvalReq.bank);

    if (approvalReq.documents?.length !== 6) {
      throw new Error(`Expected 6 approval request documents, found ${approvalReq.documents?.length}`);
    }

    // 7. Verify Admin API DTO via getAgencyRequests & getAgencyRequestById
    console.log('\n--- STEP 7: Verifying Admin API DTO ---');
    const adminListing = await adminAgencyRequestService.getAgencyRequests({
      search: testEmail,
      status: 'All Status',
    });
    console.log('✅ Admin API listing returned items:', adminListing.items.length);
    if (adminListing.items.length === 0) {
      throw new Error('Admin API listing did not find the submitted agency!');
    }

    const adminItem = adminListing.items[0];
    console.log('✅ Admin DTO Item:');
    console.log('   • documentsUploadedCount:', adminItem.documentsUploadedCount);
    console.log('   • documentsTotalCount:', adminItem.documentsTotalCount);
    console.log('   • Missing Documents:', adminItem.documentsTotalCount - adminItem.documentsUploadedCount);
    console.log('   • Bank Name:', adminItem.bankDetails?.bankName);
    console.log('   • Account Number:', adminItem.bankDetails?.accountNumber);
    console.log('   • IFSC Code:', adminItem.bankDetails?.ifscCode);
    console.log('   • Branch:', adminItem.bankDetails?.branch);
    console.log('   • Documents Tab Items Count:', adminItem.documents.length);

    if (adminItem.documentsUploadedCount !== 6) {
      throw new Error(`Expected admin documentsUploadedCount = 6, got ${adminItem.documentsUploadedCount}`);
    }
    if (adminItem.bankDetails?.bankName !== 'HDFC Bank') {
      throw new Error(`Expected Bank Name "HDFC Bank", got "${adminItem.bankDetails?.bankName}"`);
    }
    if (adminItem.bankDetails?.accountNumber !== '50200098765432') {
      throw new Error(`Expected Account Number "50200098765432", got "${adminItem.bankDetails?.accountNumber}"`);
    }
    if (adminItem.bankDetails?.ifscCode !== 'HDFC0001234') {
      throw new Error(`Expected IFSC "HDFC0001234", got "${adminItem.bankDetails?.ifscCode}"`);
    }

    console.log('\n🎉 ALL PIPELINE VERIFICATIONS PASSED 100%! DATA FLOWS PERFECTLY END-TO-END!');
  } finally {
    // Cleanup test records
    await RegistrationDraftModel.deleteMany({ draftId });
    await AgencyModel.deleteMany({ email: testEmail });
    await ApprovalRequestModel.deleteMany({ email: testEmail });
    await PartnerSubscriptionModel.deleteMany({ email: testEmail });
    await mongoose.disconnect();
    console.log('🧹 Test cleanup complete & DB disconnected.');
  }
}

main().catch((err) => {
  console.error('❌ Pipeline Test Failed:', err);
  process.exit(1);
});
