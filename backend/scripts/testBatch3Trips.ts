import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { tripService } from '../src/services/trip.service.js';
import { UserModel } from '../src/models/user.model.js';
import { BookingModel } from '../src/models/booking.model.js';

async function runTripTest() {
  console.log('🧪 Starting Batch 3 Trips, Live Operations & Documents Integration Test...');
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/apnatrip';
  await mongoose.connect(mongoUri);
  console.log(' Connected to MongoDB');

  try {
    // 1. Find a customer who has bookings
    let booking = await BookingModel.findOne({ isDeleted: false, userId: { $exists: true, $ne: null } });
    if (!booking) {
      booking = await BookingModel.findOne({ isDeleted: false });
    }
    if (!booking) {
      throw new Error('No booking found in database to test trips');
    }
    const userId = String(booking.userId || '');
    console.log(`👤 Found booking ${booking.bookingId} for userId: ${userId}`);

    // 2. Test getCustomerTrips
    const customerTripsData = await tripService.getCustomerTrips(userId);
    console.log(`✅ Trips Retrieved: Count = ${customerTripsData.trips.length}, Bookings Count = ${customerTripsData.bookings.length}`);
    console.log(`✅ Travel Stats: Total Trips = ${customerTripsData.stats.totalTrips}, Spend = ${customerTripsData.stats.lifetimeSpend}`);

    if (customerTripsData.trips.length === 0) {
      throw new Error('Expected at least 1 trip for customer with bookings');
    }

    const testTrip = customerTripsData.trips[0];
    console.log(`🧭 Testing single trip: ID = "${testTrip.id}", Title = "${testTrip.title}", Status = "${testTrip.status}"`);
    console.log(`   Host: ${testTrip.tripHost?.name} (${testTrip.tripHost?.role})`);
    console.log(`   Guide: ${testTrip.guide?.name} (${testTrip.guide?.role})`);
    console.log(`   Vehicle: ${testTrip.vehicle?.name} (${testTrip.vehicle?.number})`);
    console.log(`   Companions: ${testTrip.companions?.length}`);
    console.log(`   Timeline Milestones: ${testTrip.timeline?.length}`);

    // 3. Test getCustomerTripById
    const singleTrip = await tripService.getCustomerTripById(userId, testTrip.id);
    console.log(`✅ Single Trip Retrieved by ID: "${singleTrip.title}"`);

    // 4. Test getCustomerTripDocuments
    const docsData = await tripService.getCustomerTripDocuments(userId, testTrip.id);
    console.log(`✅ Trip Documents Retrieved: Count = ${docsData.documents.length}`);
    for (const doc of docsData.documents) {
      console.log(`   📄 Document: "${doc.title}" [${doc.category}] - ${doc.subtitle}`);
    }

    console.log('\n🎉 ALL BATCH 3 TRIP & DOCUMENT TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Batch 3 Trip Test Failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

runTripTest();
