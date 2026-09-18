import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { AdminModel } from '../src/models/admin.model.js';
import { CampaignModel } from '../src/models/campaign.model.js';
import { CMSContentModel } from '../src/models/cmsContent.model.js';
import { SystemSettingsModel } from '../src/models/systemSettings.model.js';
import { TokenUtil } from '../src/utils/token.util.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_BASE = 'http://localhost:5000/api/admin';

async function runTests() {
  console.log('🚀 Starting Super Admin Batch 4 Integration Test Flow (Notifications, Reports, CMS, Settings & Global Search)...');

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

  // ─── 1. NOTIFICATIONS & MARKETING CAMPAIGNS ───
  await test('1. Fetch Notification KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/notifications/stats`, { headers });
    const data = await res.json();
    if (!data.success || !data.data.sentToday) throw new Error('Failed to get notification KPIs');
  });

  let testCampaignId = '';
  await test('2. Create Marketing Campaign', async () => {
    const res = await fetch(`${API_BASE}/notifications/campaigns`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Holi Long Weekend Special',
        message: 'Book domestic trips with flat 25% discount this Holi season!',
        type: 'Push',
        audience: 'All Users',
        ctaText: 'View Deals',
        deepLink: '/packages?tag=holi',
      }),
    });
    const data = await res.json();
    if (!data.success || !data.data.campaignId) throw new Error('Failed to create campaign');
    testCampaignId = data.data._id || data.data.campaignId;
  });

  await test('3. Query Campaigns Listing', async () => {
    const res = await fetch(`${API_BASE}/notifications/campaigns?search=Holi`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) throw new Error('Failed to list campaigns');
  });

  await test('4. Fetch Header Notifications Feed', async () => {
    const res = await fetch(`${API_BASE}/notifications/header`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Failed to get header notifications');
  });

  // ─── 2. BI REPORTS & ANALYTICS ───
  await test('5. Fetch BI Reports KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/reports/stats`, { headers });
    const data = await res.json();
    if (!data.success || !data.data.grossRevenue) throw new Error('Failed to get report KPIs');
  });

  await test('6. Fetch Reports Library Catalog', async () => {
    const res = await fetch(`${API_BASE}/reports/library`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) throw new Error('Failed to get report library');
  });

  // ─── 3. CMS & CONTENT STUDIO ───
  await test('7. Fetch CMS KPI Stats', async () => {
    const res = await fetch(`${API_BASE}/cms/stats`, { headers });
    const data = await res.json();
    if (!data.success || !data.data.activeBanners) throw new Error('Failed to get CMS KPIs');
  });

  let testBannerId = '';
  await test('8. Create and Fetch Hero Banner', async () => {
    const createRes = await fetch(`${API_BASE}/cms/hero-banners`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Meghalaya Living Root Bridges Expedition',
        subtitle: 'Uncover the wettest place on Earth with accredited local guides.',
        ctaText: 'Explore Packages',
        ctaLink: '/packages?destination=meghalaya',
        desktopImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200',
        priority: 1,
      }),
    });
    const createData = await createRes.json();
    if (!createData.success || !createData.data.contentId) throw new Error('Failed to create hero banner');
    testBannerId = createData.data._id || createData.data.contentId;

    const listRes = await fetch(`${API_BASE}/cms/hero-banners`, { headers });
    const listData = await listRes.json();
    if (!listData.success || !Array.isArray(listData.data)) throw new Error('Failed to list hero banners');
  });

  await test('9. Create Platform Announcement', async () => {
    const res = await fetch(`${API_BASE}/cms/announcements`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'New Agency Settlement Timelines',
        description: 'Settlements will now be automatically disbursed every Monday at 09:00 AM IST.',
        type: 'info',
        audience: 'agencies',
      }),
    });
    const data = await res.json();
    if (!data.success || !data.data.contentId) throw new Error('Failed to create announcement');
  });

  // ─── 4. SETTINGS & FEATURE FLAGS ───
  await test('10. Fetch & Update General Settings & Feature Flags', async () => {
    const getRes = await fetch(`${API_BASE}/settings/general`, { headers });
    const getData = await getRes.json();
    if (!getData.success || !getData.data.platformName) throw new Error('Failed to get settings');

    const patchRes = await fetch(`${API_BASE}/settings/general`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        platformName: 'Travel OS Enterprise',
      }),
    });
    const patchData = await patchRes.json();
    if (!patchData.success || patchData.data.platformName !== 'Travel OS Enterprise') throw new Error('Failed to update settings');

    const flagRes = await fetch(`${API_BASE}/settings/feature-flags/feat-ai-itinerary/toggle`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ enabled: true }),
    });
    const flagData = await flagRes.json();
    if (!flagData.success) throw new Error('Failed to toggle feature flag');
  });

  // ─── 5. GLOBAL SEARCH ───
  await test('11. Execute Global Omnichannel Search Query', async () => {
    const res = await fetch(`${API_BASE}/global-search?q=Holi`, { headers });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Failed to execute global search');
  });

  console.log(`\n🏁 Test Results: ${passed}/${total} passed (${((passed / total) * 100).toFixed(0)}%)`);

  await mongoose.disconnect();
  process.exit(passed === total ? 0 : 1);
}

runTests();
