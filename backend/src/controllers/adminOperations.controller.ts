import { Request, Response, NextFunction } from 'express';
import { operationalMonitoringService } from '../services/operationalMonitoring.service.js';
import { retryEngineService } from '../services/retryEngine.service.js';
import { webhookQueueService } from '../services/webhookQueue.service.js';
import { settlementEngineService } from '../services/settlementEngine.service.js';
import { refundService } from '../services/refund.service.js';
import { sellerPaymentProfileService } from '../services/sellerPaymentProfile.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class AdminOperationsController {
  /**
   * 1. Get Real-Time Operations Monitoring Dashboard (Phase 6)
   * GET /api/admin/operations/metrics
   */
  public getMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metrics = await operationalMonitoringService.getOperationalMetrics();
      ResponseUtil.success(res, metrics, 'Operational metrics retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 2. Global Universal Finance Search (Phase 7)
   * GET /api/admin/operations/search
   */
  public search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const q = (req.query.q as string) || '';
      const results = await operationalMonitoringService.globalFinanceSearch(q);
      ResponseUtil.success(res, results, 'Universal finance search executed');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 3. Paginated Centralized Retry Queue (Phase 3 & 9)
   * GET /api/admin/operations/retry-queue
   */
  public getRetryQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { operationType, status, search, page, limit } = req.query;
      const result = await retryEngineService.getRetryQueue({
        operationType: operationType as string,
        status: status as string,
        search: search as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      ResponseUtil.success(res, result, 'Retry queue retrieved successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 4. Trigger Manual Retry on Queue Item (Phase 9)
   * POST /api/admin/operations/retry-queue/:retryId/retry
   */
  public triggerManualRetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const retryId = String(req.params.retryId);
      const admin = (req as any).admin || (req as any).user;
      const result = await retryEngineService.manualRetry(retryId, admin);
      ResponseUtil.success(res, result, 'Manual retry executed successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 5. Cancel Pending Retry in Queue (Phase 9)
   * POST /api/admin/operations/retry-queue/:retryId/cancel
   */
  public cancelRetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const retryId = String(req.params.retryId);
      const admin = (req as any).admin || (req as any).user;
      const result = await retryEngineService.cancelRetry(retryId, admin);
      ResponseUtil.success(res, result, 'Retry cancelled successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 6. Retry Failed Route Transfer (Phase 9)
   * POST /api/admin/operations/transfers/:transferId/retry
   */
  public retryTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transferId = String(req.params.transferId);
      const admin = (req as any).admin || (req as any).user;
      const result = await settlementEngineService.retryTransfer(transferId, admin);
      ResponseUtil.success(res, result, 'Transfer retried successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 7. Retry Failed Refund Execution (Phase 9)
   * POST /api/admin/operations/refunds/:refundId/retry
   */
  public retryRefund = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refundId = String(req.params.refundId);
      const admin = (req as any).admin || (req as any).user;
      const result = await refundService.retryFailedRefund(refundId, admin);
      ResponseUtil.success(res, result, 'Refund retry executed successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 8. Retry Settlement Gateway Sync (Phase 9)
   * POST /api/admin/operations/settlements/:settlementId/sync
   */
  public retrySettlementSync = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settlementId = String(req.params.settlementId);
      const result = await settlementEngineService.syncSingleSettlementFromGateway(settlementId);
      ResponseUtil.success(res, result, 'Settlement sync completed');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 9. Replay Webhook Event (Phase 9)
   * POST /api/admin/operations/webhooks/replay/:eventId
   */
  public replayWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = String(req.params.eventId);
      const admin = (req as any).admin || (req as any).user;
      const result = await webhookQueueService.replayWebhook(eventId, admin);
      ResponseUtil.success(res, result, 'Webhook replay completed successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 10. Archive DLQ Item (Phase 9)
   * POST /api/admin/operations/dlq/:eventId/archive
   */
  public archiveDLQItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const eventId = String(req.params.eventId);
      const { notes } = req.body;
      const admin = (req as any).admin || (req as any).user;
      const result = await webhookQueueService.archiveDLQItem(eventId, notes || 'Archived by admin', admin);
      ResponseUtil.success(res, result, 'DLQ item archived successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 11. Place Payout Hold on Seller (Phase 5 & 9)
   * POST /api/admin/operations/sellers/:sellerId/hold
   */
  public placePayoutHold = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const { reason } = req.body;
      if (!reason) {
        throw new BadRequestError('reason is required to place a payout hold');
      }
      const admin = (req as any).admin || (req as any).user;
      const profile = await sellerPaymentProfileService.placePayoutHold(sellerId, reason, admin);
      ResponseUtil.success(res, profile, 'Payout hold placed successfully');
    } catch (err) {
      next(err);
    }
  };

  /**
   * 12. Release Payout Hold on Seller (Phase 5 & 9)
   * POST /api/admin/operations/sellers/:sellerId/release-hold
   */
  public releasePayoutHold = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = String(req.params.sellerId);
      const { reason } = req.body;
      const admin = (req as any).admin || (req as any).user;
      const profile = await sellerPaymentProfileService.releasePayoutHold(sellerId, reason || 'Hold released by administrator', admin);
      ResponseUtil.success(res, profile, 'Payout hold released successfully');
    } catch (err) {
      next(err);
    }
  };
}

export const adminOperationsController = new AdminOperationsController();
