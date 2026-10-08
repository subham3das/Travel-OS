import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { PaymentModel, IPayment } from '../models/payment.model.js';
import { BookingModel } from '../models/booking.model.js';
import { CarBookingModel } from '../models/carBooking.model.js';
import { CarModel } from '../models/car.model.js';
import { InvoiceModel } from '../models/invoice.model.js';
import { DepartureModel } from '../models/departure.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { socketService } from './socket.service.js';
import { mailService } from './mail.service.js';
import { settlementEngineService } from './settlementEngine.service.js';
import { WebhookLogModel } from '../models/webhookLog.model.js';
import { TransferModel } from '../models/transfer.model.js';
import { SettlementModel } from '../models/settlement.model.js';
import { SellerPaymentProfileModel } from '../models/sellerPaymentProfile.model.js';
import { webhookQueueService } from './webhookQueue.service.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors.util.js';

export interface CreateOrderInput {
  bookingId: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentInput {
  bookingId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentFilterOptions {
  status?: string;
  gateway?: string;
  agencyId?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export class PaymentService {
  private razorpayClient: Razorpay | null = null;

  constructor() {
    this.initializeRazorpay();
  }

  private initializeRazorpay(): void {
    if (!envConfig.RAZORPAY_KEY_ID || !envConfig.RAZORPAY_KEY_SECRET) {
      logger.warn('⚠️ Razorpay credentials missing in environment. Razorpay checkout will not function.');
      return;
    }

    try {
      this.razorpayClient = new Razorpay({
        key_id: envConfig.RAZORPAY_KEY_ID,
        key_secret: envConfig.RAZORPAY_KEY_SECRET,
      });
      logger.info('💳 Razorpay SDK initialized successfully with Key ID: %s', envConfig.RAZORPAY_KEY_ID);
    } catch (err: any) {
      logger.error('❌ Failed to initialize Razorpay SDK:', err);
    }
  }

  private getRazorpay(): Razorpay {
    if (!this.razorpayClient) {
      this.initializeRazorpay();
    }
    if (!this.razorpayClient) {
      throw new BadRequestError('Payment gateway is currently unavailable. Please contact support.');
    }
    return this.razorpayClient;
  }

  /**
   * Create Razorpay Order for a Booking
   */
  public async createOrder(userId: string, input: CreateOrderInput) {
    const { bookingId, notes = {} } = input;

    // 1. Fetch Booking and verify ownership
    const booking = await BookingModel.findOne({
      bookingId,
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    });

    if (!booking) {
      const carBooking = await CarBookingModel.findOne({
        bookingId,
        customerId: new mongoose.Types.ObjectId(userId),
        isDeleted: { $ne: true },
      }).populate('carId').populate('agencyId');

      if (!carBooking) {
        throw new NotFoundError(`Booking "${bookingId}" not found or unauthorized.`);
      }

      if (
        (carBooking.bookingStatus === 'CONFIRMED' || carBooking.bookingStatus === 'COMPLETED') &&
        (carBooking.paymentStatus === 'FULL_PAID' ||
          (carBooking.paymentType === 'deposit' && carBooking.paymentStatus === 'DEPOSIT_PAID'))
      ) {
        throw new BadRequestError('This car booking is already paid and confirmed.');
      }

      const car = await CarModel.findOne({ _id: carBooking.carId, isActive: true });
      if (!car) {
        throw new BadRequestError('Vehicle is currently inactive or unavailable.');
      }

      const payableAmount = carBooking.paymentType === 'deposit'
        ? (carBooking.depositPaid || 300)
        : carBooking.totalAmount;
      const amountInPaise = Math.round(payableAmount * 100);

      const existingPayment = await PaymentModel.findOne({
        bookingId: carBooking.bookingId,
        status: 'PENDING',
        orderId: { $exists: true, $ne: '' },
      }).sort({ createdAt: -1 });

      const razorpay = this.getRazorpay();
      let order: any = null;

      if (existingPayment?.orderId) {
        try {
          const fetchedOrder = await razorpay.orders.fetch(existingPayment.orderId);
          if (fetchedOrder && fetchedOrder.status === 'created' && fetchedOrder.amount === amountInPaise) {
            order = fetchedOrder;
            logger.info('♻️ Reusing existing active Razorpay order %s for car booking %s', order.id, bookingId);
          }
        } catch (fetchErr) {
          logger.warn('Could not reuse existing order for car booking: %s', (fetchErr as any).message);
        }
      }

      if (!order) {
        const orderPayload = {
          amount: amountInPaise,
          currency: 'INR',
          receipt: carBooking.bookingId,
          notes: {
            bookingId: carBooking.bookingId,
            bookingType: carBooking.serviceType || 'CAR_BOOKING',
            vehicleModel: carBooking.vehicleModel || (car as any)?.name || 'Car Booking',
            customerEmail: carBooking.customerEmail,
            customerPhone: carBooking.customerPhone,
            ...notes,
          },
        };

        order = await razorpay.orders.create(orderPayload);
        logger.info('✨ Created Razorpay Order %s for car booking %s (₹%d)', order.id, carBooking.bookingId, payableAmount);
      }

      const paymentId = existingPayment?.paymentId || `PAY-${Date.now().toString().slice(-8)}`;
      const agencyObj = carBooking.agencyId as any;

      await PaymentModel.findOneAndUpdate(
        { orderId: order.id },
        {
          paymentId,
          orderId: order.id,
          bookingId: carBooking.bookingId,
          agencyId: carBooking.agencyId?._id || carBooking.agencyId,
          agencyName: agencyObj?.businessName || agencyObj?.name || 'ApnaTrip Car Partner',
          agencyLogo: agencyObj?.logo || '',
          userId: carBooking.customerId,
          userName: carBooking.customerName,
          userEmail: carBooking.customerEmail,
          userPhone: carBooking.customerPhone,
          packageName: carBooking.vehicleModel || (car as any)?.name || 'Car Booking',
          packageThumbnail: (car as any)?.images?.[0] || '',
          destinationCountry: 'India',
          destinationRegion: carBooking.dropLocation || '',
          durationText: `${carBooking.totalDays || 1} Days`,
          amount: payableAmount,
          platformFee: 0,
          gstAmount: 0,
          currency: 'INR',
          gateway: 'Razorpay',
          paymentMethod: 'Razorpay Checkout',
          status: 'PENDING',
          captured: false,
          refunded: false,
          receiptNumber: carBooking.bookingId,
          signatureVerified: false,
          settlementStatus: 'Pending',
          metadata: {
            razorpayOrderId: order.id,
            orderNotes: order.notes,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      return {
        orderId: order.id,
        currency: order.currency || 'INR',
        amount: order.amount,
        key: envConfig.RAZORPAY_KEY_ID,
        bookingReference: carBooking.bookingId,
        packageName: carBooking.vehicleModel || (car as any)?.name || 'Car Booking',
        customer: {
          name: carBooking.customerName,
          email: carBooking.customerEmail,
          phone: carBooking.customerPhone,
        },
      };
    }

    if (booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID') {
      throw new BadRequestError('This booking is already paid and confirmed.');
    }

    // Phase 9: Validate departure availability before proceeding to payment
    let dep: any = null;
    if (booking.departureId) {
      if (mongoose.Types.ObjectId.isValid(booking.departureId)) {
        dep = await DepartureModel.findById(booking.departureId);
      }
      if (!dep) {
        dep = await DepartureModel.findOne({ departureId: String(booking.departureId) });
      }
    }
    if (!dep && booking.packageId) {
      const pkgIds: any[] = [booking.packageId];
      if (mongoose.Types.ObjectId.isValid(booking.packageId)) {
        pkgIds.push(new mongoose.Types.ObjectId(booking.packageId.toString()));
      }
      dep = await DepartureModel.findOne({
        packageId: { $in: pkgIds },
        departureDate: booking.tripStartDate,
      });
    }

    if (dep) {
      const availableSeats = Math.max(0, (dep.capacity || 0) - (dep.bookedSeats || 0));
      const isPast = new Date(dep.departureDate) < new Date();
      const isClosed = dep.status === 'SOLDOUT' || dep.status === 'BOOKING_CLOSED' || dep.status === 'COMPLETED' || dep.isManualClosed;

      if (isPast || isClosed || availableSeats < (booking.travelersCount || 1)) {
        throw new BadRequestError('This departure is no longer available.');
      }
    }

    // 2. Prevent race conditions: Check if an active pending payment order already exists
    const existingPayment = await PaymentModel.findOne({
      bookingId: booking.bookingId,
      status: 'PENDING',
      orderId: { $exists: true, $ne: '' },
    }).sort({ createdAt: -1 });

    const razorpay = this.getRazorpay();
    const amountInPaise = Math.round(booking.totalAmount * 100);

    let order: any = null;

    // If existing order exists and matches amount, reuse it to avoid duplicate Razorpay orders
    if (existingPayment?.orderId) {
      try {
        const fetchedOrder = await razorpay.orders.fetch(existingPayment.orderId);
        if (fetchedOrder && fetchedOrder.status === 'created' && fetchedOrder.amount === amountInPaise) {
          order = fetchedOrder;
          logger.info('♻️ Reusing existing active Razorpay order %s for booking %s', order.id, bookingId);
        }
      } catch (fetchErr) {
        logger.warn('Could not reuse existing order, generating new one: %s', (fetchErr as any).message);
      }
    }

    // Otherwise create a fresh Razorpay order
    if (!order) {
      const orderPayload = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingId,
        notes: {
          bookingId: booking.bookingId,
          packageName: booking.packageName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          ...notes,
        },
      };

      order = await razorpay.orders.create(orderPayload);
      logger.info('✨ Created Razorpay Order %s for booking %s (₹%d)', order.id, booking.bookingId, booking.totalAmount);
    }

    // 3. Upsert / record Payment entry in database
    const paymentId = existingPayment?.paymentId || `PAY-${Date.now().toString().slice(-8)}`;

    await PaymentModel.findOneAndUpdate(
      { orderId: order.id },
      {
        paymentId,
        orderId: order.id,
        bookingId: booking.bookingId,
        agencyId: booking.agencyId,
        agencyName: booking.agencyName || 'ApnaTrip Partner Agency',
        agencyLogo: booking.agencyLogo || '',
        userId: booking.userId,
        userName: booking.customerName,
        userEmail: booking.customerEmail,
        userPhone: booking.customerPhone,
        packageName: booking.packageName,
        packageThumbnail: booking.packageThumbnail,
        destinationCountry: booking.destinationCountry || 'India',
        destinationRegion: booking.destinationRegion || '',
        durationText: booking.durationText,
        amount: booking.totalAmount,
        platformFee: booking.platformFee || 0,
        gstAmount: booking.taxesAndFees || 0,
        currency: 'INR',
        gateway: 'Razorpay',
        paymentMethod: 'Razorpay Checkout',
        status: 'PENDING',
        captured: false,
        refunded: false,
        receiptNumber: booking.bookingId,
        signatureVerified: false,
        settlementStatus: 'Pending',
        metadata: {
          razorpayOrderId: order.id,
          orderNotes: order.notes,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return {
      orderId: order.id,
      currency: order.currency || 'INR',
      amount: order.amount, // in paise
      key: envConfig.RAZORPAY_KEY_ID, // Safe public key ID for checkout initialization
      bookingReference: booking.bookingId,
      packageName: booking.packageName,
      customer: {
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
      },
    };
  }

  /**
   * Cryptographically verify Razorpay Payment HMAC SHA256 Signature
   * and Confirm Booking atomically
   */
  public async verifyPayment(userId: string, input: VerifyPaymentInput) {
    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = input;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new BadRequestError('Missing required Razorpay payment credentials for verification.');
    }

    // 1. HMAC SHA256 Cryptographic Verification
    const secret = envConfig.RAZORPAY_KEY_SECRET;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf-8');
    const isMatch =
      expectedBuffer.length === signatureBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, signatureBuffer);

    if (!isMatch) {
      logger.error('❌ Cryptographic signature mismatch for order %s and payment %s', razorpay_order_id, razorpay_payment_id);

      await PaymentModel.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: 'FAILED',
          gatewayTransactionId: razorpay_payment_id,
          failureReason: 'Cryptographic HMAC SHA256 signature verification failed.',
          signatureVerified: false,
        }
      );

      throw new BadRequestError('Payment signature verification failed. Untrusted transaction.');
    }

    logger.info('🔐 Cryptographic HMAC signature successfully verified for order %s and payment %s', razorpay_order_id, razorpay_payment_id);

    // 2. Fetch Booking
    const booking = await BookingModel.findOne({
      bookingId,
      userId: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    });

    if (!booking) {
      const carBooking = await CarBookingModel.findOne({
        bookingId,
        customerId: new mongoose.Types.ObjectId(userId),
        isDeleted: { $ne: true },
      }).populate('carId').populate('agencyId');

      if (!carBooking) {
        throw new NotFoundError(`Booking "${bookingId}" not found or unauthorized.`);
      }

      // Idempotency: Prevent replay attacks / duplicate confirmation
      if (
        carBooking.bookingStatus === 'CONFIRMED' &&
        (carBooking.paymentStatus === 'FULL_PAID' ||
          (carBooking.paymentType === 'deposit' && carBooking.paymentStatus === 'DEPOSIT_PAID'))
      ) {
        logger.info('ℹ️ Car booking %s was already confirmed and verified. Returning existing confirmation.', bookingId);
        const existingPay = await PaymentModel.findOne({ orderId: razorpay_order_id });
        return {
          verified: true,
          booking: carBooking,
          bookingId: carBooking.bookingId,
          paymentId: existingPay?.paymentId || razorpay_payment_id,
          transactionId: razorpay_payment_id,
          status: 'CONFIRMED',
        };
      }

      const payableAmount = carBooking.paymentType === 'deposit'
        ? (carBooking.depositPaid || carBooking.totalAmount)
        : carBooking.totalAmount;

      carBooking.paymentStatus = carBooking.paymentType === 'full' ? 'FULL_PAID' : 'DEPOSIT_PAID';
      carBooking.bookingStatus = 'CONFIRMED';
      carBooking.transactionId = razorpay_payment_id;
      carBooking.confirmedAt = new Date();
      carBooking.timeline = [
        {
          id: `step-created-${Date.now()}`,
          title: 'Booking Created',
          subtitle: `Booking Reference #${carBooking.bookingId}`,
          timestamp: new Date(carBooking.createdAt || Date.now()).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'calendar',
        },
        {
          id: `step-paid-${Date.now()}`,
          title: 'Payment Successful',
          subtitle: `Razorpay Payment ID: ${razorpay_payment_id}`,
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'credit-card',
        },
        {
          id: `step-confirmed-${Date.now()}`,
          title: 'Agency Confirmed',
          subtitle: (carBooking.agencyId as any)?.businessName || 'Agency reservation accepted',
          timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          status: 'completed',
          iconType: 'check-circle',
        },
        {
          id: `step-driver-${Date.now()}`,
          title: carBooking.driverName ? `Driver Assigned: ${carBooking.driverName}` : 'Driver Assignment',
          subtitle: carBooking.driverName ? `Vehicle: ${carBooking.vehicleNumber || 'Assigned'}` : 'Driver being assigned by agency',
          timestamp: carBooking.driverName ? 'Assigned' : 'Pending',
          status: carBooking.driverName ? 'completed' : 'current',
          iconType: 'car',
        },
        {
          id: `step-trip-${Date.now()}`,
          title: 'Trip Completed',
          subtitle: 'Ride completion & digital settlement',
          timestamp: 'Scheduled',
          status: 'upcoming',
          iconType: 'flag',
        },
      ];
      await carBooking.save();

      // Process marketplace settlement
      const agencyObj = carBooking.agencyId as any;
      try {
        await settlementEngineService.processPaymentSuccess({
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          bookingId: carBooking.bookingId,
          sellerId: agencyObj?._id || carBooking.agencyId,
          sellerType: 'Agency',
          sellerName: agencyObj?.businessName || agencyObj?.name || 'Car Rental Partner',
          totalAmount: payableAmount,
          paidAt: new Date(),
        });
      } catch (settleErr: any) {
        logger.error('Failed to process settlement split for car booking: %s', settleErr.message);
      }

      await PaymentModel.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: 'SUCCESS',
          captured: true,
          gatewayTransactionId: razorpay_payment_id,
          signatureVerified: true,
          paidAt: new Date(),
        }
      );

      try {
        NotificationDispatcher.notifyUser(userId, {
          title: 'Booking Confirmed & Payment Received! 🎉',
          description: `Your car booking (${carBooking.bookingId}) has been confirmed. Total paid: ₹${payableAmount.toLocaleString('en-IN')}.`,
          category: 'Bookings',
          priority: 'HIGH',
          targetRoute: `/bookings/${carBooking.bookingId}`,
        }).catch(() => {});

        NotificationDispatcher.notifyAgency((carBooking.agencyId?._id || carBooking.agencyId).toString(), {
          title: 'New Booking & Payment Received',
          description: `New booking #${carBooking.bookingId} for ${carBooking.customerName}. Payment of ₹${payableAmount.toLocaleString('en-IN')} confirmed. Please review and assign a driver.`,
          category: 'Bookings',
          priority: 'HIGH',
          targetRoute: '/agency/car-rental/bookings',
        }).catch(() => {});

        socketService.emitToAgency((carBooking.agencyId?._id || carBooking.agencyId).toString(), 'new_booking', {
          bookingId: carBooking.bookingId,
        });
        socketService.emitToAgency((carBooking.agencyId?._id || carBooking.agencyId).toString(), 'booking_status_updated', {
          bookingId: carBooking.bookingId,
          status: 'CONFIRMED',
        });
        socketService.emitToUser(userId, 'booking_status_updated', {
          bookingId: carBooking.bookingId,
          status: 'CONFIRMED',
        });
        socketService.emitToAdmin('booking:new', {
          bookingId: carBooking.bookingId,
          bookingType: 'CAR_BOOKING',
        });
      } catch (notifyErr: any) {
        logger.error('Failed to dispatch notifications for car booking payment: %s', notifyErr.message);
      }

      return {
        verified: true,
        booking: carBooking,
        bookingId: carBooking.bookingId,
        paymentId: razorpay_payment_id,
        transactionId: razorpay_payment_id,
        status: 'CONFIRMED',
      };
    }

    // Idempotency: Prevent replay attacks / duplicate confirmation
    if (booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID') {
      logger.info('ℹ️ Booking %s was already confirmed and verified. Returning existing confirmation.', bookingId);
      const existingPay = await PaymentModel.findOne({ orderId: razorpay_order_id });
      return {
        verified: true,
        booking,
        bookingId: booking.bookingId,
        paymentId: existingPay?.paymentId || razorpay_payment_id,
        transactionId: razorpay_payment_id,
        status: 'CONFIRMED',
      };
    }

    // 3. Confirm Booking
    booking.status = 'CONFIRMED';
    booking.paymentStatus = 'PAID';
    booking.paidAmount = booking.totalAmount;
    booking.transactionId = razorpay_payment_id;

    booking.timeline.push({
      id: `step-paid-${Date.now()}`,
      title: 'Payment Confirmed',
      subtitle: `Razorpay Payment ID: ${razorpay_payment_id}`,
      timestamp: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
      status: 'completed',
    });

    booking.activities.push({
      id: `act-${Date.now()}`,
      actor: booking.customerName,
      role: 'Traveler',
      action: 'Payment Verified & Confirmed',
      details: `Paid ₹${booking.totalAmount.toLocaleString('en-IN')} via Razorpay (Order: ${razorpay_order_id})`,
      timestamp: new Date().toISOString(),
    });

    // 4. Update Departure booked seats
    try {
      let dep = null;
      if (booking.departureId) {
        dep = await DepartureModel.findById(booking.departureId);
      }
      if (!dep && booking.packageId) {
        const pkgIds: any[] = [booking.packageId];
        if (mongoose.Types.ObjectId.isValid(booking.packageId)) {
          pkgIds.push(new mongoose.Types.ObjectId(booking.packageId.toString()));
        }
        dep = await DepartureModel.findOne({
          packageId: { $in: pkgIds },
          departureDate: booking.tripStartDate,
        });
      }
      if (dep) {
        dep.bookedSeats = (dep.bookedSeats || 0) + (booking.travelersCount || 1);
        if (dep.bookedSeats >= dep.capacity) {
          dep.status = 'SOLDOUT';
          NotificationDispatcher.notifyAgency(dep.agencyId.toString(), {
            title: 'Departure Sold Out',
            description: `Departure for "${booking.packageName}" has reached capacity (${dep.capacity} seats booked).`,
            category: 'Bookings',
            priority: 'HIGH',
            targetRoute: '/agency/bookings',
          }).catch(() => {});
        }
        await dep.save();

        socketService.getIO()?.emit('departure:capacity-updated', {
          departureId: dep._id.toString(),
          bookedSeats: dep.bookedSeats,
          capacity: dep.capacity,
          status: dep.status,
        });
      }
    } catch (depErr) {
      logger.error('Failed to update departure capacity on payment confirmation:', depErr);
    }

    // 5. Update Payment Record to SUCCESS
    const payment = await PaymentModel.findOneAndUpdate(
      { orderId: razorpay_order_id },
      {
        status: 'SUCCESS',
        captured: true,
        gatewayTransactionId: razorpay_payment_id,
        transactionRef: razorpay_payment_id,
        signatureVerified: true,
        gatewayResponse: 'Authorized & HMAC Verified',
        paidAt: new Date(),
        capturedAt: new Date(),
        metadata: {
          razorpay_order_id,
          razorpay_payment_id,
          verifiedAt: new Date().toISOString(),
        },
      },
      { new: true, upsert: true }
    );

    // 5.1. Execute Platform Commission Split, Route Transfer, Settlement & Immutable Ledger Snapshot
    try {
      await settlementEngineService.processPaymentSuccess({
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        bookingId: booking.bookingId,
        sellerId: booking.agencyId || new mongoose.Types.ObjectId(),
        sellerType: 'Agency',
        sellerName: booking.agencyName || 'ApnaTrip Partner Agency',
        totalAmount: booking.totalAmount,
        paidAt: new Date(),
      });
    } catch (settleErr: any) {
      logger.error('Failed to process Razorpay Route settlement split: %s', settleErr.message);
    }

    // 6. Generate Customer Invoice
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const invoice = await InvoiceModel.create({
        invoiceNumber,
        businessType: 'customer',
        bookingId: booking.bookingId,
        partnerName: booking.agencyName || 'ApnaTrip Partner Agency',
        userEmail: booking.customerEmail,
        userPhone: booking.customerPhone,
        paymentId: razorpay_payment_id,
        subtotal: booking.basePrice || booking.totalAmount,
        discount: booking.discountAmount || 0,
        tax: booking.taxesAndFees || 0,
        total: booking.totalAmount,
        currency: 'INR',
        status: 'paid',
        issuedAt: new Date(),
      });

      // Attach invoice reference to booking documents
      booking.documents = booking.documents || [];
      booking.documents.push({
        id: invoiceNumber,
        title: `Tax Invoice & Receipt (${invoiceNumber})`,
        url: `/api/payments/invoices/${invoiceNumber}`,
        status: 'Generated',
      });
    } catch (invErr) {
      logger.error('Failed to create customer invoice record: %s', (invErr as any).message);
    }

    await booking.save();

    // 7. Dispatch Realtime Notifications
    try {
      await NotificationDispatcher.notifyUser(String(booking.userId), {
        category: 'Bookings',
        title: 'Booking Confirmed! 🎉',
        description: `Your trip to ${booking.destination} for ${booking.packageName} is confirmed. Booking ID: ${booking.bookingId}`,
        targetRoute: `/trips`,
      });

      socketService.emitToUser(String(booking.userId), 'current_trip_updated', {
        bookingId: booking.bookingId,
        type: 'package',
        status: 'CONFIRMED',
      });

      if (booking.agencyId) {
        await NotificationDispatcher.notifyAgency(String(booking.agencyId), {
          title: 'New Confirmed Booking',
          description: `${booking.customerName} completed payment of ₹${booking.totalAmount.toLocaleString('en-IN')} for "${booking.packageName}".`,
          category: 'Bookings',
          priority: 'HIGH',
          targetRoute: '/agency/bookings',
        }).catch(() => {});

        socketService.emitToAgency(String(booking.agencyId), 'new_booking', {
          bookingId: booking.bookingId,
          customerName: booking.customerName,
          packageName: booking.packageName,
        });
      }
    } catch (notifErr: any) {
      logger.warn('Failed to dispatch notification on payment verification: %s', notifErr.message);
    }

    // 8. Deliver Transactional Confirmation & Receipt Emails
    if (booking.customerEmail) {
      const frontendUrl = envConfig.FRONTEND_URL || envConfig.CLIENT_URL || 'http://localhost:5173';
      const bookingUrl = `${frontendUrl}/bookings/${booking.bookingId}`;

      mailService
        .sendBookingConfirmationEmail({
          to: booking.customerEmail,
          customerName: booking.customerName,
          bookingId: booking.bookingId,
          title: booking.packageName,
          travelDates: `${booking.tripStartDate ? new Date(booking.tripStartDate).toLocaleDateString() : 'Upcoming'} to ${booking.tripEndDate ? new Date(booking.tripEndDate).toLocaleDateString() : 'Completion'}`,
          travelersCount: booking.travelersCount || 1,
          totalAmount: booking.totalAmount,
          bookingDetailsUrl: bookingUrl,
        })
        .catch((err) => {
          logger.error('Failed to send booking confirmation email: %s', err.message);
        });

      mailService
        .sendPaymentConfirmationEmail({
          to: booking.customerEmail,
          customerName: booking.customerName,
          paymentId: payment.paymentId,
          bookingId: booking.bookingId,
          amount: booking.totalAmount,
          paymentMethod: 'Razorpay Checkout',
          receiptUrl: bookingUrl,
        })
        .catch((err) => {
          logger.error('Failed to send payment confirmation email: %s', err.message);
        });
    }

    logger.info('🎉 Successfully verified & confirmed booking %s with payment %s', booking.bookingId, payment.paymentId);

    return {
      verified: true,
      booking,
      bookingId: booking.bookingId,
      paymentId: payment.paymentId,
      transactionId: razorpay_payment_id,
      status: 'CONFIRMED',
      totalAmount: booking.totalAmount,
      invoiceNumber,
    };
  }

  /**
   * Phase 7, 8 & 22: Enqueue Webhook for Reliable Asynchronous Processing
   * Validates signature, persists raw event, and immediately returns HTTP 200 without blocking.
   */
  public async handleWebhook(rawBody: Buffer | string, signature: string, payload: any) {
    return webhookQueueService.enqueueWebhook(rawBody, signature, payload);
  }

  /**
   * Asynchronously process verified webhook payload inside the background queue worker
   */
  public async processVerifiedWebhookPayload(event: string, eventId: string, payload: any) {
    logger.info('🔔 Worker processing verified Razorpay Webhook Event: %s (ID: %s)', event, eventId);

    try {
      switch (event) {
        case 'payment.authorized': {
          const paymentEntity = payload.payload?.payment?.entity;
          if (paymentEntity?.order_id) {
            await PaymentModel.findOneAndUpdate(
              { orderId: paymentEntity.order_id },
              {
                status: 'PENDING',
                gatewayTransactionId: paymentEntity.id,
                gatewayResponse: 'Authorized by Bank',
              }
            );
          }
          break;
        }

        case 'payment.captured': {
          const paymentEntity = payload.payload?.payment?.entity;
          if (paymentEntity?.order_id) {
            const payment = await PaymentModel.findOne({ orderId: paymentEntity.order_id });
            if (payment && payment.status !== 'SUCCESS') {
              payment.status = 'SUCCESS';
              payment.captured = true;
              payment.gatewayTransactionId = paymentEntity.id;
              payment.paidAt = new Date();
              payment.capturedAt = new Date();
              await payment.save();

              if (payment.bookingId) {
                const booking = await BookingModel.findOneAndUpdate(
                  { bookingId: payment.bookingId, status: { $ne: 'CONFIRMED' } },
                  {
                    status: 'CONFIRMED',
                    paymentStatus: 'PAID',
                    paidAmount: payment.amount,
                    transactionId: paymentEntity.id,
                  },
                  { new: true }
                );

                if (booking) {
                  // Execute settlement split if not already executed
                  await settlementEngineService.processPaymentSuccess({
                    paymentId: paymentEntity.id,
                    orderId: paymentEntity.order_id,
                    bookingId: payment.bookingId,
                    sellerId: booking.agencyId || payment.agencyId || new mongoose.Types.ObjectId(),
                    sellerType: 'Agency',
                    sellerName: booking.agencyName || payment.agencyName || 'ApnaTrip Partner Agency',
                    totalAmount: payment.amount,
                    paidAt: new Date(),
                  });
                } else {
                  // Fallback for Car / Route Booking
                  const carBooking = await CarBookingModel.findOneAndUpdate(
                    { bookingId: payment.bookingId, bookingStatus: { $ne: 'CONFIRMED' } },
                    {
                      bookingStatus: 'CONFIRMED',
                      paymentStatus: 'FULL_PAID',
                      transactionId: paymentEntity.id,
                      confirmedAt: new Date(),
                    },
                    { new: true }
                  );

                  if (carBooking) {
                    await settlementEngineService.processPaymentSuccess({
                      paymentId: paymentEntity.id,
                      orderId: paymentEntity.order_id,
                      bookingId: payment.bookingId,
                      sellerId: carBooking.agencyId || payment.agencyId || new mongoose.Types.ObjectId(),
                      sellerType: 'Agency',
                      sellerName: payment.agencyName || 'ApnaTrip Car Partner',
                      totalAmount: payment.amount,
                      paidAt: new Date(),
                    });
                  }
                }
              }
            }
          }
          break;
        }

        case 'payment.failed': {
          const paymentEntity = payload.payload?.payment?.entity;
          if (paymentEntity?.order_id) {
            const payment = await PaymentModel.findOne({ orderId: paymentEntity.order_id });
            if (payment) {
              payment.status = 'FAILED';
              payment.failureReason =
                paymentEntity.error_description || paymentEntity.error_reason || 'Payment failed at gateway';
              await payment.save();

              if (payment.bookingId && payment.userEmail) {
                const frontendUrl = envConfig.FRONTEND_URL || 'http://localhost:5173';
                mailService
                  .sendPaymentFailedEmail({
                    to: payment.userEmail,
                    customerName: payment.userName || 'Traveler',
                    bookingId: payment.bookingId,
                    amount: payment.amount,
                    reason: payment.failureReason,
                    retryUrl: `${frontendUrl}/booking/checkout?bookingId=${payment.bookingId}`,
                  })
                  .catch((err) => logger.warn('Failed to send payment failure email: %s', err.message));
              }
            }
          }
          break;
        }

        case 'transfer.created':
        case 'transfer.processed': {
          const transferEntity = payload.payload?.transfer?.entity;
          if (transferEntity?.id) {
            const transfer = await TransferModel.findOne({
              $or: [{ gatewayTransferId: transferEntity.id }, { transferId: transferEntity.notes?.transferRef }],
            });

            if (transfer) {
              const prev = transfer.status;
              transfer.status = event === 'transfer.processed' ? 'PROCESSED' : 'PENDING';
              transfer.gatewayTransferId = transferEntity.id;
              transfer.processedAt = new Date();
              await transfer.save();

              // Update associated Settlement
              await SettlementModel.findOneAndUpdate(
                { transferId: transfer._id },
                {
                  status: event === 'transfer.processed' ? 'TRANSFERRED' : 'PROCESSING',
                  gatewaySettlementId: transferEntity.settlement_id || transferEntity.id,
                }
              );

              // Append Immutable Ledger Event
              await settlementEngineService.appendLedgerEvent({
                transferId: transfer._id,
                transferReferenceId: transfer.transferId,
                bookingId: transfer.bookingId,
                sellerId: transfer.sellerId,
                previousStatus: prev,
                newStatus: transfer.status,
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                amount: transfer.transferAmount,
                notes: `Route Transfer ${event}: ₹${transfer.transferAmount.toLocaleString('en-IN')} to recipient account`,
              });

              // Live socket updates
              socketService.emitToAgency(transfer.sellerId.toString(), 'settlement:update', {
                transferId: transfer.transferId,
                status: transfer.status,
                amount: transfer.transferAmount,
              });
              socketService.emitToAdmin('settlement:update', {
                transferId: transfer.transferId,
                status: transfer.status,
                sellerId: transfer.sellerId.toString(),
              });
            }
          }
          break;
        }

        case 'transfer.failed': {
          const transferEntity = payload.payload?.transfer?.entity;
          if (transferEntity?.id) {
            const transfer = await TransferModel.findOne({
              $or: [{ gatewayTransferId: transferEntity.id }, { transferId: transferEntity.notes?.transferRef }],
            });

            if (transfer) {
              const prev = transfer.status;
              transfer.status = 'FAILED';
              transfer.failureReason = transferEntity.error?.description || 'Transfer failed at Route gateway';
              await transfer.save();

              await SettlementModel.findOneAndUpdate(
                { transferId: transfer._id },
                { status: 'FAILED', failureReason: transfer.failureReason }
              );

              await settlementEngineService.appendLedgerEvent({
                transferId: transfer._id,
                transferReferenceId: transfer.transferId,
                bookingId: transfer.bookingId,
                sellerId: transfer.sellerId,
                previousStatus: prev,
                newStatus: 'FAILED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                notes: `Route Transfer Failed: ${transfer.failureReason}`,
              });

              // Notify Admin and Agency
              NotificationDispatcher.notifyAdmin({
                title: 'Route Transfer Failed',
                description: `Transfer ${transfer.transferId} failed for ${transfer.sellerName}: ${transfer.failureReason}`,
                category: 'Payments',
                priority: 'HIGH',
                targetRoute: '/admin/finance',
              }).catch(() => {});

              NotificationDispatcher.notifyAgency(transfer.sellerId.toString(), {
                title: 'Payout Transfer Failed',
                description: `Transfer for booking #${transfer.bookingId} failed. Please verify your bank details.`,
                category: 'Payments',
                priority: 'HIGH',
                targetRoute: '/agency/settings/payment',
              }).catch(() => {});
            }
          }
          break;
        }

        case 'settlement.processed': {
          const settlementEntity = payload.payload?.settlement?.entity;
          if (settlementEntity?.id) {
            const utr = settlementEntity.utr || `UTR${Date.now().toString().slice(-8)}`;
            const sett = await SettlementModel.findOneAndUpdate(
              {
                $or: [{ gatewaySettlementId: settlementEntity.id }, { settlementId: settlementEntity.id }],
              },
              {
                status: 'SETTLED',
                utr,
                settledAt: new Date(),
              },
              { new: true }
            );

            if (sett) {
              await settlementEngineService.appendLedgerEvent({
                settlementId: sett._id,
                settlementReferenceId: sett.settlementId,
                bookingId: sett.bookingId,
                sellerId: sett.sellerId,
                previousStatus: 'PROCESSING',
                newStatus: 'SETTLED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                utr,
                amount: sett.netSettledAmount,
                notes: `Settlement disbursed by bank with UTR ${utr}`,
              });

              NotificationDispatcher.notifyAgency(sett.sellerId.toString(), {
                title: 'Settlement Completed! 💰',
                description: `Payout of ₹${sett.netSettledAmount.toLocaleString('en-IN')} has been settled to your bank account (UTR: ${utr}).`,
                category: 'Payments',
                priority: 'MEDIUM',
                targetRoute: '/agency/finance',
              }).catch(() => {});

              socketService.emitToAgency(sett.sellerId.toString(), 'settlement:update', {
                settlementId: sett.settlementId,
                status: 'SETTLED',
                utr,
              });
            }
          }
          break;
        }

        case 'refund.created':
        case 'refund.processed': {
          const refundEntity = payload.payload?.refund?.entity;
          const paymentEntity = payload.payload?.payment?.entity;
          const paymentId = refundEntity?.payment_id || paymentEntity?.id;

          if (paymentId) {
            const payment = await PaymentModel.findOne({ gatewayTransactionId: paymentId });
            if (payment) {
              const prev = payment.status;
              payment.status = 'REFUNDED';
              payment.refunded = true;
              payment.refundAmount = refundEntity?.amount ? refundEntity.amount / 100 : payment.amount;
              await payment.save();

              if (payment.bookingId) {
                await BookingModel.findOneAndUpdate(
                  { bookingId: payment.bookingId },
                  { paymentStatus: 'REFUNDED', status: 'CANCELLED' }
                );
              }

              // Reverse transfer and settlement
              await TransferModel.findOneAndUpdate(
                { paymentId: payment._id },
                { status: 'REVERSED', reversalReason: 'Payment refunded to customer', reversedAt: new Date() }
              );

              const sett = await SettlementModel.findOneAndUpdate(
                { paymentId: payment._id },
                { status: 'REVERSED', failureReason: 'Refund issued to customer' },
                { new: true }
              );

              await settlementEngineService.appendLedgerEvent({
                settlementId: sett?._id,
                paymentId: payment._id,
                paymentReferenceId: payment.paymentId,
                bookingId: payment.bookingId,
                sellerId: payment.agencyId,
                previousStatus: prev,
                newStatus: 'REFUNDED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                amount: payment.refundAmount,
                notes: `Refund of ₹${payment.refundAmount.toLocaleString('en-IN')} issued to traveler`,
              });

              if (payment.agencyId) {
                NotificationDispatcher.notifyAgency(payment.agencyId.toString(), {
                  title: 'Booking Refunded',
                  description: `Booking #${payment.bookingId} was refunded. Transfer reversed.`,
                  category: 'Payments',
                  priority: 'HIGH',
                  targetRoute: '/agency/finance',
                }).catch(() => {});
              }
            }
          }
          break;
        }

        case 'transfer.reversed': {
          const reversalEntity = payload.payload?.reversal?.entity;
          const transferId = reversalEntity?.transfer_id;
          if (transferId) {
            const transfer = await TransferModel.findOneAndUpdate(
              { gatewayTransferId: transferId },
              { status: 'REVERSED', reversedAt: new Date() },
              { new: true }
            );

            if (transfer) {
              await settlementEngineService.appendLedgerEvent({
                transferId: transfer._id,
                transferReferenceId: transfer.transferId,
                bookingId: transfer.bookingId,
                sellerId: transfer.sellerId,
                previousStatus: 'PROCESSED',
                newStatus: 'REVERSED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                notes: `Route Transfer reversed by gateway`,
              });
            }
          }
          break;
        }

        case 'account.activated':
        case 'account.updated': {
          const accountEntity = payload.payload?.account?.entity;
          if (accountEntity?.id) {
            const profile = await SellerPaymentProfileModel.findOne({
              razorpayLinkedAccountId: accountEntity.id,
            });
            if (profile) {
              const isActivated = accountEntity.status === 'activated' || event === 'account.activated';
              if (isActivated) {
                profile.status = 'APPROVED';
                profile.bankVerificationStatus = 'VERIFIED';
                profile.routeEnabled = true;
                profile.settlementsEnabled = true;
                if (!profile.onboardingProgress) profile.onboardingProgress = {};
                profile.onboardingProgress.bankVerification = { status: 'VERIFIED', updatedAt: new Date() };
                profile.onboardingProgress.razorpayReview = { status: 'APPROVED', updatedAt: new Date() };
                profile.onboardingProgress.settlementEnabled = { completed: true, updatedAt: new Date() };
                profile.approvedAt = new Date();
                await profile.save();

                await settlementEngineService.appendLedgerEvent({
                  sellerId: profile.sellerId,
                  previousStatus: 'UNDER_REVIEW',
                  newStatus: 'APPROVED',
                  eventSource: 'RAZORPAY_WEBHOOK',
                  razorpayEvent: event,
                  webhookId: eventId,
                  razorpayReference: accountEntity.id,
                  notes: `Seller onboarding approved via Razorpay Route webhook (${event}). Selling enabled.`,
                });

                socketService.emitToAgency(profile.sellerId.toString(), 'payment_profile_updated', {
                  status: 'APPROVED',
                  isPayoutReady: true,
                  onboardingProgress: profile.onboardingProgress,
                });

                await NotificationDispatcher.notifyAgency(profile.sellerId.toString(), {
                  title: 'Payout Account Verified — Selling Enabled',
                  description: 'Your Razorpay Route linked account is active! You can now publish packages and receive marketplace settlements.',
                  category: 'Payments',
                  priority: 'HIGH',
                  targetRoute: '/agency/finance',
                }).catch(() => {});
              }
            }
          }
          break;
        }

        case 'account.rejected':
        case 'account.suspended': {
          const accountEntity = payload.payload?.account?.entity;
          if (accountEntity?.id) {
            const profile = await SellerPaymentProfileModel.findOne({
              razorpayLinkedAccountId: accountEntity.id,
            });
            if (profile) {
              const reason = accountEntity.status_details?.description || 'Account rejected or suspended by Razorpay';
              profile.status = 'REJECTED';
              profile.routeEnabled = false;
              profile.settlementsEnabled = false;
              profile.onboardingFailureReason = reason;
              if (!profile.onboardingProgress) profile.onboardingProgress = {};
              profile.onboardingProgress.razorpayReview = { status: 'REJECTED', reason, updatedAt: new Date() };
              profile.onboardingProgress.failedStep = 'razorpayReview';
              profile.onboardingProgress.failureReason = reason;
              profile.onboardingProgress.recommendedAction = 'Contact ApnaTrip support or review your Razorpay merchant dashboard.';
              await profile.save();

              await settlementEngineService.appendLedgerEvent({
                sellerId: profile.sellerId,
                previousStatus: profile.status,
                newStatus: 'REJECTED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                razorpayReference: accountEntity.id,
                notes: `Seller Route account ${event}: ${reason}`,
              });

              socketService.emitToAgency(profile.sellerId.toString(), 'payment_profile_updated', {
                status: 'REJECTED',
                isPayoutReady: false,
                onboardingProgress: profile.onboardingProgress,
              });
            }
          }
          break;
        }

        case 'fund_account.validation.completed': {
          const faValidation = payload.payload?.fund_account_validation?.entity;
          const fundAccountId = faValidation?.fund_account?.id || faValidation?.fund_account_id;
          if (fundAccountId) {
            const profile = await SellerPaymentProfileModel.findOne({
              razorpayFundAccountId: fundAccountId,
            });
            if (profile && faValidation.status === 'completed') {
              profile.bankVerificationStatus = 'VERIFIED';
              if (!profile.onboardingProgress) profile.onboardingProgress = {};
              profile.onboardingProgress.bankVerification = { status: 'VERIFIED', updatedAt: new Date() };
              await profile.save();

              await settlementEngineService.appendLedgerEvent({
                sellerId: profile.sellerId,
                previousStatus: 'PENDING',
                newStatus: 'VERIFIED',
                eventSource: 'RAZORPAY_WEBHOOK',
                razorpayEvent: event,
                webhookId: eventId,
                razorpayReference: fundAccountId,
                notes: `Fund account validation completed via penny drop. Bank account verified.`,
              });
            }
          }
          break;
        }

        case 'fund_account.validation.failed': {
          const faValidation = payload.payload?.fund_account_validation?.entity;
          const fundAccountId = faValidation?.fund_account?.id || faValidation?.fund_account_id;
          if (fundAccountId) {
            const profile = await SellerPaymentProfileModel.findOne({
              razorpayFundAccountId: fundAccountId,
            });
            if (profile) {
              const failReason = faValidation.failure_reason || 'Penny drop validation failed at bank';
              profile.bankVerificationStatus = 'FAILED';
              profile.onboardingFailureReason = failReason;
              if (!profile.onboardingProgress) profile.onboardingProgress = {};
              profile.onboardingProgress.bankVerification = { status: 'FAILED', reason: failReason, updatedAt: new Date() };
              profile.onboardingProgress.failedStep = 'bankVerification';
              profile.onboardingProgress.failureReason = failReason;
              profile.onboardingProgress.recommendedAction = 'Please check the beneficiary name and bank account number.';
              await profile.save();
            }
          }
          break;
        }

        default:
          logger.info('ℹ️ Unhandled Razorpay event: %s', event);
      }
    } catch (processErr: any) {
      logger.error('Error processing webhook event %s: %s', event, processErr.message);
      throw processErr;
    }

    return { received: true, status: 'processed' };
  }

  /**
   * Get Payments with Filtering, Search, and Pagination (Admin & Agency)
   */
  public async getPayments(filter: PaymentFilterOptions = {}) {
    const { status, gateway, agencyId, userId, search, startDate, endDate, page = 1, limit = 20 } = filter;

    const query: any = { isDeleted: false };

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }
    if (gateway && gateway !== 'all') {
      query.gateway = gateway;
    }
    if (agencyId) {
      query.agencyId = new mongoose.Types.ObjectId(agencyId);
    }
    if (userId) {
      query.userId = new mongoose.Types.ObjectId(userId);
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (search) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { paymentId: regex },
        { orderId: regex },
        { bookingId: regex },
        { userName: regex },
        { userEmail: regex },
        { packageName: regex },
        { gatewayTransactionId: regex },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [payments, total] = await Promise.all([
      PaymentModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PaymentModel.countDocuments(query),
    ]);

    return {
      payments,
      total,
      page: Math.max(1, page),
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single payment by paymentId or MongoDB _id
   */
  public async getPaymentById(id: string) {
    let payment = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      payment = await PaymentModel.findById(id).lean();
    }
    if (!payment) {
      payment = await PaymentModel.findOne({ paymentId: id }).lean();
    }
    if (!payment) {
      payment = await PaymentModel.findOne({ orderId: id }).lean();
    }
    if (!payment) {
      throw new NotFoundError(`Payment record "${id}" not found.`);
    }
    return payment;
  }
}

export const paymentService = new PaymentService();
