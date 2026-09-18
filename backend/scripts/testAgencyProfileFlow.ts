import mongoose from 'mongoose';
import { AgencyModel } from '../src/models/agency.model.js';
import { PackageModel } from '../src/models/package.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { agencyProfileService } from '../src/services/agencyProfile.service.js';
import { envConfig } from '../src/config/env.config.js';

async function runAgencyProfileTest() {
  console.log('🧪 Starting Agency Profile Backend Test Suite...\n');

  const mongoUri = envConfig.MONGODB_URI || 'mongodb://localhost:27017/travel_os_dev';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB.');

  const testEmail = `profile.test.${Date.now()}@agency.com`;

  // 1. Create a test approved agency
  const testAgency = await AgencyModel.create({
    applicationId: `ATP-APP-${Date.now()}`,
    agencyId: `ATP-AGY-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    name: 'Summit Trekkers India',
    agencyDisplayName: 'Summit Trekkers India',
    legalBusinessName: 'Summit Trekkers Private Limited',
    email: testEmail,
    loginEmail: testEmail,
    phone: '+91 98765 11122',
    ownerName: 'Rahul Verma',
    businessType: 'Adventure Travel Agency',
    yearEstablished: '2020',
    gstNumber: '18AABCS9876F1Z2',
    panNumber: 'AABCS9876F',
    city: 'Manali',
    state: 'Himachal Pradesh',
    businessAddress: 'The Mall Road, Manali, HP - 175131',
    description: 'Specializing in Hampta Pass, Pin Parvati & Spiti valley expeditions.',
    website: 'https://summittrekkers.in',
    status: 'ACTIVE',
    verificationStatus: 'APPROVED',
    canLogin: true,
    documents: [
      {
        id: 'doc-1',
        name: 'Himachal_Tourism_License.pdf',
        type: 'Business License',
        status: 'Approved',
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        uploadedAt: new Date().toISOString(),
      },
    ],
    bankDetails: {
      accountHolderName: 'Summit Trekkers Private Limited',
      bankName: 'State Bank of India',
      accountNumber: '39482710492',
      ifscCode: 'SBIN0001423',
      verified: true,
    },
  });

  console.log(`✅ Created test agency: ${testAgency.name} (${testAgency._id})`);

  // 2. Create sample packages and bookings for dynamic aggregation
  const testPkg = await PackageModel.create({
    packageId: `PKG-SUMMIT-1`,
    title: 'Hampta Pass High Altitude Trek',
    agencyId: testAgency._id,
    agencyName: testAgency.name,
    destination: 'Manali & Spiti',
    price: 14500,
    status: 'APPROVED',
  });

  await BookingModel.create([
    {
      bookingId: `BK-TEST-1`,
      agencyId: testAgency._id,
      packageId: testPkg._id,
      packageName: testPkg.title,
      agencyName: testAgency.name,
      customerName: 'Aarav Mehta',
      customerEmail: 'aarav@gmail.com',
      customerPhone: '+91 98765 00001',
      travelersCount: 2,
      totalAmount: 29000,
      paidAmount: 29000,
      status: 'CONFIRMED',
      destination: 'Manali & Spiti',
      tripStartDate: new Date(),
      tripEndDate: new Date(Date.now() + 86400000 * 5),
    },
    {
      bookingId: `BK-TEST-2`,
      agencyId: testAgency._id,
      packageId: testPkg._id,
      packageName: testPkg.title,
      agencyName: testAgency.name,
      customerName: 'Priya Sharma',
      customerEmail: 'priya@gmail.com',
      customerPhone: '+91 98765 00002',
      travelersCount: 3,
      totalAmount: 43500,
      paidAmount: 43500,
      status: 'CONFIRMED',
      destination: 'Manali & Spiti',
      tripStartDate: new Date(),
      tripEndDate: new Date(Date.now() + 86400000 * 6),
    },
  ]);

  console.log('✅ Created 1 package and 2 confirmed bookings.');

  // --- Test 1: Fetch Profile with Real Aggregations ---
  console.log('\n--- Test 1: Testing getProfile with Live Dynamic Aggregations ---');
  const profile = await agencyProfileService.getProfile(testAgency._id);

  console.log('Agency ID:', profile.hero.agencyId);
  console.log('Agency Name:', profile.hero.agencyName);
  console.log('Category:', profile.hero.category);
  console.log('Total Packages Aggregated:', profile.hero.totalPackages);
  console.log('Total Bookings Aggregated:', profile.hero.totalBookings);
  console.log('Performance Snapshot:');
  profile.performanceSnapshot.forEach((m: any) => console.log(`  - ${m.title}: ${m.value} (${m.growth})`));

  if (profile.hero.totalPackages !== 1) throw new Error('Package count aggregation mismatch');
  if (profile.hero.totalBookings !== 2) throw new Error('Booking count aggregation mismatch');
  if (profile.performanceSnapshot.find((m: any) => m.type === 'revenue').value !== '₹72,500') {
    throw new Error('Revenue aggregation mismatch');
  }
  console.log('✅ Test 1 Passed: Dynamic aggregations for profile verified successfully.');

  // --- Test 2: Update Profile (PATCH) ---
  console.log('\n--- Test 2: Testing updateProfile ---');
  const updated = await agencyProfileService.updateProfile(testAgency._id, {
    description: 'Leading Himalayan mountain trekking leaders with IFMGA certified guides.',
    website: 'https://updated-summit.in',
    social: {
      instagram: 'https://instagram.com/summittrekkers',
      youtube: 'https://youtube.com/@summittrekkers',
    },
    business: {
      languages: ['English', 'Hindi', 'Pahari'],
    },
  });

  console.log('Updated Description:', updated.hero.description);
  console.log('Updated Website:', updated.hero.website);
  console.log('Updated Instagram:', updated.social.instagram);
  console.log('Updated Languages:', updated.business.languages);

  if (updated.hero.website !== 'https://updated-summit.in') throw new Error('Website update failed');
  if (updated.social.instagram !== 'https://instagram.com/summittrekkers') throw new Error('Social update failed');
  console.log('✅ Test 2 Passed: updateProfile persisted changes in MongoDB successfully.');

  // --- Test 3: Settings Lifecycle (GET / PUT) ---
  console.log('\n--- Test 3: Testing Settings Lifecycle ---');
  const settings = await agencyProfileService.getSettings(testAgency._id);
  console.log('Initial Booking Approval:', settings.booking.bookingApproval);

  const updatedSettings = await agencyProfileService.updateSettings(testAgency._id, {
    booking: {
      ...settings.booking,
      bookingApproval: 'Manual',
      maxTravelers: 30,
    },
    notification: {
      ...settings.notification,
      smsNotifications: true,
    },
  });

  console.log('Updated Booking Approval:', updatedSettings.booking.bookingApproval);
  console.log('Updated Max Travelers:', updatedSettings.booking.maxTravelers);
  console.log('Updated SMS Notifications:', updatedSettings.notification.smsNotifications);

  if (updatedSettings.booking.bookingApproval !== 'Manual') throw new Error('Settings update failed');
  console.log('✅ Test 3 Passed: Settings lifecycle verified successfully.');

  // Cleanup
  await BookingModel.deleteMany({ agencyId: testAgency._id });
  await PackageModel.deleteMany({ agencyId: testAgency._id });
  await AgencyModel.deleteOne({ _id: testAgency._id });
  console.log('\n✅ Cleaned up temporary test documents.');
  console.log('🎉 ALL AGENCY PROFILE BACKEND TESTS PASSED WITH 100% SUCCESS!\n');

  await mongoose.disconnect();
}

runAgencyProfileTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
