import { Request, Response, NextFunction } from 'express';
import { carBookingService } from '../services/carBooking.service.js';
import { BadRequestError } from '../utils/errors.util.js';

export class CarBookingController {
  public async createBooking(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const booking = await carBookingService.createBooking(userId, req.body);
    res.status(201).json({
      success: true,
      data: { booking },
    });
  }

  public async payBooking(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const booking = await carBookingService.payBooking(userId, String(req.params.id), req.body);
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  public async getMyBookings(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const bookings = await carBookingService.getCustomerBookings(userId);
    res.status(200).json({
      success: true,
      data: { bookings },
    });
  }

  public async getBookingById(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id || (req as any).agency?._id;
    const booking = await carBookingService.getBookingById(userId, String(req.params.id));
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  public async cancelBooking(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const booking = await carBookingService.cancelBooking(userId, String(req.params.id));
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  public async submitReview(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const review = await carBookingService.submitReview(userId, String(req.params.id), req.body);
    res.status(201).json({
      success: true,
      data: { review },
    });
  }

  // Agency controller methods
  public async agencyGetBookings(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id;
    const status = req.query.status as string | undefined;
    const bookings = await carBookingService.agencyGetBookings(String(agencyId), status);
    res.status(200).json({
      success: true,
      data: { bookings },
    });
  }

  public async agencyUpdateStatus(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id;
    const { status, rejectionReason } = req.body;
    const booking = await carBookingService.agencyUpdateStatus(
      String(agencyId),
      String(req.params.id),
      status,
      rejectionReason
    );
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  // Self-Drive Rental Endpoints
  public async createRentalBooking(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const booking = await carBookingService.createRentalBooking(userId, req.body);
    res.status(201).json({
      success: true,
      data: { booking },
    });
  }

  public async rentalPickupCheckIn(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const booking = await carBookingService.rentalPickupCheckIn(String(agencyId), String(req.params.id), req.body);
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  public async rentalReturnCheckOut(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const result = await carBookingService.rentalReturnCheckOut(String(agencyId), String(req.params.id), req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async refundSecurityDeposit(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const { amount, reason } = req.body;
    const booking = await carBookingService.refundSecurityDeposit(
      String(agencyId),
      String(req.params.id),
      amount,
      reason
    );
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }

  public async verifyRideStart(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId || (req as any).user?.userId;
    const { code } = req.body;
    const result = await carBookingService.verifyRideStartCode(String(agencyId), String(req.params.id), String(code));
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async verifyRideClose(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId || (req as any).user?.userId;
    const { code } = req.body;
    const result = await carBookingService.verifyRideCloseCode(String(agencyId), String(req.params.id), String(code));
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  /**
   * POST /api/car-bookings/owner/cancel
   * Dedicated owner cancellation endpoint
   */
  public async ownerCancel(req: Request, res: Response): Promise<void> {
    try {
      const agencyDoc = (req as any).agency;
      const agencyId = agencyDoc?._id || agencyDoc?.agencyId || (req as any).user?.agencyId || (req as any).user?.userId || '';
      const bookingId = req.body.bookingId || req.body.id || req.params?.id;
      const reason = req.body.reason || req.body.cancellationReason;

      if (!bookingId) {
        throw new BadRequestError('bookingId is required.');
      }

      const booking = await carBookingService.ownerCancelBooking(
        agencyId ? agencyId.toString() : '',
        bookingId.toString(),
        reason
      );

      res.status(200).json({
        success: true,
        message: 'Car booking cancelled successfully by owner. Vehicle is now available.',
        data: booking,
      });
    } catch (err: any) {
      const statusCode = err.statusCode || (err.name === 'BadRequestError' ? 400 : 500);
      res.status(statusCode).json({
        success: false,
        message: err.message || 'This booking can no longer be cancelled.',
      });
    }
  }
}

export const carBookingController = new CarBookingController();
