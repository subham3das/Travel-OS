import { Request, Response } from 'express';
import { adminAgencyRequestService } from '../services/adminAgencyRequest.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { logger } from '../config/logger.config.js';

export class AdminAgencyRequestController {
  /**
   * GET /api/admin/agency-requests/stats
   */
  public getStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const stats = await adminAgencyRequestService.getSummaryStats();
      ResponseUtil.success(res, stats, 'Agency request summary stats retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching agency request stats: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch agency request statistics.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/agency-requests
   */
  public getRequests = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await adminAgencyRequestService.getAgencyRequests(req.query as any);
      ResponseUtil.success(res, result, 'Agency requests retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching agency requests: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch agency requests.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/agency-requests/export
   */
  public exportCsv = async (req: Request, res: Response): Promise<void> => {
    try {
      const csvData = await adminAgencyRequestService.exportRequestsCsv(req.query as any);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="agency-requests-${Date.now()}.csv"`);
      res.status(200).send(csvData);
    } catch (error: any) {
      logger.error('Error exporting agency requests CSV: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to export CSV.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/agency-requests/:id
   */
  public getRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
      const agency = await adminAgencyRequestService.getAgencyRequestById(req.params.id as string);
      ResponseUtil.success(res, agency, 'Agency request details retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching agency request by ID: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch agency details.', HTTP_STATUS.NOT_FOUND);
    }
  };

  /**
   * POST /api/admin/agency-requests/:id/notes
   */
  public saveNotes = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { note } = req.body;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.saveReviewNotes(
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
   * PUT /api/admin/agency-requests/:id/approve
   */
  public approve = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { notes } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.approveRequest(
        req.params.id as string,
        adminUser,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Agency approved successfully.');
    } catch (error: any) {
      logger.error('Error approving agency request: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to approve agency.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/agency-requests/:id/approve-documents
   */
  public approveDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { documentIds, notes } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.approveDocuments(
        req.params.id as string,
        adminUser,
        documentIds,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Documents approved successfully.');
    } catch (error: any) {
      logger.error('Error approving agency documents: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to approve agency documents.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/agency-requests/:id/approve-bank
   */
  public approveBankDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { notes } = req.body || {};
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.approveBankDetails(
        req.params.id as string,
        adminUser,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Bank details approved successfully.');
    } catch (error: any) {
      logger.error('Error approving agency bank details: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to approve bank details.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT /api/admin/agency-requests/:id/reject
   */
  public reject = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { reason, notes } = req.body;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.rejectRequest(
        req.params.id as string,
        adminUser,
        reason,
        notes,
        reqContext
      );
      ResponseUtil.success(res, result, 'Agency rejected successfully.');
    } catch (error: any) {
      logger.error('Error rejecting agency request: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to reject agency.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * PUT/POST /api/admin/agency-requests/:id/request-docs OR /request-documents
   */
  public requestDocs = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { missingDocuments, requestedDocuments, notes, agencyMessage } = req.body || {};
      const docsPayload = requestedDocuments || missingDocuments;
      const messagePayload = agencyMessage || notes;

      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.requestMoreDocuments(
        req.params.id as string,
        adminUser,
        docsPayload,
        messagePayload,
        reqContext
      );
      ResponseUtil.success(res, result, 'Document re-upload request sent successfully.');
    } catch (error: any) {
      logger.error('Error requesting documents for agency: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to request documents.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * GET /api/admin/agency-requests/:id/requested-documents
   */
  public getRequestedDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await adminAgencyRequestService.getRequestedDocuments(req.params.id as string);
      ResponseUtil.success(res, result, 'Requested documents history retrieved successfully.');
    } catch (error: any) {
      logger.error('Error fetching requested documents for agency: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to fetch requested documents.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };

  /**
   * POST /api/admin/agency-requests/bulk-action
   */
  public bulkAction = async (req: Request, res: Response): Promise<void> => {
    try {
      const adminUser = (req as any).admin;
      const { action, agencyIds, reason, notes, missingDocuments } = req.body;
      const reqContext = {
        ip: String(req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'),
        browser: String(req.headers['user-agent'] || 'Chrome'),
      };

      const result = await adminAgencyRequestService.bulkAction(
        action,
        agencyIds,
        adminUser,
        { reason, notes, missingDocuments },
        reqContext
      );
      ResponseUtil.success(res, result, 'Bulk action executed successfully.');
    } catch (error: any) {
      logger.error('Error executing bulk action on agency requests: %s', error.message);
      ResponseUtil.error(res, error.message || 'Failed to execute bulk action.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}

export const adminAgencyRequestController = new AdminAgencyRequestController();
