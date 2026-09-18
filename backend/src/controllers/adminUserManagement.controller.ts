import { Request, Response, NextFunction } from 'express';
import { adminUserManagementService } from '../services/adminUserManagement.service.js';
import {
  AdminUserQueryInput,
  AdminCreateUserInput,
  AdminUpdateUserInput,
  AdminBulkUserActionInput,
  AdminSendNotificationInput,
} from '../validations/adminUserManagement.validation.js';

export class AdminUserManagementController {
  /**
   * GET /api/admin/users/stats
   */
  public async getSummaryStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminUserManagementService.getSummaryStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/admin/users
   */
  public async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req as any).validatedQuery || (req.query as unknown as AdminUserQueryInput);
      const result = await adminUserManagementService.getUsers(query);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/admin/users/export
   */
  public async exportUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = (req as any).validatedQuery || (req.query as unknown as AdminUserQueryInput);
      const csv = await adminUserManagementService.exportUsersCsv(query);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=apnatrip_users_${Date.now()}.csv`);
      return res.status(200).send(csv);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * GET /api/admin/users/:id
   */
  public async getUserDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const details = await adminUserManagementService.getUserDetails(id);
      return res.status(200).json({
        success: true,
        data: details,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/users
   */
  public async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const body: AdminCreateUserInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const created = await adminUserManagementService.createUser(body, adminUser);
      return res.status(201).json({
        success: true,
        data: created,
        message: 'Traveler user created successfully',
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * PATCH /api/admin/users/:id
   */
  public async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const body: AdminUpdateUserInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const updated = await adminUserManagementService.updateUser(id, body, adminUser);
      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Traveler user updated successfully',
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * DELETE /api/admin/users/:id
   */
  public async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const adminUser = (req as any).admin;
      await adminUserManagementService.softDeleteUser(id, adminUser);
      return res.status(200).json({
        success: true,
        message: 'Traveler user deleted successfully',
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/users/bulk-action
   */
  public async bulkUserAction(req: Request, res: Response, next: NextFunction) {
    try {
      const body: AdminBulkUserActionInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const result = await adminUserManagementService.bulkUserAction(body, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/users/:id/reset-password
   */
  public async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const adminUser = (req as any).admin;
      const result = await adminUserManagementService.resetPassword(id, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * POST /api/admin/users/:id/notifications
   */
  public async sendNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const body: AdminSendNotificationInput = (req as any).validatedBody || req.body;
      const adminUser = (req as any).admin;
      const result = await adminUserManagementService.sendNotification(id, body, adminUser);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      return next(err);
    }
  }
}

export const adminUserManagementController = new AdminUserManagementController();
