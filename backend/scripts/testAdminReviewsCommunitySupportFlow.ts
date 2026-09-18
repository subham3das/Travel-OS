import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ReviewModel } from '../src/models/review.model.js';
import { CommunityPostModel } from '../src/models/communityPost.model.js';
import { SupportTicketModel } from '../src/models/supportTicket.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

import { AdminModel } from '../src/models/admin.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/admin';

async function runTests() {
  console.log('🚀 Starting Super Admin Reviews, Community & Support Integration Test Flow (Batch 3)...');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/travelos_db';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB Atlas');

  let admin = await AdminModel.findOne({ email: 'superadmin@apnatrip.com' });
  if (!admin) {
    admin = await AdminModel.findOne();
  }
  if (!admin) {
    throw new Error('No admin account found in database.');
  }

  const adminToken = TokenUtil.signAccessToken({
    userId: admin._id.toString(),
    email: admin.email,
    userType: 'ADMIN',
    role: 'SUPER_ADMIN',
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${adminToken}`,
  };

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => Promise<void>) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ❌ [FAIL] ${name}:`, err.message);
    }
  }

  // --- Seed test data ---
  const seedReview = await ReviewModel.findOneAndUpdate(
    { reviewId: 'REV-TEST-001' },
    {
      reviewId: 'REV-TEST-001',
      userName: 'Test Traveler',
      userEmail: 'testtraveler@apnatrip.com',
      agencyName: 'Himalayan Expeditions',
      packageName: 'Spiti Valley Explorer',
      rating: 5,
      reviewText: 'Outstanding experience! Everything was seamless and well organized.',
      status: 'Pending',
      sentiment: 'Positive',
      spamScore: 2,
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  const seedPost = await CommunityPostModel.findOneAndUpdate(
    { postId: 'POST-TEST-001' },
    {
      postId: 'POST-TEST-001',
      authorName: 'Aarav Explorer',
      authorRole: 'Traveler',
      postType: 'Story',
      title: 'Sunrise above the clouds at Rohtang',
      content: 'Woke up at 4 AM to capture this magnificent sunrise over the pass.',
      destinationTag: 'Manali',
      likesCount: 15,
      commentsCount: 3,
      sharesCount: 1,
      status: 'Pending',
      isDeleted: false,
    },
    { upsert: true, new: true }
  );

  const seedTicket = await SupportTicketModel.findOneAndUpdate(
    { ticketId: 'TKT-TEST-001' },
    {
      ticketId: 'TKT-TEST-001',
      subject: 'Inquiry regarding baggage allowance',
      description: 'Can I carry additional trekking gear on the shared taxi transfers?',
      userName: 'Priya Sharma',
      userEmail: 'priya.sharma@example.com',
      priority: 'MEDIUM',
      status: 'OPEN',
      category: 'Package',
      messages: [
        {
          id: 'msg-init-1',
          senderType: 'customer',
          senderName: 'Priya Sharma',
          text: 'Can I carry additional trekking gear on the shared taxi transfers?',
          timestamp: '10:00 AM',
          isRead: true,
        },
      ],
    },
    { upsert: true, new: true }
  );

  // ─── 1. REVIEWS TESTS ───
  await test('1. Fetch Review KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/reviews/stats`, { headers });
    const data = await res.json();
    console.log('DEBUG test 1 response:', res.status, data);
    if (!data.success || !data.data?.totalReviews) throw new Error('Failed to get review KPIs: ' + JSON.stringify(data));
  });

  await test('2. Fetch Paginated Reviews & Filter by Status', async () => {
    const res = await fetch(`${API_BASE}/reviews?search=Spiti`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.reviews)) throw new Error('Failed to query reviews');
  });

  await test('3. Update Review Moderation Status to Approved', async () => {
    const res = await fetch(`${API_BASE}/reviews/${seedReview._id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Approved' }),
    });
    const data = await res.json();
    if (!data.success || data.data.status !== 'Approved') throw new Error('Failed to approve review');
  });

  // ─── 2. COMMUNITY TESTS ───
  await test('4. Fetch Community KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/community/stats`, { headers });
    const data = await res.json();
    if (!data.success || !data.data.totalPosts) throw new Error('Failed to get community KPIs');
  });

  await test('5. Fetch Community Moderation Queue & Feed', async () => {
    const res = await fetch(`${API_BASE}/community/moderation-queue`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Failed to get moderation queue');
  });

  await test('6. Approve Community Post', async () => {
    const res = await fetch(`${API_BASE}/community/posts/${seedPost._id}/approve`, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to approve community post');
  });

  await test('7. Broadcast Super Admin Announcement', async () => {
    const res = await fetch(`${API_BASE}/community/announcements`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Platform System Maintenance Window',
        description: 'Scheduled maintenance this Sunday at 2 AM IST for 30 minutes.',
        audience: 'All Users',
        notificationType: 'Banner',
        publishMode: 'Publish Now',
      }),
    });
    const data = await res.json();
    if (!data.success || !data.data.postId) throw new Error('Failed to create announcement');
  });

  // ─── 3. SUPPORT TESTS ───
  await test('8. Fetch Support KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/support/stats`, { headers });
    const data = await res.json();
    if (!data.success || !data.data.openTickets) throw new Error('Failed to get support KPIs');
  });

  await test('9. Fetch Support Tickets & Details', async () => {
    const res = await fetch(`${API_BASE}/support/tickets?search=baggage`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) throw new Error('Failed to find ticket');
  });

  await test('10. Add Message to Support Ticket as Admin', async () => {
    const res = await fetch(`${API_BASE}/support/tickets/${seedTicket._id}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        senderType: 'agent',
        senderName: 'Super Admin',
        text: 'Yes Priya, up to 15kg extra gear is permitted per traveler at no extra cost.',
      }),
    });
    const data = await res.json();
    if (!data.success || data.data.messages.length < 2) throw new Error('Failed to add message to ticket');
  });

  await test('11. Update Support Ticket Status & Fetch Analytics', async () => {
    const statusRes = await fetch(`${API_BASE}/support/tickets/${seedTicket._id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status: 'Closed' }),
    });
    const statusData = await statusRes.json();
    if (!statusData.success) throw new Error('Failed to close ticket');

    const analyticsRes = await fetch(`${API_BASE}/support/analytics`, { headers });
    const analyticsData = await analyticsRes.json();
    if (!analyticsData.success || !analyticsData.data.slaCompliance) throw new Error('Failed to get support analytics');
  });

  console.log(`\n🏁 Test Results: ${passed}/${total} passed (${((passed / total) * 100).toFixed(0)}%)`);

  await mongoose.disconnect();
  process.exit(passed === total ? 0 : 1);
}

runTests();
