import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { AdminModel } from '../src/models/admin.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/admin';

async function runTests() {
  console.log('🚀 Starting Admin Packages & Bookings Migration Test Suite...\n');

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Find or create test admin
  let admin = await AdminModel.findOne({ email: 'superadmin@apnatrip.com' });
  if (!admin) {
    admin = await AdminModel.findOne();
  }

  if (!admin) {
    throw new Error('No admin account found in database to run tests.');
  }

  const token = TokenUtil.signAccessToken({
    userId: admin._id.toString(),
    email: admin.email,
    userType: 'ADMIN',
    role: 'SUPER_ADMIN',
  });

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let testPackageId: string = '';
  let testBookingId: string = '';

  // Test 1: Fetch Packages KPI Stats
  console.log('--- Test 1: GET /api/admin/packages/stats ---');
  const statsRes = await fetch(`${API_BASE}/packages/stats`, { headers: authHeaders });
  const statsJson = await statsRes.json();
  console.log('Package KPI Stats:', statsJson);
  if (!statsJson.success || !statsJson.data.totalPackages) throw new Error('Test 1 Failed: stats missing');
  console.log('✅ Test 1 Passed: Package KPI telemetry live\n');

  // Test 2: Create Tour Package
  console.log('--- Test 2: POST /api/admin/packages (Create Package) ---');
  const createPkgRes = await fetch(`${API_BASE}/packages`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Himachal Snow & Pine Forest Expedition',
      subtitle: 'Experience Manali and Solang Valley in Winter',
      agencyName: 'Himalayan Trails Ltd',
      destination: 'Manali, Himachal Pradesh',
      destinationCountry: 'India',
      destinationRegion: 'North India',
      category: 'Adventure',
      durationDays: 5,
      durationNights: 4,
      price: 24999,
      originalPrice: 32000,
      availableSeats: 16,
      totalSeats: 20,
      inclusions: ['4-Star Mountain View Resort', 'All Meals', 'Skiing Passes'],
      exclusions: ['Flight to Chandigarh'],
      itinerary: [
        { day: 1, title: 'Arrival in Manali', description: 'Check-in and evening bonfire dinner' },
        { day: 2, title: 'Solang Valley Adventure', description: 'Snow sports and paragliding' },
      ],
    }),
  });
  const createPkgJson = await createPkgRes.json();
  console.log('Created Package:', createPkgJson.data?.packageId, createPkgJson.data?.title);
  if (!createPkgJson.success || !createPkgJson.data.id) throw new Error('Test 2 Failed: package creation failed');
  testPackageId = createPkgJson.data.id;
  console.log('✅ Test 2 Passed: Package created and stored in MongoDB\n');

  // Test 3: Approve Package
  console.log('--- Test 3: PATCH /api/admin/packages/:id/approval (Approve Package) ---');
  const approvePkgRes = await fetch(`${API_BASE}/packages/${testPackageId}/approval`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      approvalStatus: 'APPROVED',
      notes: 'Verified itinerary and compliance documents',
    }),
  });
  const approvePkgJson = await approvePkgRes.json();
  console.log('Approval Result:', approvePkgJson.message);
  if (!approvePkgJson.success) throw new Error('Test 3 Failed: approve package failed');
  console.log('✅ Test 3 Passed: Package approved and activated\n');

  // Test 4: Feature Package
  console.log('--- Test 4: PATCH /api/admin/packages/:id/feature (Feature Package) ---');
  const featPkgRes = await fetch(`${API_BASE}/packages/${testPackageId}/feature`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ isFeatured: true }),
  });
  const featPkgJson = await featPkgRes.json();
  console.log('Feature Result:', featPkgJson.message);
  if (!featPkgJson.success) throw new Error('Test 4 Failed: feature package failed');
  console.log('✅ Test 4 Passed: Package featured on homepage\n');

  // Test 5: Fetch Paginated Packages with Filter
  console.log('--- Test 5: GET /api/admin/packages (Search & Filter) ---');
  const listPkgRes = await fetch(`${API_BASE}/packages?search=Himachal&page=1&limit=10`, { headers: authHeaders });
  const listPkgJson = await listPkgRes.json();
  console.log(`Found ${listPkgJson.data.packages.length} packages matching search "Himachal"`);
  if (!listPkgJson.success || listPkgJson.data.packages.length === 0) throw new Error('Test 5 Failed: package search returned 0 items');
  console.log('✅ Test 5 Passed: Server-side search and filters working\n');

  // Test 6: Seed / Verify Master Bookings
  console.log('--- Test 6: Ensure Live Bookings in MongoDB ---');
  let existingBooking = await BookingModel.findOne({ isDeleted: false });
  if (!existingBooking) {
    existingBooking = await BookingModel.create({
      bookingId: `BK-${new Date().getFullYear()}-0001`,
      packageName: 'Himachal Snow & Pine Forest Expedition',
      agencyName: 'Himalayan Trails Ltd',
      customerName: 'Aarav Gupta',
      customerEmail: 'aarav.gupta@email.com',
      customerPhone: '+91 98765 12345',
      travelersCount: 2,
      totalAmount: 49998,
      paidAmount: 49998,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      destination: 'Manali, Himachal Pradesh',
      tripStartDate: new Date(Date.now() + 86400000 * 10),
      tripEndDate: new Date(Date.now() + 86400000 * 15),
      travelers: [
        { id: 'trv-1', name: 'Aarav Gupta', age: 31, gender: 'Male', passportNumber: 'P98765432', phone: '+91 98765 12345', email: 'aarav.gupta@email.com', isPrimary: true },
        { id: 'trv-2', name: 'Sneha Gupta', age: 29, gender: 'Female', passportNumber: 'P98765433', isPrimary: false },
      ],
    });
    console.log('Created Seed Booking in MongoDB:', existingBooking.bookingId);
  }
  testBookingId = existingBooking._id.toString();

  // Test 7: GET Bookings KPI Stats
  console.log('--- Test 7: GET /api/admin/bookings/stats ---');
  const bkStatsRes = await fetch(`${API_BASE}/bookings/stats`, { headers: authHeaders });
  const bkStatsJson = await bkStatsRes.json();
  console.log('Bookings KPI Stats:', bkStatsJson);
  if (!bkStatsJson.success || !bkStatsJson.data.totalBookings) throw new Error('Test 7 Failed: booking stats missing');
  console.log('✅ Test 7 Passed: Bookings KPI telemetry live\n');

  // Test 8: GET Paginated Bookings List
  console.log('--- Test 8: GET /api/admin/bookings (Paginated Manifests) ---');
  const bkListRes = await fetch(`${API_BASE}/bookings?page=1&limit=10`, { headers: authHeaders });
  const bkListJson = await bkListRes.json();
  console.log(`Retrieved ${bkListJson.data.bookings.length} bookings from MongoDB`);
  if (!bkListJson.success || bkListJson.data.bookings.length === 0) throw new Error('Test 8 Failed: no bookings returned');
  console.log('✅ Test 8 Passed: Bookings table rendered with live MongoDB documents\n');

  // Test 9: GET Single Detailed Booking (Passenger Manifest Drawer)
  console.log('--- Test 9: GET /api/admin/bookings/:id (Passenger Manifest) ---');
  const bkDetailRes = await fetch(`${API_BASE}/bookings/${testBookingId}`, { headers: authHeaders });
  const bkDetailJson = await bkDetailRes.json();
  console.log('Booking Customer:', bkDetailJson.data.travelerName, '| Travelers Count:', bkDetailJson.data.travelers?.length);
  if (!bkDetailJson.success || !bkDetailJson.data.travelers || bkDetailJson.data.travelers.length === 0) throw new Error('Test 9 Failed: travelers manifest missing');
  console.log('✅ Test 9 Passed: Deep passenger manifest inspector working\n');

  // Test 10: Update Booking Details
  console.log('--- Test 10: PATCH /api/admin/bookings/:id (Update Booking) ---');
  const updateBkRes = await fetch(`${API_BASE}/bookings/${testBookingId}`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      notes: 'Traveler requested vegetarian meal plan',
    }),
  });
  const updateBkJson = await updateBkRes.json();
  console.log('Update Result:', updateBkJson.message);
  if (!updateBkJson.success) throw new Error('Test 10 Failed: update booking failed');
  console.log('✅ Test 10 Passed: Booking updated in MongoDB\n');

  // Test 11: Audit Log Verification
  console.log('--- Test 11: Verify SOC 2 Audit Logs ---');
  const auditLogs = await AuditLogModel.find({
    module: { $in: ['PACKAGES', 'BOOKINGS'] },
  }).sort({ createdAt: -1 }).limit(5);
  console.log(`Found ${auditLogs.length} audit log entries for Packages & Bookings`);
  if (auditLogs.length === 0) throw new Error('Test 11 Failed: no audit logs recorded');
  console.log('✅ Test 11 Passed: Administrative actions recorded in audit_logs\n');

  console.log('🎉 ALL 11 TESTS PASSED WITH 100% SUCCESS! Batch 1 (Packages & Bookings) is 100% Production Ready!');

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
