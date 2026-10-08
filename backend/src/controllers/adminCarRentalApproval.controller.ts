import { Request, Response } from 'express';
import { adminCarRentalApprovalService } from '../services/adminCarRentalApproval.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { logger } from '../config/logger.config.js';

export class AdminCarRentalApprovalController {
  /**
   * GET /api/admin/car-rental-requests/stats
   */
  public getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await adminCarRentalApprovalService.getSummaryStats();
      ResponseUtil.success(res, stats, 'Car rental request summary stats retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching car rental request stats: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch statistics.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/car-rental-requests
   */
  public getRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await adminCarRentalApprovalService.getCarRentalRequests(req.query as any);
      ResponseUtil.success(res, result, 'Car rental requests retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching car rental requests: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch car rental requests.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/car-rental-requests/export
   */
  public exportCsv = async (req: Request, res: Response): Promise<void> => {
    try {
      const csvData = await adminCarRentalApprovalService.exportCsv(req.query as any);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="car-rental-approvals-${Date.now()}.csv"`);
      res.status(200).send(csvData);
    } catch (error: any) {
      logger.error('Error exporting car rental requests CSV: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to export CSV.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/car-rental-requests/:id
   */
  public getRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const request = await adminCarRentalApprovalService.getCarRentalRequestById(req.params.id as string);
      ResponseUtil.success(res, request, 'Car rental application details retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching car rental request by ID: %s', error.message);
      ResponseUtil.error(res, error.message || 'Application not found.', HTTP_STATUS.NOT_FOUND);
    }
  };

  /**
   * POST /api/admin/car-rental-requests/:id/notes
   */
  public saveNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { note } = req.body;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.saveReviewNotes(
        req.params.id as string,
        adminUser,
        note,
        reqContext
      );
      ResponseUtil.success(res, result, 'Review note saved successfully.');
    } catch (error: any) {
      logger.error('Error saving review note: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to save review note.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/approve
   */
  public approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { notes } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.approveCarRental(
        req.params.id as string,
        adminUser,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Car rental provider approved successfully.');
    } catch (error: any) {
      logger.error('Error approving car rental request: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to approve car rental provider.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/reject
   */
  public reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { reason, notes } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.rejectCarRental(
        req.params.id as string,
        adminUser,
        reason,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Car rental application rejected.');
    } catch (error: any) {
      logger.error('Error rejecting car rental request: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to reject application.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/request-changes
   */
  public requestChanges = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { issues, message } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.requestChanges(
        req.params.id as string,
        adminUser,
        issues,
        message,
        reqContext
      );
      ResponseUtil.success(res, result, 'Changes requested from car rental applicant.');
    } catch (error: any) {
      logger.error('Error requesting changes: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to request changes.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/suspend
   */
  public suspend = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { reason } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.suspendCarRental(
        req.params.id as string,
        adminUser,
        reason,
        reqContext
      );
      ResponseUtil.success(res, result, 'Car rental operations suspended.');
    } catch (error: any) {
      logger.error('Error suspending car rental operations: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to suspend operations.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/reopen
   */
  public reopen = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.reopenReview(
        req.params.id as string,
        adminUser,
        reqContext
      );
      ResponseUtil.success(res, result, 'Application review reopened.');
    } catch (error: any) {
      logger.error('Error reopening review: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to reopen review.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/car-rental-requests/:id/approve-documents
   */
  public approveDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { documentIds } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.approveDocuments(
        req.params.id as string,
        adminUser,
        documentIds,
        reqContext
      );
      ResponseUtil.success(res, result, 'Fleet documents approved successfully.');
    } catch (error: any) {
      logger.error('Error approving documents: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to approve documents.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/admin/car-rental-requests/bulk-action
   */
  public bulkAction = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { action, ids, data } = req.body;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminCarRentalApprovalService.bulkAction(
        action,
        ids,
        data,
        adminUser,
        reqContext
      );
      ResponseUtil.success(res, result, 'Bulk action executed successfully.');
    } catch (error: any) {
      logger.error('Error executing bulk action: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to execute bulk action.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public getAllRoutes = async (req: Request, res: Response): Promise<void> => {
    try {
      const routes = await adminCarRentalApprovalService.getAllRoutes(req.query as any);
      ResponseUtil.success(res, { routes }, 'Car rental routes retrieved successfully.');
    } catch (error: any) {
      logger.error('Error getting car rental routes: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to get routes.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public setRouteStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { routeId } = req.params;
      const { status } = req.body;
      const result = await adminCarRentalApprovalService.setRouteStatus(routeId as string, status);
      ResponseUtil.success(res, result, `Route status set to ${status}.`);
    } catch (error: any) {
      logger.error('Error updating route status: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to update route status.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public getRentalVehicles = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await adminCarRentalApprovalService.getRentalVehicles(req.query as any);
      ResponseUtil.success(res, result, 'Rental vehicles retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching rental vehicles: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch rental vehicles.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public setRentalVehicleStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      const result = await adminCarRentalApprovalService.setRentalVehicleStatus(id as string, action);
      ResponseUtil.success(res, result, `Rental vehicle ${action}d successfully.`);
    } catch (error: any) {
      logger.error('Error updating rental vehicle status: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to update vehicle status.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public getRentalBookings = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await adminCarRentalApprovalService.getRentalBookings(req.query as any);
      ResponseUtil.success(res, result, 'Rental bookings retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching rental bookings: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch rental bookings.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  public getRentalAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await adminCarRentalApprovalService.getRentalAnalytics();
      ResponseUtil.success(res, stats, 'Rental analytics retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching rental analytics: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch analytics.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}

export const adminCarRentalApprovalController = new AdminCarRentalApprovalController();
