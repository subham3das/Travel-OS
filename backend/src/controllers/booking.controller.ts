import { Request, Response } from 'express';
import { bookingService } from '../services/booking.service.js';

export class BookingController {
  public async createCheckout(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const result = await bookingService.createCheckoutBooking(userId, req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  }

  public async verifyPayment(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const result = await bookingService.verifyAndConfirmBooking(userId, req.body);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getMyBookings(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const bookings = await bookingService.getCustomerBookings(userId);
    res.status(200).json({
      success: true,
      data: { bookings },
    });
  }

  public async getBookingById(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const bookingId = String(req.params.id || req.params.bookingId || '');
    const booking = await bookingService.getCustomerBookingById(userId, bookingId);
    res.status(200).json({
      success: true,
      data: { booking },
    });
  }
}

export const bookingController = new BookingController();
