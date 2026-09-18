import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { bookingService } from '../src/services/booking.service.js';
import { PackageModel } from '../src/models/package.model.js';
import { UserModel } from '../src/models/user.model.js';

async function runBookingTest() {
  console.log('🧪 Starting Batch 2 Booking & Payment Verification Test...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB');

  try {
    // 1. Find a test customer user
    let user = await UserModel.findOne({ role: 'customer' });
    if (!user) {
      user = await UserModel.findOne();
    }
    if (!user) {
      throw new Error('No user found in database to test bookings');
    }
    console.log(`👤 Using test user: ${user.fullName || user.name || user.email} (${user._id})`);

    // 2. Find a package
    const pkg = await PackageModel.findOne();
    if (!pkg) {
      throw new Error('No package found in database to test bookings');
    }
    console.log(`📦 Using package: "${pkg.title}" (${pkg._id})`);

    // 3. Test Checkout Booking Creation
    const checkoutPayload = {
      packageId: String(pkg._id),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      leadTraveler: {
        fullName: user.fullName || 'Test Lead Traveler',
        email: user.email || 'traveler@test.com',
        phone: '+91 99999 88888',
        gender: 'Male',
      },
      travelers: [
        {
          name: user.fullName || 'Test Lead Traveler',
          email: user.email || 'traveler@test.com',
          phone: '+91 99999 88888',
          gender: 'Male',
          isPrimary: true,
        },
        {
          name: 'Companion One',
          gender: 'Female',
          isPrimary: false,
        },
      ],
      promoCode: 'APNATRIP2000',
      pickupPoint: 'Airport Terminal 1',
      dropPoint: 'Airport Terminal 1',
    };

    const checkoutResult = await bookingService.createCheckoutBooking(String(user._id), checkoutPayload);
    console.log(`✅ Checkout Created: Booking ID = ${checkoutResult.bookingId}, Grand Total = ₹${checkoutResult.orderSummary.grandTotal}`);

    // 4. Test Payment Verification
    const verification = await bookingService.verifyAndConfirmBooking(String(user._id), {
      bookingId: checkoutResult.bookingId,
      paymentId: `pay_test_${Date.now()}`,
    });
    console.log(`✅ Payment Verified: Status = ${verification.booking.status}, Paid Amount = ₹${verification.booking.paidAmount}`);

    // 5. Test Customer Bookings List
    const customerBookings = await bookingService.getCustomerBookings(String(user._id));
    console.log(`✅ Customer Bookings Retrieved: Count = ${customerBookings.length}`);
    const found = customerBookings.find(b => b.bookingId === checkoutResult.bookingId);
    if (!found) {
      throw new Error('Created booking not found in customer bookings list');
    }
    console.log(`✅ Created booking verified in customer list with status "${found.status}"`);

    // 6. Test Single Booking Retrieval
    const retrievedBooking = await bookingService.getCustomerBookingById(String(user._id), checkoutResult.bookingId);
    console.log(`✅ Single Booking Retrieved by ID: ID = ${retrievedBooking.bookingId}, Package = "${retrievedBooking.packageName}"`);

    console.log('\n🎉 ALL BATCH 2 BOOKING & PAYMENT TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Batch 2 Booking Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runBookingTest();
