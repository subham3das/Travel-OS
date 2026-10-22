import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { RentalBookingModel, IRentalBooking, RentalType, RentalBookingStatus } from '../models/rentalBooking.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { CarModel } from '../models/car.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { BadRequestError, NotFoundError, ForbiddenError } from '../utils/errors.util.js';
import { NotificationModel } from '../models/notification.model.js';
import { socketService } from './socket.service.js';

export interface CreateRentalBookingDTO {
  carId: string;
  rentalType: RentalType;
  durationValue: number;
  pickupDateTime: string;
  returnDateTime?: string;
  pickupLocation: string;
  returnLocation?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialNotes?: string;
  paymentType?: 'full' | 'deposit';
  emergencyContact?: { name?: string; phone?: string; relationship?: string };
  address?: string;
  gender?: string;
  age?: number;
}

export class RentalBookingService {
  private razorpayClient: Razorpay | null = null;

  constructor() {
    this.initRazorpay();
  }

  private initRazorpay(): void {
    if (envConfig.RAZORPAY_KEY_ID && envConfig.RAZORPAY_KEY_SECRET) {
      this.razorpayClient = new Razorpay({
        key_id: envConfig.RAZORPAY_KEY_ID,
        key_secret: envConfig.RAZORPAY_KEY_SECRET,
      });
    }
  }

  private getRazorpay(): Razorpay {
    if (!this.razorpayClient) {
      this.initRazorpay();
    }
    if (!this.razorpayClient) {
      throw new BadRequestError('Payment gateway unavailable. Please check Razorpay keys.');
    }
    return this.razorpayClient;
  }

  /**
   * 1. Create a dedicated Rental Booking
   */
  public async createRentalBooking(customerId: string, data: CreateRentalBookingDTO): Promise<IRentalBooking> {
    if (!mongoose.Types.ObjectId.isValid(data.carId)) {
      throw new BadRequestError('Invalid vehicle ID');
    }

    const car = await CarModel.findOne({ _id: data.carId, isActive: { $ne: false } });
    if (!car) {
      throw new NotFoundError('Rental vehicle not found or inactive');
    }

    if (car.specs?.driverIncluded === true && car.serviceType === 'ROUTE_BOOKING') {
      throw new BadRequestError('This vehicle is registered for driver-based bookings, not self-drive rental');
    }

    if (car.status === 'booked') {
      throw new BadRequestError('This vehicle is currently unavailable for rental');
    }

    const rentalPricing = car.rentalPricing || ({} as any);
    const fallbackDaily = rentalPricing.dailyRate || car.dailyPrice || (car as any).pricePerDay || 1500;
    const rentalType = data.rentalType || 'daily';
    const duration = Math.max(1, Number(data.durationValue) || 1);

    let rate = fallbackDaily;
    if (rentalType === 'hourly') {
      rate = rentalPricing.hourlyRate || Math.round(fallbackDaily / 10);
    } else if (rentalType === 'daily') {
      rate = fallbackDaily;
    } else if (rentalType === 'weekly') {
      rate = rentalPricing.weeklyRate || fallbackDaily * 6;
    } else if (rentalType === 'monthly') {
      rate = rentalPricing.monthlyRate || fallbackDaily * 24;
    } else {
      rate = fallbackDaily;
    }

    const startDate = new Date(data.pickupDateTime);
    if (isNaN(startDate.getTime())) {
      throw new BadRequestError('Invalid pickup date and time');
    }

    let endDate: Date;
    if (data.returnDateTime && !isNaN(new Date(data.returnDateTime).getTime())) {
      endDate = new Date(data.returnDateTime);
    } else {
      endDate = new Date(startDate.getTime());
      if (rentalType === 'hourly') {
        endDate.setHours(endDate.getHours() + duration);
      } else if (rentalType === 'daily') {
        endDate.setDate(endDate.getDate() + duration);
      } else if (rentalType === 'weekly') {
        endDate.setDate(endDate.getDate() + duration * 7);
      } else if (rentalType === 'monthly') {
        endDate.setDate(endDate.getDate() + duration * 30);
      }
    }

    const baseAmount = rate * duration;
    const taxesAmount = Math.round(baseAmount * 0.05); // 5% GST
    const securityDeposit = car.rentalPolicies?.securityDeposit || 0;
    const totalAmount = baseAmount + taxesAmount;

    const paymentType = data.paymentType || 'full';
    const depositPaid = paymentType === 'deposit' ? Math.round(totalAmount * 0.3) : totalAmount;
    const remainingAmount = totalAmount - depositPaid;

    const bookingId = `RENT-${Date.now().toString().slice(-6)}${Math.floor(1000 + Math.random() * 9000)}`;

    // Generate unique random 6-digit pickup verification code for active/open bookings
    let pickupCode = '';
    let isUnique = false;
    while (!isUnique) {
      pickupCode = crypto.randomInt(100000, 999999).toString();
      const existingOpenBooking = await RentalBookingModel.findOne({
        pickupCode,
        isDeleted: false,
        bookingStatus: { $in: ['BOOKED', 'READY_FOR_PICKUP', 'ACTIVE', 'RETURN_PENDING'] as RentalBookingStatus[] },
      }).select('_id').lean();

      if (!existingOpenBooking) {
        isUnique = true;
      }
    }

    const booking = await RentalBookingModel.create({
      bookingId,
      carId: car._id,
      agencyId: car.agencyId,
      customerId: new mongoose.Types.ObjectId(customerId),
      rentalType,
      durationValue: duration,
      startDate,
      endDate,
      pickupLocation: data.pickupLocation || car.pickupLocation || car.city || 'Main Hub',
      returnLocation: data.returnLocation || data.pickupLocation || car.pickupLocation || car.city || 'Main Hub',
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      specialNotes: data.specialNotes,
      emergencyContact: data.emergencyContact,
      address: data.address,
      gender: data.gender,
      age: data.age,
      rateApplied: rate,
      baseAmount,
      taxesAmount,
      securityDeposit,
      totalAmount,
      paymentType,
      depositPaid,
      remainingAmount,
      paymentStatus: 'PENDING',
      status: 'BOOKED',
      bookingStatus: 'BOOKED',
      bookingConfirmationCode: pickupCode,
      pickupCode,
      timeline: [
        {
          id: `step-booked-${Date.now()}`,
          title: 'Booking Reserved',
          subtitle: `Reference: #${bookingId}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'calendar',
        },
        {
          id: `step-pickup-${Date.now()}`,
          title: 'Collect Vehicle',
          subtitle: `Pickup Code: ${pickupCode}`,
          timestamp: 'Ready For Pickup',
          status: 'upcoming',
          iconType: 'key',
        },
        {
          id: `step-return-${Date.now()}`,
          title: 'Return Vehicle',
          subtitle: 'Verify 6-digit return code with owner',
          timestamp: 'Scheduled',
          status: 'upcoming',
          iconType: 'check-circle',
        },
      ],
    });

    return booking;
  }

  /**
   * 2. Create Razorpay Payment Order for Rental Booking
   */
  public async createPaymentOrder(userId: string, bookingId: string) {
    const booking = await RentalBookingModel.findOne({
      bookingId,
      customerId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    }).populate('carId');

    if (!booking) {
      throw new NotFoundError(`Rental booking "${bookingId}" not found or unauthorized.`);
    }

    if (booking.bookingStatus !== 'BOOKED' && booking.paymentStatus === 'FULL_PAID') {
      throw new BadRequestError('This rental booking is already paid.');
    }

    const payableAmount = booking.paymentType === 'deposit' ? booking.depositPaid : booking.totalAmount;
    const amountInPaise = Math.round(payableAmount * 100);

    const razorpay = this.getRazorpay();

    const orderPayload = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: booking.bookingId,
      notes: {
        bookingId: booking.bookingId,
        bookingType: 'VEHICLE_RENTAL',
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        rentalType: booking.rentalType,
      },
    };

    const order = await razorpay.orders.create(orderPayload);
    logger.info('✨ Created Razorpay Order %s for rental booking %s (₹%d)', order.id, booking.bookingId, payableAmount);

    return {
      orderId: order.id,
      currency: order.currency || 'INR',
      amount: order.amount,
      key: envConfig.RAZORPAY_KEY_ID,
      bookingReference: booking.bookingId,
      customer: {
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
      },
    };
  }

  /**
   * 3. Verify Payment and Generate 6-Digit Confirmation Code
   */
  public async verifyPayment(
    userId: string,
    params: {
      bookingId: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }
  ) {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    const secret = envConfig.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf-8');
    const isMatch =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    if (!isMatch) {
      throw new BadRequestError('Payment signature verification failed.');
    }

    const booking = await RentalBookingModel.findOne({
      bookingId,
      customerId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    }).populate('carId').populate('agencyId');

    if (!booking) {
      throw new NotFoundError(`Rental booking "${bookingId}" not found.`);
    }

    // Preserve existing unique pickup code from creation or generate if missing
    let confirmationCode = (booking.pickupCode || booking.bookingConfirmationCode || '').toString().trim();
    if (!confirmationCode) {
      let isUnique = false;
      while (!isUnique) {
        confirmationCode = crypto.randomInt(100000, 999999).toString();
        const existingOpen = await RentalBookingModel.findOne({
          pickupCode: confirmationCode,
          isDeleted: false,
          bookingStatus: { $in: ['BOOKED', 'READY_FOR_PICKUP', 'ACTIVE', 'RETURN_PENDING'] as RentalBookingStatus[] },
        }).select('_id').lean();
        if (!existingOpen) isUnique = true;
      }
    }

    booking.bookingConfirmationCode = confirmationCode;
    booking.pickupCode = confirmationCode;
    booking.bookingStatus = 'READY_FOR_PICKUP';
    booking.status = 'READY_FOR_PICKUP';
    booking.paymentStatus = booking.paymentType === 'deposit' ? 'DEPOSIT_PAID' : 'FULL_PAID';
    booking.transactionId = razorpay_payment_id;
    booking.confirmedAt = new Date();

    if (booking.timeline && booking.timeline.length > 1) {
      booking.timeline[1].status = 'current';
      booking.timeline[1].subtitle = `Pickup Code: ${confirmationCode}`;
    }

    await booking.save();

    // Create PaymentModel record for accounting
    try {
      const payableAmount = booking.paymentType === 'deposit' ? booking.depositPaid : booking.totalAmount;
      const agencyObj = booking.agencyId as any;
      const carObj = booking.carId as any;

      await PaymentModel.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentId: `PAY-${Date.now().toString().slice(-8)}`,
          orderId: razorpay_order_id,
          bookingId: booking.bookingId,
          agencyId: booking.agencyId?._id || booking.agencyId,
          agencyName: agencyObj?.businessName || agencyObj?.name || 'Car Rental Partner',
          userId: booking.customerId,
          userName: booking.customerName,
          userEmail: booking.customerEmail,
          userPhone: booking.customerPhone,
          packageName: `${carObj?.brand || ''} ${carObj?.name || 'Rental Vehicle'} (${booking.rentalType})`,
          packageThumbnail: carObj?.images?.[0] || '',
          amount: payableAmount,
          currency: 'INR',
          gateway: 'Razorpay',
          paymentMethod: 'Razorpay Checkout',
          status: 'SUCCESS',
          captured: true,
          receiptNumber: booking.bookingId,
          signatureVerified: true,
          paidAt: new Date(),
        },
        { upsert: true, new: true }
      );
    } catch (payErr) {
      logger.warn('Failed to record PaymentModel for rental: %s', (payErr as any).message);
    }

    return {
      verified: true,
      booking,
      bookingConfirmationCode: confirmationCode,
    };
  }

  /**
   * 4. Owner verifies pickup confirmation code -> Booking ACTIVE, Car ON_RENT (Unavailable)
   */
  public async verifyPickupCode(agencyId: string, bookingIdOrCode: string, code?: string) {
    // 1. Normalize code and booking reference
    let enteredCode = (code || '').toString().trim();
    let rawBookingId = (bookingIdOrCode || '').toString().trim();

    // If bookingIdOrCode was passed as a 6-digit code with no second param:
    if (!enteredCode && /^\d{6}$/.test(rawBookingId)) {
      enteredCode = rawBookingId;
      rawBookingId = '';
    }

    if (!rawBookingId) {
      throw new BadRequestError('Booking ID is required for verification.');
    }

    if (!enteredCode) {
      throw new BadRequestError('Invalid Pickup Code');
    }

    // Determine ID lookup criteria (handles 24-hex ObjectId as well as string bookingId)
    const isObjectId = mongoose.Types.ObjectId.isValid(rawBookingId) && rawBookingId.length === 24;
    const idFilter = isObjectId
      ? { $or: [{ _id: new mongoose.Types.ObjectId(rawBookingId) }, { _id: rawBookingId }, { bookingId: rawBookingId }] }
      : { bookingId: rawBookingId };

    // 1. Locate specific booking to inspect current state for logging & validation
    let candidateBooking = await RentalBookingModel.findOne({
      ...idFilter,
      isDeleted: false,
    });
    if (!candidateBooking) {
      candidateBooking = await CarBookingModel.findOne({
        ...idFilter,
        isDeleted: false,
      });
    }

    const storedPickupCode = candidateBooking
      ? String(candidateBooking.pickupCode || (candidateBooking as any).bookingConfirmationCode || (candidateBooking as any).rideStartCode || '').trim()
      : null;
    const storedStatus = candidateBooking
      ? String(candidateBooking.bookingStatus || (candidateBooking as any).status || '').trim()
      : null;

    // 2. Direct query verifying against the booking itself, not globally
    // Booking.findOne({ _id: bookingId, pickupCode: enteredCode, status: "BOOKED" })
    let booking: any = await RentalBookingModel.findOne({
      ...idFilter,
      $or: [
        { pickupCode: enteredCode },
        { pickupCode: Number(enteredCode) as any },
        { bookingConfirmationCode: enteredCode },
      ],
      $and: [
        {
          $or: [
            { bookingStatus: { $in: ['BOOKED', 'READY_FOR_PICKUP'] } },
            { status: { $in: ['BOOKED', 'READY_FOR_PICKUP'] } },
          ],
        },
      ],
      isDeleted: false,
    });

    if (!booking) {
      booking = await (CarBookingModel as any).findOne({
        ...idFilter,
        $or: [
          { rideStartCode: enteredCode },
          { pickupCode: enteredCode },
        ],
        bookingStatus: { $in: ['ACCEPTED', 'READY_FOR_RIDE', 'CONFIRMED'] },
        isDeleted: false,
      });
    }

    // Temporarily log:
    // Booking ID
    // Stored pickup code
    // Entered pickup code
    // Stored status
    // Lookup result
    console.log('--- Rental Pickup Verification ---');
    console.log('Booking ID:', rawBookingId);
    console.log('Stored pickup code:', storedPickupCode);
    console.log('Entered pickup code:', enteredCode);
    console.log('Stored status:', storedStatus);
    console.log('Lookup result:', booking ? 'Found' : 'Not found');
    console.log('-----------------------------------');

    logger.info('--- Rental Pickup Verification ---');
    logger.info('Booking ID: %s', rawBookingId);
    logger.info('Stored pickup code: %s', storedPickupCode);
    logger.info('Entered pickup code: %s', enteredCode);
    logger.info('Stored status: %s', storedStatus);
    logger.info('Lookup result: %s', booking ? 'Found' : 'Not found');
    logger.info('-----------------------------------');

    // If already active and code matches
    if (candidateBooking && storedStatus === 'ACTIVE') {
      const isCodeMatch = storedPickupCode && String(storedPickupCode).trim() === enteredCode;
      if (isCodeMatch) {
        return {
          success: true,
          booking: candidateBooking,
          returnCode: candidateBooking.returnCode,
          message: 'Rental is already active.',
        };
      }
    }

    // If no booking found with matching criteria
    if (!booking) {
      throw new BadRequestError('Invalid Pickup Code');
    }

    // Normalize before comparison
    const storedCodeToCompare = String(booking.pickupCode || (booking as any).bookingConfirmationCode || '').trim();
    if (storedCodeToCompare !== enteredCode) {
      throw new BadRequestError('Invalid Pickup Code');
    }

    // Generate new return verification code
    const returnCode = crypto.randomInt(100000, 999999).toString();

    // Status changes: BOOKED -> ACTIVE
    booking.bookingStatus = 'ACTIVE';
    booking.status = 'ACTIVE';
    booking.returnCode = returnCode;
    booking.pickupCode = enteredCode;

    if (booking.timeline && booking.timeline.length > 2) {
      booking.timeline[1].status = 'completed';
      booking.timeline[2].status = 'current';
      booking.timeline[2].subtitle = `Return Code: ${returnCode}`;
    }

    await booking.save();

    // Set Vehicle UNAVAILABLE / ON_RENT
    if (booking.carId) {
      await CarModel.findByIdAndUpdate(booking.carId, {
        isAvailable: false,
        status: 'booked',
      });
    }

    logger.info('🚗 Rental %s verified for pickup. Status changed to ACTIVE. Return code: %s', rawBookingId, returnCode);

    return {
      success: true,
      booking,
      returnCode,
      message: 'Vehicle pickup verified! Booking is now ACTIVE.',
    };
  }

  /**
   * 5. Owner verifies return code -> Booking COMPLETED, Car AVAILABLE
   */
  public async verifyReturnCode(agencyId: string, bookingIdOrCode: string, code?: string) {
    let enteredCode = (code || '').toString().trim();
    let rawBookingId = (bookingIdOrCode || '').toString().trim();

    if (!enteredCode && /^\d{6}$/.test(rawBookingId)) {
      enteredCode = rawBookingId;
      rawBookingId = '';
    }

    if (!enteredCode) {
      throw new BadRequestError('Return code is required');
    }

    let booking: any = null;

    if (rawBookingId) {
      if (mongoose.Types.ObjectId.isValid(rawBookingId) && rawBookingId.length === 24) {
        booking = await RentalBookingModel.findById(rawBookingId);
      }
      if (!booking) {
        booking = await RentalBookingModel.findOne({
          bookingId: rawBookingId,
          isDeleted: false,
        });
      }
    }

    if (!booking && enteredCode) {
      booking = await RentalBookingModel.findOne({
        returnCode: enteredCode,
        isDeleted: false,
      });
    }

    if (!booking) {
      throw new NotFoundError('Rental booking not found');
    }

    if (booking.bookingStatus === 'COMPLETED') {
      return { success: true, booking, message: 'Booking is already completed.' };
    }

    if (booking.bookingStatus !== 'ACTIVE' && booking.bookingStatus !== 'RETURN_PENDING') {
      throw new BadRequestError('Booking must be ACTIVE to process vehicle return');
    }

    if (booking.returnCode && booking.returnCode !== enteredCode) {
      throw new BadRequestError('Invalid return code. Please check code provided by customer.');
    }

    booking.bookingStatus = 'COMPLETED';
    booking.completedAt = new Date();

    if (booking.timeline && booking.timeline.length > 2) {
      booking.timeline[2].status = 'completed';
    }

    await booking.save();

    // Set Vehicle AVAILABLE again
    await CarModel.findByIdAndUpdate(booking.carId, {
      isAvailable: true,
      status: 'available',
    });

    logger.info('🏁 Rental %s returned. Vehicle %s is now AVAILABLE again.', booking.bookingId, booking.carId);

    return {
      success: true,
      booking,
      message: 'Vehicle return verified! Booking is now COMPLETED.',
    };
  }

  /**
   * 6. Customer: Get my rental bookings
   */
  public async getMyBookings(customerId: string) {
    return RentalBookingModel.find({
      customerId: new mongoose.Types.ObjectId(customerId),
      isDeleted: false,
    })
      .populate('carId')
      .populate('agencyId', 'name businessName logo email phone isVerified city')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 7. Agency: Get agency's rental bookings
   */
  public async getAgencyBookings(agencyId: string) {
    return RentalBookingModel.find({
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: false,
    })
      .populate('carId')
      .populate('customerId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 8. Get booking by ID (supports bookingId or _id)
   */
  public async getBookingById(userId: string, bookingIdOrDocId: string) {
    const filter: any = {
      isDeleted: false,
      $or: [
        { bookingId: bookingIdOrDocId },
        ...(mongoose.Types.ObjectId.isValid(bookingIdOrDocId)
          ? [{ _id: new mongoose.Types.ObjectId(bookingIdOrDocId) }]
          : []),
      ],
    };

    const booking = await RentalBookingModel.findOne(filter)
      .populate('carId')
      .populate('agencyId', 'name businessName logo email phone isVerified city')
      .populate('customerId', 'name email phone avatar')
      .lean();

    if (!booking) {
      throw new NotFoundError('Rental booking not found');
    }

    return booking;
  }

  /**
   * 9. Cancel Rental Booking (by Customer or Agency/Admin)
   */
  public async cancelBooking(
    requester: { userId?: string; agencyId?: string; role?: string },
    bookingIdOrDocId: string,
    reason?: string
  ) {
    const filter: any = {
      isDeleted: false,
      $or: [
        { bookingId: bookingIdOrDocId },
        ...(mongoose.Types.ObjectId.isValid(bookingIdOrDocId)
          ? [{ _id: new mongoose.Types.ObjectId(bookingIdOrDocId) }]
          : []),
      ],
    };

    if (requester.userId && requester.role !== 'ADMIN') {
      filter.customerId = new mongoose.Types.ObjectId(requester.userId);
    } else if (requester.agencyId) {
      filter.agencyId = new mongoose.Types.ObjectId(requester.agencyId);
    }

    const booking = await RentalBookingModel.findOne(filter);
    if (!booking) {
      throw new NotFoundError('Rental booking not found or unauthorized');
    }

    if (booking.bookingStatus === 'COMPLETED' || booking.bookingStatus === 'CANCELLED') {
      throw new BadRequestError(`Cannot cancel a booking that is ${booking.bookingStatus.toLowerCase()}`);
    }

    booking.bookingStatus = 'CANCELLED';
    booking.cancellationReason = reason || 'Cancelled by user/agency';
    booking.cancelledAt = new Date();
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    // Revert car availability to available
    await CarModel.findByIdAndUpdate(booking.carId, {
      isAvailable: true,
      status: 'available',
    });

    logger.info('🚫 Rental booking %s cancelled. Vehicle %s released to available.', booking.bookingId, booking.carId);

    return {
      success: true,
      booking,
      message: 'Rental booking cancelled successfully. Vehicle marked available.',
    };
  }

  /**
   * 10. Dedicated Owner Cancellation for Rental Booking (POST /api/rental/owner/cancel)
   */
  public async ownerCancelBooking(
    agencyId: string,
    bookingIdOrDocId: string,
    cancellationReason?: string
  ) {
    const filter: any = {
      isDeleted: false,
      $or: [
        { bookingId: bookingIdOrDocId },
        ...(mongoose.Types.ObjectId.isValid(bookingIdOrDocId)
          ? [{ _id: new mongoose.Types.ObjectId(bookingIdOrDocId) }]
          : []),
      ],
    };

    if (agencyId && mongoose.Types.ObjectId.isValid(agencyId)) {
      filter.agencyId = new mongoose.Types.ObjectId(agencyId);
    }

    const booking = await RentalBookingModel.findOne(filter);
    if (!booking) {
      throw new NotFoundError('Rental booking not found or unauthorized');
    }

    const statusUpper = (booking.bookingStatus || '').toUpperCase();

    // 4. Validation: Only allow BOOKED, READY_FOR_PICKUP, READY_FOR_RIDE
    const allowedStatuses = ['BOOKED', 'READY_FOR_PICKUP', 'READY_FOR_RIDE'];
    if (!allowedStatuses.includes(statusUpper)) {
      throw new BadRequestError('This booking can no longer be cancelled.');
    }

    // 5. Database: Update booking
    booking.bookingStatus = 'CANCELLED';
    (booking as any).status = 'CANCELLED';
    booking.cancelledBy = 'OWNER';
    booking.cancelledAt = new Date();
    if (cancellationReason && cancellationReason.trim()) {
      booking.cancellationReason = cancellationReason.trim();
    }
    booking.paymentStatus = 'REFUNDED';

    // 10. Booking Timeline: Booking Created -> Payment Successful -> Booking Cancelled by Owner
    const currentTimeline = booking.timeline || [];
    const createdStep = currentTimeline.find((t: any) =>
      t.title?.toLowerCase().includes('create') || t.title?.toLowerCase().includes('reserv')
    ) || {
      id: `step-created-${booking.bookingId}`,
      title: 'Booking Created',
      subtitle: `Reference: #${booking.bookingId}`,
      timestamp: new Date(booking.createdAt || Date.now()).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'completed',
      iconType: 'calendar',
    };
    createdStep.status = 'completed';

    const paidStep = currentTimeline.find((t: any) =>
      t.title?.toLowerCase().includes('pay')
    ) || {
      id: `step-paid-${booking.bookingId}`,
      title: 'Payment Successful',
      subtitle: booking.depositPaid ? `Deposit: ₹${booking.depositPaid}` : 'Payment Verified',
      timestamp: new Date(booking.confirmedAt || booking.updatedAt || Date.now()).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'completed',
      iconType: 'credit-card',
    };
    paidStep.status = 'completed';

    const cancelledStep = {
      id: `step-cancelled-owner-${Date.now()}`,
      title: 'Booking Cancelled by Owner',
      subtitle: cancellationReason?.trim()
        ? `Reason: ${cancellationReason.trim()}`
        : 'Cancelled by vehicle owner',
      timestamp: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      status: 'completed' as const,
      iconType: 'x-circle',
    };

    booking.timeline = [createdStep, paidStep, cancelledStep];
    await booking.save();

    // 6. Vehicle Availability: Automatically restore vehicle.isAvailable = true
    if (booking.carId) {
      await CarModel.findByIdAndUpdate(booking.carId, {
        isAvailable: true,
        status: 'available',
        $pull: { bookedSlots: { bookingId: booking.bookingId } },
      });
    }

    // 7. Customer Notification
    const notifReason = cancellationReason?.trim() || 'No reason provided';
    const notifDesc = `Your booking has been cancelled by the vehicle owner.

Booking ID:
${booking.bookingId}

Reason:
${notifReason}

If you have already paid, our support team will process your refund according to the cancellation policy.`;

    try {
      await NotificationModel.create({
        recipientType: 'USER',
        recipientId: booking.customerId,
        category: 'Bookings',
        title: 'Booking Cancelled by Owner',
        description: notifDesc,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/my-bookings',
        relatedEntityType: 'RentalBooking',
        relatedEntityId: booking.bookingId,
      });

      socketService.emitToUser(booking.customerId.toString(), 'booking_cancelled_by_owner', {
        bookingId: booking.bookingId,
        reason: notifReason,
        message: notifDesc,
      });
      socketService.emitToUser(booking.customerId.toString(), 'booking_status_updated', {
        bookingId: booking.bookingId,
        status: 'CANCELLED',
        cancelledBy: 'OWNER',
      });
    } catch (err) {
      logger.error('Failed to dispatch customer notification for owner rental cancellation:', err);
    }

    logger.info('🚫 Rental booking %s cancelled by owner. Vehicle %s released to available.', booking.bookingId, booking.carId);

    return booking;
  }
}

export const rentalBookingService = new RentalBookingService();
