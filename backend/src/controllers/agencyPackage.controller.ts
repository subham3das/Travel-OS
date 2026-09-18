import { Request, Response, NextFunction } from 'express';
import { agencyPackageService } from '../services/agencyPackage.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class AgencyPackageController {
  public getPackageStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await agencyPackageService.getPackageStats(req.agency!._id);
      ResponseUtil.success(res, stats, 'Package statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getPackages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { search, status, category, page, limit } = req.query;
      const result = await agencyPackageService.getPackages(req.agency!._id, {
        search: search as string,
        status: status as string,
        category: category as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      ResponseUtil.success(res, result, 'Agency packages retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public getPackageById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const pkg = await agencyPackageService.getPackageById(req.agency!._id, id);
      ResponseUtil.success(res, pkg, 'Package details retrieved successfully');
    } catch (error) {
      next(error);
    }
  };

  public createPackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newPackage = await agencyPackageService.createPackage(req.agency!._id, req.body);
      ResponseUtil.success(res, newPackage, 'Package created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public updatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const updated = await agencyPackageService.updatePackage(req.agency!._id, id, req.body);
      ResponseUtil.success(res, updated, 'Package updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public updatePackageStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const { status } = req.body;
      if (!status) {
        throw new BadRequestError('Status field is required');
      }
      const updated = await agencyPackageService.updatePackageStatus(req.agency!._id, id, status);
      ResponseUtil.success(res, updated, 'Package status updated successfully');
    } catch (error) {
      next(error);
    }
  };

  public duplicatePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const cloned = await agencyPackageService.duplicatePackage(req.agency!._id, id);
      ResponseUtil.success(res, cloned, 'Package duplicated successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  public deletePackage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      await agencyPackageService.deletePackage(req.agency!._id, id);
      ResponseUtil.success(res, { success: true }, 'Package deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}

export const agencyPackageController = new AgencyPackageController();
