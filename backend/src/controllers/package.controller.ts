import { Request, Response } from 'express';
import { packageService } from '../services/package.service.js';

export class PackageController {
  public async getPackages(req: Request, res: Response): Promise<void> {
    const filters = {
      search: (req.query.search as string) || (req.query.q as string),
      category: req.query.category as string,
      destination: req.query.destination as string,
      agencyId: req.query.agencyId as string,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
      minRating: req.query.minRating ? Number(req.query.minRating) : undefined,
      sort: req.query.sort as any,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await packageService.getPackages(filters);
    res.status(200).json({
      success: true,
      data: result,
    });
  }

  public async getFeaturedPackages(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : 6;
    const packages = await packageService.getFeaturedPackages(limit);
    res.status(200).json({
      success: true,
      data: { packages },
    });
  }

  public async getTrendingPackages(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit ? Number(req.query.limit) : 8;
    const packages = await packageService.getTrendingPackages(limit);
    res.status(200).json({
      success: true,
      data: { packages },
    });
  }

  public async getPackageById(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id || req.params.packageId || '');
    const pkg = await packageService.getPackageById(id);
    res.status(200).json({
      success: true,
      data: { package: pkg },
    });
  }

  public async getSimilarPackages(req: Request, res: Response): Promise<void> {
    const id = String(req.params.id || req.params.packageId || '');
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const packages = await packageService.getSimilarPackages(id, limit);
    res.status(200).json({
      success: true,
      data: { packages },
    });
  }
}

export const packageController = new PackageController();
