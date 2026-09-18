import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { TripModel } from '../src/models/trip.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const API_BASE = 'http://localhost:5000/api/agency';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING BATCH 2: OPERATIONAL TRIPS & DISPATCH TEST SUITE');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Get an active/approved agency
  let agency = await AgencyModel.findOne({ $or: [{ status: 'ACTIVE' }, { verificationStatus: 'APPROVED' }, { verificationStatus: 'VERIFIED' }] });
  if (!agency) {
    agency = await AgencyModel.findOne({});
    if (agency) {
      agency.status = 'ACTIVE';
      agency.verificationStatus = 'APPROVED';
      await agency.save();
    }
  }

  if (!agency) {
    throw new Error('No agency found in database to test.');
  }

  const token = TokenUtil.signAccessToken({
    agencyId: (agency._id as any).toString(),
    userId: (agency._id as any).toString(),
    email: agency.email,
    userType: 'AGENCY',
    role: 'AGENCY',
  });

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, msg: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${msg}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${msg}`);
      throw new Error(`Assertion failed: ${msg}`);
    }
  }

  // TEST 1: GET /trips
  console.log('\n--- 1. Testing GET /api/agency/trips ---');
  const res1 = await fetch(`${API_BASE}/trips`, { headers: authHeaders });
  const data1 = await res1.json();
  assert(res1.status === 200, 'GET /trips returns 200 OK');
  assert(Array.isArray(data1.data?.trips), 'Response contains trips array');
  assert(data1.data.trips.length > 0, `Returned ${data1.data.trips.length} trips`);
  assert(typeof data1.data?.tabCounts === 'object', 'Response contains tabCounts object');
  assert(typeof data1.data?.stats === 'object', 'Response contains stats object');

  const sampleTrip = data1.data.trips[0];
  const testTripId = sampleTrip.tripId;

  // TEST 2: Filter by statusCategory
  console.log('\n--- 2. Testing Filter by statusCategory ---');
  const res2 = await fetch(`${API_BASE}/trips?statusCategory=${sampleTrip.statusCategory}`, { headers: authHeaders });
  const data2 = await res2.json();
  assert(res2.status === 200, `GET /trips?statusCategory=${sampleTrip.statusCategory} returns 200`);
  assert(data2.data.trips.every((t: any) => t.statusCategory === sampleTrip.statusCategory), 'All returned trips match statusCategory filter');

  // TEST 3: GET /trips/:id
  console.log(`\n--- 3. Testing GET /api/agency/trips/${testTripId} ---`);
  const res3 = await fetch(`${API_BASE}/trips/${testTripId}`, { headers: authHeaders });
  const data3 = await res3.json();
  assert(res3.status === 200, `GET /trips/${testTripId} returns 200 OK`);
  assert(data3.data.tripId === testTripId, 'Fetched trip has correct tripId');

  // TEST 4: PATCH /trips/:id/team
  console.log(`\n--- 4. Testing PATCH /api/agency/trips/${testTripId}/team ---`);
  const newTeam = [
    {
      id: 'at-test-1',
      name: 'Test Guide Commander',
      role: 'Trip Host',
      phone: '+91 99999 88888',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      isAssigned: true,
    },
  ];
  const res4 = await fetch(`${API_BASE}/trips/${testTripId}/team`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ teamAssignments: newTeam }),
  });
  const data4 = await res4.json();
  assert(res4.status === 200, 'PATCH team assignments returns 200');

  // TEST 5: PATCH /trips/:id/vehicle
  console.log(`\n--- 5. Testing PATCH /api/agency/trips/${testTripId}/vehicle ---`);
  const newVehicles = [
    {
      id: 'v-test-1',
      name: 'Luxury Volvo Bus 45',
      registrationNumber: 'DL 01 AB 9999',
      type: 'Luxury AC Coach',
      capacity: 45,
      assignedDriver: 'Manoj Negi',
      status: 'Assigned',
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=300',
    },
  ];
  const res5 = await fetch(`${API_BASE}/trips/${testTripId}/vehicle`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ vehicleAssignments: newVehicles }),
  });
  assert(res5.status === 200, 'PATCH vehicle assignments returns 200');

  // TEST 6: PATCH /trips/:id/hotel
  console.log(`\n--- 6. Testing PATCH /api/agency/trips/${testTripId}/hotel ---`);
  const res6 = await fetch(`${API_BASE}/trips/${testTripId}/hotel`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      hotelInformation: {
        hotelName: 'The Grand Alpine Palace',
        address: 'Mall Road, Manali',
        checkInTime: '01:00 PM',
        checkOutTime: '11:00 AM',
        roomAllocationNotes: 'Deluxe mountain view suites',
      },
    }),
  });
  assert(res6.status === 200, 'PATCH hotel info returns 200');

  // TEST 7: PATCH /trips/:id/emergency
  console.log(`\n--- 7. Testing PATCH /api/agency/trips/${testTripId}/emergency ---`);
  const res7 = await fetch(`${API_BASE}/trips/${testTripId}/emergency`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      emergencyInformation: {
        contactPerson: '24/7 Operations Desk',
        contactPhone: '+91 99887 76655',
        nearestHospital: 'Civil Hospital Manali',
        nearestPoliceStation: 'Manali Police Station',
        backupVehicleContact: '+91 88776 65544',
        additionalNotes: 'First aid kits verified',
      },
    }),
  });
  assert(res7.status === 200, 'PATCH emergency info returns 200');

  // TEST 8: PATCH /trips/:id/status
  console.log(`\n--- 8. Testing PATCH /api/agency/trips/${testTripId}/status ---`);
  const res8 = await fetch(`${API_BASE}/trips/${testTripId}/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ status: 'Ongoing' }),
  });
  assert(res8.status === 200, 'PATCH trip status to Ongoing returns 200');

  // TEST 9: POST /trips/:id/announcements
  console.log(`\n--- 9. Testing POST /api/agency/trips/${testTripId}/announcements ---`);
  const res9 = await fetch(`${API_BASE}/trips/${testTripId}/announcements`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      title: 'Morning Briefing at 7:30 AM',
      message: 'All travelers meet at hotel lawn for breakfast and briefing.',
      type: 'General',
      status: 'Sent',
      author: 'Trip Host',
      deliveryOptions: { notifyAllTravelers: true, pushNotification: true, saveToTimeline: true },
    }),
  });
  assert(res9.status === 201 || res9.status === 200, 'POST announcement returns success');

  // TEST 10: POST /trips/:id/incidents & Toggle
  console.log(`\n--- 10. Testing Incidents Logging and Toggle ---`);
  const res10 = await fetch(`${API_BASE}/trips/${testTripId}/incidents`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      timestampText: '10:00 AM',
      category: 'Weather Issue',
      description: 'Rain shower delayed departure by 15 mins.',
      isResolved: false,
      reportedBy: 'Guide',
    }),
  });
  const data10 = await res10.json();
  assert(res10.status === 201 || res10.status === 200, 'POST incident returns success');
  const incidentId = data10.data.id;

  const res10b = await fetch(`${API_BASE}/trips/${testTripId}/incidents/${incidentId}/toggle`, {
    method: 'PATCH',
    headers: authHeaders,
  });
  assert(res10b.status === 200, 'Toggle incident resolution returns 200');

  // TEST 11: POST notes & photos
  console.log(`\n--- 11. Testing POST notes and photos ---`);
  const res11a = await fetch(`${API_BASE}/trips/${testTripId}/notes`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      timestampText: '11:00 AM',
      author: 'John Doe',
      authorRole: 'Host',
      content: 'Group is loving the scenery!',
    }),
  });
  assert(res11a.status === 201 || res11a.status === 200, 'POST note returns success');

  const res11b = await fetch(`${API_BASE}/trips/${testTripId}/photos`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
      caption: 'Top of the mountain group picture',
      category: 'Group Photos',
      timestampText: '12:00 PM',
    }),
  });
  assert(res11b.status === 201 || res11b.status === 200, 'POST photo returns success');

  // TEST 12: Check-in all travelers
  console.log(`\n--- 12. Testing Check-in all travelers ---`);
  const res12 = await fetch(`${API_BASE}/trips/${testTripId}/travelers/check-in-all`, {
    method: 'POST',
    headers: authHeaders,
  });
  assert(res12.status === 200, 'POST check-in-all travelers returns 200');

  // TEST 13: Tenant Isolation Check
  console.log('\n--- 13. Testing Tenant Isolation ---');
  let foreignAgency = await AgencyModel.findOne({ email: 'other-agency-test@apnatrip.com' });
  if (!foreignAgency) {
    foreignAgency = await AgencyModel.create({
      applicationId: 'APP-OTHER-TEST-123',
      name: 'Other Agency LLC',
      businessName: 'Other Agency LLC',
      email: 'other-agency-test@apnatrip.com',
      phone: '+91 99999 11111',
      status: 'ACTIVE',
      verificationStatus: 'APPROVED',
      ownerName: 'Other Owner',
    });
  }

  const foreignAgencyId = (foreignAgency._id as any).toString();
  const foreignToken = TokenUtil.signAccessToken({
    agencyId: foreignAgencyId,
    userId: foreignAgencyId,
    email: foreignAgency.email,
    userType: 'AGENCY',
    role: 'AGENCY',
  });

  const res13 = await fetch(`${API_BASE}/trips/${testTripId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${foreignToken}`,
    },
  });
  assert(res13.status === 404, `Foreign agency token returns 404 for another agency's trip (status: ${res13.status})`);

  console.log('\n====================================================');
  console.log(`🎉 ALL BATCH 2 TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
