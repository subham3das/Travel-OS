import { Request, Response } from 'express';
import { adminAuditLogsService } from '../services/adminAuditLogs.service.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class AdminAuditLogsController {
  /**
   * Fetch Paginated & Filtered Audit Logs
   */
  public getAuditLogs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      search,
      category,
      severity,
      module,
      status,
      startDate,
      endDate,
      page = '1',
      limit = '20',
    } = req.query as Record<string, string>;

    const result = await adminAuditLogsService.getAuditLogs(
      {
        search,
        category,
        severity,
        module,
        status,
        startDate,
        endDate,
      },
      parseInt(page, 10) || 1,
      parseInt(limit, 10) || 20
    );

    ResponseUtil.success(res, result, 'Audit logs retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Real-time Dashboard KPI Telemetry
   */
  public getKPIStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const stats = await adminAuditLogsService.getKPIStats();
    ResponseUtil.success(res, stats, 'Audit KPI statistics retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Grouped Categories
   */
  public getCategories = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const categories = await adminAuditLogsService.getCategories();
    ResponseUtil.success(res, categories, 'Audit categories retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Module Distribution Breakdown
   */
  public getDistribution = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const distribution = await adminAuditLogsService.getDistribution();
    ResponseUtil.success(res, distribution, 'Event distribution retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Top Active Admins
   */
  public getTopAdmins = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const topAdmins = await adminAuditLogsService.getTopAdmins();
    ResponseUtil.success(res, topAdmins, 'Top active administrators retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Security Alerts
   */
  public getSecurityAlerts = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const alerts = await adminAuditLogsService.getSecurityAlerts();
    ResponseUtil.success(res, alerts, 'Security alerts retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Temporal Login Activity Heatmap
   */
  public getLoginHeatmap = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const matrix = await adminAuditLogsService.getLoginHeatmap();
    ResponseUtil.success(res, matrix, 'Login activity heatmap retrieved successfully', HTTP_STATUS.OK);
  });

  /**
   * Fetch Single Audit Log Event Details
   */
  public getAuditLogById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params.id);
    const log = await adminAuditLogsService.getAuditLogById(id);
    ResponseUtil.success(res, log, 'Audit log event retrieved successfully', HTTP_STATUS.OK);
  });
}

export const adminAuditLogsController = new AdminAuditLogsController();
