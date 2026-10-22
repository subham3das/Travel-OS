import { Request, Response, NextFunction } from 'express';
import { rentalBookingService } from '../services/rentalBooking.service.js';
import { BadRequestError } from '../utils/errors.util.js';

export class RentalBookingController {
  /**
   * POST /api/rental/book
   * Create dedicated self-drive rental booking
   */
  public async book(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        throw new BadRequestError('User authentication required.');
      }

      const booking = await rentalBookingService.createRentalBooking(userId, req.body);
      res.status(201).json({
        success: true,
        message: 'Rental booking created successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/rental/payment
   * Create Razorpay order or verify payment for rental booking
   */
  public async payment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        throw new BadRequestError('User authentication required.');
      }

      const { action, bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (action === 'verify' || razorpay_signature) {
        if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          throw new BadRequestError('Missing payment verification credentials.');
        }

        const verifyResult = await rentalBookingService.verifyPayment(userId, {
          bookingId,
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        });

        res.status(200).json({
          success: true,
          message: 'Payment verified and rental confirmed.',
          data: verifyResult,
        });
        return;
      }

      // Default: create payment order
      if (!bookingId) {
        throw new BadRequestError('bookingId is required.');
      }

      const orderData = await rentalBookingService.createPaymentOrder(userId, bookingId);
      res.status(200).json({
        success: true,
        data: orderData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/rental/confirm
   * Owner enters 6-digit confirmation code upon vehicle pickup
   */
  public async confirm(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyDoc = (req as any).agency;
      const agencyId = agencyDoc?._id || agencyDoc?.id || (req as any).user?.agencyId || (req as any).user?.userId || '';

      const { bookingId, id, code, pickupCode, confirmationCode } = req.body;
      const codeToUse = (pickupCode || confirmationCode || code || '').toString().trim();
      const bookingIdToUse = (bookingId || id || req.params?.id || '').toString().trim();

      const result = await rentalBookingService.verifyPickupCode(
        agencyId ? agencyId.toString() : '',
        bookingIdToUse,
        codeToUse
      );
      res.status(200).json({
        success: true,
        message: result.message || 'Vehicle pickup verified successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/rental/return
   * Owner enters 6-digit return code upon vehicle return
   */
  public async returnVehicle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyDoc = (req as any).agency;
      const agencyId = agencyDoc?._id || agencyDoc?.id || (req as any).user?.agencyId || (req as any).user?.userId || '';

      const { bookingId, id, code, returnCode } = req.body;
      const codeToUse = (returnCode || code || '').toString().trim();
      const bookingIdToUse = (bookingId || id || req.params?.id || '').toString().trim();

      const result = await rentalBookingService.verifyReturnCode(
        agencyId ? agencyId.toString() : '',
        bookingIdToUse,
        codeToUse
      );
      res.status(200).json({
        success: true,
        message: result.message || 'Vehicle return verified successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/rental/my-bookings
   * Customer retrieves their rental bookings
   */
  public async myBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      if (!userId) {
        throw new BadRequestError('User authentication required.');
      }

      const bookings = await rentalBookingService.getMyBookings(userId);
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/rental/agency-bookings
   * Agency retrieves rental bookings
   */
  public async agencyBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyId = (req as any).agency?._id || (req as any).agency?.agencyId;
      if (!agencyId) {
        throw new BadRequestError('Agency authentication required.');
      }

      const bookings = await rentalBookingService.getAgencyBookings(agencyId.toString());
      res.status(200).json({
        success: true,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/rental/:id
   * Get single rental booking details
   */
  public async getBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).agency?._id;
      const { id } = req.params;

      const booking = await rentalBookingService.getBookingById(userId, String(id));
      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/rental/:id/cancel or POST /api/rental/cancel
   * Cancel rental booking
   */
  public async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id || (req as any).user?._id;
      const agencyId = (req as any).agency?._id || (req as any).agency?.agencyId;
      const role = (req as any).user?.role;
      const bookingId = req.params.id || req.body.bookingId || req.body.id;
      const { reason } = req.body;

      const result = await rentalBookingService.cancelBooking(
        { userId: userId?.toString(), agencyId: agencyId?.toString(), role },
        bookingId,
        reason
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.booking,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/rental/owner/cancel
   * Dedicated owner cancellation endpoint
   */
  public async ownerCancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const agencyDoc = (req as any).agency;
      const agencyId = agencyDoc?._id || agencyDoc?.agencyId || (req as any).user?.agencyId || (req as any).user?.userId || '';
      const bookingId = req.body.bookingId || req.body.id || req.params?.id;
      const reason = req.body.reason || req.body.cancellationReason;

      if (!bookingId) {
        throw new BadRequestError('bookingId is required.');
      }

      const booking = await rentalBookingService.ownerCancelBooking(
        agencyId ? agencyId.toString() : '',
        bookingId.toString(),
        reason
      );

      res.status(200).json({
        success: true,
        message: 'Rental booking cancelled successfully by owner. Vehicle is now available.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const rentalBookingController = new RentalBookingController();
