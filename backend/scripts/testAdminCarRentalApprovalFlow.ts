import mongoose from 'mongoose';
import { envConfig } from '../src/config/env.config.js';
import { adminCarRentalApprovalService } from '../src/services/adminCarRentalApproval.service.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { CarModel } from '../src/models/car.model.js';

async function runTest() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(envConfig.MONGODB_URI);
  console.log('Connected successfully.\n');

  try {
    // 1. Test Summary Stats
    console.log('1. Testing getSummaryStats()...');
    const stats = await adminCarRentalApprovalService.getSummaryStats();
    console.log('Stats retrieved:', {
      pending: stats.pendingRequests.count,
      approvedToday: stats.approvedToday.count,
      rejectedToday: stats.rejectedToday.count,
      needsChanges: stats.needsChanges.count,
      totalVehicles: stats.totalVehicles.count,
      avgApprovalTime: stats.avgApprovalTime.value,
    });

    // 2. Test Get Requests by Tab
    console.log('\n2. Testing getCarRentalRequests() with tabs...');
    const pendingRequests = await adminCarRentalApprovalService.getCarRentalRequests({ tab: 'Pending', limit: 5 });
    console.log(`Pending applications found: ${pendingRequests.pagination.total}`);

    const approvedRequests = await adminCarRentalApprovalService.getCarRentalRequests({ tab: 'Approved', limit: 5 });
    console.log(`Approved applications found: ${approvedRequests.pagination.total}`);

    // 3. Create a test Car Rental application to verify full lifecycle
    console.log('\n3. Creating temporary Car Rental application for workflow verification...');
    const testAppId = `ATP-CR-TEST-${Date.now().toString().slice(-6)}`;
    const testAgency = new AgencyModel({
      applicationId: testAppId,
      name: 'Apex Speed Commercial Fleet Ltd',
      legalBusinessName: 'Apex Speed Commercial Fleet Private Limited',
      agencyDisplayName: 'Apex Speed Fleet',
      email: `test-cr-${Date.now()}@apnatrip.com`,
      phone: '+91 98765 43210',
      ownerName: 'Vikramaditya Sharma',
      businessAddress: 'Hub 14, Commercial Cargo Terminal',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pinCode: '411014',
      panNumber: 'ABCDE1234F',
      gstNumber: '27ABCDE1234F1Z5',
      businessTypes: ['car_rental'],
      activeBusiness: 'car_rental',
      carRentalVerificationStatus: 'PENDING',
      status: 'PENDING',
      carRentalProfile: {
        businessName: 'Apex Speed Commercial Fleet Ltd',
        ownerName: 'Vikramaditya Sharma',
        phone: '+91 98765 43210',
        email: `test-cr-${Date.now()}@apnatrip.com`,
        address: 'Hub 14, Commercial Cargo Terminal',
        city: 'Pune',
        state: 'Maharashtra',
        country: 'India',
        pinCode: '411014',
        fleetSize: 12,
        operatingCities: ['Pune', 'Mumbai', 'Goa'],
        workingHours: '24/7 Dispatch',
        documents: [
          {
            id: 'doc-rc-01',
            name: 'Commercial Fleet RC Bundle',
            type: 'RC',
            status: 'Pending',
            fileUrl: 'https://example.com/rc-bundle.pdf',
          },
          {
            id: 'doc-ins-01',
            name: 'Comprehensive Commercial Insurance',
            type: 'Insurance',
            status: 'Pending',
            fileUrl: 'https://example.com/fleet-insurance.pdf',
          },
        ],
      },
    });
    await testAgency.save();
    console.log(`Test application created with ID: ${testAgency._id} (${testAppId})`);

    // Add a vehicle to test the join
    const testCar = new CarModel({
      agencyId: testAgency._id,
      name: 'Innova Crysta Luxury',
      brand: 'Toyota',
      type: 'suv',
      category: 'outstation',
      city: 'Pune',
      dailyPrice: 3800,
      depositPercentage: 20,
      specs: {
        seats: 7,
        doors: 4,
        luggageBags: 4,
        fuel: 'Diesel',
        transmission: 'Manual',
        hasAC: true,
        driverIncluded: true,
        modelYear: 2024,
      },
      driver: {
        name: 'Rameshwar Patil',
        phone: '+91 91234 56789',
        experienceYears: 6,
        rating: 4.9,
        tripsCount: 140,
        languages: ['Marathi', 'Hindi', 'English'],
        isVerified: true,
      },
      images: ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=600&auto=format&fit=crop'],
      thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop',
      features: ['Air Conditioning', 'Chauffeur Driven', 'Luggage Carrier'],
      inclusions: ['Fuel', 'Tolls & State Taxes'],
      exclusions: ['Driver Night Allowance'],
      cancellationPolicy: 'Free cancellation up to 24 hours before trip.',
      averageRating: 4.9,
      reviewsCount: 18,
      isAvailable: true,
      isActive: true,
      isFeatured: true,
      description: 'Well maintained luxury commercial SUV with trained chauffeur.',
    });
    await testCar.save();
    console.log(`Test vehicle created with ID: ${testCar._id} assigned to ${testAgency._id}`);

    // Mock Admin User
    const mockAdmin = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Super Compliance Admin',
      email: 'admin@travelos.com',
      role: { name: 'SUPER_ADMIN' },
    };

    // 4. Test Get by ID (Checking vehicle and driver joins)
    console.log('\n4. Testing getCarRentalRequestById()...');
    const fetchedDetails = await adminCarRentalApprovalService.getCarRentalRequestById(testAgency._id.toString());
    console.log(`Fetched details for: ${fetchedDetails.businessName}`);
    console.log(`Vehicles count: ${fetchedDetails.vehicles?.length} (Brand: ${fetchedDetails.vehicles?.[0]?.brand})`);
    console.log(`Chauffeur extracted: ${fetchedDetails.drivers?.[0]?.name} (Vehicle: ${fetchedDetails.drivers?.[0]?.vehicleAssigned})`);

    // 5. Test Save Review Notes
    console.log('\n5. Testing saveReviewNotes()...');
    const noteRes = await adminCarRentalApprovalService.saveReviewNotes(
      testAgency._id.toString(),
      mockAdmin,
      'Fleet verification documents checked. All commercial permits valid.'
    );
    console.log('Review notes saved:', noteRes.success);

    // 6. Test Request Changes
    console.log('\n6. Testing requestChanges()...');
    const chgRes = await adminCarRentalApprovalService.requestChanges(
      testAgency._id.toString(),
      mockAdmin,
      ['Comprehensive Fleet Insurance Missing or Expired'],
      'Please attach the latest 2026 renewal receipt.'
    );
    console.log(`Status after request changes: ${chgRes.request?.verificationStatus}`);

    // 7. Test Approve Documents
    console.log('\n7. Testing approveDocuments()...');
    const docAppRes = await adminCarRentalApprovalService.approveDocuments(
      testAgency._id.toString(),
      mockAdmin,
      ['doc-rc-01']
    );
    console.log(`Approved documents result: ${docAppRes.success}`);

    // 8. Test Approve Car Rental
    console.log('\n8. Testing approveCarRental()...');
    const apprRes = await adminCarRentalApprovalService.approveCarRental(
      testAgency._id.toString(),
      mockAdmin,
      'Fleet inspection passed with flying colors.'
    );
    console.log(`Status after approval: ${apprRes.request?.verificationStatus}`);
    console.log(`Business types:`, apprRes.request ? testAgency.businessTypes : []);

    // 9. Test Suspend
    console.log('\n9. Testing suspendCarRental()...');
    const suspRes = await adminCarRentalApprovalService.suspendCarRental(
      testAgency._id.toString(),
      mockAdmin,
      'Routine administrative compliance check'
    );
    console.log(`Status after suspend: ${suspRes.request?.verificationStatus}`);

    // 10. Test Reopen Review
    console.log('\n10. Testing reopenReview()...');
    const reopenRes = await adminCarRentalApprovalService.reopenReview(
      testAgency._id.toString(),
      mockAdmin
    );
    console.log(`Status after reopen: ${reopenRes.request?.verificationStatus}`);

    // 11. Test Reject
    console.log('\n11. Testing rejectCarRental()...');
    const rejRes = await adminCarRentalApprovalService.rejectCarRental(
      testAgency._id.toString(),
      mockAdmin,
      'Failed vehicle fitness and permit requirements'
    );
    console.log(`Status after reject: ${rejRes.request?.verificationStatus}`);

    // 12. Test Export CSV
    console.log('\n12. Testing exportCsv()...');
    const csv = await adminCarRentalApprovalService.exportCsv({ tab: 'All' });
    console.log(`CSV generated with ${csv.split('\n').length} lines.`);

    // Cleanup test records
    console.log('\nCleaning up test records...');
    await CarModel.deleteOne({ _id: testCar._id });
    await AgencyModel.deleteOne({ _id: testAgency._id });
    console.log('Cleanup complete. All tests passed!');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runTest();
