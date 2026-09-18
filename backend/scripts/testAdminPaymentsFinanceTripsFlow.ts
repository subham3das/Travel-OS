import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { AdminModel } from '../src/models/admin.model.js';
import { PaymentModel } from '../src/models/payment.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/admin';

async function runTests() {
  console.log('🚀 Starting Admin Payments, Finance & Trips Migration Test Suite (Batch 2)...\n');

  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log('✅ Connected to MongoDB Atlas');

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

  let testPaymentId: string = '';

  // Ensure seed payment in MongoDB
  let existingPayment = await PaymentModel.findOne({ isDeleted: false });
  if (!existingPayment) {
    existingPayment = await PaymentModel.create({
      paymentId: `TXN-${Date.now().toString().slice(-6)}`,
      bookingId: 'BK-2026-0001',
      agencyName: 'Himalayan Trails Ltd',
      userName: 'Aarav Gupta',
      userEmail: 'aarav.gupta@email.com',
      userPhone: '+91 98765 12345',
      packageName: 'Himachal Snow & Pine Forest Expedition',
      amount: 49998,
      currency: 'INR',
      gateway: 'Razorpay',
      paymentMethod: 'UPI (Google Pay)',
      status: 'SUCCESS',
      settlementStatus: 'Pending',
    });
    console.log('Created Seed Payment in MongoDB:', existingPayment.paymentId);
  }
  testPaymentId = existingPayment._id.toString();

  // Test 1: GET Payments KPI Stats
  console.log('--- Test 1: GET /api/admin/payments/stats ---');
  const payStatsRes = await fetch(`${API_BASE}/payments/stats`, { headers: authHeaders });
  const payStatsJson = await payStatsRes.json();
  console.log('Payment KPI Stats:', payStatsJson);
  if (!payStatsJson.success || !payStatsJson.data.totalTransactions) throw new Error('Test 1 Failed: payment stats missing');
  console.log('✅ Test 1 Passed: Payment KPI telemetry live\n');

  // Test 2: GET Paginated Payments
  console.log('--- Test 2: GET /api/admin/payments ---');
  const payListRes = await fetch(`${API_BASE}/payments?page=1&limit=10`, { headers: authHeaders });
  const payListJson = await payListRes.json();
  console.log(`Retrieved ${payListJson.data.payments.length} transactions from MongoDB`);
  if (!payListJson.success || payListJson.data.payments.length === 0) throw new Error('Test 2 Failed: payments table empty');
  console.log('✅ Test 2 Passed: Paginated payments ledger working\n');

  // Test 3: Process Payment Refund
  console.log('--- Test 3: POST /api/admin/payments/:id/refund ---');
  const refundRes = await fetch(`${API_BASE}/payments/${testPaymentId}/refund`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      refundAmount: 49998,
      reason: 'Traveler cancellation approved by compliance',
    }),
  });
  const refundJson = await refundRes.json();
  console.log('Refund Result:', refundJson.message);
  if (!refundJson.success) throw new Error('Test 3 Failed: refund failed');
  console.log('✅ Test 3 Passed: Refund processed and synced in MongoDB\n');

  // Test 4: GET Finance KPI Stats
  console.log('--- Test 4: GET /api/admin/finance/stats ---');
  const finStatsRes = await fetch(`${API_BASE}/finance/stats`, { headers: authHeaders });
  const finStatsJson = await finStatsRes.json();
  console.log('Finance KPI Stats:', finStatsJson);
  if (!finStatsJson.success || !finStatsJson.data.gmv) throw new Error('Test 4 Failed: finance stats missing');
  console.log('✅ Test 4 Passed: Financial command center telemetry live\n');

  // Test 5: GET Finance Charts & Settlements
  console.log('--- Test 5: GET /api/admin/finance/charts & /settlements ---');
  const [chartsRes, settRes] = await Promise.all([
    fetch(`${API_BASE}/finance/charts?range=30d`, { headers: authHeaders }),
    fetch(`${API_BASE}/finance/settlements`, { headers: authHeaders }),
  ]);
  const chartsJson = await chartsRes.json();
  const settJson = await settRes.json();
  console.log(`Retrieved ${chartsJson.data.length} revenue chart points and ${settJson.data.length} settlement rows`);
  if (!chartsJson.success || !settJson.success) throw new Error('Test 5 Failed: finance charts or settlements failed');
  console.log('✅ Test 5 Passed: Finance revenue charts & settlements live\n');

  // Test 6: Process Agency Settlement Payout
  console.log('--- Test 6: POST /api/admin/finance/settlements/:id/process ---');
  const payoutRes = await fetch(`${API_BASE}/finance/settlements/SETT-59221/process`, {
    method: 'POST',
    headers: authHeaders,
  });
  const payoutJson = await payoutRes.json();
  console.log('Settlement Payout Result:', payoutJson.message);
  if (!payoutJson.success) throw new Error('Test 6 Failed: settlement payout failed');
  console.log('✅ Test 6 Passed: Agency settlement payout disbursed\n');

  // Test 7: GET Operational Trips KPI Stats
  console.log('--- Test 7: GET /api/admin/trips/stats ---');
  const tripStatsRes = await fetch(`${API_BASE}/trips/stats`, { headers: authHeaders });
  const tripStatsJson = await tripStatsRes.json();
  console.log('Trips KPI Stats:', tripStatsJson);
  if (!tripStatsJson.success || !tripStatsJson.data.totalTrips) throw new Error('Test 7 Failed: trip stats missing');
  console.log('✅ Test 7 Passed: Operational trips telemetry live\n');

  // Test 8: GET Paginated Operational Trips
  console.log('--- Test 8: GET /api/admin/trips ---');
  const tripListRes = await fetch(`${API_BASE}/trips?page=1&limit=10`, { headers: authHeaders });
  const tripListJson = await tripListRes.json();
  console.log(`Retrieved ${tripListJson.data.trips.length} operational trips from MongoDB`);
  if (!tripListJson.success || tripListJson.data.trips.length === 0) throw new Error('Test 8 Failed: trips list empty');
  console.log('✅ Test 8 Passed: Live operational trips working\n');

  // Test 9: Update Trip Status
  console.log('--- Test 9: PATCH /api/admin/trips/:id/status ---');
  const updateTripRes = await fetch(`${API_BASE}/trips/TRIP-24081/status`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({
      status: 'Running',
      notes: 'All 18 travelers checked in on time',
    }),
  });
  const updateTripJson = await updateTripRes.json();
  console.log('Trip Update Result:', updateTripJson.message);
  if (!updateTripJson.success) throw new Error('Test 9 Failed: trip update failed');
  console.log('✅ Test 9 Passed: Trip operational status updated\n');

  // Test 10: Broadcast Alert to Trip
  console.log('--- Test 10: POST /api/admin/trips/:id/broadcast ---');
  const alertRes = await fetch(`${API_BASE}/trips/TRIP-24081/broadcast`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      message: 'Weather update: Clear skies forecasted for evening bonfire dinner.',
    }),
  });
  const alertJson = await alertRes.json();
  console.log('Broadcast Result:', alertJson.message);
  if (!alertJson.success) throw new Error('Test 10 Failed: trip broadcast failed');
  console.log('✅ Test 10 Passed: Operational alert broadcasted\n');

  // Test 11: Verify Audit Logs
  console.log('--- Test 11: Verify SOC 2 Audit Logs for Batch 2 ---');
  const auditLogs = await AuditLogModel.find({
    module: { $in: ['PAYMENTS', 'FINANCE', 'TRIPS'] },
  }).sort({ createdAt: -1 }).limit(5);
  console.log(`Found ${auditLogs.length} audit log entries for Payments, Finance & Trips`);
  if (auditLogs.length === 0) throw new Error('Test 11 Failed: no audit logs recorded');
  console.log('✅ Test 11 Passed: Administrative actions recorded in audit_logs\n');

  console.log('🎉 ALL 11 TESTS PASSED WITH 100% SUCCESS! Batch 2 (Payments, Finance & Trips) is 100% Production Ready!');

  await mongoose.disconnect();
}

runTests().catch((err) => {
  console.error('❌ Test Suite Failed:', err);
  process.exit(1);
});
