import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function testApproveDocumentsFlow() {
  console.log('🚀 Starting Approve Documents Integration Test Suite...\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name || 'travelos_db');

  const testTimestamp = Date.now();
  const testAgencyAppId = `ATP-AGY-APPDOC-${testTimestamp}`;
  let createdAgencyId: string = '';

  try {
    // 1. Create a mock agency with Re-upload Submitted and Pending documents
    const testAgency = await AgencyModel.create({
      applicationId: testAgencyAppId,
      name: 'Highland Treks & Tours',
      legalBusinessName: 'Highland Treks Pvt Ltd',
      agencyDisplayName: 'Highland Treks',
      email: `contact.${testTimestamp}@highlandtreks.com`,
      phone: '+91 98765 43210',
      ownerName: 'Sunita Sharma',
      businessType: 'Adventure',
      city: 'Manali',
      state: 'Himachal Pradesh',
      gstNumber: '02AABCH1234E1Z8',
      verificationStatus: 'MISSING_DOCS',
      status: 'PENDING',
      complianceScore: 60,
      documents: [
        {
          id: 'doc_gst_cert',
          name: 'GST Registration Certificate.pdf',
          type: 'GST',
          status: 'Re-upload Submitted',
          rejectionReason: 'Blurry Document',
          customReason: 'Text unreadable',
          fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_gst_new.pdf',
          reuploadedFileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_gst_new.pdf',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 'doc_pan_card',
          name: 'Company PAN Card.pdf',
          type: 'KYC',
          status: 'Under Review',
          rejectionReason: 'Missing Pages',
          fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_pan_new.pdf',
          uploadedAt: new Date().toISOString(),
        },
      ],
      requestedDocuments: ['doc_gst_cert', 'doc_pan_card'],
      requestedDocumentsDetails: [
        {
          documentId: 'doc_gst_cert',
          documentName: 'GST Registration Certificate.pdf',
          documentType: 'GST',
          reason: 'Blurry Document',
          customReason: 'Text unreadable',
          status: 'REUPLOAD_SUBMITTED',
          requestedAt: new Date().toISOString(),
        },
        {
          documentId: 'doc_pan_card',
          documentName: 'Company PAN Card.pdf',
          documentType: 'KYC',
          reason: 'Missing Pages',
          status: 'REUPLOAD_SUBMITTED',
          requestedAt: new Date().toISOString(),
        },
      ],
    });

    createdAgencyId = testAgency._id.toString();
    console.log(`✅ [1/5] Created test agency with re-uploaded/pending documents: "${testAgency.name}" (${testAgency.applicationId})`);

    // 2. Mock Admin User
    const adminUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Super Admin Test',
      email: 'admin@travelos.com',
      role: { name: 'SUPER_ADMIN' },
    };

    // 3. Execute Approve Documents
    const approveResult = await adminAgencyRequestService.approveDocuments(
      createdAgencyId,
      adminUser,
      undefined,
      'All newly submitted certificates verified and valid.'
    );

    console.log('✅ [2/5] approveDocuments returned response:', {
      success: approveResult.success,
      message: approveResult.message,
      approvedCount: approveResult.approvedCount,
    });

    if (!approveResult.success || approveResult.approvedCount !== 2) {
      throw new Error(`Expected 2 approved documents, got ${approveResult.approvedCount}`);
    }

    // 4. Verify MongoDB Document State
    const updatedAgency = await AgencyModel.findById(createdAgencyId);
    if (!updatedAgency) throw new Error('Agency not found after update');

    console.log('✅ [3/5] Verifying MongoDB document states:');
    updatedAgency.documents.forEach((d: any) => {
      console.log(`   - "${d.name}": status = ${d.status}, rejectionReason = ${d.rejectionReason || 'cleared'}`);
      if (d.status !== 'Approved') {
        throw new Error(`Document ${d.name} status should be Approved, got ${d.status}`);
      }
      if (d.rejectionReason) {
        throw new Error(`Document ${d.name} rejectionReason should be cleared`);
      }
    });

    // 5. Verify Verification Status and Compliance Score
    console.log(`✅ [4/5] Verification Status transitioned: ${updatedAgency.verificationStatus}`);
    console.log(`   Compliance Score recalculated: ${updatedAgency.complianceScore}/100`);
    if (updatedAgency.requestedDocuments.length > 0) {
      throw new Error('requestedDocuments should be empty after all approvals');
    }

    // 6. Verify Audit Trail and Timeline
    const latestAuditLog = await AuditLogModel.findOne({
      'metadata.agencyId': createdAgencyId,
    }).sort({ createdAt: -1 });

    console.log('✅ [5/5] Verified Audit Log & Timeline:');
    console.log(`   - Action: ${latestAuditLog?.action}`);
    console.log(`   - Description: ${latestAuditLog?.description}`);
    console.log(`   - Timeline events count: ${updatedAgency.timeline.length}`);

    if (!latestAuditLog || latestAuditLog.action !== 'Documents Approved') {
      throw new Error('Expected AuditLog entry for Documents Approved');
    }

    // Clean up
    await AgencyModel.deleteOne({ _id: createdAgencyId });
    await AuditLogModel.deleteMany({ 'metadata.agencyId': createdAgencyId });
    console.log('\n🧹 Test clean-up completed.');
    console.log('\n🎉 ALL APPROVE DOCUMENTS TESTS PASSED (100% SUCCESS)!\n');
  } catch (err: any) {
    console.error('❌ Test Failed:', err);
    if (createdAgencyId) {
      await AgencyModel.deleteOne({ _id: createdAgencyId }).catch(() => {});
      await AuditLogModel.deleteMany({ 'metadata.agencyId': createdAgencyId }).catch(() => {});
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testApproveDocumentsFlow();
