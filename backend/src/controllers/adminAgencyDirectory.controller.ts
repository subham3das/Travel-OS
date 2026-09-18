import { Request, Response, NextFunction } from 'express';
import { adminAgencyDirectoryService } from '../services/adminAgencyDirectory.service.js';
import {
  AdminAgencyDirectoryQueryInput,
  AdminUpdateAgencyStatusInput,
  AdminBulkAgencyActionInput,
} from '../validations/adminAgencyDirectory.validation.js';

export class AdminAgencyDirectoryController {
  /**
   * GET /api/admin/agencies/stats
   */
  public async getSummaryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminAgencyDirectoryService.getSummaryStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/admin/agencies
   */
  public async getAgencies(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req as any).validatedQuery || (req.query as unknown as AdminAgencyDirectoryQueryInput);
      const result = await adminAgencyDirectoryService.getAgencies(query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/admin/agencies/:id
   */
  public async getAgencyDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const details = await adminAgencyDirectoryService.getAgencyDetails(id);
      return res.status(200).json({
        success: true,
        data: details,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * PATCH /api/admin/agencies/:id/status
   */
  public async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const body: AdminUpdateAgencyStatusInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const result = await adminAgencyDirectoryService.updateAgencyStatus(id, body, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/agencies/bulk-action
   */
  public async bulkAction(req: Request, res: Response, next: NextFunction) {
    try {
      const body: AdminBulkAgencyActionInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const result = await adminAgencyDirectoryService.bulkAgencyAction(body, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const adminAgencyDirectoryController = new AdminAgencyDirectoryController();
