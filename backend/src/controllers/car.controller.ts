import { Request, Response } from 'express';
import { carService } from '../services/car.service.js';

export class CarController {
  public async listCars(req: Request, res: Response): Promise<void> {
    const result = await carService.listCars(req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getCarById(req: Request, res: Response): Promise<void> {
    const car = await carService.getCarById(String(req.params.id));
    res.status(200).json({
      success: true,
      data: { car },
    });
  }

  public async getCarReviews(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await carService.getCarReviews(String(req.params.id), page, limit);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getCategoryCounts(req: Request, res: Response): Promise<void> {
    const counts = await carService.getCategoryCounts();
    res.status(200).json({
      success: true,
      data: { counts },
    });
  }

  // Agency endpoints
  public async getAgencyCars(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const cars = await carService.getAgencyCars(String(agencyId));
    res.status(200).json({
      success: true,
      data: { cars },
    });
  }

  public async createCar(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const car = await carService.createCar(String(agencyId), req.body);
    res.status(201).json({
      success: true,
      data: { car },
    });
  }

  public async updateCar(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    const car = await carService.updateCar(String(agencyId), String(req.params.id), req.body);
    res.status(200).json({
      success: true,
      data: { car },
    });
  }

  public async deleteCar(req: Request, res: Response): Promise<void> {
    const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
    await carService.deleteCar(String(agencyId), String(req.params.id));
    res.status(200).json({
      success: true,
      message: 'Car listing deleted successfully',
    });
  }

  // User Favorite / Wishlist endpoints
  public async toggleFavorite(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const result = await carService.toggleFavorite(String(userId), String(req.params.id));
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getFavorites(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const cars = await carService.getFavorites(String(userId));
    res.status(200).json({
      success: true,
      data: { cars },
    });
  }

  public async reportCar(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.userId || (req as any).user?._id;
    const result = await carService.reportCar(String(userId), String(req.params.id), req.body?.reason || 'Reported');
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  // Dedicated Self-Drive Rental Search & Quoting
  public async searchRentals(req: Request, res: Response): Promise<void> {
    const result = await carService.searchRentals(req.query as any);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getRentalPriceEstimate(req: Request, res: Response): Promise<void> {
    const { carId, pickupDateTime, returnDateTime } = req.query;
    const estimate = await carService.getRentalPriceEstimate(
      String(carId),
      String(pickupDateTime),
      String(returnDateTime)
    );
    res.status(200).json({
      success: true,
      data: estimate,
    });
  }
}

export const carController = new CarController();
