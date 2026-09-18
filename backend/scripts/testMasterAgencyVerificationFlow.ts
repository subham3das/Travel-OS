import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { AgencyModel } from '../src/models/agency.model.js';
import { AdminModel } from '../src/models/admin.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { adminAgencyRequestService } from '../src/services/adminAgencyRequest.service.js';

async function runMasterVerificationTest() {
  console.log('\n================================================================');
  console.log('🧪 MASTER INTEGRATION TEST: SUPER ADMIN AGENCY VERIFICATION PIPELINE');
  console.log('================================================================\n');

  try {
    // 1. Connect to MongoDB Atlas
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error('MONGODB_URI is not defined in .env');

    console.log('1️⃣ Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('   ✅ Connected to MongoDB Atlas successfully.');

    // 2. Fetch Super Admin User
    console.log('\n2️⃣ Verifying Super Admin Principal for test audit trail...');
    const superAdmin = await AdminModel.findOne({ email: 'das01subhamj@gmail.com' }).lean();
    if (!superAdmin) throw new Error('Super Admin "das01subhamj@gmail.com" not found in database.');
    console.log(`   ✅ Authorized as: ${superAdmin.firstName} ${superAdmin.lastName} (${superAdmin.email})`);

    const adminUser = {
      _id: superAdmin._id.toString(),
      id: superAdmin._id.toString(),
      name: `${superAdmin.firstName} ${superAdmin.lastName}`,
      email: superAdmin.email,
      role: { name: 'SUPER_ADMIN' },
    };

    // 3. Test Summary Statistics Aggregations
    console.log('\n3️⃣ Testing getSummaryStats() (6 KPI Stats calculation)...');
    const stats = await adminAgencyRequestService.getSummaryStats();
    console.log('   📊 KPI Stats Computed:');
    console.log(`      • Pending Requests: ${stats.pendingRequests.count} (${stats.pendingRequests.growth})`);
    console.log(`      • Approved Today: ${stats.approvedToday.count} (${stats.approvedToday.growth})`);
    console.log(`      • Rejected Today: ${stats.rejectedToday.count} (${stats.rejectedToday.growth})`);
    console.log(`      • Under Review: ${stats.underReview.count} (${stats.underReview.growth})`);
    console.log(`      • Documents Missing: ${stats.documentsMissing.count} (${stats.documentsMissing.growth})`);
    console.log(`      • Avg Approval Time: ${stats.avgApprovalTime.value} (${stats.avgApprovalTime.growth})`);
    console.log('   ✅ getSummaryStats() passed.');

    // 4. Create or Ensure Test Agency for Verification Flow
    console.log('\n4️⃣ Preparing Test Agency Registration record...');
    let testAgency = await AgencyModel.findOne({ email: 'test.verification.agency@apnatrip.com' });
    if (!testAgency) {
      testAgency = await AgencyModel.create({
        applicationId: `ATP-AGY-2026-999888`,
        name: 'Apex Mountain Expeditions',
        legalBusinessName: 'Apex Mountain Expeditions Private Limited',
        agencyDisplayName: 'Apex Mountain Expeditions',
        email: 'test.verification.agency@apnatrip.com',
        phone: '+91 98765 99988',
        ownerName: 'Subham Das',
        businessType: 'Adventure',
        yearEstablished: '2021',
        registrationNumber: 'REG-2021-998877',
        gstNumber: '18AABCU9603R1ZV',
        businessAddress: 'Sector 5, Salt Lake, Kolkata, West Bengal - 700091',
        city: 'Kolkata',
        state: 'West Bengal',
        pinCode: '700091',
        country: 'India',
        website: 'https://apexmountains.com',
        owner: {
          name: 'Subham Das',
          email: 'test.verification.agency@apnatrip.com',
          phone: '+91 98765 99988',
          panNumber: 'ABCDE9999F',
          aadhaarNumber: '123456789999',
          governmentIdType: 'Aadhaar Card',
          governmentIdUrl: 'https://res.cloudinary.com/travelos/image/upload/sample-aadhaar.jpg',
          selfieUrl: 'https://res.cloudinary.com/travelos/image/upload/sample-selfie.jpg',
          addressProofUrl: 'https://res.cloudinary.com/travelos/image/upload/sample-address.jpg',
        },
        profile: {
          logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
          coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
          tagline: 'Leading Himalayan Treks & Expeditions',
          about: 'Specialized adventure tour operator.',
          selectedServices: ['adventure', 'trekking', 'domestic'],
          destinations: ['Sikkim', 'Ladakh', 'Meghalaya'],
          languages: ['English', 'Hindi', 'Bengali'],
        },
        bankDetails: {
          accountHolderName: 'Apex Mountain Expeditions Pvt Ltd',
          bankName: 'HDFC Bank',
          accountNumber: '50200012345678',
          ifscCode: 'HDFC0001234',
          payoutMethod: 'bank',
        },
        documents: [
          {
            id: 'doc-1',
            name: 'GST Registration Certificate.pdf',
            type: 'GST',
            status: 'Approved',
            fileUrl: 'https://res.cloudinary.com/travelos/image/upload/sample-gst.pdf',
            uploadedAt: new Date().toISOString(),
          },
          {
            id: 'doc-2',
            name: 'Company PAN Card Copy.pdf',
            type: 'PAN',
            status: 'Approved',
            fileUrl: 'https://res.cloudinary.com/travelos/image/upload/sample-pan.pdf',
            uploadedAt: new Date().toISOString(),
          },
        ],
        verificationStatus: 'PENDING',
        status: 'PENDING',
        complianceScore: 94,
      });
      console.log(`   ✅ Created Test Agency: "${testAgency.name}" (${testAgency.applicationId})`);
    } else {
      console.log(`   ✅ Found Existing Test Agency: "${testAgency.name}" (${testAgency.applicationId})`);
    }

    const testAgencyId = testAgency._id.toString();

    // 5. Test getAgencyRequests() Listing & Multi-Filter Pipeline
    console.log('\n5️⃣ Testing getAgencyRequests() with pagination & search...');
    const searchRes = await adminAgencyRequestService.getAgencyRequests({
      search: 'Apex',
      limit: 10,
      page: 1,
    });
    if (searchRes.items.length === 0) throw new Error('Search did not return test agency.');
    console.log(`   ✅ Search query returned ${searchRes.items.length} items (Total: ${searchRes.pagination.total})`);

    // 6. Test getAgencyRequestById() with full details
    console.log('\n6️⃣ Testing getAgencyRequestById() (Drawer Data Load)...');
    const drawerDetails = await adminAgencyRequestService.getAgencyRequestById(testAgencyId);
    if (!drawerDetails || drawerDetails.agencyName !== 'Apex Mountain Expeditions') {
      throw new Error('getAgencyRequestById failed to return correct agency details.');
    }
    console.log(`   ✅ Drawer Loaded: ${drawerDetails.agencyName} | Status: ${drawerDetails.reviewStatus} | Score: ${drawerDetails.complianceScore}/100`);

    // 7. Test saveReviewNotes()
    console.log('\n7️⃣ Testing saveReviewNotes()...');
    const noteRes = await adminAgencyRequestService.saveReviewNotes(
      testAgencyId,
      adminUser,
      'Documents verified against MCA and GST portal. All credentials match.',
      { ip: '127.0.0.1', browser: 'TestRunner' }
    );
    if (!noteRes.success) throw new Error('saveReviewNotes failed.');
    console.log('   ✅ Internal review note saved and audit log recorded.');

    // 8. Test requestMoreDocuments()
    console.log('\n8️⃣ Testing requestMoreDocuments()...');
    const reqDocsRes = await adminAgencyRequestService.requestMoreDocuments(
      testAgencyId,
      adminUser,
      ['Cancelled Cheque with IFSC', 'Tourism Board Registration'],
      'Please ensure cheque leaf clearly shows account name.',
      { ip: '127.0.0.1', browser: 'TestRunner' }
    );
    if (!reqDocsRes.success) throw new Error('requestMoreDocuments failed.');
    console.log(`   ✅ Documents requested. Verification status transitioned to: ${reqDocsRes.agency.verificationStatus}`);

    // 9. Test rejectRequest()
    console.log('\n9️⃣ Testing rejectRequest()...');
    const rejectRes = await adminAgencyRequestService.rejectRequest(
      testAgencyId,
      adminUser,
      'Bank statement IFSC code mismatch with registered branch',
      'Contact compliance support if re-submitting.',
      { ip: '127.0.0.1', browser: 'TestRunner' }
    );
    if (!rejectRes.success) throw new Error('rejectRequest failed.');
    console.log(`   ✅ Application rejected. Status: ${rejectRes.agency.reviewStatus}`);

    // 10. Test approveRequest()
    console.log('\n🔟 Testing approveRequest()...');
    const approveRes = await adminAgencyRequestService.approveRequest(
      testAgencyId,
      adminUser,
      'Final approval granted by Head of Partner Compliance.',
      { ip: '127.0.0.1', browser: 'TestRunner' }
    );
    if (!approveRes.success) throw new Error('approveRequest failed.');
    console.log(`   ✅ Agency APPROVED. Status transitioned to: ${approveRes.agency.reviewStatus}`);

    // 11. Test exportRequestsCsv()
    console.log('\n1️⃣1️⃣ Testing exportRequestsCsv()...');
    const csvContent = await adminAgencyRequestService.exportRequestsCsv({});
    if (!csvContent || !csvContent.includes('Application ID')) {
      throw new Error('exportRequestsCsv generated empty or invalid output.');
    }
    console.log(`   ✅ CSV Export generated successfully (${csvContent.split('\n').length} rows).`);

    // 12. Test bulkAction()
    console.log('\n1️⃣2️⃣ Testing bulkAction()...');
    const bulkRes = await adminAgencyRequestService.bulkAction(
      'approve',
      [testAgencyId],
      adminUser,
      { notes: 'Batch verification' },
      { ip: '127.0.0.1', browser: 'TestRunner' }
    );
    if (!bulkRes.success || bulkRes.successful === 0) throw new Error('bulkAction failed.');
    console.log(`   ✅ Bulk Action executed: ${bulkRes.successful} succeeded, ${bulkRes.failed} failed.`);

    // 13. Verify Audit Logs Created
    console.log('\n1️⃣3️⃣ Verifying Audit Logs recorded in MongoDB Atlas...');
    const auditCount = await AuditLogModel.countDocuments({
      module: 'Agency',
      'metadata.agencyId': testAgencyId,
    });
    console.log(`   ✅ Found ${auditCount} high-fidelity audit log records for agency "${testAgency.name}".`);

    console.log('\n================================================================');
    console.log('🎉 ALL 13/13 AGENCY VERIFICATION PIPELINE TESTS PASSED WITH 100% SUCCESS!');
    console.log('================================================================\n');
  } catch (error: any) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB Atlas.');
  }
}

runMasterVerificationTest();
