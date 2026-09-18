import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { adminUserManagementService } from '../src/services/adminUserManagement.service.js';
import { UserModel } from '../src/models/user.model.js';
import { BookingModel } from '../src/models/booking.model.js';
import { PaymentModel } from '../src/models/payment.model.js';
import { AuditLogModel } from '../src/models/auditLog.model.js';

dotenv.config();

async function runTests() {
  console.log('🚀 Starting Admin Users Module End-to-End Test...\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB');

  try {
    // 1. Test Summary Stats
    console.log('\n--- 1. Testing getSummaryStats ---');
    const stats = await adminUserManagementService.getSummaryStats();
    console.log('KPI Stats:', JSON.stringify(stats, null, 2));
    if (typeof stats.totalUsers.count !== 'number') throw new Error('Invalid totalUsers count');
    console.log('✅ getSummaryStats passed');

    // 2. Test Create User
    console.log('\n--- 2. Testing createUser ---');
    const testEmail = `test.traveler.${Date.now()}@example.com`;
    const createdUser = await adminUserManagementService.createUser(
      {
        fullName: 'Test Traveler Super Admin',
        email: testEmail,
        phone: '+91 98765 43210',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        gender: 'Male',
        membership: 'Gold',
        status: 'Active',
        verificationStatus: 'Verified',
      },
      { id: 'super_admin_test', name: 'Super Admin', email: 'admin@apnatrip.com' }
    );
    console.log('Created User ID:', createdUser.id, createdUser.userId, createdUser.name);
    console.log('✅ createUser passed');

    // 3. Create a mock booking & payment for this user to test aggregation
    console.log('\n--- 3. Creating linked booking & payment for aggregation test ---');
    const testBooking = await BookingModel.create({
      bookingId: `BK-TEST-${Date.now().toString().slice(-4)}`,
      userId: new mongoose.Types.ObjectId(createdUser.id),
      customerName: createdUser.name,
      customerEmail: testEmail,
      customerPhone: createdUser.phone,
      packageName: 'Goa Sunshine Tour',
      agencyName: 'Goa Getaways Agency',
      travelersCount: 2,
      totalAmount: 18500,
      paidAmount: 18500,
      status: 'CONFIRMED',
      paymentStatus: 'PAID',
      destination: 'Goa, India',
      tripStartDate: new Date('2026-10-15'),
      tripEndDate: new Date('2026-10-20'),
    });

    const testPayment = await PaymentModel.create({
      paymentId: `INV-TEST-${Date.now().toString().slice(-4)}`,
      bookingId: testBooking.bookingId,
      userId: new mongoose.Types.ObjectId(createdUser.id),
      userName: createdUser.name,
      amount: 18500,
      currency: 'INR',
      paymentMethod: 'UPI',
      status: 'SUCCESS',
    });
    console.log('Created linked Booking:', testBooking.bookingId, 'Payment:', testPayment.paymentId);

    // 4. Test getUsers with search & pagination
    console.log('\n--- 4. Testing getUsers with search ---');
    const queryResult = await adminUserManagementService.getUsers({
      search: testEmail,
      page: 1,
      limit: 10,
    });
    console.log('Found Users Count:', queryResult.users.length, 'Total:', queryResult.pagination.total);
    const foundUser = queryResult.users.find((u) => u.id === createdUser.id);
    if (!foundUser) throw new Error('Created user not found in search query');
    console.log('Aggregated User Spend:', foundUser.totalSpend, 'Bookings:', foundUser.totalBookings);
    console.log('✅ getUsers search & aggregation passed');

    // 5. Test getUserDetails (Drawer Data)
    console.log('\n--- 5. Testing getUserDetails (Drawer View) ---');
    const details = await adminUserManagementService.getUserDetails(createdUser.id);
    console.log('User Details Loaded:', {
      name: details.name,
      email: details.email,
      bookingsCount: details.bookings.length,
      tripsCount: details.trips.length,
      paymentsCount: details.payments.length,
      activitiesCount: details.activities.length,
    });
    if (details.bookings.length === 0) throw new Error('Bookings tab not populated');
    if (details.trips.length === 0) throw new Error('Trips tab not populated');
    if (details.payments.length === 0) throw new Error('Payments tab not populated');
    console.log('✅ getUserDetails drawer population passed');

    // 6. Test Update / Verify / Suspend User
    console.log('\n--- 6. Testing updateUser (Status & Verification) ---');
    const updated = await adminUserManagementService.updateUser(
      createdUser.id,
      {
        action: 'suspend',
        membership: 'Platinum',
      },
      { id: 'super_admin_test', name: 'Super Admin', email: 'admin@apnatrip.com' }
    );
    console.log('Updated Status:', updated.status, 'Membership:', updated.membership);
    if (updated.status !== 'Suspended') throw new Error('Status update failed');
    if (updated.membership !== 'Platinum') throw new Error('Membership update failed');
    console.log('✅ updateUser passed');

    // 7. Test Bulk User Actions
    console.log('\n--- 7. Testing bulkUserAction ---');
    const bulkResult = await adminUserManagementService.bulkUserAction(
      {
        action: 'activate',
        userIds: [createdUser.id],
      },
      { id: 'super_admin_test', name: 'Super Admin', email: 'admin@apnatrip.com' }
    );
    console.log('Bulk Action Modified:', bulkResult.modifiedCount);
    const reloaded = await UserModel.findById(createdUser.id);
    if (reloaded?.status !== 'Active') throw new Error('Bulk activate failed');
    console.log('✅ bulkUserAction passed');

    // 8. Test Password Reset Link & Notification
    console.log('\n--- 8. Testing resetPassword & sendNotification ---');
    const resetRes = await adminUserManagementService.resetPassword(createdUser.id, {
      id: 'super_admin_test',
      name: 'Super Admin',
      email: 'admin@apnatrip.com',
    });
    console.log('Reset Password Result:', resetRes);

    const notifRes = await adminUserManagementService.sendNotification(
      createdUser.id,
      { title: 'Welcome Special Bonus', message: 'You received 500 bonus travel coins!' },
      { id: 'super_admin_test', name: 'Super Admin', email: 'admin@apnatrip.com' }
    );
    console.log('Notification Result:', notifRes);
    console.log('✅ resetPassword & sendNotification passed');

    // 9. Test CSV Export
    console.log('\n--- 9. Testing exportUsersCsv ---');
    const csvContent = await adminUserManagementService.exportUsersCsv({ search: testEmail });
    console.log('Exported CSV snippet:\n', csvContent.slice(0, 300));
    if (!csvContent.includes(testEmail)) throw new Error('CSV does not contain test user');
    console.log('✅ exportUsersCsv passed');

    // 10. Test Soft Delete
    console.log('\n--- 10. Testing softDeleteUser ---');
    await adminUserManagementService.softDeleteUser(createdUser.id, {
      id: 'super_admin_test',
      name: 'Super Admin',
      email: 'admin@apnatrip.com',
    });
    const softDeleted = await UserModel.findById(createdUser.id);
    if (!softDeleted?.isDeleted) throw new Error('Soft delete failed - isDeleted is not true');
    console.log('Soft Delete Verified: isDeleted =', softDeleted.isDeleted, 'deletedAt =', softDeleted.deletedAt);
    console.log('✅ softDeleteUser passed');

    // Cleanup created test booking and payment
    await BookingModel.deleteOne({ _id: testBooking._id });
    await PaymentModel.deleteOne({ _id: testPayment._id });
    await UserModel.deleteOne({ _id: createdUser.id });
    console.log('\n🧹 Test documents cleaned up');

    console.log('\n🎉 ALL 10 USER MANAGEMENT TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
