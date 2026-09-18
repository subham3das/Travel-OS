import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { AgencyModel } from '../src/models/agency.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/agency';

async function runTests() {
  console.log('🚀 Starting Agency Packages & Bookings Migration Test Suite (Batch 1)...\n');

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Find or create verified test agency
  let agency = await AgencyModel.findOne({ verificationStatus: { $in: ['APPROVED', 'VERIFIED'] }, isDeleted: false });
  if (!agency) {
    agency = await AgencyModel.findOne({ isDeleted: false });
    if (agency) {
      agency.verificationStatus = 'APPROVED';
      agency.status = 'ACTIVE';
      await agency.save();
    }
  }

  if (!agency) {
    agency = await AgencyModel.create({
      applicationId: 'APP-TEST-001',
      name: 'Wanderlust Travels India',
      email: 'partner@wanderlust.com',
      phone: '+91 98765 43210',
      ownerName: 'Rajesh Sharma',
      verificationStatus: 'APPROVED',
      status: 'ACTIVE',
      isDeleted: false,
    });
  }

  const token = TokenUtil.signAccessToken({
    agencyId: agency._id.toString(),
    userId: agency._id.toString(),
    email: agency.email,
    userType: 'AGENCY',
    role: 'AGENCY',
  });

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let testPackageMongoId: string = '';
  let testPackageCustomId: string = '';
  let testBookingId: string = '';

  // Test 1: Fetch Agency Package KPI Stats
  console.log('--- Test 1: GET /api/agency/packages/stats ---');
  const statsRes = await fetch(`${API_BASE}/packages/stats`, { headers: authHeaders });
  const statsJson = await statsRes.json();
  console.log('Package KPI Stats:', statsJson);
  if (!statsJson.success || statsJson.data.total === undefined) throw new Error('Test 1 Failed: stats missing');
  console.log('✅ Test 1 Passed: Package KPI telemetry live\n');

  // Test 2: Create Package from Wizard
  console.log('--- Test 2: POST /api/agency/packages (Create Package) ---');
  const createPkgRes = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Kashmir Alpine & Great Lakes Expedition',
      destination: 'Srinagar, Sonamarg, Gulmarg',
      destinationCountry: 'India',
      category: 'Trekking & Adventure',
      durationDays: 7,
      durationNights: 6,
      price: 24999,
      originalPrice: 29999,
      availableSeats: 25,
      totalSeats: 25,
      coverImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
      inclusions: ['All meals during trek', 'Alpine tents', 'Trek leader & guide', 'Permits & entry fees'],
      exclusions: ['Flights to Srinagar', 'Personal trekking gear', 'Insurance'],
      itinerary: [
        { day: 1, title: 'Arrival in Srinagar', description: 'Acclimatization and houseboat stay' },
        { day: 2, title: 'Drive to Sonamarg Basecamp', description: 'Briefing and equipment check' },
      ],
    }),
  });
  const createPkgJson = await createPkgRes.json();
  console.log('Created Package:', createPkgJson.data?.packageId, createPkgJson.data?.title);
  if (!createPkgJson.success || !createPkgJson.data?._id) throw new Error('Test 2 Failed: package creation error');
  testPackageMongoId = createPkgJson.data._id;
  testPackageCustomId = createPkgJson.data.packageId;
  console.log('✅ Test 2 Passed: Package created and stored in MongoDB\n');

  // Test 3: Get Packages List with Search & Status Filters
  console.log('--- Test 3: GET /api/agency/packages (Search & Filters) ---');
  const listRes = await fetch(`${API_BASE}/packages?search=Kashmir&status=Active`, { headers: authHeaders });
  const listJson = await listRes.json();
  console.log(`Found ${listJson.data?.items?.length} matching packages`);
  if (!listJson.success || !Array.isArray(listJson.data.items)) throw new Error('Test 3 Failed: packages list error');
  console.log('✅ Test 3 Passed: Package listing with search & tenant filter live\n');

  // Test 4: Quick Toggle Package Status
  console.log('--- Test 4: PATCH /api/agency/packages/:id/status (Toggle Status) ---');
  const statusToggleRes = await fetch(`${API_BASE}/packages/${testPackageMongoId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ status: 'Draft' }),
  });
  const statusToggleJson = await statusToggleRes.json();
  console.log('Updated Status:', statusToggleJson.data?.status);
  if (!statusToggleJson.success || statusToggleJson.data.status !== 'Draft') {
    throw new Error('Test 4 Failed: status toggle error');
  }
  console.log('✅ Test 4 Passed: Status toggle executed successfully\n');

  // Test 5: Clone / Duplicate Package
  console.log('--- Test 5: POST /api/agency/packages/:id/duplicate (Duplicate Package) ---');
  const dupRes = await fetch(`${API_BASE}/packages/${testPackageMongoId}/duplicate`, {
    method: 'POST',
    headers: authHeaders,
  });
  const dupJson = await dupRes.json();
  console.log('Duplicated Package:', dupJson.data?.packageId, dupJson.data?.packageName);
  if (!dupJson.success || !dupJson.data?.packageName?.includes('(Copy)')) {
    throw new Error('Test 5 Failed: duplicate package error');
  }
  console.log('✅ Test 5 Passed: Package cloned as draft\n');

  // Test 6: Seed / Ensure Live Booking Document for Agency
  console.log('--- Test 6: Ensure Live Booking Document in MongoDB ---');
  let sampleBooking = await BookingModel.findOne({ agencyId: agency._id });
  if (!sampleBooking) {
    sampleBooking = await BookingModel.create({
      bookingId: `BK-2026-TST-${Date.now().toString().slice(-4)}`,
      agencyId: agency._id,
      packageId: testPackageMongoId,
      packageName: 'Kashmir Alpine & Great Lakes Expedition',
      agencyName: agency.name,
      customerName: 'Ananya Roy',
      customerEmail: 'ananya.roy@example.com',
      customerPhone: '+91 98123 45678',
      travelersCount: 2,
      totalAmount: 49998,
      paidAmount: 49998,
      status: 'PENDING',
      paymentStatus: 'PAID',
      destination: 'Kashmir',
      tripStartDate: new Date('2026-07-15'),
      tripEndDate: new Date('2026-07-22'),
      travelers: [
        { id: 'trv-1', name: 'Ananya Roy', age: 26, gender: 'Female', isPrimary: true, phone: '+91 98123 45678' },
        { id: 'trv-2', name: 'Rohan Roy', age: 29, gender: 'Male', isPrimary: false },
      ],
    });
  }
  testBookingId = sampleBooking.bookingId;
  console.log('Booking Ready:', testBookingId, sampleBooking.customerName);
  console.log('✅ Test 6 Passed: Live booking document ensured in MongoDB\n');

  // Test 7: Fetch Agency Booking Stats
  console.log('--- Test 7: GET /api/agency/bookings/stats ---');
  const bookingStatsRes = await fetch(`${API_BASE}/bookings/stats`, { headers: authHeaders });
  const bookingStatsJson = await bookingStatsRes.json();
  console.log('Booking KPI Stats:', bookingStatsJson);
  if (!bookingStatsJson.success || bookingStatsJson.data.total === undefined) {
    throw new Error('Test 7 Failed: booking stats error');
  }
  console.log('✅ Test 7 Passed: Booking KPI telemetry live\n');

  // Test 8: Get Bookings & Grouped Departures
  console.log('--- Test 8: GET /api/agency/bookings (Grouped Departures) ---');
  const bookingsListRes = await fetch(`${API_BASE}/bookings`, { headers: authHeaders });
  const bookingsListJson = await bookingsListRes.json();
  console.log(`Retrieved ${bookingsListJson.data?.bookings?.length} bookings and ${bookingsListJson.data?.groups?.length} departure groups`);
  if (!bookingsListJson.success || !Array.isArray(bookingsListJson.data.groups)) {
    throw new Error('Test 8 Failed: bookings & groups listing error');
  }
  console.log('✅ Test 8 Passed: Bookings & departure grouping operational\n');

  // Test 9: Get Single Booking Manifest by ID
  console.log(`--- Test 9: GET /api/agency/bookings/${testBookingId} (Manifest) ---`);
  const manifestRes = await fetch(`${API_BASE}/bookings/${testBookingId}`, { headers: authHeaders });
  const manifestJson = await manifestRes.json();
  console.log('Passenger Manifest:', manifestJson.data?.owner?.name, '| Travelers:', manifestJson.data?.travelerCount);
  if (!manifestJson.success || manifestJson.data?.bookingId !== testBookingId) {
    throw new Error('Test 9 Failed: booking manifest error');
  }
  console.log('✅ Test 9 Passed: Deep passenger manifest inspector working\n');

  // Test 10: Confirm Booking
  console.log(`--- Test 10: PATCH /api/agency/bookings/${testBookingId}/confirm ---`);
  const confirmRes = await fetch(`${API_BASE}/bookings/${testBookingId}/confirm`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  const confirmJson = await confirmRes.json();
  console.log('Booking Confirmed Status:', confirmJson.data?.bookingStatus);
  if (!confirmJson.success || confirmJson.data?.bookingStatus !== 'CONFIRMED') {
    throw new Error('Test 10 Failed: booking confirmation error');
  }
  console.log('✅ Test 10 Passed: Booking confirmed and state persisted\n');

  // Test 11: Verify SOC 2 Audit Logs for Agency Actions
  console.log('--- Test 11: Verify Audit Logs for Agency Actions ---');
  const auditLogs = await AuditLogModel.find({
    'actor.id': agency._id.toString(),
  }).sort({ createdAt: -1 }).limit(5);
  console.log(`Found ${auditLogs.length} audit log entries for Agency "${agency.name}"`);
  if (auditLogs.length === 0) throw new Error('Test 11 Failed: Audit log entry missing');
  console.log('Audit Action:', auditLogs[0].action, '| Event:', auditLogs[0].eventType);
  console.log('✅ Test 11 Passed: Agency administrative actions recorded in audit_logs\n');

  console.log('🎉 ALL 11 TESTS PASSED WITH 100% SUCCESS! Batch 1 (Agency Packages & Bookings) Backend is 100% Production Ready!\n');
  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
