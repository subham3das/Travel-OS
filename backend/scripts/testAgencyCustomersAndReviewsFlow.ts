import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const API_BASE = 'http://localhost:5000/api/agency';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING BATCH 3: CUSTOMER CRM & REVIEWS TEST SUITE');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB Atlas');

  // 1. Get an active/approved agency
  let agency = await AgencyModel.findOne({
    $or: [{ status: 'ACTIVE' }, { verificationStatus: 'APPROVED' }, { verificationStatus: 'VERIFIED' }],
  });
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

  // --- PART 1: CUSTOMER CRM TESTS ---
  console.log('\n--- 1. Testing GET /api/agency/customers ---');
  const res1 = await fetch(`${API_BASE}/customers`, { headers: authHeaders });
  const data1 = await res1.json();
  assert(res1.status === 200, 'GET /customers returns 200 OK');
  assert(Array.isArray(data1.data?.customers), 'Response contains customers array');
  assert(data1.data.customers.length > 0, `Returned ${data1.data.customers.length} customers`);
  assert(typeof data1.data.total === 'number', 'Response contains total customer count');

  const sampleCustomer = data1.data.customers[0];
  const testCustomerId = sampleCustomer.id;

  console.log('\n--- 2. Testing Customer Search & Filters ---');
  const res2 = await fetch(`${API_BASE}/customers?search=${encodeURIComponent(sampleCustomer.name.split(' ')[0])}`, { headers: authHeaders });
  const data2 = await res2.json();
  assert(res2.status === 200, 'Search customers returns 200 OK');
  assert(data2.data.customers.some((c: any) => c.name.includes(sampleCustomer.name.split(' ')[0])), 'Search matches customer name');

  console.log('\n--- 3. Testing GET /api/agency/customers/stats ---');
  const res3 = await fetch(`${API_BASE}/customers/stats`, { headers: authHeaders });
  const data3 = await res3.json();
  assert(res3.status === 200, 'GET /customers/stats returns 200 OK');
  assert(typeof data3.data?.totalCustomers === 'number', 'Stats contains totalCustomers');
  assert(typeof data3.data?.avgLifetimeValue === 'string', 'Stats contains avgLifetimeValue');

  console.log(`\n--- 4. Testing GET /api/agency/customers/${testCustomerId} ---`);
  const res4 = await fetch(`${API_BASE}/customers/${testCustomerId}`, { headers: authHeaders });
  const data4 = await res4.json();
  assert(res4.status === 200, `GET customer dossier returns 200 OK`);
  assert(data4.data.name === sampleCustomer.name, 'Customer dossier has matching name');
  assert(Array.isArray(data4.data.tripHistory), 'Customer dossier contains tripHistory');
  assert(Array.isArray(data4.data.bookingHistory), 'Customer dossier contains bookingHistory');

  console.log(`\n--- 5. Testing Customer Notes CRUD ---`);
  const res5 = await fetch(`${API_BASE}/customers/${testCustomerId}/notes`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ noteText: 'Test customer VIP preference note' }),
  });
  const data5 = await res5.json();
  assert(res5.status === 201 || res5.status === 200, 'POST customer note returns success');
  const noteId = data5.data.id;

  const res5b = await fetch(`${API_BASE}/customers/${testCustomerId}/notes/${noteId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({ noteText: 'Updated customer note preference' }),
  });
  assert(res5b.status === 200, 'PUT customer note returns 200 OK');

  const res5c = await fetch(`${API_BASE}/customers/${testCustomerId}/notes/${noteId}`, {
    method: 'DELETE',
    headers: authHeaders,
  });
  assert(res5c.status === 200, 'DELETE customer note returns 200 OK');

  // --- PART 2: REVIEWS & REPUTATION TESTS ---
  console.log('\n--- 6. Testing GET /api/agency/reviews ---');
  const res6 = await fetch(`${API_BASE}/reviews`, { headers: authHeaders });
  const data6 = await res6.json();
  assert(res6.status === 200, 'GET /reviews returns 200 OK');
  assert(Array.isArray(data6.data?.reviews), 'Response contains reviews array');
  assert(data6.data.reviews.length > 0, `Returned ${data6.data.reviews.length} reviews`);

  const sampleReview = data6.data.reviews[0];
  const testReviewId = sampleReview.id;

  console.log('\n--- 7. Testing GET /api/agency/reviews/stats ---');
  const res7 = await fetch(`${API_BASE}/reviews/stats`, { headers: authHeaders });
  const data7 = await res7.json();
  assert(res7.status === 200, 'GET /reviews/stats returns 200 OK');
  assert(typeof data7.data?.averageRating === 'number', 'Stats contains averageRating');
  assert(Array.isArray(data7.data?.distribution), 'Stats contains distribution array');

  console.log(`\n--- 8. Testing POST /api/agency/reviews/${testReviewId}/reply ---`);
  const res8 = await fetch(`${API_BASE}/reviews/${testReviewId}/reply`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      replyText: 'Thank you for traveling with us! We appreciate your kind review.',
      authorName: 'Agency Host',
    }),
  });
  assert(res8.status === 200, 'POST reply to review returns 200 OK');

  console.log(`\n--- 9. Testing PATCH /api/agency/reviews/${testReviewId}/flag ---`);
  const res9 = await fetch(`${API_BASE}/reviews/${testReviewId}/flag`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ reason: 'Reported test flag' }),
  });
  assert(res9.status === 200, 'PATCH flag review returns 200 OK');

  console.log('\n====================================================');
  console.log(`🎉 ALL BATCH 3 TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
