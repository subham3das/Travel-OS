import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';
import { agencyOnboardingService } from '../src/services/agencyOnboarding.service.js';
import { envConfig } from '../src/config/env.config.js';
import { logger } from '../src/utils/logger.js';

async function runTest() {
  console.log('🚀 Starting Document-Specific Re-upload End-to-End Test Suite...\n');

  try {
    await mongoose.connect(envConfig.MONGODB_URI);
    console.log('✅ Connected to MongoDB:', envConfig.MONGODB_URI);

    const testAppId = `ATP-AGY-TEST-DOCREQ-${Date.now()}`;
    const testEmail = `docreq.test.${Date.now()}@example.com`;

    // 1. Create a Test Agency with 3 uploaded documents
    const agency = await AgencyModel.create({
      applicationId: testAppId,
      name: 'Himalayan Explorers Ltd',
      agencyDisplayName: 'Himalayan Explorers',
      ownerName: 'Subham Das',
      email: testEmail,
      phone: '+91 98765 43210',
      owner: {
        name: 'Subham Das',
        email: testEmail,
        phone: '+91 98765 43210',
      },
      businessType: 'Tour Operator',
      status: 'PENDING',
      verificationStatus: 'PENDING',
      complianceScore: 78,
      documents: [
        {
          id: `doc_gst_${Date.now()}`,
          name: 'GST Registration Certificate',
          type: 'GST Certificate',
          status: 'Pending',
          fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v1/sample_gst.pdf',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: `doc_pan_${Date.now()}`,
          name: 'Company PAN Card',
          type: 'PAN Card',
          status: 'Pending',
          fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v1/sample_pan.pdf',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: `doc_reg_${Date.now()}`,
          name: 'Business Registration Certificate',
          type: 'Registration Certificate',
          status: 'Approved',
          fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v1/sample_reg.pdf',
          uploadedAt: new Date().toISOString(),
        },
      ],
      timeline: [
        {
          id: `tl_init`,
          title: 'Application Submitted',
          timestamp: new Date().toISOString(),
          completed: true,
          actor: 'Agency',
          desc: 'Initial registration application submitted.',
        },
      ],
    });

    console.log(`✅ [1/6] Created test agency application: ${agency.name} (${agency.applicationId}) with 3 documents.`);

    // 2. Super Admin Requests Re-upload of 2 specific documents
    const adminUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Super Administrator',
      email: 'das01subhamj@gmail.com',
      role: { name: 'SUPER_ADMIN' },
    };

    const requestPayload = [
      {
        documentId: agency.documents[0].id,
        documentName: agency.documents[0].name,
        documentType: agency.documents[0].type,
        reason: 'Blurry Document',
        internalNote: 'Cannot read GSTIN clearly in lower left box.',
      },
      {
        documentId: agency.documents[1].id,
        documentName: agency.documents[1].name,
        documentType: agency.documents[1].type,
        reason: 'Mismatch Found',
        customReason: 'PAN Name does not match MCA incorporation records',
        internalNote: 'Re-verify with NSDL API once received.',
      },
    ];

    const reqDocsResult = await adminAgencyRequestService.requestMoreDocuments(
      agency._id.toString(),
      adminUser,
      requestPayload,
      'Please upload a clearer GST certificate and verify company PAN card details.'
    );

    console.log(`✅ [2/6] Super Admin requested re-upload for 2 documents:`, reqDocsResult.message);

    // Verify DB State after Document Request
    const agencyAfterRequest = await AgencyModel.findById(agency._id);
    if (!agencyAfterRequest) throw new Error('Agency not found after request');

    if (agencyAfterRequest.verificationStatus !== 'MISSING_DOCS') {
      throw new Error(`Expected verificationStatus to be MISSING_DOCS, got: ${agencyAfterRequest.verificationStatus}`);
    }

    const docGst = agencyAfterRequest.documents.find((d: any) => d.name === 'GST Registration Certificate');
    const docPan = agencyAfterRequest.documents.find((d: any) => d.name === 'Company PAN Card');
    const docReg = agencyAfterRequest.documents.find((d: any) => d.name === 'Business Registration Certificate');

    if (docGst?.status !== 'Re-upload Requested' || docGst.rejectionReason !== 'Blurry Document') {
      throw new Error(`GST status or reason mismatch: status=${docGst?.status}, reason=${docGst?.rejectionReason}`);
    }
    if (docPan?.status !== 'Re-upload Requested' || docPan.customReason !== 'PAN Name does not match MCA incorporation records') {
      throw new Error(`PAN status or customReason mismatch: status=${docPan?.status}`);
    }
    if (docReg?.status !== 'Approved') {
      throw new Error(`Approved document should remain Approved, got: ${docReg?.status}`);
    }
    console.log('✅ DB Verification: Document statuses updated to "Re-upload Requested" with specific reasons.');

    // 3. Agency Portal queries requested documents
    const agencyView = await agencyOnboardingService.getRequestedDocuments(testAppId);
    if (!agencyView.success || agencyView.requestedDocuments.length !== 2) {
      throw new Error(`Expected 2 requested documents in agency view, got: ${agencyView.requestedDocuments.length}`);
    }
    console.log(`✅ [3/6] Agency portal successfully retrieved requested documents:`, agencyView.requestedDocuments.map((d: any) => `${d.documentName} (${d.reason})`));

    // 4. Security Test: Agency attempts to upload an unrequested document
    try {
      await agencyOnboardingService.reuploadDocuments({
        applicationId: testAppId,
        documents: [
          {
            name: 'Unrequested Electricity Bill',
            type: 'Utility Bill',
            fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v1/random.pdf',
          },
        ],
      });
      throw new Error('Security check failed: unrequested document was allowed!');
    } catch (err: any) {
      if (err.message.includes('not requested for re-upload')) {
        console.log('✅ [4/6] Security Test Passed: Blocked unrequested document upload:', err.message);
      } else {
        throw err;
      }
    }

    // 5. Agency submits re-uploaded documents for the 2 requested items
    const reuploadResult = await agencyOnboardingService.reuploadDocuments({
      applicationId: testAppId,
      documents: [
        {
          documentId: docGst.id,
          name: docGst.name,
          type: docGst.type,
          fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v2/new_crystal_clear_gst.pdf',
        },
        {
          documentId: docPan.id,
          name: docPan.name,
          type: docPan.type,
          fileUrl: 'https://res.cloudinary.com/travelos/raw/upload/v2/verified_pan.pdf',
        },
      ],
      notes: 'Uploaded higher resolution GST scan and updated PAN card matching MCA registration.',
    });

    console.log(`✅ [5/6] Agency submitted re-uploads:`, reuploadResult.message);

    // Verify DB State after Re-upload
    const agencyAfterReupload = await AgencyModel.findById(agency._id);
    if (!agencyAfterReupload) throw new Error('Agency not found after reupload');

    if (agencyAfterReupload.verificationStatus !== 'PENDING') {
      throw new Error(`Expected verificationStatus to be PENDING after re-upload, got: ${agencyAfterReupload.verificationStatus}`);
    }

    const docGstAfter = agencyAfterReupload.documents.find((d: any) => d.name === 'GST Registration Certificate');
    const docPanAfter = agencyAfterReupload.documents.find((d: any) => d.name === 'Company PAN Card');

    if (docGstAfter?.status !== 'Re-upload Submitted' || !docGstAfter.reuploadedAt) {
      throw new Error(`GST status should be "Re-upload Submitted", got: ${docGstAfter?.status}`);
    }
    if (docPanAfter?.status !== 'Re-upload Submitted' || !docPanAfter.reuploadedAt) {
      throw new Error(`PAN status should be "Re-upload Submitted", got: ${docPanAfter?.status}`);
    }
    console.log('✅ DB Verification: Documents updated to "Re-upload Submitted" with timestamps.');

    // 6. Super Admin final approval
    const approveResult = await adminAgencyRequestService.approveRequest(
      agency._id.toString(),
      adminUser,
      'All re-uploaded documents verified successfully. Compliant.'
    );

    console.log(`✅ [6/6] Super Admin approved application:`, approveResult.message);

    // Clean up test agency
    await AgencyModel.findByIdAndDelete(agency._id);
    console.log('\n🧹 Test clean-up completed.');

    console.log('\n🎉 ALL DOCUMENT-SPECIFIC RE-UPLOAD INTEGRATION TESTS PASSED (100% SUCCESS)!\n');
  } catch (err: any) {
    console.error('\n❌ Test failed with error:', err.message);
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
