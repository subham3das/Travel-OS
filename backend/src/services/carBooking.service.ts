import mongoose from 'mongoose';
import { CarModel } from '../models/car.model.js';
import { VehicleRouteModel } from '../models/vehicleRoute.model.js';
import { CarBookingModel, ICarBooking, CarBookingStatus } from '../models/carBooking.model.js';
import { CarReviewModel } from '../models/carReview.model.js';
import { ConversationModel } from '../models/conversation.model.js';
import { MessageModel } from '../models/message.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { socketService } from './socket.service.js';
import { rentalPricingService } from './rentalPricing.service.js';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface CreateBookingDTO {
  carId: string;
  routeId?: string;
  tripType: 'one_way' | 'round_trip' | 'hourly' | 'full_day' | 'multi_day';
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropLocation: string;
  pickupTime: string;
  passengersCount: number;
  specialNotes?: string;
  paymentType: 'full' | 'deposit';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  address?: string;
  gender?: string;
  age?: number;
}

export interface PayBookingDTO {
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'pay_on_pickup';
  transactionId?: string;
}

export interface CreateRentalBookingDTO {
  carId: string;
  pickupDateTime: string;
  returnDateTime: string;
  pickupLocation: string;
  dropLocation?: string;
  paymentType?: 'full' | 'deposit';
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  specialNotes?: string;
  emergencyContact?: { name: string; phone: string; relationship?: string };
  address?: string;
  gender?: string;
  age?: number;
}

export interface RentalCheckInDTO {
  odometerStart: number;
  fuelStatusStart: string;
  notes?: string;
}

export interface RentalCheckOutDTO {
  odometerEnd: number;
  fuelStatusEnd: string;
  damageFee?: number;
  damageNotes?: string;
  fuelDifferenceFee?: number;
}

function getBookingFilter(bookingIdOrDocId: string, additional: Record<string, any> = {}) {
  const filter: Record<string, any> = { isDeleted: { $ne: true }, ...additional };
  if (mongoose.Types.ObjectId.isValid(bookingIdOrDocId) && bookingIdOrDocId.length === 24) {
    filter.$or = [{ bookingId: bookingIdOrDocId }, { _id: new mongoose.Types.ObjectId(bookingIdOrDocId) }];
  } else {
    filter.bookingId = bookingIdOrDocId;
  }
  return filter;
}

export class CarBookingService {
  /**
   * 1. Create initial booking record in PENDING_PAYMENT status
   */
  public async createBooking(customerId: string, data: CreateBookingDTO) {
    if (!mongoose.Types.ObjectId.isValid(data.carId)) {
      throw new BadRequestError('Invalid car ID');
    }

    const car = await CarModel.findOne({ _id: data.carId, isActive: true });
    if (!car) {
      throw new NotFoundError('Car not found');
    }

    const start = new Date(data.startDate);
    const end = (data.tripType === 'multi_day' || data.tripType === 'round_trip') ? new Date(data.endDate) : new Date(data.startDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestError('Invalid travel dates');
    }

    // Route Booking pricing is strictly managed per route (Phases 7, 8, 9)
    let fixedPrice: number | undefined;
    let matchedRouteId: mongoose.Types.ObjectId | undefined;
    let matchedRouteObj: any;

    if (data.routeId && mongoose.Types.ObjectId.isValid(data.routeId)) {
      matchedRouteObj = await VehicleRouteModel.findOne({
        _id: new mongoose.Types.ObjectId(data.routeId),
        vehicleId: car._id,
        status: { $ne: 'disabled' },
      }).lean();

      if (!matchedRouteObj && Array.isArray(car.routes)) {
        matchedRouteObj = car.routes.find((r: any) => r._id?.toString() === data.routeId && r.status !== 'disabled');
      }

      if (matchedRouteObj) {
        matchedRouteId = matchedRouteObj._id;
        fixedPrice = data.tripType === 'round_trip' && matchedRouteObj.pricing?.roundTripPrice
          ? matchedRouteObj.pricing.roundTripPrice
          : (matchedRouteObj.pricing?.oneWayPrice || matchedRouteObj.price);
      }
    }

    if (!matchedRouteObj && data.pickupLocation && data.dropLocation) {
      const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      matchedRouteObj = await VehicleRouteModel.findOne({
        vehicleId: car._id,
        status: 'active',
        pickup: new RegExp(`^${escapeRegExp(data.pickupLocation.trim())}$`, 'i'),
        destination: new RegExp(`^${escapeRegExp(data.dropLocation.trim())}$`, 'i'),
      }).lean();

      if (!matchedRouteObj && Array.isArray(car.routes) && car.routes.length > 0) {
        matchedRouteObj = car.routes.find((r: any) => {
          if (r.status === 'disabled' || r.status === 'archived') return false;
          const pMatch = new RegExp(escapeRegExp(data.pickupLocation.trim()), 'i').test(r.pickup);
          const dMatch = new RegExp(escapeRegExp(data.dropLocation.trim()), 'i').test(r.destination);
          return pMatch && dMatch;
        });
      }

      if (matchedRouteObj) {
        matchedRouteId = matchedRouteObj._id;
        fixedPrice = data.tripType === 'round_trip' && matchedRouteObj.pricing?.roundTripPrice
          ? matchedRouteObj.pricing.roundTripPrice
          : (matchedRouteObj.pricing?.oneWayPrice || matchedRouteObj.price);
      }
    }

    if (!matchedRouteObj && (car.serviceType === 'ROUTE_BOOKING' || car.serviceType === 'driver_booking')) {
      throw new BadRequestError('A valid route must be selected for Route Booking. Please select a configured route.');
    }

    if (matchedRouteId) {
      VehicleRouteModel.updateOne({ _id: matchedRouteId }, { $inc: { totalBookings: 1 } }).exec();
    }

    let priceToCharge: number;
    if (fixedPrice !== undefined) {
      priceToCharge = fixedPrice;
    } else {
      priceToCharge = car.dailyPrice || 1500;
    }
    const baseAmount = priceToCharge;
    const taxesAmount = 0; // Route prices are all-inclusive fixed rates
    const totalAmount = baseAmount;

    let depositPaid = 0;
    let remainingAmount = 0;

    // Advance token payment (default ₹300 or fixed deposit)
    const tokenAdvance = car.fixedDepositAmount || 300;

    if (data.paymentType === 'deposit') {
      depositPaid = Math.min(tokenAdvance, totalAmount);
      remainingAmount = Math.max(0, totalAmount - depositPaid);
    } else {
      depositPaid = totalAmount;
      remainingAmount = 0;
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `CRB-${new Date().getFullYear()}-${randomSuffix}`;

    let cName = data.customerName;
    let cEmail = data.customerEmail;
    let cPhone = data.customerPhone;

    if (!cName || !cEmail) {
      const user = await mongoose.model('User').findById(customerId).lean() as any;
      if (user) {
        cName = cName || user.fullName || user.displayName || user.name || 'Traveler';
        cEmail = cEmail || user.email || 'traveler@apnatrip.in';
        cPhone = cPhone || user.phone || user.phoneNumber || '+91 99999 99999';
      }
    }

    const booking = await CarBookingModel.create({
      bookingId,
      carId: car._id,
      agencyId: car.agencyId,
      customerId: new mongoose.Types.ObjectId(customerId),
      routeId: matchedRouteId,
      tripType: data.tripType,
      startDate: start,
      endDate: end,
      totalDays: 1,
      pickupLocation: data.pickupLocation,
      dropLocation: data.dropLocation,
      pickupTime: data.pickupTime || '10:00 AM',
      passengersCount: Number(data.passengersCount) || 4,
      specialNotes: data.specialNotes || '',
      customerName: cName || 'Traveler',
      customerEmail: cEmail || 'traveler@apnatrip.in',
      customerPhone: cPhone || '+91 99999 99999',
      dailyRate: priceToCharge,
      fixedPrice: priceToCharge,
      baseAmount,
      taxesAmount,
      totalAmount,
      serviceType: 'ROUTE_BOOKING',
      emergencyContact: data.emergencyContact,
      address: data.address,
      gender: data.gender,
      age: data.age,
      isDeleted: false,
      timeline: [
        {
          id: `step-created-${Date.now()}`,
          title: 'Booking Created',
          subtitle: `Booking Reference #${bookingId}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'calendar',
        },
        {
          id: `step-paid-${Date.now()}`,
          title: 'Payment',
          subtitle: data.paymentType === 'deposit' ? `₹${depositPaid} Advance Deposit` : `₹${totalAmount} Full Payment`,
          timestamp: 'Pending',
          status: 'current',
          iconType: 'credit-card',
        },
        {
          id: `step-confirmed-${Date.now()}`,
          title: 'Agency Confirmation',
          subtitle: 'Awaiting agency driver assignment',
          timestamp: 'Upcoming',
          status: 'upcoming',
          iconType: 'check-circle',
        },
        {
          id: `step-driver-${Date.now()}`,
          title: 'Driver Assignment',
          subtitle: 'Driver details dispatch',
          timestamp: 'Upcoming',
          status: 'upcoming',
          iconType: 'car',
        },
        {
          id: `step-trip-${Date.now()}`,
          title: 'Trip Completed',
          subtitle: 'Destination arrival',
          timestamp: 'Scheduled',
          status: 'upcoming',
          iconType: 'flag',
        },
      ],
      paymentType: data.paymentType,
      depositPaid,
      remainingAmount,
      paymentStatus: 'PENDING',
      bookingStatus: 'PENDING_PAYMENT',
    });

    return booking;
  }

  /**
   * 2. Confirm payment (Deposit or Full) and transition to REQUESTED
   * Automatically initializes conversation between Customer and Car Owner
   */
  public async payBooking(customerId: string, bookingIdOrDocId: string, payment: PayBookingDTO) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { customerId: new mongoose.Types.ObjectId(customerId) })
    );

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.bookingStatus !== 'PENDING_PAYMENT') {
      throw new BadRequestError(`Booking is already ${booking.bookingStatus.toLowerCase()}`);
    }

    const car = await CarModel.findById(booking.carId);
    const carName = car ? car.name : 'Rental Vehicle';

    booking.paymentMethod = payment.paymentMethod || 'upi';
    booking.transactionId = payment.transactionId || `TXN-${Date.now()}`;
    booking.paymentStatus = booking.paymentType === 'full' ? 'FULL_PAID' : 'DEPOSIT_PAID';
    booking.bookingStatus = 'REQUESTED';

    // ── Auto-create or link unified Chat Conversation ──
    try {
      let conversation = await ConversationModel.findOne({
        agencyId: booking.agencyId,
        customerId: booking.customerId,
        conversationType: 'CAR_RENTAL',
        isDeleted: false,
      });

      const initialMessageText = `🚗 Booking requested for ${carName} (${booking.startDate.toISOString().split('T')[0]} to ${booking.endDate.toISOString().split('T')[0]}). Pickup: ${booking.pickupLocation}. Total: ₹${booking.totalAmount.toLocaleString()} (${booking.paymentType === 'deposit' ? `Deposit Paid: ₹${booking.depositPaid.toLocaleString()}, Remaining: ₹${booking.remainingAmount.toLocaleString()}` : 'Fully Paid'}). Let's discuss pickup timing and special requirements.`;

      if (!conversation) {
        conversation = await ConversationModel.create({
          agencyId: booking.agencyId,
          customerId: booking.customerId,
          carBookingId: booking._id,
          carId: booking.carId,
          conversationType: 'CAR_RENTAL',
          businessType: 'car_rental',
          lastMessagePreview: initialMessageText,
          lastMessageAt: new Date(),
          lastSender: 'customer',
          unreadAgencyCount: 1,
          unreadCustomerCount: 0,
        });
      } else {
        conversation.carBookingId = booking._id;
        conversation.carId = booking.carId;
        conversation.conversationType = 'CAR_RENTAL';
        conversation.businessType = 'car_rental';
        conversation.lastMessagePreview = initialMessageText;
        conversation.lastMessageAt = new Date();
        conversation.lastSender = 'customer';
        conversation.unreadAgencyCount += 1;
        await conversation.save();
      }

      // Record first message in message thread
      await MessageModel.create({
        conversationId: conversation._id,
        senderType: 'customer',
        senderId: booking.customerId,
        receiverId: booking.agencyId,
        text: initialMessageText,
        messageType: 'text',
        status: 'sent',
      });

      booking.conversationId = conversation._id;
    } catch (err) {
      logger.error('Failed to auto-create conversation for car booking', err);
    }

    await booking.save();

    // ── Create Backend Notification for Car Owner / Agency ──
    try {
      await NotificationModel.create({
        recipientType: 'AGENCY',
        agencyId: booking.agencyId,
        category: 'Bookings',
        title: `New Car Booking Request (${booking.bookingId})`,
        description: `${booking.customerName} requested ${carName} for ${booking.totalDays} day(s). ${booking.paymentType === 'deposit' ? `Deposit of ₹${booking.depositPaid} paid.` : 'Full payment received.'}`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/agency/car-bookings',
        relatedEntityType: 'CarBooking',
        relatedEntityId: booking.bookingId,
        relatedEntityName: carName,
        metadata: {
          bookingId: booking.bookingId,
          carId: booking.carId.toString(),
          depositPaid: booking.depositPaid,
          totalAmount: booking.totalAmount,
        },
      });

      // Push real-time event if socket is available
      socketService.emitToUser(customerId, 'current_trip_updated', {
        bookingId: booking.bookingId,
        type: 'car_rental',
      });
      socketService.emitToAgency(booking.agencyId.toString(), 'new_booking_request', {
        bookingId: booking.bookingId,
        carName,
        customerName: booking.customerName,
        totalAmount: booking.totalAmount,
        depositPaid: booking.depositPaid,
      });
    } catch (err) {
      logger.error('Failed to create agency notification', err);
    }

    return booking.populate([
      { path: 'carId' },
      { path: 'agencyId', select: 'name businessName logo email phone isVerified' },
    ]);
  }

  /**
   * 3. Get customer bookings
   */
  public async getCustomerBookings(customerId: string) {
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    return CarBookingModel.find({
      $or: [{ customerId: customerObjectId }, { customerId }],
      isDeleted: { $ne: true },
    })
      .populate('carId')
      .populate('agencyId', 'name businessName logo email phone isVerified')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 4. Get booking details & receipt payload
   */
  public async getBookingById(userId: string, bookingIdOrDocId: string) {
    const booking = await CarBookingModel.findOne(getBookingFilter(bookingIdOrDocId))
      .populate('carId')
      .populate('agencyId', 'name businessName logo email phone isVerified city')
      .populate('customerId', 'name email phone avatar')
      .lean();

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Verify access
    const isCustomer = booking.customerId?._id?.toString() === userId || booking.customerId?.toString() === userId;
    const isAgency = booking.agencyId?._id?.toString() === userId || booking.agencyId?.toString() === userId;

    if (!isCustomer && !isAgency) {
      throw new ForbiddenError('Unauthorized to view this booking');
    }

    const qrData = JSON.stringify({
      bookingId: booking.bookingId,
      car: (booking.carId as any)?.name,
      customer: booking.customerName,
      dates: `${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}`,
      status: booking.bookingStatus,
      depositPaid: booking.depositPaid,
      remainingAmount: booking.remainingAmount,
    });

    const carObj = booking.carId as any;
    const agencyObj = booking.agencyId as any;

    return {
      ...booking,
      qrData,
      agencyName: agencyObj?.businessName || agencyObj?.name || 'Car Rental Agency',
      agencyContactNumber: agencyObj?.phone || '',
      agencyPhone: agencyObj?.phone || '',
      vehicleNumber: booking.vehicleNumber || carObj?.registrationNumber || 'Commercial Fleet',
      vehicleModel: booking.vehicleModel || (carObj ? `${carObj.brand} ${carObj.name}` : 'Rental Vehicle'),
      driverName: booking.driverName || carObj?.driver?.name || '',
      driverPhone: booking.driverPhone || carObj?.driver?.phone || '',
      driverPhoto: booking.driverPhoto || carObj?.driver?.photo || '',
      driverLicense: booking.driverLicense || carObj?.driver?.licenseNumber || '',
    };
  }

  /**
   * 5. Agency: List incoming bookings
   */
  public async agencyGetBookings(agencyId: string, status?: string) {
    const filter: Record<string, any> = {
      agencyId: new mongoose.Types.ObjectId(agencyId),
      isDeleted: { $ne: true },
    };

    if (status && status !== 'ALL') {
      filter.bookingStatus = status;
    }

    return CarBookingModel.find(filter)
      .populate('carId')
      .populate('customerId', 'name email phone avatar')
      .sort({ createdAt: -1 })
      .lean();
  }

  /**
   * 6. Agency: Update status (Accept, Reject, Mark Completed)
   */
  public async agencyUpdateStatus(
    agencyId: string,
    bookingIdOrDocId: string,
    status: CarBookingStatus,
    rejectionReason?: string
  ) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { agencyId: new mongoose.Types.ObjectId(agencyId) })
    );

    if (!booking) {
      throw new NotFoundError('Booking not found or unauthorized');
    }

    if (booking.bookingStatus === status) {
      return booking;
    }

    const validTransitions: Record<string, CarBookingStatus[]> = {
      PENDING: ['CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      CONFIRMED: ['COMPLETED', 'CANCELLED'],
      REQUESTED: ['CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      PENDING_PAYMENT: ['CONFIRMED', 'ACCEPTED', 'REJECTED', 'CANCELLED'],
      ACCEPTED: ['CONFIRMED', 'COMPLETED', 'CANCELLED'],
    };

    const allowed = validTransitions[booking.bookingStatus];
    if (allowed && !allowed.includes(status)) {
      throw new BadRequestError(`Cannot transition booking from ${booking.bookingStatus} to ${status}`);
    }

    booking.bookingStatus = status;
    if (status === 'REJECTED') {
      booking.rejectionReason = rejectionReason || 'Unavailable for requested dates';
      booking.paymentStatus = 'REFUNDED';
    } else if (status === 'COMPLETED') {
      booking.completedAt = new Date();
    }

    await booking.save();

    // Notify Customer
    try {
      await NotificationModel.create({
        recipientType: 'USER',
        recipientId: booking.customerId,
        category: 'Bookings',
        title: `Car Booking ${status === 'ACCEPTED' ? 'Confirmed! 🎉' : status === 'REJECTED' ? 'Declined' : 'Completed'}`,
        description: `Your booking (${booking.bookingId}) has been ${status.toLowerCase()}${status === 'REJECTED' && rejectionReason ? `: ${rejectionReason}` : '.'}`,
        priority: status === 'ACCEPTED' ? 'HIGH' : 'MEDIUM',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: `/car-rental/receipt/${booking.bookingId}`,
        relatedEntityType: 'CarBooking',
        relatedEntityId: booking.bookingId,
      });

      socketService.emitToUser(booking.customerId.toString(), 'booking_status_updated', {
        bookingId: booking.bookingId,
        status,
      });
    } catch (err) {
      logger.error('Failed to notify customer on booking status update', err);
    }

    return booking;
  }

  /**
   * 7. Customer: Cancel booking
   */
  public async cancelBooking(customerId: string, bookingIdOrDocId: string) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { customerId: new mongoose.Types.ObjectId(customerId) })
    );

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.bookingStatus === 'COMPLETED' || booking.bookingStatus === 'CANCELLED') {
      throw new BadRequestError(`Cannot cancel a booking that is ${booking.bookingStatus.toLowerCase()}`);
    }

    booking.bookingStatus = 'CANCELLED';
    booking.cancelledAt = new Date();
    booking.paymentStatus = 'REFUNDED';
    await booking.save();

    // Notify Agency
    try {
      await NotificationModel.create({
        recipientType: 'AGENCY',
        agencyId: booking.agencyId,
        category: 'Bookings',
        title: `Car Booking Cancelled (${booking.bookingId})`,
        description: `Customer ${booking.customerName} cancelled their booking.`,
        priority: 'MEDIUM',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: '/agency/car-bookings',
      });
    } catch (err) {
      logger.error('Failed to notify agency of cancellation', err);
    }

    return booking;
  }

  /**
   * 8. Customer: Submit review for COMPLETED booking
   */
  public async submitReview(
    customerId: string,
    bookingIdOrDocId: string,
    reviewData: { rating: number; comment: string; photos?: string[] }
  ) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { customerId: new mongoose.Types.ObjectId(customerId) })
    );

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (booking.bookingStatus !== 'COMPLETED') {
      throw new BadRequestError('Only completed trips can be reviewed');
    }

    const existing = await CarReviewModel.findOne({ bookingId: booking._id });
    if (existing) {
      throw new BadRequestError('You have already submitted a review for this booking');
    }

    const review = await CarReviewModel.create({
      carId: booking.carId,
      bookingId: booking._id,
      customerId: booking.customerId,
      customerName: booking.customerName,
      rating: Math.min(5, Math.max(1, Number(reviewData.rating) || 5)),
      comment: reviewData.comment,
      photos: reviewData.photos || [],
    });

    // Recalculate average rating & reviews count on CarModel
    try {
      const stats = await CarReviewModel.aggregate([
        { $match: { carId: booking.carId, isDeleted: false } },
        {
          $group: {
            _id: '$carId',
            averageRating: { $avg: '$rating' },
            reviewsCount: { $sum: 1 },
          },
        },
      ]);

      if (stats.length > 0) {
        await CarModel.findByIdAndUpdate(booking.carId, {
          averageRating: Math.round(stats[0].averageRating * 10) / 10,
          reviewsCount: stats[0].reviewsCount,
        });
      }
    } catch (err) {
      logger.error('Failed to recalculate car average rating', err);
    }

    return review;
  }

  /**
   * 9. Check if a vehicle is available for a given window
   */
  public async checkVehicleAvailability(carId: string, pickupDateTime: Date | string, returnDateTime: Date | string): Promise<boolean> {
    const pickup = new Date(pickupDateTime);
    const drop = new Date(returnDateTime);

    if (isNaN(pickup.getTime()) || isNaN(drop.getTime()) || drop <= pickup) {
      return false;
    }

    const conflict = await CarBookingModel.findOne({
      carId: new mongoose.Types.ObjectId(carId),
      bookingStatus: { $in: ['PENDING_PAYMENT', 'REQUESTED', 'ACCEPTED'] },
      isDeleted: false,
      startDate: { $lt: drop },
      endDate: { $gt: pickup },
    });

    if (conflict) return false;

    // Check bookedSlots on CarModel
    const car = await CarModel.findById(carId).select('bookedSlots').lean();
    if (car && Array.isArray(car.bookedSlots)) {
      const slotOverlap = car.bookedSlots.some((slot) => {
        const s = new Date(slot.startDate).getTime();
        const e = new Date(slot.endDate).getTime();
        return s < drop.getTime() && e > pickup.getTime();
      });
      if (slotOverlap) return false;
    }

    return true;
  }

  /**
   * 10. Create Self-Drive Rental Booking (Car or Bike)
   * Calculates pricing strictly on backend via rentalPricingService
   */
  public async createRentalBooking(customerId: string, data: CreateRentalBookingDTO) {
    if (!mongoose.Types.ObjectId.isValid(data.carId)) {
      throw new BadRequestError('Invalid vehicle ID');
    }

    const car = await CarModel.findOne({ _id: data.carId, isActive: true });
    if (!car) {
      throw new NotFoundError('Vehicle not found');
    }

    const pickup = new Date(data.pickupDateTime);
    const drop = new Date(data.returnDateTime);

    if (isNaN(pickup.getTime()) || isNaN(drop.getTime()) || drop <= pickup) {
      throw new BadRequestError('Invalid rental pickup or return date & time');
    }

    // Availability validation (Double-booking prevention)
    const isAvailable = await this.checkVehicleAvailability(data.carId, pickup, drop);
    if (!isAvailable) {
      throw new BadRequestError('Vehicle is not available for the selected dates. Please select other dates.');
    }

    // Quote pricing on backend
    const quote = rentalPricingService.calculateQuote({
      pickupDateTime: pickup,
      returnDateTime: drop,
      rentalPricing: car.rentalPricing,
      rentalPolicies: car.rentalPolicies,
      dailyPriceFallback: car.dailyPrice,
    });

    let cName = data.customerName;
    let cEmail = data.customerEmail;
    let cPhone = data.customerPhone;

    if (!cName || !cEmail) {
      const user = (await mongoose.model('User').findById(customerId).lean()) as any;
      if (user) {
        cName = cName || user.fullName || user.displayName || user.name || 'Traveler';
        cEmail = cEmail || user.email || 'traveler@apnatrip.in';
        cPhone = cPhone || user.phone || user.phoneNumber || '+91 99999 99999';
      }
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `RNT-${new Date().getFullYear()}-${randomSuffix}`;

    const totalAmount = quote.totalRentalAmount;
    const securityDeposit = quote.securityDeposit;
    const totalPayable = quote.totalPayableAtBooking;

    // Advance deposit payment or full payment
    const paymentType = data.paymentType || 'full';
    let depositPaid = 0;
    let remainingAmount = 0;

    if (paymentType === 'deposit') {
      depositPaid = Math.round(securityDeposit + totalAmount * 0.2);
      remainingAmount = Math.max(0, totalPayable - depositPaid);
    } else {
      depositPaid = totalPayable;
      remainingAmount = 0;
    }

    const booking = await CarBookingModel.create({
      bookingId,
      carId: car._id,
      agencyId: car.agencyId,
      customerId: new mongoose.Types.ObjectId(customerId),
      tripType: 'full_day',
      startDate: pickup,
      endDate: drop,
      totalDays: quote.totalDays,
      pickupLocation: data.pickupLocation || car.pickupLocation || car.city,
      dropLocation: data.dropLocation || data.pickupLocation || car.pickupLocation || car.city,
      pickupTime: pickup.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      passengersCount: car.specs?.seats || 2,
      specialNotes: data.specialNotes || '',
      customerName: cName || 'Traveler',
      customerEmail: cEmail || 'traveler@apnatrip.in',
      customerPhone: cPhone || '+91 99999 99999',
      dailyRate: quote.unitRate,
      fixedPrice: totalAmount,
      baseAmount: quote.baseAmount,
      taxesAmount: quote.taxesAmount,
      totalAmount,
      serviceType: car.serviceType || 'self_drive_car',
      vehicleSubCategory: car.vehicleSubCategory || (car.serviceType === 'self_drive_bike' ? 'bike' : 'car'),
      pickupDateTime: pickup,
      returnDateTime: drop,
      rentalDurationHours: quote.durationHours,
      pricingTierApplied: quote.tierApplied,
      securityDeposit,
      securityDepositStatus: 'HELD',
      emergencyContact: data.emergencyContact,
      address: data.address,
      gender: data.gender,
      age: data.age,
      isDeleted: false,
      timeline: [
        {
          id: `step-created-${Date.now()}`,
          title: 'Booking Created',
          subtitle: `Rental Reference #${bookingId}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'calendar',
        },
        {
          id: `step-paid-${Date.now()}`,
          title: 'Payment & Security Deposit',
          subtitle: paymentType === 'deposit' ? `₹${depositPaid} Advance (Deposit included)` : `₹${totalPayable} Full Payment`,
          timestamp: 'Pending',
          status: 'current',
          iconType: 'credit-card',
        },
        {
          id: `step-confirmed-${Date.now()}`,
          title: 'Agency Reservation Confirmed',
          subtitle: 'Vehicle reserved at hub',
          timestamp: 'Upcoming',
          status: 'upcoming',
          iconType: 'check-circle',
        },
        {
          id: `step-checkin-${Date.now()}`,
          title: 'Vehicle Pickup & Inspection',
          subtitle: `Scheduled for ${pickup.toLocaleDateString()}`,
          timestamp: 'Upcoming',
          status: 'upcoming',
          iconType: 'car',
        },
        {
          id: `step-checkout-${Date.now()}`,
          title: 'Vehicle Return & Deposit Refund',
          subtitle: 'Return check-out & deposit release',
          timestamp: 'Scheduled',
          status: 'upcoming',
          iconType: 'flag',
        },
      ],
      paymentType,
      depositPaid,
      remainingAmount,
      paymentStatus: 'PENDING',
      bookingStatus: 'PENDING_PAYMENT',
    });

    // Add to vehicle bookedSlots
    try {
      await CarModel.findByIdAndUpdate(car._id, {
        $push: {
          bookedSlots: {
            startDate: pickup,
            endDate: drop,
            bookingId,
          },
        },
      });
    } catch (err) {
      logger.error('Failed to update vehicle bookedSlots', err);
    }

    return booking;
  }

  /**
   * 11. Provider Check-In (Vehicle Handover to Customer)
   */
  public async rentalPickupCheckIn(agencyId: string, bookingIdOrDocId: string, data: RentalCheckInDTO) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { agencyId: new mongoose.Types.ObjectId(agencyId) })
    );

    if (!booking) {
      throw new NotFoundError('Rental booking not found or unauthorized');
    }

    if (booking.bookingStatus !== 'ACCEPTED' && booking.bookingStatus !== 'REQUESTED') {
      throw new BadRequestError(`Cannot perform check-in on booking with status ${booking.bookingStatus}`);
    }

    booking.odometerStart = Number(data.odometerStart) || 0;
    booking.fuelStatusStart = data.fuelStatusStart || 'Full';
    booking.checkInAt = new Date();
    booking.bookingStatus = 'ACCEPTED';
    if (data.notes) {
      booking.specialNotes = (booking.specialNotes ? booking.specialNotes + ' | ' : '') + `Pickup: ${data.notes}`;
    }

    await booking.save();

    // Customer Notification
    try {
      await NotificationModel.create({
        recipientType: 'CUSTOMER',
        userId: booking.customerId,
        category: 'Bookings',
        title: `Vehicle Picked Up (${booking.bookingId})`,
        description: `Vehicle handover completed. Starting Odometer: ${booking.odometerStart} km, Fuel: ${booking.fuelStatusStart}. Enjoy your ride!`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: `/account/rentals/${booking.bookingId}`,
      });
    } catch (err) {
      logger.error('Failed to create pickup notification', err);
    }

    return booking;
  }

  /**
   * 12. Provider Check-Out & Return Settlement (Calculate Extra KM, Late Fee, Damage & Release Deposit)
   */
  public async rentalReturnCheckOut(agencyId: string, bookingIdOrDocId: string, data: RentalCheckOutDTO) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { agencyId: new mongoose.Types.ObjectId(agencyId) })
    ).populate('carId');

    if (!booking) {
      throw new NotFoundError('Rental booking not found or unauthorized');
    }

    if (booking.bookingStatus !== 'ACCEPTED') {
      throw new BadRequestError(`Vehicle cannot be returned for booking in status ${booking.bookingStatus}`);
    }

    const car = booking.carId as any;
    const scheduledEnd = booking.returnDateTime || booking.endDate;
    const actualEnd = new Date();

    const settlement = rentalPricingService.calculateReturnSettlement({
      securityDeposit: booking.securityDeposit || 0,
      scheduledReturnDateTime: scheduledEnd,
      actualReturnDateTime: actualEnd,
      odometerStart: booking.odometerStart,
      odometerEnd: Number(data.odometerEnd),
      includedKm: (car?.rentalPolicies?.includedKmPerDay || 300) * (booking.totalDays || 1),
      extraKmCharge: car?.rentalPolicies?.extraKmCharge || 12,
      hourlyRate: car?.rentalPricing?.hourlyRate,
      dailyRate: car?.rentalPricing?.dailyRate || booking.dailyRate,
      damageFee: Number(data.damageFee) || 0,
      damageNotes: data.damageNotes,
      fuelDifferenceFee: Number(data.fuelDifferenceFee) || 0,
    });

    booking.odometerEnd = Number(data.odometerEnd);
    booking.fuelStatusEnd = data.fuelStatusEnd || 'Full';
    booking.extraKmFee = settlement.extraKmFee;
    booking.lateFee = settlement.lateFee;
    booking.damageFee = settlement.damageFee;
    booking.damageNotes = data.damageNotes || '';
    booking.securityDepositStatus = settlement.depositStatus;
    booking.securityDepositDeductionAmount = settlement.totalDeductions;
    booking.checkOutAt = actualEnd;
    booking.completedAt = actualEnd;
    booking.bookingStatus = 'COMPLETED';

    await booking.save();

    // Clean up bookedSlots from CarModel
    try {
      await CarModel.findByIdAndUpdate(booking.carId, {
        $pull: { bookedSlots: { bookingId: booking.bookingId } },
      });
    } catch (err) {
      logger.error('Failed to clear bookedSlot for completed rental', err);
    }

    // Customer Notification
    try {
      const depositMsg =
        settlement.refundableDeposit > 0
          ? `Deposit of ₹${settlement.refundableDeposit} released (Deductions: ₹${settlement.totalDeductions}).`
          : `Deposit settled with total deductions ₹${settlement.totalDeductions}.`;

      await NotificationModel.create({
        recipientType: 'CUSTOMER',
        userId: booking.customerId,
        category: 'Bookings',
        title: `Vehicle Returned (${booking.bookingId})`,
        description: `Vehicle return completed successfully. ${depositMsg}`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: `/account/rentals/${booking.bookingId}`,
      });
    } catch (err) {
      logger.error('Failed to notify customer of vehicle return', err);
    }

    return {
      booking,
      settlement,
    };
  }

  /**
   * 13. Settle / Refund Security Deposit
   */
  public async refundSecurityDeposit(
    agencyId: string,
    bookingIdOrDocId: string,
    amount?: number,
    reason?: string
  ) {
    const booking = await CarBookingModel.findOne(
      getBookingFilter(bookingIdOrDocId, { agencyId: new mongoose.Types.ObjectId(agencyId) })
    );

    if (!booking) {
      throw new NotFoundError('Rental booking not found or unauthorized');
    }

    const refundAmount = amount !== undefined ? amount : (booking.securityDeposit || 0);
    booking.securityDepositStatus = refundAmount >= (booking.securityDeposit || 0) ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
    booking.securityDepositRefundId = `DEP-REF-${Date.now()}`;
    if (reason) {
      booking.securityDepositDeductionReason = reason;
    }

    await booking.save();

    // Notify customer
    try {
      await NotificationModel.create({
        recipientType: 'CUSTOMER',
        userId: booking.customerId,
        category: 'Finance',
        title: `Security Deposit Refund Processed (${booking.bookingId})`,
        description: `Your security deposit refund of ₹${refundAmount} has been processed.`,
        priority: 'HIGH',
        status: 'UNREAD',
        isUnread: true,
        targetRoute: `/account/rentals/${booking.bookingId}`,
      });
    } catch (err) {
      logger.error('Failed to notify deposit refund', err);
    }

    return booking;
  }
}

export const carBookingService = new CarBookingService();
