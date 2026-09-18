import { Request, Response } from 'express';
import { tripService } from '../services/trip.service.js';

export class TripController {
  public async getMyTrips(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const data = await tripService.getCustomerTrips(userId);
    res.status(200).json({
      success: true,
      data,
    });
  }

  public async getTripById(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const tripId = String(req.params.id || '');
    const trip = await tripService.getCustomerTripById(userId, tripId);
    res.status(200).json({
      success: true,
      data: { trip },
    });
  }

  public async getTripDocuments(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const tripId = String(req.params.id || '');
    const data = await tripService.getCustomerTripDocuments(userId, tripId);
    res.status(200).json({
      success: true,
      data,
    });
  }

  public async getTravelStats(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId;
    const data = await tripService.getCustomerTrips(userId);
    res.status(200).json({
      success: true,
      data: { stats: data.stats },
    });
  }
}

export const tripController = new TripController();
