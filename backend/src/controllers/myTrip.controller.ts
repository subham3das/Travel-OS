import { Request, Response } from 'express';
import { myTripService } from '../services/myTrip.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { UnauthorizedError } from '../utils/errors.util.js';

export class MyTripController {
  /**
   * GET /api/my/current-trip
   *
   * Returns the user's single ongoing package trip.
   * Response shape:
   *   { hasTrip: true, trip: { ... } }   — when a trip is active
   *   { hasTrip: false }                  — when no trip is ongoing
   */
  public getCurrentTrip = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const result = await myTripService.getCurrentTrip(userId);
    return ResponseUtil.success(res, result, 'Current trip fetched successfully');
  });

  /**
   * GET /api/my/bookings/packages
   */
  public getMyPackageBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const bookings = await myTripService.getMyPackageBookings(userId);
    return ResponseUtil.success(res, { bookings }, 'Package bookings fetched successfully');
  });

  /**
   * GET /api/my/bookings/car-rentals
   */
  public getMyCarRentalBookings = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const bookings = await myTripService.getMyCarRentalBookings(userId);
    return ResponseUtil.success(res, { bookings }, 'Car rental bookings fetched successfully');
  });
}

export const myTripController = new MyTripController();
