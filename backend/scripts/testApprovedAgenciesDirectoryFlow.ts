import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { adminAgencyDirectoryService } from '../src/services/adminAgencyDirectory.service.js';

const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function runDirectoryTestSuite() {
  console.log('🚀 Starting Approved Agencies Directory Test Suite...\n');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB:', mongoose.connection.name || 'travelos_db');

  const testTimestamp = Date.now();
  const testAgencyAppId = `ATP-AGY-DIRTEST-${testTimestamp}`;
  let createdAgencyId: string = '';

  try {
    // 1. Create a mock approved agency in MongoDB
    const testAgency = await AgencyModel.create({
      applicationId: testAgencyAppId,
      name: 'Skyline Luxury Journeys',
      legalBusinessName: 'Skyline Luxury Journeys Pvt Ltd',
      agencyDisplayName: 'Skyline Journeys',
      email: `director.${testTimestamp}@skylinejourneys.com`,
      phone: '+91 99887 66554',
      ownerName: 'Vikram Malhotra',
      businessType: 'Tour Operator',
      city: 'Jaipur',
      state: 'Rajasthan',
      gstNumber: '08AABCS1234F1Z5',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      complianceScore: 94,
      documents: [
        {
          id: 'doc_gst_cert',
          name: 'GST Registration Certificate.pdf',
          type: 'GST',
          status: 'Approved',
          fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_gst.pdf',
          uploadedAt: new Date().toISOString(),
        },
        {
          id: 'doc_pan_card',
          name: 'Company PAN Card.pdf',
          type: 'KYC',
          status: 'Approved',
          fileUrl: 'https://res.cloudinary.com/demo/image/upload/v1/sample_pan.pdf',
          uploadedAt: new Date().toISOString(),
        },
      ],
      timeline: [
        {
          id: `tl_1`,
          title: 'Application Approved',
          timestamp: new Date().toISOString(),
          completed: true,
          desc: 'Agency approved by Super Admin.',
          actor: 'Super Admin',
          color: 'emerald',
        },
      ],
    });

    createdAgencyId = testAgency._id.toString();
    console.log(`✅ [1/6] Created test approved agency: "${testAgency.name}" (${testAgency.applicationId})`);

    // 2. Test Summary KPI Stats
    const stats = await adminAgencyDirectoryService.getSummaryStats();
    console.log('✅ [2/6] Summary Stats retrieved successfully:', {
      totalAgencies: stats.totalAgencies.count,
      activeAgencies: stats.activeAgencies.count,
      verifiedAgencies: stats.verifiedAgencies.count,
      pendingApproval: stats.pendingApproval.count,
      suspendedAgencies: stats.suspendedAgencies.count,
    });
    if (stats.totalAgencies.count < 1) {
      throw new Error('Stats total agencies should be at least 1');
    }

    // 3. Test Agency Listing & Search Query
    const searchRes = await adminAgencyDirectoryService.getAgencies({
      search: 'Skyline Luxury',
      page: 1,
      limit: 10,
      status: 'All Status',
      verification: 'All Verification',
      businessType: 'All Types',
      state: 'All States',
      city: 'All Cities',
      rating: 'All Ratings',
      dateJoined: '',
      sortBy: 'newest',
      sortOrder: 'desc',
    });

    console.log(`✅ [3/6] Search query returned ${searchRes.agencies.length} agency: "${searchRes.agencies[0]?.name}"`);
    if (searchRes.agencies.length === 0 || searchRes.agencies[0].id !== createdAgencyId) {
      throw new Error('Search did not return newly created agency');
    }

    // 4. Test Single Agency Full Details
    const details = await adminAgencyDirectoryService.getAgencyDetails(createdAgencyId);
    console.log('✅ [4/6] Agency Details retrieved for Drawer:', {
      name: details.name,
      owner: details.owner.name,
      gst: details.gstNumber,
      documentsCount: details.documents.length,
      activitiesCount: details.activities.length,
    });
    if (details.documents.length !== 2) {
      throw new Error('Expected 2 documents in agency details');
    }

    // 5. Test Status Transitions (Suspend & Activate)
    const suspendRes = await adminAgencyDirectoryService.updateAgencyStatus(createdAgencyId, {
      action: 'suspend',
      reason: 'Routine compliance audit hold',
    });
    console.log('✅ [5/6] Agency status updated to SUSPENDED:', suspendRes.message);

    const checkSuspended = await AgencyModel.findById(createdAgencyId);
    if (checkSuspended?.status !== 'SUSPENDED') {
      throw new Error(`Expected status SUSPENDED, got ${checkSuspended?.status}`);
    }

    const activateRes = await adminAgencyDirectoryService.updateAgencyStatus(createdAgencyId, {
      action: 'activate',
    });
    console.log('✅ Agency status reactivated to ACTIVE:', activateRes.message);

    // 6. Test Bulk Action
    const bulkRes = await adminAgencyDirectoryService.bulkAgencyAction({
      action: 'suspend',
      agencyIds: [createdAgencyId],
      reason: 'Bulk testing suspension',
    });
    console.log('✅ [6/6] Bulk action executed successfully:', bulkRes.message);

    // Cleanup
    await AgencyModel.deleteOne({ _id: createdAgencyId });
    console.log('\n🧹 Test clean-up completed.');
    console.log('\n🎉 ALL APPROVED AGENCIES DIRECTORY TESTS PASSED (100% SUCCESS)!\n');
  } catch (err: any) {
    console.error('❌ Test Suite Failed:', err);
    if (createdAgencyId) {
      await AgencyModel.deleteOne({ _id: createdAgencyId }).catch(() => {});
    }
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runDirectoryTestSuite();
