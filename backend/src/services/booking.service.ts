import mongoose from 'mongoose';
import { BookingModel, IBooking, BookingStatus, BookingPaymentStatus } from '../models/booking.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { UserModel } from '../models/user.model.js';
import { SavedTravelerModel } from '../models/savedTraveler.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { socketService } from './socket.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';
import { mailService } from './mail.service.js';
import { paymentService } from './payment.service.js';
import { isPackageVisibleToTraveler, isPackageBookable } from './packageReadiness.service.js';

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
  departureId?: string;
  departureDate: string;
  travelerIds?: string[];
  travelers?: CheckoutTravelerItem[];
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

    // Enforce single source of truth validator: isPackageVisibleToTraveler
    const isVisible = await isPackageVisibleToTraveler(pkg);
    if (!isVisible) {
      logger.warn(`Booking attempt rejected for unbookable package: ${pkg._id} (${pkg.title})`);
      throw new BadRequestError('PACKAGE_NOT_AVAILABLE');
    }

    // 2. Fetch User
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError('Customer user account not found');
    }

    // Resolve Saved Travelers if travelerIds provided
    let resolvedTravelerIds: mongoose.Types.ObjectId[] = [];
    let formattedTravelers: any[] = [];
    let count = 1;

    if (input.travelerIds && input.travelerIds.length > 0) {
      const savedTravelers = await SavedTravelerModel.find({
        _id: { $in: input.travelerIds.map((id) => new mongoose.Types.ObjectId(id)) },
        userId,
        isDeleted: false,
      }).exec();

      if (savedTravelers.length === 0) {
        throw new BadRequestError('Selected travelers not found');
      }

      // Check Government ID Verification Rule:
      // Every traveler must have at least one verified primary government ID before completing a booking.
      // Required (Choose One):
      // - Aadhaar Card (both frontUrl AND backUrl mandatory)
      // OR
      // - Voter ID Card (frontUrl mandatory)
      const missingRequirements: string[] = [];
      for (const st of savedTravelers) {
        const missingForTraveler: string[] = [];

        const hasAadhaar = Boolean(st.aadhaar?.frontUrl && st.aadhaar?.backUrl);
        const hasVoterId = Boolean(st.voterId?.frontUrl);

        if (!hasAadhaar && !hasVoterId) {
          if (st.aadhaar?.frontUrl && !st.aadhaar?.backUrl) {
            missingForTraveler.push('Aadhaar Back Side missing');
          } else {
            missingForTraveler.push('Primary Government ID (Aadhaar Card Front & Back OR Voter ID Card)');
          }
        }

        if (pkg.requiresPassport && !st.passport?.documentUrl) {
          missingForTraveler.push('Passport (Photo/Information Page)');
        }
        if (
          pkg.requiresEmergencyContact &&
          (!st.emergencyContact?.name || !st.emergencyContact?.phone)
        ) {
          missingForTraveler.push('Emergency Contact');
        }

        if (missingForTraveler.length > 0) {
          missingRequirements.push(`${st.fullName}: ${missingForTraveler.join(', ')}`);
        }
      }

      if (missingRequirements.length > 0) {
        throw new BadRequestError(
          `Complete your Travel Profile before booking. Every traveler must have either an Aadhaar Card (Front & Back) or Voter ID Card uploaded. Missing for: ${missingRequirements.join(
            '; '
          )}`
        );
      }

      resolvedTravelerIds = savedTravelers.map((t) => t._id as mongoose.Types.ObjectId);
      count = savedTravelers.length;

      const calcAge = (dob: Date) => {
        if (!dob) return 28;
        const diff = Date.now() - new Date(dob).getTime();
        return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
      };

      formattedTravelers = savedTravelers.map((st, idx) => ({
        id: `trv-${idx + 1}`,
        name: st.fullName,
        age: calcAge(st.dob),
        gender: st.gender === 'female' ? 'Female' : st.gender === 'other' ? 'Other' : 'Male',
        passportNumber: st.passport?.number || '',
        phone: st.phone || (st.relationship === 'self' ? leadTraveler.phone : ''),
        email: st.email || (st.relationship === 'self' ? leadTraveler.email : ''),
        isPrimary: st.relationship === 'self' || idx === 0,
      }));
    } else {
      count = Math.max(1, travelers && travelers.length > 0 ? travelers.length : 1);
      formattedTravelers = (travelers || []).map((t, idx) => ({
        id: `trv-${idx + 1}`,
        name: t.name,
        age: t.age || 28,
        gender: t.gender || 'Male',
        passportNumber: t.passportNumber || '',
        phone: t.phone || (t.isPrimary ? leadTraveler.phone : ''),
        email: t.email || (t.isPrimary ? leadTraveler.email : ''),
        isPrimary: Boolean(t.isPrimary),
      }));
    }

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

    // Resolve or Auto-create Departure
    let dep: any = null;
    if (input.departureId) {
      if (mongoose.Types.ObjectId.isValid(input.departureId)) {
        dep = await DepartureModel.findById(input.departureId);
      }
      if (!dep) {
        dep = await DepartureModel.findOne({ departureId: input.departureId });
      }
    }
    if (!dep) {
      const dayStart = new Date(startDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(startDate);
      dayEnd.setHours(23, 59, 59, 999);

      const bookingPackageIds: any[] = [pkg._id];
      if (mongoose.Types.ObjectId.isValid(pkg._id)) {
        bookingPackageIds.push(new mongoose.Types.ObjectId(pkg._id.toString()));
        bookingPackageIds.push(pkg._id.toString());
      }
      if (pkg.packageId) {
        bookingPackageIds.push(pkg.packageId);
      }

      dep = await DepartureModel.findOne({
        packageId: { $in: bookingPackageIds },
        departureDate: { $gte: dayStart, $lte: dayEnd },
      });
    }

    if (!dep) {
      logger.warn(`Departure resolution failed: no active scheduled departure found for package ${pkg._id} on date ${startDate}`);
      throw new BadRequestError('This departure is no longer available.');
    }

    // Capacity checks
    const remainingSeats = Math.max(0, (dep.capacity || 0) - (dep.bookedSeats || 0));
    if (remainingSeats < count) {
      throw new BadRequestError('This departure is no longer available.');
    }

    if (dep.status === 'SOLDOUT' || dep.status === 'BOOKING_CLOSED' || dep.status === 'COMPLETED' || dep.isManualClosed) {
      throw new BadRequestError('This departure is no longer available.');
    }

    const newBookingId = this.generateBookingId();

    const booking = await BookingModel.create({
      bookingId: newBookingId,
      userId: new mongoose.Types.ObjectId(userId),
      agencyId: pkg.agencyId || undefined,
      packageId: pkg._id,
      departureId: dep._id,
      travelerIds: resolvedTravelerIds,
      packageName: pkg.title,
      packageThumbnail: pkg.coverImage || pkg.featuredImage || '',
      agencyName: pkg.agencyName || 'Partner Agency',
      agencyLogo: pkg.agencyLogo || '',
      customerName: leadTraveler.fullName || user.fullName,
      customerEmail: leadTraveler.email || user.email,
      customerPhone: leadTraveler.phone || user.phone,
      customerAvatar: user.avatar || '',
      bookingType: count === 1 ? 'Solo' : count === 2 ? 'Couple' : 'Group',
      emergencyContact: {
        name: leadTraveler.fullName,
        phone: leadTraveler.phone,
        relationship: 'Primary Contact',
      },
      address: leadTraveler.address || '',
      pickupPreference: input.pickupPoint || 'Standard Pickup',
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

    // Pre-create Razorpay order for fast checkout
    let razorpayOrder = null;
    try {
      razorpayOrder = await paymentService.createOrder(userId, { bookingId: newBookingId });
    } catch (orderErr: any) {
      logger.warn('Failed to pre-create Razorpay order during checkout: %s', orderErr.message);
    }

    return {
      bookingId: newBookingId,
      booking,
      razorpayOrder,
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
   * Verify & Complete Payment with HMAC SHA256 Signature Verification
   */
  public async verifyAndConfirmBooking(userId: string, payload: {
    bookingId: string;
    paymentId?: string;
    razorpayPaymentId?: string;
    razorpayOrderId?: string;
    razorpaySignature?: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) {
    const orderId = payload.razorpayOrderId || payload.razorpay_order_id;
    const paymentId = payload.razorpayPaymentId || payload.razorpay_payment_id || payload.paymentId;
    const signature = payload.razorpaySignature || payload.razorpay_signature;

    if (!orderId || !paymentId || !signature) {
      throw new BadRequestError(
        'Razorpay order ID, payment ID, and HMAC SHA256 signature are strictly required for payment verification.'
      );
    }

    return await paymentService.verifyPayment(userId, {
      bookingId: payload.bookingId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    });
  }

  /**
   * List Customer's Bookings
   */
  public async getCustomerBookings(userId: string) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const [bookings, carBookings] = await Promise.all([
      BookingModel.find({
        userId: userObjectId,
        isDeleted: false,
      })
        .sort({ createdAt: -1 })
        .lean(),
      CarBookingModel.find({
        $or: [{ customerId: userObjectId }, { customerId: userId }],
        isDeleted: { $ne: true },
      })
        .populate('carId')
        .populate('agencyId')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    const formattedTours = bookings.map((b: any) => {
      const departure = new Date(b.tripStartDate);
      const now = new Date();
      const diffDays = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        id: b.bookingId,
        _id: b._id.toString(),
        bookingId: b.bookingId,
        bookingType: 'PACKAGE',
        serviceType: 'PACKAGE',
        packageName: b.packageName,
        coverImage: b.packageThumbnail || '',
        agencyName: b.agencyName,
        bookingStatus: b.status === 'CONFIRMED' ? 'Confirmed' : b.status,
        paymentStatus: b.paymentStatus === 'PAID' ? 'Paid' : b.paymentStatus,
        departureDate: departure.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        countdownDays: Math.max(0, diffDays),
        totalAmount: b.totalAmount,
        travelersCount: b.travelersCount,
        associatedTripId: b.bookingId,
        createdAt: b.createdAt,
      };
    });

    const formattedCars = carBookings.map((cb: any) => {
      const departure = new Date(cb.startDate);
      const now = new Date();
      const diffDays = Math.ceil((departure.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const carObj = cb.carId as any;
      const agencyObj = cb.agencyId as any;
      const isRental =
        cb.serviceType === 'SELF_DRIVE_RENTAL' ||
        cb.serviceType === 'self_drive_car' ||
        cb.serviceType === 'self_drive_bike';
      const carName = carObj?.name ? `${carObj?.brand || ''} ${carObj?.name}`.trim() : (cb.vehicleModel || 'Rental Vehicle');

      return {
        id: cb.bookingId,
        _id: cb._id.toString(),
        bookingId: cb.bookingId,
        bookingType: isRental ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING',
        serviceType: cb.serviceType || (isRental ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING'),
        packageName: `${carName} (${isRental ? 'Self-Drive' : 'Route Booking'})`,
        coverImage: carObj?.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
        agencyName: agencyObj?.businessName || agencyObj?.name || 'Car Rental Partner',
        bookingStatus: cb.bookingStatus === 'CONFIRMED' ? 'Confirmed' : (cb.bookingStatus === 'ACCEPTED' ? 'Trip Ready' : cb.bookingStatus),
        paymentStatus: cb.paymentStatus,
        departureDate: departure.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        countdownDays: Math.max(0, diffDays),
        totalAmount: cb.totalAmount,
        travelersCount: cb.passengersCount || 1,
        associatedTripId: `CAR-${cb.bookingId}`,
        createdAt: cb.createdAt,
      };
    });

    return [...formattedTours, ...formattedCars].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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

    if (booking) {
      if (booking.packageId) {
        const pkgDoc: any = await PackageModel.findById(booking.packageId).select('whatsappGroupLink').lean();
        if (pkgDoc?.whatsappGroupLink) {
          (booking as any).whatsappGroupLink = pkgDoc.whatsappGroupLink;
        }
      }
      return booking;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const carBooking = await CarBookingModel.findOne({
      $or: [
        { bookingId: bookingIdentifier },
        ...(mongoose.Types.ObjectId.isValid(bookingIdentifier) ? [{ _id: bookingIdentifier }] : []),
      ],
      $and: [
        {
          $or: [{ customerId: userObjectId }, { customerId: userId }],
        },
      ],
      isDeleted: { $ne: true },
    })
      .populate('carId')
      .populate('agencyId')
      .lean();

    if (!carBooking) {
      throw new NotFoundError(`Booking "${bookingIdentifier}" not found or unauthorized`);
    }

    const carObj = carBooking.carId as any;
    const agencyObj = carBooking.agencyId as any;
    const isRental =
      carBooking.serviceType === 'SELF_DRIVE_RENTAL' ||
      carBooking.serviceType === 'self_drive_car' ||
      carBooking.serviceType === 'self_drive_bike';

    return {
      id: carBooking.bookingId,
      _id: carBooking._id.toString(),
      bookingId: carBooking.bookingId,
      bookingType: isRental ? 'SELF_DRIVE_RENTAL' : 'ROUTE_BOOKING',
      serviceType: carBooking.serviceType,
      packageName: carBooking.vehicleModel || carObj?.name || 'Rental Vehicle',
      packageThumbnail: carObj?.images?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800',
      agencyName: agencyObj?.businessName || agencyObj?.name || 'Car Rental Partner',
      agencyPhone: agencyObj?.phone || '',
      agencyLogo: agencyObj?.logo || '',
      customerName: carBooking.customerName,
      customerEmail: carBooking.customerEmail,
      customerPhone: carBooking.customerPhone,
      travelersCount: carBooking.passengersCount || 1,
      totalAmount: carBooking.totalAmount,
      paidAmount: carBooking.depositPaid || (carBooking.paymentStatus === 'FULL_PAID' ? carBooking.totalAmount : 0),
      remainingAmount: carBooking.remainingAmount || 0,
      bookingStatus: carBooking.bookingStatus,
      paymentStatus: carBooking.paymentStatus,
      departureDate: carBooking.startDate ? new Date(carBooking.startDate).toLocaleDateString() : 'Upcoming',
      returnDate: carBooking.endDate ? new Date(carBooking.endDate).toLocaleDateString() : '',
      pickupTime: carBooking.pickupTime || '10:00 AM',
      pickupLocation: carBooking.pickupLocation,
      dropLocation: carBooking.dropLocation,
      driverId: carBooking.driverId,
      driverName: carBooking.driverName || '',
      driverPhone: carBooking.driverPhone || '',
      driverPhoto: carBooking.driverPhoto || '',
      driverLicense: carBooking.driverLicense || '',
      vehicleNumber: carBooking.vehicleNumber || carObj?.registrationNumber || 'Commercial Fleet',
      vehicleModel: carBooking.vehicleModel || carObj?.name || 'Rental Vehicle',
      timeline: carBooking.timeline || [],
      isCarRental: true,
      canCancel: carBooking.bookingStatus !== 'COMPLETED' && carBooking.bookingStatus !== 'CANCELLED',
    };
  }
}

export const bookingService = new BookingService();
