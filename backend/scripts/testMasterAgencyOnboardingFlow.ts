import mongoose from 'mongoose';
import { envConfig } from '../src/config/env.config.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { AdminModel } from '../src/models/admin.model.js';
import { agencyOnboardingService } from '../src/services/agencyOnboarding.service.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runMasterOnboardingTest() {
  console.log('\n===============================================================');
  console.log('🚀 RUNNING MASTER AGENCY ONBOARDING & REGISTRATION TEST SUITE');
  console.log('===============================================================\n');

  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('Connected to MongoDB Atlas successfully.\n');

  const testEmail = `partner_${Date.now()}@travelostest.com`;
  let testAppId: string = '';
  let agencyMongoId: string = '';

  try {
    // -------------------------------------------------------------
    // Test 1: Save Step 1 (Business Information Draft)
    // -------------------------------------------------------------
    console.log('--- Test 1: Save Step 1 Business Info Draft ---');
    const step1Draft = await agencyOnboardingService.saveDraft({
      email: testEmail,
      step: 1,
      business: {
        legalBusinessName: 'Himalayan Wanderers Private Limited',
        agencyDisplayName: 'Himalayan Wanderers',
        businessType: 'Private Limited (Pvt Ltd)',
        yearEstablished: '2019',
        businessRegistrationNumber: 'U63040DL2019PTC123456',
        gstNumber: '07AAACH7409R1ZZ',
        phone: '+91 98111 22334',
        email: testEmail,
        website: 'https://himalayanwanderers.com',
        streetAddress: '42, Cyber Hub, Phase 2',
        city: 'Gurugram',
        state: 'Haryana',
        pinCode: '122002',
        country: 'India',
      },
    }, { ip: '127.0.0.1', userAgent: 'TravelOS-TestAgent' });

    assert(!!step1Draft.applicationId, 'Draft returned an Application ID');
    assert(step1Draft.step === 1, 'Draft step is 1');
    assert(step1Draft.completionPercentage >= 20, `Completion percentage is >= 20% (got ${step1Draft.completionPercentage}%)`);
    testAppId = step1Draft.applicationId;

    // -------------------------------------------------------------
    // Test 2: Save Step 2 (Profile & Branding Draft)
    // -------------------------------------------------------------
    console.log('\n--- Test 2: Save Step 2 Profile & Branding Draft ---');
    const step2Draft = await agencyOnboardingService.saveDraft({
      applicationId: testAppId,
      step: 2,
      profile: {
        logoUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/logo_hw.png',
        coverUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/banner_hw.jpg',
        tagline: 'Crafting unforgettable mountain expeditions',
        about: 'We specialize in curated treks, luxury mountain stays, and alpine photography expeditions across the Himalayas.',
        yearsOfExperience: '5 Years',
        teamSize: '11-50 employees',
        selectedServices: ['custom_tours', 'trekking_adventure', 'luxury_stays', 'transportation'],
        destinations: ['Manali', 'Leh Ladakh', 'Spiti Valley', 'Kashmir'],
        languages: ['English', 'Hindi', 'Punjabi'],
      },
    });

    assert(step2Draft.step === 2, 'Draft step progressed to 2');
    assert(step2Draft.completionPercentage >= 40, `Completion percentage is >= 40% (got ${step2Draft.completionPercentage}%)`);

    // -------------------------------------------------------------
    // Test 3: Save Step 3 (Verification Documents Draft)
    // -------------------------------------------------------------
    console.log('\n--- Test 3: Save Step 3 KYC Documents Draft ---');
    const step3Draft = await agencyOnboardingService.saveDraft({
      applicationId: testAppId,
      step: 3,
      verification: {
        ownerName: 'Vikramaditya Sharma',
        ownerEmail: testEmail,
        ownerPhone: '+91 98111 22334',
        ownerPanNumber: 'AAACH7409R',
        ownerAadhaarNumber: '9876 5432 1098',
        governmentIdType: 'Aadhaar Card',
        registrationCert: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/reg_cert.pdf',
          size: 1048576,
          sizeFormatted: '1.0 MB',
        },
        gstCert: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/gst_cert.pdf',
          size: 524288,
          sizeFormatted: '512 KB',
        },
        panCard: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/pan_card.jpg',
          size: 262144,
          sizeFormatted: '256 KB',
        },
        governmentIdFile: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/owner_aadhaar.pdf',
        },
        selfieFile: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/owner_selfie.jpg',
        },
        addressProofFile: {
          dataUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/office_lease.pdf',
        },
      },
    });

    assert(step3Draft.step === 3, 'Draft step progressed to 3');
    assert(step3Draft.completionPercentage >= 60, `Completion percentage is >= 60% (got ${step3Draft.completionPercentage}%)`);

    // -------------------------------------------------------------
    // Test 4: Save Step 4 (Bank Details Draft)
    // -------------------------------------------------------------
    console.log('\n--- Test 4: Save Step 4 Bank Details Draft ---');
    const step4Draft = await agencyOnboardingService.saveDraft({
      applicationId: testAppId,
      step: 4,
      bank: {
        accountHolderName: 'Himalayan Wanderers Pvt Ltd',
        bankName: 'HDFC Bank',
        accountNumber: '50200012345678',
        confirmAccountNumber: '50200012345678',
        ifscCode: 'HDFC0001234',
        upiId: 'himalayan@hdfcbank',
        payoutMethod: 'bank',
        branch: 'Cyber City Branch, Gurugram',
      },
    });

    assert(step4Draft.step === 4, 'Draft step progressed to 4');
    assert(step4Draft.completionPercentage >= 80, `Completion percentage is >= 80% (got ${step4Draft.completionPercentage}%)`);

    // -------------------------------------------------------------
    // Test 5: Retrieve Saved Draft by Application ID
    // -------------------------------------------------------------
    console.log('\n--- Test 5: Retrieve Full Saved Draft State ---');
    const retrievedDraft = await agencyOnboardingService.getDraft(testAppId);
    assert(!!retrievedDraft, 'Retrieved draft is non-null');
    assert(retrievedDraft?.business?.legalBusinessName === 'Himalayan Wanderers Private Limited', 'Business name preserved');
    assert(retrievedDraft?.profile?.tagline === 'Crafting unforgettable mountain expeditions', 'Tagline preserved');
    assert(retrievedDraft?.verification?.ownerName === 'Vikramaditya Sharma', 'Owner name preserved');
    assert(retrievedDraft?.bank?.ifscCode === 'HDFC0001234', 'Bank IFSC preserved');

    // -------------------------------------------------------------
    // Test 6: Submit Completed Application (Step 5 Review & Submit)
    // -------------------------------------------------------------
    console.log('\n--- Test 6: Submit Complete Onboarding Application ---');
    const submissionResult = await agencyOnboardingService.submitOnboarding({
      applicationId: testAppId,
      business: retrievedDraft.business,
      profile: retrievedDraft.profile,
      verification: retrievedDraft.verification,
      bank: retrievedDraft.bank,
      submittedAt: new Date().toISOString(),
    }, { ip: '127.0.0.1', userAgent: 'TravelOS-Browser' });

    assert(submissionResult.success === true, 'Submission succeeded');
    assert(submissionResult.status === 'PENDING', 'Status is PENDING');
    assert(submissionResult.applicationId === testAppId, 'Application ID matches');

    // -------------------------------------------------------------
    // Test 7: Verify Database State in MongoDB Atlas
    // -------------------------------------------------------------
    console.log('\n--- Test 7: Verify MongoDB Agency Document State ---');
    const savedDoc = await AgencyModel.findOne({ applicationId: testAppId });
    assert(!!savedDoc, 'Agency document exists in MongoDB');
    assert(savedDoc?.verificationStatus === 'PENDING', 'verificationStatus is PENDING');
    assert(savedDoc?.status === 'PENDING', 'status is PENDING');
    assert(savedDoc?.onboardingStep === 6, 'onboardingStep is 6 (Completed)');
    assert(savedDoc?.completionPercentage === 100, 'completionPercentage is 100%');
    assert(savedDoc?.documents.length >= 4, `Documents count >= 4 (got ${savedDoc?.documents.length})`);
    assert(savedDoc?.verificationChecklist.length === 6, 'Verification checklist has 6 verification items');
    assert(savedDoc?.timeline.length >= 1, 'Timeline has initial submission event');
    assert(savedDoc?.complianceScore >= 75, `Compliance score is >= 75 (got ${savedDoc?.complianceScore})`);
    agencyMongoId = savedDoc!._id.toString();

    // -------------------------------------------------------------
    // Test 8: Verify System Audit Log Trail
    // -------------------------------------------------------------
    console.log('\n--- Test 8: Verify System Audit Log Trail ---');
    const auditLog = await AuditLogModel.findOne({
      'actor.id': savedDoc!._id.toString(),
      action: 'Application Submitted',
    });
    assert(!!auditLog, 'Audit log entry created for application submission');
    assert(auditLog?.module === 'Agency', 'Audit log module is Agency');
    assert(auditLog?.status === 'Success', 'Audit log status is Success');

    // -------------------------------------------------------------
    // Test 9: Query Public Live Verification Status Tracker
    // -------------------------------------------------------------
    console.log('\n--- Test 9: Query Verification Status Tracker ---');
    const statusTracker = await agencyOnboardingService.getVerificationStatus(testAppId);
    assert(statusTracker.status === 'PENDING', 'Tracker returns status PENDING');
    assert(statusTracker.agencyName === 'Himalayan Wanderers', 'Tracker returns agency display name');
    assert(statusTracker.timeline.length >= 1, 'Tracker returns live timeline');

    // -------------------------------------------------------------
    // Test 10: Super Admin Requests Missing Documents
    // -------------------------------------------------------------
    console.log('\n--- Test 10: Super Admin Requests Missing Documents ---');
    const superAdmin = await AdminModel.findOne({ isDeleted: false });
    assert(!!superAdmin, 'Super Admin found in database');

    await adminAgencyRequestService.requestMoreDocuments(
      agencyMongoId,
      superAdmin,
      ['Office Address Proof', 'Trade License'],
      'Please upload recent utility bill for commercial office address proof.'
    );

    const docRequestedAgency = await AgencyModel.findById(agencyMongoId);
    assert(docRequestedAgency?.verificationStatus === 'MISSING_DOCS', 'verificationStatus transitioned to MISSING_DOCS');

    // -------------------------------------------------------------
    // Test 11: Agency Re-uploads Requested Documents
    // -------------------------------------------------------------
    console.log('\n--- Test 11: Agency Re-uploads Requested Documents ---');
    const reuploadResult = await agencyOnboardingService.reuploadDocuments({
      applicationId: testAppId,
      documents: [
        {
          id: 'doc_utility_bill',
          name: 'Office Electricity Bill',
          type: 'Address Proof',
          fileUrl: 'https://res.cloudinary.com/travelos/image/upload/v1/updated_office_bill.pdf',
        },
      ],
      notes: 'Uploaded latest electricity bill dated August 2026.',
    }, { ip: '127.0.0.1' });

    assert(reuploadResult.success === true, 'Re-upload succeeded');
    const recheckedAgency = await AgencyModel.findById(agencyMongoId);
    assert(recheckedAgency?.verificationStatus === 'PENDING', 'verificationStatus returned to PENDING after re-upload');

    // -------------------------------------------------------------
    // Test 12: Super Admin Approves Agency Application
    // -------------------------------------------------------------
    console.log('\n--- Test 12: Super Admin Approves Application ---');
    const approveResult = await adminAgencyRequestService.approveRequest(
      agencyMongoId,
      superAdmin,
      'All compliance KYC items verified.'
    );

    assert(approveResult.success === true, 'Agency approval succeeded');
    const approvedDoc = await AgencyModel.findById(agencyMongoId);
    assert(approvedDoc?.verificationStatus === 'APPROVED', 'verificationStatus is APPROVED');
    assert(approvedDoc?.status === 'ACTIVE', 'status is ACTIVE');

    // -------------------------------------------------------------
    // Test 13: Final Verification Status Check Reflects Approval
    // -------------------------------------------------------------
    console.log('\n--- Test 13: Live Status Tracker Reflects Approval ---');
    const finalTracker = await agencyOnboardingService.getVerificationStatus(testAppId);
    assert(finalTracker.status === 'APPROVED', 'Final status tracker reflects APPROVED');
    assert(finalTracker.applicationStatus === 'ACTIVE', 'Final application status is ACTIVE');

    console.log('\n===============================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED WITH 100% SUCCESS!`);
    console.log('===============================================================\n');
  } catch (error: any) {
    console.error('\n❌ Test execution failed with error:', error.message);
    process.exit(1);
  } finally {
    // Clean up test agency document to keep database clean
    if (agencyMongoId) {
      await AgencyModel.findByIdAndDelete(agencyMongoId);
      await AuditLogModel.deleteMany({ $or: [{ 'actor.id': agencyMongoId }, { 'metadata.agencyId': agencyMongoId }] });
      console.log('🧹 Test fixtures cleaned up from MongoDB Atlas.');
    }
    await mongoose.disconnect();
  }
}

runMasterOnboardingTest();
