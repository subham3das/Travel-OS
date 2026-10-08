import { Request, Response } from 'express';
import { settlementEngineService } from '../services/settlementEngine.service.js';
import { reconciliationService } from '../services/reconciliation.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

import { operationalMonitoringService } from '../services/operationalMonitoring.service.js';

export class SettlementController {
  /**
   * 1. Agency: Get Settlement Dashboard Data (Summary KPIs + Table)
   */
  public getAgencySettlements = async (req: Request, res: Response): Promise<void> => {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) {
        throw new BadRequestError('Agency identity not found in request context.');
      }

      const { status, search, page, limit } = req.query;

      const data = await settlementEngineService.getAgencySettlementDashboard(agencyId, {
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });

      ResponseUtil.success(res, data, 'Agency settlements retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch settlements', error.statusCode || 500);
    }
  };

  /**
   * 2. Agency: Get Settlement Details Dossier with Immutable Timeline
   */
  public getSettlementDetails = async (req: Request, res: Response): Promise<void> => {
    try {
      const settlementId = String(req.params.id);

      const details = await settlementEngineService.getSettlementDetails(settlementId);
      ResponseUtil.success(res, details, 'Settlement details and audit ledger timeline retrieved');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch settlement details', error.statusCode || 404);
    }
  };

  /**
   * 3. Admin: Get Platform-wide Settlement Overview & Health
   */
  public getAdminSettlements = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await settlementEngineService.getAdminSettlementOverview();
      ResponseUtil.success(res, data, 'Admin settlement telemetry retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch settlement overview', 500);
    }
  };

  /**
   * 4. Admin: Run Scheduled / On-Demand Daily Reconciliation
   */
  public runReconciliation = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await reconciliationService.runDailyReconciliation();
      ResponseUtil.success(res, result, 'Reconciliation job executed successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Reconciliation failed', 500);
    }
  };

  /**
   * 5. Admin: Get Real-time Operational Monitoring & SLA Metrics
   */
  public getOperationalMonitoring = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = await operationalMonitoringService.getOperationalMetrics();
      ResponseUtil.success(res, metrics, 'Operational monitoring metrics retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch operational metrics', 500);
    }
  };

  /**
   * 6. Admin: Search and Paginate Immutable Financial Audit Logs
   */
  public getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search, eventType, eventSource, sellerId, startDate, endDate, page, limit } = req.query;
      const logs = await operationalMonitoringService.getAuditLogs({
        search: search as string,
        eventType: eventType as string,
        eventSource: eventSource as string,
        sellerId: sellerId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      ResponseUtil.success(res, logs, 'Financial audit logs retrieved successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to fetch audit logs', 500);
    }
  };

  /**
   * 7. Admin: Retry Failed or Pending Transfer (Phase 4)
   */
  public retryTransfer = async (req: Request, res: Response): Promise<void> => {
    try {
      const transferId = String(req.params.transferId);
      const admin = (req as any).admin || (req as any).user;
      const result = await settlementEngineService.retryTransfer(transferId, admin);
      ResponseUtil.success(res, result, 'Transfer retried successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to retry transfer', error.statusCode || 500);
    }
  };

  /**
   * 8. Admin: Record Financial Adjustment on Settlement (Phase 7)
   */
  public recordAdjustment = async (req: Request, res: Response): Promise<void> => {
    try {
      const settlementId = String(req.params.settlementId);
      const { amount, reason, notes } = req.body;
      if (!amount || !reason) {
        throw new BadRequestError('amount and reason are required fields');
      }

      const admin = (req as any).admin || (req as any).user;
      const result = await settlementEngineService.recordFinancialAdjustment({
        settlementId,
        amount: Number(amount),
        reason,
        admin,
        notes,
      });

      ResponseUtil.success(res, result, 'Financial adjustment recorded successfully');
    } catch (error: any) {
      ResponseUtil.error(res, error.message || 'Failed to record adjustment', error.statusCode || 500);
    }
  };
}

export const settlementController = new SettlementController();


