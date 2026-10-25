import mongoose from 'mongoose';
import { CarModel, ICar } from '../models/car.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { ConflictError, NotFoundError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export interface AcquireHoldParams {
  carId: string | mongoose.Types.ObjectId;
  customerId: string;
  bookingId: string;
  durationMinutes?: number;
}

export interface ConfirmHoldParams {
  carId: string | mongoose.Types.ObjectId;
  bookingId: string;
  customerId?: string;
  paymentId?: string;
}

export interface ReleaseHoldParams {
  carId: string | mongoose.Types.ObjectId;
  bookingId?: string;
  customerId?: string;
  reason?: string;
}

export interface AuditLogOptions {
  action:
    | 'Hold Created'
    | 'Hold Released'
    | 'Hold Expired'
    | 'Booking Confirmed'
    | 'Payment Failed'
    | 'Payment Cancelled';
  carId: string;
  bookingId?: string;
  customerId?: string;
  paymentId?: string;
  reason?: string;
  metadata?: Record<string, any>;
}

export class VehicleHoldService {
  private sweeperInterval: NodeJS.Timeout | null = null;

  /**
   * Helper: Record structured audit log in database and winston logger
   */
  public async logAudit(options: AuditLogOptions): Promise<void> {
    const { action, carId, bookingId, customerId, paymentId, reason, metadata = {} } = options;
    const now = new Date();
    const eventId = `AUDIT-VEH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const description = `[${action}] Vehicle: ${carId}${bookingId ? ` | Booking: ${bookingId}` : ''}${
      customerId ? ` | Customer: ${customerId}` : ''
    }${paymentId ? ` | Payment: ${paymentId}` : ''}${reason ? ` | Reason: ${reason}` : ''}`;

    logger.info('🛡️ [VehicleHold] %s', description);

    try {
      await AuditLogModel.create({
        eventId,
        timestamp: now.toISOString(),
        date: now.toISOString().split('T')[0],
        actor: {
          id: customerId || 'system',
          name: customerId ? `Customer (${customerId})` : 'System Reservation Engine',
          role: customerId ? 'Customer' : 'System',
          isSystem: !customerId,
        },
        module: 'VehicleReservation',
        action,
        eventType: action.toUpperCase().replace(/\s+/g, '_'),
        description,
        severity: action === 'Payment Failed' ? 'Medium' : 'Low',
        status: action === 'Payment Failed' ? 'Warning' : 'Success',
        metadata: {
          carId,
          bookingId,
          customerId,
          paymentId,
          reason,
          ...metadata,
        },
      });
    } catch (auditErr: any) {
      logger.warn('⚠ Could not persist AuditLogModel entry for %s: %s', action, auditErr?.message || auditErr);
    }
  }

  /**
   * Step 1 & 2: Atomically acquire a temporary reservation hold on a vehicle.
   * If the vehicle is currently AVAILABLE, or its previous hold has expired, or the same
   * customer is re-acquiring / retrying, updates status to HELD atomically.
   *
   * If another customer holds the vehicle, rejects with HTTP 409 Conflict.
   */
  public async acquireHold(params: AcquireHoldParams): Promise<ICar> {
    const { carId, customerId, bookingId, durationMinutes = 10 } = params;

    if (!mongoose.Types.ObjectId.isValid(carId)) {
      throw new NotFoundError('Invalid vehicle ID format.');
    }

    const carObjectId = new mongoose.Types.ObjectId(carId);
    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const now = new Date();
    const holdExpiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000);

    // Atomic conditional filter:
    // 1. Vehicle is AVAILABLE (status available/AVAILABLE or default isAvailable true)
    // 2. OR vehicle is HELD but previous hold has expired (holdExpiresAt < now)
    // 3. OR vehicle is HELD by the SAME customer (allowed to maintain/extend hold during retry)
    const filter = {
      _id: carObjectId,
      isActive: true,
      $or: [
        {
          status: { $in: ['available', 'AVAILABLE'] },
          isAvailable: { $ne: false },
        },
        {
          status: { $exists: false },
          isAvailable: true,
        },
        {
          status: { $in: ['HELD', 'held'] },
          'holdDetails.holdExpiresAt': { $lt: now },
        },
        {
          status: { $in: ['HELD', 'held'] },
          'holdDetails.heldBy': customerObjectId,
        },
      ],
    };

    const update = {
      $set: {
        status: 'HELD',
        isAvailable: false,
        holdDetails: {
          heldBy: customerObjectId,
          holdCreatedAt: now,
          holdExpiresAt,
          holdBookingId: bookingId,
          paymentStatus: 'PENDING',
        },
      },
    };

    const heldCar = (await CarModel.findOneAndUpdate(filter as any, update as any, { new: true })) as ICar | null;

    if (!heldCar) {
      // Diagnostic check to produce exact user-friendly error
      const existing = await CarModel.findById(carObjectId);
      if (!existing || !existing.isActive) {
        throw new NotFoundError('Vehicle not found or currently inactive.');
      }

      if (existing.status === 'booked' || existing.status === 'BOOKED') {
        throw new ConflictError('This vehicle is currently booked and unavailable.');
      }

      // If held by another customer whose hold is still active:
      throw new ConflictError(
        'This vehicle is currently being booked by another customer. Please choose another vehicle.'
      );
    }

    await this.logAudit({
      action: 'Hold Created',
      carId: carObjectId.toString(),
      bookingId,
      customerId,
      metadata: {
        holdCreatedAt: now.toISOString(),
        holdExpiresAt: holdExpiresAt.toISOString(),
        durationMinutes,
      },
    });

    return heldCar;
  }

  /**
   * Step 4: When Razorpay verification succeeds, atomically transition HELD -> BOOKED.
   * Attach Booking ID, Customer ID, Payment ID.
   */
  public async confirmHoldAsBooked(params: ConfirmHoldParams): Promise<ICar | null> {
    const { carId, bookingId, customerId, paymentId } = params;
    const carObjectId = new mongoose.Types.ObjectId(carId);
    const now = new Date();

    const update: any = {
      $set: {
        status: 'BOOKED',
        isAvailable: false,
        'holdDetails.paymentStatus': 'SUCCESS',
        'holdDetails.bookedAt': now,
        'holdDetails.bookingId': bookingId,
      },
    };

    if (paymentId) update.$set['holdDetails.paymentId'] = paymentId;
    if (customerId) update.$set['holdDetails.bookedBy'] = new mongoose.Types.ObjectId(customerId);

    const bookedCar = await CarModel.findByIdAndUpdate(carObjectId, update, { new: true });

    await this.logAudit({
      action: 'Booking Confirmed',
      carId: carObjectId.toString(),
      bookingId,
      customerId,
      paymentId,
      metadata: { bookedAt: now.toISOString() },
    });

    return bookedCar;
  }

  /**
   * Step 5 & 6: Release hold on payment failure, cancellation, or explicit abort.
   * Updates Vehicle Status HELD -> AVAILABLE and clears hold details.
   */
  public async releaseHold(params: ReleaseHoldParams): Promise<boolean> {
    const { carId, bookingId, customerId, reason = 'Hold released' } = params;

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return false;
    }

    const carObjectId = new mongoose.Types.ObjectId(carId);
    const car = await CarModel.findById(carObjectId);
    if (!car) return false;

    // If bookingId was supplied and matches a different hold, do not release
    if (bookingId && car.holdDetails?.holdBookingId && car.holdDetails.holdBookingId !== bookingId) {
      return false;
    }

    // If the vehicle has already been confirmed and paid as BOOKED,
    // only release if reason explicitly indicates completion/return or admin/cancellation override
    const isConfirmedBooked =
      (car.status === 'BOOKED' || car.status === 'booked') &&
      car.holdDetails?.paymentStatus === 'SUCCESS';

    if (isConfirmedBooked) {
      const allowedOverrides = ['return', 'completed', 'cancelled', 'canceled', 'refund', 'owner_cancelled'];
      const isAllowed = allowedOverrides.some((keyword) => reason.toLowerCase().includes(keyword));
      if (!isAllowed) {
        return false;
      }
    }

    await CarModel.findByIdAndUpdate(carObjectId, {
      $set: {
        status: 'AVAILABLE',
        isAvailable: true,
      },
      $unset: {
        holdDetails: 1,
      },
    });

    await this.logAudit({
      action: 'Hold Released',
      carId: carObjectId.toString(),
      bookingId: bookingId || car.holdDetails?.holdBookingId,
      customerId: customerId || car.holdDetails?.heldBy?.toString(),
      reason,
    });

    return true;
  }

  /**
   * Verify hold validity for checkout / retry payment.
   * Throws ConflictError if hold has expired or belongs to another user.
   */
  public async validateHoldForPayment(params: {
    carId: string | mongoose.Types.ObjectId;
    customerId: string;
    bookingId: string;
  }): Promise<void> {
    const { carId, customerId, bookingId } = params;
    if (!mongoose.Types.ObjectId.isValid(carId)) {
      return;
    }

    const carObjectId = new mongoose.Types.ObjectId(carId);
    const car = await CarModel.findById(carObjectId);
    if (!car) {
      throw new NotFoundError('Vehicle not found.');
    }

    // If car is already confirmed for this booking, allow
    if (
      (car.status === 'BOOKED' || car.status === 'booked') &&
      car.holdDetails?.bookingId === bookingId &&
      car.holdDetails?.paymentStatus === 'SUCCESS'
    ) {
      return;
    }

    if (car.status === 'HELD' || car.status === 'held') {
      const heldByStr = car.holdDetails?.heldBy?.toString();
      const isOwner = heldByStr === customerId.toString();
      const expiresAt = car.holdDetails?.holdExpiresAt;
      const isNotExpired = expiresAt && new Date(expiresAt).getTime() > Date.now();

      if (!isOwner) {
        throw new ConflictError(
          'This vehicle is currently reserved by another customer. Please choose another vehicle.'
        );
      }

      if (!isNotExpired) {
        // Automatically release expired hold
        await this.releaseHold({
          carId: carObjectId,
          bookingId,
          customerId,
          reason: 'Hold expired before payment completion',
        });
        throw new ConflictError(
          'Your 10-minute vehicle reservation hold has expired. Please select the vehicle again to reserve.'
        );
      }
    }
  }

  /**
   * Step 7: Release all expired holds (older than 10 minutes).
   */
  public async releaseExpiredHolds(): Promise<number> {
    const now = new Date();
    const expiredCars = await CarModel.find({
      status: { $in: ['HELD', 'held'] },
      'holdDetails.holdExpiresAt': { $lt: now },
    } as any);

    if (expiredCars.length === 0) {
      return 0;
    }

    let releasedCount = 0;
    for (const car of expiredCars) {
      const bId = car.holdDetails?.holdBookingId;
      const cId = car.holdDetails?.heldBy?.toString();

      await CarModel.findByIdAndUpdate(car._id, {
        $set: {
          status: 'AVAILABLE',
          isAvailable: true,
        },
        $unset: { holdDetails: 1 },
      });

      await this.logAudit({
        action: 'Hold Expired',
        carId: car._id.toString(),
        bookingId: bId,
        customerId: cId,
        reason: 'Reservation 10-minute window elapsed without completed payment',
      });

      await this.logAudit({
        action: 'Hold Released',
        carId: car._id.toString(),
        bookingId: bId,
        customerId: cId,
        reason: 'Expired hold returned to inventory',
      });

      releasedCount++;
    }

    logger.info('⏰ [VehicleHoldSweeper] Released %d expired vehicle holds.', releasedCount);
    return releasedCount;
  }

  /**
   * Step 8: Crash Recovery on Server Startup
   * Finds all expired HELD vehicles and dangling holds, returning them to AVAILABLE.
   */
  public async recoverExpiredHoldsOnStartup(): Promise<number> {
    const now = new Date();
    // Find cars in HELD status where hold is expired OR holdDetails.holdExpiresAt is missing
    const staleCars = await CarModel.find({
      status: { $in: ['HELD', 'held'] },
      $or: [
        { 'holdDetails.holdExpiresAt': { $lt: now } },
        { 'holdDetails.holdExpiresAt': { $exists: false } },
        { holdDetails: { $exists: false } },
      ],
    } as any);

    if (staleCars.length === 0) {
      logger.info('✓ [VehicleHoldRecovery] No expired or dangling vehicle holds found on startup.');
      return 0;
    }

    let recoveredCount = 0;
    for (const car of staleCars) {
      await CarModel.findByIdAndUpdate(car._id, {
        $set: {
          status: 'AVAILABLE',
          isAvailable: true,
        },
        $unset: { holdDetails: 1 },
      });

      await this.logAudit({
        action: 'Hold Released',
        carId: car._id.toString(),
        bookingId: car.holdDetails?.holdBookingId,
        reason: 'Crash recovery on server startup',
      });

      recoveredCount++;
    }

    logger.info('🚀 [VehicleHoldRecovery] Cleaned up and restored %d vehicle holds on server startup.', recoveredCount);
    return recoveredCount;
  }

  /**
   * Start recurring background timer to sweep expired holds every 30 seconds
   */
  public startHoldSweeper(intervalMs = 30000): void {
    if (this.sweeperInterval) {
      clearInterval(this.sweeperInterval);
    }

    this.sweeperInterval = setInterval(async () => {
      try {
        await this.releaseExpiredHolds();
      } catch (err: any) {
        logger.warn('⚠ Error during vehicle hold sweep: %s', err?.message || err);
      }
    }, intervalMs);

    this.sweeperInterval.unref();
    logger.info('✓ [VehicleHoldSweeper] Background hold sweeper started (interval: %dms)', intervalMs);
  }

  /**
   * Stop recurring background timer
   */
  public stopHoldSweeper(): void {
    if (this.sweeperInterval) {
      clearInterval(this.sweeperInterval);
      this.sweeperInterval = null;
      logger.info('✓ [VehicleHoldSweeper] Background hold sweeper stopped.');
    }
  }
}

export const vehicleHoldService = new VehicleHoldService();
