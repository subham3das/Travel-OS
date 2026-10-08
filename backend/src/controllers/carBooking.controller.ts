import { Request, Response } from 'express';
import { carBookingService } from '../services/carBooking.service.js';

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
}

export const carBookingController = new CarBookingController();
