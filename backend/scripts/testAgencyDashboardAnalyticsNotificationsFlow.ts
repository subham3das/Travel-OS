import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { AgencyModel } from '../src/models/agency.model.js';
import { TokenUtil } from '../src/utils/token.util.js';
import { AgencyNotificationModel } from '../src/models/notification.model.js';

dotenv.config();

const API_BASE = 'http://localhost:5000/api/agency';

async function runTests() {
  console.log('🚀 Starting Agency Dashboard, Analytics & Notifications Flow Tests...\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB Atlas');

  let agency = await AgencyModel.findOne({ email: 'testagency@apnatrip.com' });
  if (!agency) {
    agency = await AgencyModel.create({
      applicationId: `APN-TEST-${Date.now()}`,
      name: 'Himalayan Highs Travel',
      agencyName: 'Himalayan Highs Travel',
      ownerName: 'Subham Das',
      email: 'testagency@apnatrip.com',
      phone: '9876543210',
      password: 'HashedPassword123!',
      status: 'ACTIVE',
      verificationStatus: 'APPROVED',
      officeAddress: {
        street: '12 Ridge Road',
        city: 'Shimla',
        state: 'Himachal Pradesh',
        country: 'India',
        postalCode: '171001',
      },
    });
  }

  const token = TokenUtil.signAccessToken({
    agencyId: agency._id.toString(),
    userId: agency._id.toString(),
    email: agency.email,
    userType: 'AGENCY',
    role: 'AGENCY',
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAIL: ${name} - ${err.message}`);
      failed++;
    }
  }

  // 1. Dashboard Tests
  await test('GET /dashboard returns summary & KPI metrics', async () => {
    const res = await fetch(`${API_BASE}/dashboard?range=This%20Month`, { headers });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch dashboard');
    if (!json.data.kpiStats || !json.data.revenue) throw new Error('Missing dashboard payload components');
  });

  await test('GET /dashboard/recent-bookings returns recent bookings list', async () => {
    const res = await fetch(`${API_BASE}/dashboard/recent-bookings`, { headers });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch recent bookings');
    if (!Array.isArray(json.data)) throw new Error('Expected array for recent bookings');
  });

  await test('GET /dashboard/upcoming-departures returns upcoming departures', async () => {
    const res = await fetch(`${API_BASE}/dashboard/upcoming-departures`, { headers });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch departures');
    if (!Array.isArray(json.data)) throw new Error('Expected array for departures');
  });

  // 2. Analytics BI Tests
  await test('GET /analytics returns full BI dataset & charts', async () => {
    const res = await fetch(`${API_BASE}/analytics?range=7D`, { headers });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch analytics');
    const { kpis, revenueOverview, bookingOverview, packages, destinations, financialSummary } = json.data;
    if (!kpis || !revenueOverview || !bookingOverview || !packages || !destinations || !financialSummary) {
      throw new Error('Analytics response missing core BI sections');
    }
    if (kpis.length !== 5) throw new Error(`Expected 5 top KPIs, got ${kpis.length}`);
  });

  // 3. Notifications Tests
  let testNotifId = '';

  await test('GET /notifications returns seeded notifications & tab counts', async () => {
    const res = await fetch(`${API_BASE}/notifications`, { headers });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to fetch notifications');
    if (!Array.isArray(json.data.notifications) || json.data.notifications.length === 0) {
      throw new Error('Expected non-empty notifications list');
    }
    if (typeof json.data.unreadCount !== 'number') throw new Error('Missing unreadCount');
    if (!json.data.tabCounts || typeof json.data.tabCounts.All !== 'number') throw new Error('Missing tabCounts');
    testNotifId = json.data.notifications[0].id;
  });

  await test('PATCH /notifications/:id/read marks notification as read/unread', async () => {
    if (!testNotifId) throw new Error('No notification ID available');
    // Mark read
    const res1 = await fetch(`${API_BASE}/notifications/${testNotifId}/read`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isUnread: false }),
    });
    const json1 = await res1.json();
    if (!res1.ok || !json1.success || json1.data.isUnread !== false) throw new Error('Failed to mark read');

    // Mark unread
    const res2 = await fetch(`${API_BASE}/notifications/${testNotifId}/read`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ isUnread: true }),
    });
    const json2 = await res2.json();
    if (!res2.ok || !json2.success || json2.data.isUnread !== true) throw new Error('Failed to mark unread');
  });

  await test('POST /notifications/read-all marks all notifications as read', async () => {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to mark all as read');

    const checkRes = await fetch(`${API_BASE}/notifications`, { headers });
    const checkJson = await checkRes.json();
    if (checkJson.data.unreadCount !== 0) throw new Error('Unread count should be 0 after read-all');
  });

  await test('PATCH /notifications/:id/archive archives single notification', async () => {
    if (!testNotifId) throw new Error('No notification ID available');
    const res = await fetch(`${API_BASE}/notifications/${testNotifId}/archive`, {
      method: 'PATCH',
      headers,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to archive notification');
  });

  await test('DELETE /notifications/:id deletes single notification', async () => {
    // Create a temporary notification to delete
    const tempNotif = await AgencyNotificationModel.create({
      agencyId: agency._id,
      category: 'System',
      title: 'Temporary Notif',
      description: 'To be deleted in test',
      isUnread: false,
    });

    const res = await fetch(`${API_BASE}/notifications/${tempNotif._id}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to delete notification');
  });

  await test('POST /notifications/clear-read clears all read notifications', async () => {
    const res = await fetch(`${API_BASE}/notifications/clear-read`, {
      method: 'POST',
      headers,
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'Failed to clear read notifications');
  });

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
  console.log(`========================================\n`);

  await mongoose.disconnect();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
