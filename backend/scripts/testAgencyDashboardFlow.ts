import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { TokenUtil } from '../src/utils/token.util.js';
import { agencyDashboardService } from '../src/services/agencyDashboard.service.js';
import { envConfig } from '../src/config/env.config.js';

async function runTests() {
  console.log('🧪 Starting Agency Dashboard & Auth Verification Test Suite...\n');

  try {
    const mongoUri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/travel_os_dev';
    console.log(`📡 Connecting to database...`);
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // ── Test 1: Create Test Agencies ──
    console.log('\n--- Test 1: Creating Test Agencies (Alpha, Beta, Gamma, Pending) ---');

    // 1. Pending Agency
    await AgencyModel.deleteOne({ email: 'test-pending@agency.com' });
    const pendingAgency = await AgencyModel.create({
      name: 'Pending Onboarding Agency',
      ownerName: 'Pending Owner',
      email: 'test-pending@agency.com',
      phone: '9876543210',
      applicationId: 'APP-PENDING-001',
      verificationStatus: 'UNDER_REVIEW',
      status: 'PENDING',
    });
    console.log('✅ Created Pending Agency:', pendingAgency._id.toString());

    // 2. Agency Alpha (Approved, Active with Bookings)
    await AgencyModel.deleteOne({ email: 'alpha@adventures.com' });
    await BookingModel.deleteMany({ agencyName: 'Alpha Himalayan Adventures' });
    await PackageModel.deleteMany({ agencyName: 'Alpha Himalayan Adventures' });

    const agencyAlpha = await AgencyModel.create({
      name: 'Alpha Himalayan Adventures',
      agencyDisplayName: 'Alpha Adventures',
      ownerName: 'John Alpha',
      email: 'alpha@adventures.com',
      phone: '9988776655',
      applicationId: 'APP-ALPHA-001',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      owner: {
        name: 'John Alpha',
        email: 'john@alpha.com',
        phone: '9988776655',
      },
    });

    const alphaPackage = await PackageModel.create({
      packageId: 'PKG-ALPHA-01',
      title: 'Ladakh High Altitude Trek',
      agencyId: agencyAlpha._id,
      agencyName: 'Alpha Himalayan Adventures',
      destination: 'Ladakh',
      category: 'Adventure',
      price: 35000,
      durationDays: 7,
      durationNights: 6,
      status: 'APPROVED',
      isActive: true,
    });

    await BookingModel.create([
      {
        bookingId: 'BK-ALPHA-001',
        agencyId: agencyAlpha._id,
        packageId: alphaPackage._id,
        packageName: 'Ladakh High Altitude Trek',
        agencyName: 'Alpha Himalayan Adventures',
        customerName: 'Aarav Sharma',
        customerEmail: 'aarav@gmail.com',
        customerPhone: '9876500001',
        travelersCount: 2,
        totalAmount: 70000,
        paidAmount: 70000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        destination: 'Ladakh',
        tripStartDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
      },
      {
        bookingId: 'BK-ALPHA-002',
        agencyId: agencyAlpha._id,
        packageId: alphaPackage._id,
        packageName: 'Ladakh High Altitude Trek',
        agencyName: 'Alpha Himalayan Adventures',
        customerName: 'Diya Patel',
        customerEmail: 'diya@gmail.com',
        customerPhone: '9876500002',
        travelersCount: 1,
        totalAmount: 35000,
        paidAmount: 0,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        destination: 'Ladakh',
        tripStartDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('✅ Created Agency Alpha with 2 bookings and 1 package.');

    // 3. Agency Beta (Approved, Active with Different Bookings)
    await AgencyModel.deleteOne({ email: 'beta@coastal.com' });
    await BookingModel.deleteMany({ agencyName: 'Beta Coastal Escapes' });
    await PackageModel.deleteMany({ agencyName: 'Beta Coastal Escapes' });

    const agencyBeta = await AgencyModel.create({
      name: 'Beta Coastal Escapes',
      agencyDisplayName: 'Beta Escapes',
      ownerName: 'Sara Beta',
      email: 'beta@coastal.com',
      phone: '9911223344',
      applicationId: 'APP-BETA-001',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      owner: {
        name: 'Sara Beta',
        email: 'sara@beta.com',
        phone: '9911223344',
      },
    });

    const betaPackage = await PackageModel.create({
      packageId: 'PKG-BETA-01',
      title: 'Goa Coastal Cruise & Stay',
      agencyId: agencyBeta._id,
      agencyName: 'Beta Coastal Escapes',
      destination: 'Goa',
      category: 'Leisure',
      price: 25000,
      durationDays: 4,
      durationNights: 3,
      status: 'APPROVED',
      isActive: true,
    });

    await BookingModel.create([
      {
        bookingId: 'BK-BETA-001',
        agencyId: agencyBeta._id,
        packageId: betaPackage._id,
        packageName: 'Goa Coastal Cruise & Stay',
        agencyName: 'Beta Coastal Escapes',
        customerName: 'Rohan Mehta',
        customerEmail: 'rohan@gmail.com',
        customerPhone: '9876500003',
        travelersCount: 2,
        totalAmount: 50000,
        paidAmount: 50000,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        destination: 'Goa',
        tripStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        tripEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    ]);
    console.log('✅ Created Agency Beta with 1 booking and 1 package.');

    // 4. Agency Gamma (Approved, Brand New with 0 Bookings)
    await AgencyModel.deleteOne({ email: 'gamma@new.com' });
    const agencyGamma = await AgencyModel.create({
      name: 'Gamma Fresh Tours',
      agencyDisplayName: 'Gamma Tours',
      ownerName: 'Vikram Gamma',
      email: 'gamma@new.com',
      phone: '9955443322',
      applicationId: 'APP-GAMMA-001',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      owner: {
        name: 'Vikram Gamma',
        email: 'vikram@gamma.com',
        phone: '9955443322',
      },
    });
    console.log('✅ Created Agency Gamma with 0 bookings.');

    // ── Test 2: Verify Dashboard Data for Agency Alpha ──
    console.log('\n--- Test 2: Testing Agency Alpha Dashboard Data ---');
    const alphaDashboard = await agencyDashboardService.getDashboardData(agencyAlpha, 'This Month');

    console.log('Alpha Agency Name:', alphaDashboard.agency.displayName);
    console.log('Alpha Owner Email:', alphaDashboard.agency.ownerEmail);
    console.log('Alpha KPI Stats:', alphaDashboard.kpiStats);
    console.log('Alpha Top Package:', alphaDashboard.topPackage.packageName);
    console.log('Alpha Recent Bookings Count:', alphaDashboard.recentBookings.length);

    if (alphaDashboard.agency.displayName !== 'Alpha Adventures') {
      throw new Error(`Expected displayName to be 'Alpha Adventures', got '${alphaDashboard.agency.displayName}'`);
    }
    if (alphaDashboard.agency.ownerEmail !== 'john@alpha.com') {
      throw new Error(`Expected ownerEmail to be 'john@alpha.com', got '${alphaDashboard.agency.ownerEmail}'`);
    }
    if (alphaDashboard.topPackage.packageName !== 'Ladakh High Altitude Trek') {
      throw new Error(`Expected top package to be 'Ladakh High Altitude Trek', got '${alphaDashboard.topPackage.packageName}'`);
    }
    if (alphaDashboard.recentBookings.length !== 2) {
      throw new Error(`Expected 2 recent bookings, got ${alphaDashboard.recentBookings.length}`);
    }
    console.log('✅ Agency Alpha dashboard aggregation verified successfully.');

    // ── Test 3: Verify Multi-Tenant Data Isolation (Agency Beta) ──
    console.log('\n--- Test 3: Testing Agency Beta (Multi-Tenant Isolation) ---');
    const betaDashboard = await agencyDashboardService.getDashboardData(agencyBeta, 'This Month');

    console.log('Beta Agency Name:', betaDashboard.agency.displayName);
    console.log('Beta KPI Revenue:', betaDashboard.revenue.revenueAmount);
    console.log('Beta Top Package:', betaDashboard.topPackage.packageName);
    console.log('Beta Recent Bookings Count:', betaDashboard.recentBookings.length);

    if (betaDashboard.agency.displayName !== 'Beta Escapes') {
      throw new Error(`Expected displayName 'Beta Escapes', got '${betaDashboard.agency.displayName}'`);
    }
    if (betaDashboard.topPackage.packageName !== 'Goa Coastal Cruise & Stay') {
      throw new Error(`Expected top package 'Goa Coastal Cruise & Stay', got '${betaDashboard.topPackage.packageName}'`);
    }
    if (betaDashboard.recentBookings.length !== 1) {
      throw new Error(`Expected 1 recent booking, got ${betaDashboard.recentBookings.length}`);
    }
    if (betaDashboard.recentBookings[0].packageName.includes('Ladakh')) {
      throw new Error('Data Leak Detected! Agency Beta saw Agency Alpha Ladakh booking!');
    }
    console.log('✅ Multi-Tenant Data Isolation verified! No data leakage between agencies.');

    // ── Test 4: Verify Empty State Handling (Agency Gamma) ──
    console.log('\n--- Test 4: Testing Agency Gamma (0 Bookings Empty State) ---');
    const gammaDashboard = await agencyDashboardService.getDashboardData(agencyGamma, 'This Month');

    console.log('Gamma Revenue:', gammaDashboard.revenue.revenueAmount);
    console.log('Gamma Total Bookings Count:', gammaDashboard.bookingOverview.total);
    console.log('Gamma Recent Bookings Count:', gammaDashboard.recentBookings.length);
    console.log('Gamma Departures Count:', gammaDashboard.departures.length);

    if (gammaDashboard.bookingOverview.total !== 0) {
      throw new Error(`Expected 0 bookings for Gamma, got ${gammaDashboard.bookingOverview.total}`);
    }
    if (gammaDashboard.recentBookings.length !== 0) {
      throw new Error(`Expected 0 recent bookings for Gamma, got ${gammaDashboard.recentBookings.length}`);
    }
    console.log('✅ Clean empty state handling verified for newly approved agencies with 0 bookings.');

    // ── Test 5: Verify JWT Signing and Verification ──
    console.log('\n--- Test 5: Testing JWT Generation & Verification ---');
    const alphaToken = TokenUtil.signAccessToken({
      userId: agencyAlpha._id.toString(),
      agencyId: agencyAlpha._id.toString(),
      email: agencyAlpha.email,
      userType: 'agency',
      role: 'owner',
    });
    console.log('Generated JWT Token (first 25 chars):', alphaToken.slice(0, 25) + '...');

    const decoded = TokenUtil.verifyAccessToken(alphaToken);
    if (decoded.agencyId !== agencyAlpha._id.toString()) {
      throw new Error('Token verification failed: agencyId mismatch');
    }
    console.log('✅ JWT signing and verification verified successfully.');

    // Cleanup test records
    console.log('\n--- Cleaning up test records ---');
    await AgencyModel.deleteMany({ email: { $in: ['test-pending@agency.com', 'alpha@adventures.com', 'beta@coastal.com', 'gamma@new.com'] } });
    await BookingModel.deleteMany({ agencyName: { $in: ['Alpha Himalayan Adventures', 'Beta Coastal Escapes'] } });
    await PackageModel.deleteMany({ agencyName: { $in: ['Alpha Himalayan Adventures', 'Beta Coastal Escapes'] } });
    console.log('✅ Cleaned up temporary test documents.');

    console.log('\n🎉 ALL 5 TEST SUITES PASSED WITH 100% SUCCESS!\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test Suite Failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runTests();
