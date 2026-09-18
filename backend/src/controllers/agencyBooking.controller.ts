import { Request, Response, NextFunction } from 'express';
import { agencyBookingService } from '../services/agencyBooking.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyBookingController {
  public getBookingStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await agencyBookingService.getBookingStats(req.agency!._id);
      ResponseUtil.success(res, stats, 'Booking statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getBookings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await agencyBookingService.getBookings(req.agency!._id);
      ResponseUtil.success(res, result, 'Agency bookings and departure groups retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getBookingById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const booking = await agencyBookingService.getBookingById(req.agency!._id, id);
      ResponseUtil.success(res, booking, 'Booking manifest details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public confirmBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const confirmed = await agencyBookingService.confirmBooking(req.agency!._id, id);
      ResponseUtil.success(res, confirmed, 'Booking confirmed successfully');
    } catch (error) {
      next(error);
    }
  };

  public cancelBooking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { reason } = req.body;
      const cancelled = await agencyBookingService.cancelBooking(req.agency!._id, id, reason);
      ResponseUtil.success(res, cancelled, 'Booking cancelled successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const agencyBookingController = new AgencyBookingController();
