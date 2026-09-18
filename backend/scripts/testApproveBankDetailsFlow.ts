import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import { AgencyModel } from '../src/models/agency.model';
import { AuditLogModel } from '../src/models/auditLog.model';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service';

async function runTest() {
  console.log('🚀 Starting Bank Details Review & Approval Integration Test Suite...\n');

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name);

  const testAppId = `ATP-AGY-BANKTEST-${Date.now()}`;
  let createdAgencyId: string | null = null;

  try {
    // 1. Create Test Agency with Unverified Bank Details
    const testAgency = await AgencyModel.create({
      applicationId: testAppId,
      name: 'Himalayan Horizons Travel Co.',
      legalBusinessName: 'Himalayan Horizons Private Limited',
      agencyDisplayName: 'Himalayan Horizons',
      email: `banktest.${Date.now()}@himalayanhorizons.com`,
      phone: '+91 9876543210',
      ownerName: 'Aarav Sharma',
      owner: {
        name: 'Aarav Sharma',
        email: `aarav.${Date.now()}@himalayanhorizons.com`,
        phone: '+91 9876543210',
        panNumber: 'ABCDE1234F',
        aadhaarNumber: '123456789012',
      },
      businessType: 'Tour Operator',
      gstNumber: '27ABCDE1234F1Z5',
      city: 'Manali',
      state: 'Himachal Pradesh',
      verificationStatus: 'UNDER_REVIEW',
      status: 'PENDING',
      complianceScore: 75,
      bankDetails: {
        accountHolderName: 'Himalayan Horizons Private Limited',
        bankName: 'State Bank of India',
        accountNumber: '334455667788',
        ifscCode: 'SBIN0001234',
        branch: 'Mall Road, Manali',
        accountType: 'Current Account',
        payoutMethod: 'Bank Transfer',
        upiId: 'himalayan@sbi',
        verified: false,
        status: 'Under Review',
      },
      documents: [
        {
          id: 'doc-gst',
          name: 'GST Registration Certificate.pdf',
          type: 'GST',
          status: 'Approved',
          fileUrl: 'https://example.com/gst.pdf',
        },
      ],
      verificationChecklist: [
        { id: 'vc1', label: 'GST Verification', status: 'Verified' },
        { id: 'vc2', label: 'PAN Verification', status: 'Verified' },
        { id: 'vc3', label: 'Business License', status: 'Pending' },
        { id: 'vc4', label: 'Bank Settlement Account & IFSC Verification', status: 'Under Review' },
      ],
    });

    createdAgencyId = testAgency._id.toString();
    console.log(`✅ [1/5] Created test agency with unverified bank details: "${testAgency.name}" (${testAppId})`);

    // 2. Fetch via service to verify DTO formatting
    const initialDto = await adminAgencyRequestService.getAgencyRequestById(createdAgencyId);
    console.log('✅ [2/5] Retrieved initial Agency DTO:');
    console.log(`   - Bank Name: ${initialDto.bankDetails?.bankName}`);
    console.log(`   - Account Number: ${initialDto.bankDetails?.accountNumber}`);
    console.log(`   - IFSC: ${initialDto.bankDetails?.ifscCode}`);
    console.log(`   - Verification Status: ${initialDto.bankDetails?.status} (verified: ${initialDto.bankDetails?.verified})`);

    if (initialDto.bankDetails?.verified === true) {
      throw new Error('Initial bankDetails.verified should be false');
    }

    // 3. Execute approveBankDetails
    const adminUser = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Super Admin Subham',
      email: 'admin@travelos.com',
      role: { name: 'SUPER_ADMIN' },
    };

    const approveResult = await adminAgencyRequestService.approveBankDetails(
      createdAgencyId,
      adminUser,
      'Bank statement and cancelled cheque verified with SBI IFSC database.'
    );

    console.log('✅ [3/5] approveBankDetails returned:', approveResult.message);

    // 4. Verify MongoDB Document State
    const updatedAgency = await AgencyModel.findById(createdAgencyId).lean();
    if (!updatedAgency) throw new Error('Agency not found after update');

    console.log('✅ [4/5] Verifying MongoDB database state:');
    console.log(`   - bankDetails.verified: ${updatedAgency.bankDetails?.verified}`);
    console.log(`   - bankDetails.status: ${updatedAgency.bankDetails?.status}`);
    console.log(`   - bankDetails.verifiedBy: ${updatedAgency.bankDetails?.verifiedBy}`);
    console.log(`   - bankDetails.verifiedAt: ${updatedAgency.bankDetails?.verifiedAt}`);

    if (!updatedAgency.bankDetails?.verified || updatedAgency.bankDetails?.status !== 'Verified') {
      throw new Error('Bank details was not marked Verified in DB');
    }

    const bankChecklistItem = updatedAgency.verificationChecklist?.find((c) =>
      c.label.toLowerCase().includes('bank')
    );
    console.log(`   - Checklist Bank Item: "${bankChecklistItem?.label}" -> ${bankChecklistItem?.status}`);
    if (bankChecklistItem?.status !== 'Verified') {
      throw new Error('Verification checklist bank item was not marked Verified');
    }

    // 5. Verify Timeline & Audit Log
    const auditRecord = await AuditLogModel.findOne({
      'metadata.applicationId': testAppId,
      action: 'Bank Details Approved',
    }).lean();

    console.log('✅ [5/5] Verified Audit Log & Timeline:');
    console.log(`   - Audit Action: ${auditRecord?.action}`);
    console.log(`   - Audit Description: ${auditRecord?.description}`);
    console.log(`   - Audit Status: ${auditRecord?.status}`);

    const timelineBankEvent = updatedAgency.timeline?.find((t) => t.title.includes('Bank'));
    console.log(`   - Timeline Event: "${timelineBankEvent?.title}" -> ${timelineBankEvent?.desc}`);

    if (!auditRecord || !timelineBankEvent) {
      throw new Error('Audit log or timeline event missing');
    }

    console.log('\n🎉 ALL BANK DETAILS REVIEW & APPROVAL TESTS PASSED (100% SUCCESS)!\n');
  } finally {
    // Cleanup
    if (createdAgencyId) {
      await AgencyModel.deleteOne({ _id: createdAgencyId });
      await AuditLogModel.deleteMany({ 'metadata.applicationId': testAppId });
      console.log('🧹 Cleaned up test records from MongoDB.');
    }
    await mongoose.disconnect();
  }
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
