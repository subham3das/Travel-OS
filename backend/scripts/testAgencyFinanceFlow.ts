import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const API_BASE = 'http://localhost:5000/api/agency';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 RUNNING BATCH 4: FINANCIAL COMMAND CENTER TEST SUITE');
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

  // TEST 1: GET /api/agency/finance
  console.log('\n--- 1. Testing GET /api/agency/finance ---');
  const res1 = await fetch(`${API_BASE}/finance`, { headers: authHeaders });
  const data1 = await res1.json();
  assert(res1.status === 200, 'GET /finance returns 200 OK');
  assert(Array.isArray(data1.data?.summary), 'Response contains financial summary array');
  assert(data1.data.summary.length >= 6, 'Summary has 6 metric cards');
  assert(Array.isArray(data1.data?.paymentBreakdown), 'Response contains paymentBreakdown array');
  assert(Array.isArray(data1.data?.recentTransactions), 'Response contains recentTransactions array');
  assert(typeof data1.data?.settlement === 'object', 'Response contains settlement object');
  assert(typeof data1.data?.taxInfo === 'object', 'Response contains taxInfo object');

  // TEST 2: GET /api/agency/finance/transactions
  console.log('\n--- 2. Testing GET /api/agency/finance/transactions ---');
  const res2 = await fetch(`${API_BASE}/finance/transactions`, { headers: authHeaders });
  const data2 = await res2.json();
  assert(res2.status === 200, 'GET /finance/transactions returns 200 OK');
  assert(Array.isArray(data2.data?.transactions), 'Response contains transactions array');
  assert(data2.data.transactions.length > 0, `Returned ${data2.data.transactions.length} transactions`);

  const sampleTx = data2.data.transactions[0];
  const testTxId = sampleTx.id;

  // TEST 3: Filter transactions
  console.log('\n--- 3. Testing Transactions Filter by status ---');
  const res3 = await fetch(`${API_BASE}/finance/transactions?paymentStatus=Paid`, { headers: authHeaders });
  const data3 = await res3.json();
  assert(res3.status === 200, 'GET filtered transactions returns 200 OK');
  assert(data3.data.transactions.every((t: any) => t.paymentStatus === 'Paid'), 'All returned transactions have status Paid');

  // TEST 4: GET /api/agency/finance/transactions/:id
  console.log(`\n--- 4. Testing GET /api/agency/finance/transactions/${testTxId} ---`);
  const res4 = await fetch(`${API_BASE}/finance/transactions/${testTxId}`, { headers: authHeaders });
  const data4 = await res4.json();
  assert(res4.status === 200, 'GET single transaction returns 200 OK');
  assert(typeof data4.data?.amount === 'number', 'Transaction has amount property');

  // TEST 5: POST /api/agency/finance/request-payout
  console.log('\n--- 5. Testing POST /api/agency/finance/request-payout ---');
  const res5 = await fetch(`${API_BASE}/finance/request-payout`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ amount: 50000 }),
  });
  const data5 = await res5.json();
  assert(res5.status === 201 || res5.status === 200, 'POST request-payout returns success');
  assert(data5.data?.status === 'Processing', 'Payout status is Processing');

  // TEST 6: Tenant Isolation
  console.log('\n--- 6. Testing Tenant Isolation ---');
  let foreignAgency = await AgencyModel.findOne({ email: 'other-agency-test@apnatrip.com' });
  if (!foreignAgency) {
    foreignAgency = await AgencyModel.create({
      applicationId: 'APP-FINANCE-FOREIGN-TEST',
      name: 'Other Finance Agency',
      businessName: 'Other Finance Agency',
      email: 'other-agency-test@apnatrip.com',
      phone: '+91 99999 22222',
      status: 'ACTIVE',
      verificationStatus: 'APPROVED',
      ownerName: 'Foreign Owner',
    });
  }

  const foreignToken = TokenUtil.signAccessToken({
    agencyId: (foreignAgency._id as any).toString(),
    userId: (foreignAgency._id as any).toString(),
    email: foreignAgency.email,
    userType: 'AGENCY',
    role: 'AGENCY',
  });

  const res6 = await fetch(`${API_BASE}/finance/transactions/${testTxId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${foreignToken}`,
    },
  });
  assert(res6.status === 404, `Foreign agency token returns 404 for another agency's transaction (status: ${res6.status})`);

  console.log('\n====================================================');
  console.log(`🎉 ALL BATCH 4 TESTS PASSED! (${passedTests}/${totalTests})`);
  console.log('====================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test suite failed:', err);
  process.exit(1);
});
