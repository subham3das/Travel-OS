import mongoose from 'mongoose';
import { CarModel } from '../src/models/car.model.js';
import { CarReviewModel } from '../src/models/carReview.model.js';
import { CarBookingModel } from '../src/models/carBooking.model.js';
import { ConversationModel } from '../src/models/conversation.model.js';
import { UserModel } from '../src/models/user.model.js';
import { AgencyModel } from '../src/models/agency.model.js';
import { carService } from '../src/services/car.service.js';
import { carBookingService } from '../src/services/carBooking.service.js';

const uri = process.env.MONGODB_URI || 'mongodb+srv://subhamdas26e_db_user:travelos12345@travelos.t0loaad.mongodb.net/travelos_db?retryWrites=true&w=majority&appName=TRAVELOS';

async function runTest() {
  console.log('--- STARTING CAR RENTAL BACKEND INTEGRATION TEST ---');
  await mongoose.connect(uri);

  try {
    // 1. Test Car Listing & Filtering
    console.log('\n[1] Testing carService.listCars()...');
    const listRes = await carService.listCars({ page: 1, limit: 10 });
    console.log(`✓ Fetched ${listRes.cars.length} cars (Total in DB: ${listRes.pagination.total})`);
    if (listRes.cars.length === 0) throw new Error('No cars returned');

    const firstCar = listRes.cars[0];
    console.log(`✓ First Car: "${firstCar.name}" | Daily Price: ₹${firstCar.dailyPrice} | Agency: ${(firstCar.agencyId as any)?.name || 'Agency'}`);

    // 2. Test Category Counts
    console.log('\n[2] Testing carService.getCategoryCounts()...');
    const counts = await carService.getCategoryCounts();
    console.log('✓ Category counts:', counts);

    // 3. Test Single Car Details
    console.log('\n[3] Testing carService.getCarById()...');
    const carDetails = await carService.getCarById(firstCar._id.toString());
    console.log(`✓ Car Details fetched: ${carDetails.name}, Driver: ${carDetails.driver.name} (${carDetails.driver.rating}★)`);

    // 4. Test Car Reviews
    console.log('\n[4] Testing carService.getCarReviews()...');
    const reviews = await carService.getCarReviews(firstCar._id.toString());
    console.log(`✓ Reviews count for ${firstCar.name}: ${reviews.total}`);
    if (reviews.reviews.length > 0) {
      console.log(`✓ Sample review by "${reviews.reviews[0].customerName}": "${reviews.reviews[0].comment}"`);
    }

    // 5. Test Booking Creation with Deposit
    console.log('\n[5] Testing carBookingService.createBooking()...');
    const testUser = await UserModel.findOne({}) || await UserModel.create({
      name: 'Integration Tester',
      email: `tester_${Date.now()}@apnatrip.in`,
      phone: '+91 99999 88888',
      role: 'TRAVELER',
    });

    const booking = await carBookingService.createBooking(testUser._id.toString(), {
      carId: firstCar._id.toString(),
      tripType: 'multi_day',
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days
      pickupLocation: 'Guwahati Airport (GAU)',
      dropLocation: 'Kaziranga National Park',
      pickupTime: '09:00 AM',
      passengersCount: 4,
      specialNotes: 'Child seat requested and extra boot space.',
      paymentType: 'deposit',
      customerName: testUser.name,
      customerEmail: testUser.email,
      customerPhone: testUser.phone || '+91 99999 88888',
    });

    console.log(`✓ Booking created! ID: ${booking.bookingId}`);
    console.log(`  - Total Days: ${booking.totalDays}`);
    console.log(`  - Daily Rate: ₹${booking.dailyRate}`);
    console.log(`  - Total Amount: ₹${booking.totalAmount}`);
    console.log(`  - Deposit Paid: ₹${booking.depositPaid}`);
    console.log(`  - Remaining: ₹${booking.remainingAmount}`);
    console.log(`  - Status: ${booking.bookingStatus}`);

    // 6. Test Payment and Auto-Conversation Creation
    console.log('\n[6] Testing carBookingService.payBooking()...');
    const paidBooking = await carBookingService.payBooking(testUser._id.toString(), booking.bookingId, {
      paymentMethod: 'upi',
      transactionId: `TXN-TEST-${Date.now()}`,
    });

    console.log(`✓ Payment confirmed! Booking status: ${paidBooking.bookingStatus}, Payment status: ${paidBooking.paymentStatus}`);
    console.log(`✓ Auto-created conversation ID: ${paidBooking.conversationId}`);

    const conversation = await ConversationModel.findById(paidBooking.conversationId);
    console.log(`✓ Conversation last message: "${conversation?.lastMessagePreview?.slice(0, 70)}..."`);

    // 7. Test Agency View & Status Acceptance
    console.log('\n[7] Testing Agency accepting booking...');
    const acceptedBooking = await carBookingService.agencyUpdateStatus(
      booking.agencyId.toString(),
      booking.bookingId,
      'ACCEPTED'
    );
    console.log(`✓ Agency accepted booking! Current status: ${acceptedBooking.bookingStatus}`);

    // 8. Test Agency Completing Booking
    console.log('\n[8] Testing Agency completing booking...');
    const completedBooking = await carBookingService.agencyUpdateStatus(
      booking.agencyId.toString(),
      booking.bookingId,
      'COMPLETED'
    );
    console.log(`✓ Agency marked booking COMPLETED! CompletedAt: ${completedBooking.completedAt}`);

    // 9. Test Customer Submitting Review & Rating Recalculation
    console.log('\n[9] Testing customer submitting review...');
    const newReview = await carBookingService.submitReview(testUser._id.toString(), booking.bookingId, {
      rating: 5,
      comment: 'Superb trip! Flawless driving and punctuality.',
    });
    console.log(`✓ Review submitted successfully! Review ID: ${newReview._id}`);

    const updatedCar = await CarModel.findById(firstCar._id);
    console.log(`✓ Updated Car rating in DB: ${updatedCar?.averageRating}★ (${updatedCar?.reviewsCount} reviews)`);

    console.log('\n--- ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS ---');
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
