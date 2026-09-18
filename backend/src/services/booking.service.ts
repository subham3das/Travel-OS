import mongoose from 'mongoose';
import { BookingModel, IBooking, BookingStatus, BookingPaymentStatus } from '../models/booking.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { UserModel } from '../models/user.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { socketService } from './socket.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface CheckoutTravelerItem {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface CreateBookingCheckoutInput {
  packageId: string;
  departureDate: string;
  travelers: CheckoutTravelerItem[];
  leadTraveler: {
    fullName: string;
    email: string;
    phone: string;
    gender?: string;
    dob?: string;
    idProofType?: string;
    idProofNumber?: string;
    address?: string;
    specialRequests?: string;
  };
  promoCode?: string;
  pickupPoint?: string;
  dropPoint?: string;
}

export class BookingService {
  /**
   * Helper to generate human-readable unique booking ID
   */
  private generateBookingId(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `BK-${new Date().getFullYear()}-${random}`;
  }

  /**
   * Create Booking (Checkout Step)
   */
  public async createCheckoutBooking(userId: string, input: CreateBookingCheckoutInput) {
    const { packageId, departureDate, travelers, leadTraveler, promoCode } = input;

    // 1. Fetch Package
    let pkg: any = null;
    if (mongoose.Types.ObjectId.isValid(packageId)) {
      pkg = await PackageModel.findOne({ _id: packageId, isDeleted: false });
    }
    if (!pkg) {
      pkg = await PackageModel.findOne({ packageId, isDeleted: false });
    }
    if (!pkg) {
      throw new NotFoundError(`Package "${packageId}" not found`);
    }

    // 2. Fetch User
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Customer user account not found');
    }

    const count = Math.max(1, travelers && travelers.length > 0 ? travelers.length : 1);
    const unitPrice = pkg.price || 0;
    const basePrice = unitPrice * count;
    const taxesAndFees = Math.round(basePrice * 0.05); // 5% GST
    const platformFee = 250;

    let discountAmount = 0;
    if (promoCode) {
      const codeClean = promoCode.trim().toUpperCase();
      if (codeClean === 'APNATRIP2000') discountAmount = 2000;
      else if (codeClean === 'FIRST1000') discountAmount = 1000;
    }

    const grandTotal = Math.max(0, basePrice + taxesAndFees + platformFee - discountAmount);

    const startDate = departureDate ? new Date(departureDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const durationDays = pkg.durationDays || 4;
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const newBookingId = this.generateBookingId();

    const formattedTravelers = travelers.map((t, idx) => ({
      id: `trv-${idx + 1}`,
      name: t.name,
      age: t.age || 28,
      gender: t.gender || 'Male',
      passportNumber: t.passportNumber || '',
      phone: t.phone || (t.isPrimary ? leadTraveler.phone : ''),
      email: t.email || (t.isPrimary ? leadTraveler.email : ''),
      isPrimary: Boolean(t.isPrimary),
    }));

    const booking = await BookingModel.create({
      bookingId: newBookingId,
      userId: new mongoose.Types.ObjectId(userId),
      agencyId: pkg.agencyId || undefined,
      packageId: pkg._id,
      packageName: pkg.title,
      packageThumbnail: pkg.coverImage || pkg.featuredImage || '',
      agencyName: pkg.agencyName || 'Partner Agency',
      agencyLogo: pkg.agencyLogo || '',
      customerName: leadTraveler.fullName || user.fullName,
      customerEmail: leadTraveler.email || user.email,
      customerPhone: leadTraveler.phone || user.phone,
      customerAvatar: user.avatar || '',
      travelersCount: count,
      totalAmount: grandTotal,
      basePrice,
      taxesAndFees,
      platformFee,
      discountAmount,
      discountCode: promoCode || '',
      paidAmount: 0,
      paymentMethod: 'Razorpay',
      status: 'PENDING',
      paymentStatus: 'PENDING',
      destination: pkg.destination || 'India',
      destinationCountry: pkg.destinationCountry || 'India',
      durationText: `${durationDays} Days / ${pkg.durationNights || durationDays - 1} Nights`,
      tripStartDate: startDate,
      tripEndDate: endDate,
      travelers: formattedTravelers,
      activities: [
        {
          id: `act-${Date.now()}`,
          actor: leadTraveler.fullName || user.fullName,
          role: 'Traveler',
          action: 'Initiated Booking Checkout',
          details: `Checkout initiated for ${pkg.title} (${count} travelers)`,
          timestamp: new Date().toISOString(),
        },
      ],
      timeline: [
        {
          id: 'step-1',
          title: 'Booking Initiated',
          subtitle: 'Checkout started',
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
        },
        {
          id: 'step-2',
          title: 'Payment Confirmation',
          subtitle: 'Awaiting payment verification',
          status: 'current',
        },
        {
          id: 'step-3',
          title: 'Voucher & Documentation',
          subtitle: 'Issued upon confirmation',
          status: 'upcoming',
        },
      ],
    });

    logger.info('🛒 Created checkout booking: %s for user: %s', newBookingId, userId);

    return {
      bookingId: newBookingId,
      booking,
      orderSummary: {
        basePrice,
        taxesAndFees,
        platformFee,
        discountAmount,
        grandTotal,
        currency: 'INR',
        packageName: pkg.title,
      },
    };
  }

  /**
   * Verify & Complete Payment
   */
  public async verifyAndConfirmBooking(userId: string, payload: {
    bookingId: string;
    paymentId?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
  }) {
    const { bookingId, paymentId, razorpayPaymentId } = payload;

    const booking = await BookingModel.findOne({ bookingId, userId, isDeleted: false });
    if (!booking) {
      throw new NotFoundError(`Booking "${bookingId}" not found or unauthorized`);
    }

    const txId = razorpayPaymentId || paymentId || `pay_${Date.now()}`;

    booking.status = 'CONFIRMED';
    booking.paymentStatus = 'PAID';
    booking.paidAmount = booking.totalAmount;
    booking.transactionId = txId;

    booking.timeline.push({
      id: 'step-paid',
      title: 'Payment Confirmed',
      subtitle: `Transaction ID: ${txId}`,
      timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      status: 'completed',
    });

    booking.activities.push({
      id: `act-${Date.now()}`,
      actor: booking.customerName,
      role: 'Traveler',
      action: 'Payment Completed',
      details: `Paid ₹${booking.totalAmount.toLocaleString('en-IN')} via Razorpay`,
      timestamp: new Date().toISOString(),
    });

    await booking.save();

    // Create payment ledger entry
    const payment = await PaymentModel.create({
      paymentId: `PAY-${Date.now().toString().slice(-8)}`,
      bookingId: booking.bookingId,
      agencyId: booking.agencyId,
      agencyName: booking.agencyName,
      userId: booking.userId,
      userName: booking.customerName,
      userEmail: booking.customerEmail,
      userPhone: booking.customerPhone,
      packageName: booking.packageName,
      amount: booking.totalAmount,
      platformFee: booking.platformFee,
      currency: 'INR',
      gateway: 'Razorpay',
      paymentMethod: 'UPI / Card',
      status: 'SUCCESS',
      settlementStatus: 'Pending',
      transactionRef: txId,
      gatewayTransactionId: txId,
      paidAt: new Date(),
    });

    // Notify Customer & Agency in real time
    try {
      await NotificationDispatcher.notifyUser(String(booking.userId), {
        category: 'Bookings',
        title: 'Booking Confirmed! 🎉',
        description: `Your trip to ${booking.destination} for ${booking.packageName} is confirmed. Booking ID: ${booking.bookingId}`,
        targetRoute: `/trips`,
      });

      if (booking.agencyId) {
        socketService.emitToAgency(String(booking.agencyId), 'new_booking', {
          bookingId: booking.bookingId,
          customerName: booking.customerName,
          packageName: booking.packageName,
          amount: booking.totalAmount,
        });
      }
    } catch (err: any) {
      logger.warn('Failed to dispatch post-booking notification: %s', err.message);
    }

    logger.info('✅ Confirmed booking: %s with payment: %s', bookingId, payment.paymentId);

    return {
      success: true,
      booking,
      bookingId: booking.bookingId,
      paymentId: payment.paymentId,
      transactionId: txId,
      status: booking.status,
      totalAmount: booking.totalAmount,
      packageName: booking.packageName,
    };
  }

  /**
   * List Customer's Bookings
   */
  public async getCustomerBookings(userId: string) {
    const bookings = await BookingModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .lean();

    return bookings.map((b: any) => {
      const departure = new Date(b.tripStartDate);
      const now = new Date();
      const diffDays = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: b.bookingId,
        bookingId: b.bookingId,
        packageName: b.packageName,
        coverImage: b.packageThumbnail || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600',
        agencyName: b.agencyName,
        bookingStatus: b.status === 'CONFIRMED' ? 'Confirmed' : b.status,
        paymentStatus: b.paymentStatus === 'PAID' ? 'Paid' : b.paymentStatus,
        departureDate: departure.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        countdownDays: Math.max(0, diffDays),
        totalAmount: b.totalAmount,
        travelersCount: b.travelersCount,
        associatedTripId: b.bookingId,
      };
    });
  }

  /**
   * Get Single Booking Details (Customer Isolated)
   */
  public async getCustomerBookingById(userId: string, bookingIdentifier: string) {
    const booking = await BookingModel.findOne({
      $or: [
        { bookingId: bookingIdentifier },
        ...(mongoose.Types.ObjectId.isValid(bookingIdentifier) ? [{ _id: bookingIdentifier }] : []),
      ],
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    }).lean();

    if (!booking) {
      throw new NotFoundError(`Booking "${bookingIdentifier}" not found or unauthorized`);
    }

    return booking;
  }
}

export const bookingService = new BookingService();
