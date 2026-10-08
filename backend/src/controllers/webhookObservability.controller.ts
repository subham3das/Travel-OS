import { Request, Response, NextFunction } from 'express';
import { webhookQueueService } from '../services/webhookQueue.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { BadRequestError } from '../utils/errors.util.js';

export class WebhookObservabilityController {
  /**
   * Admin: Get Webhook Ingestion Logs
   * GET /api/admin/webhooks/logs
   */
  public async getWebhookLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const event = req.query.event as string;
      const status = req.query.status as string;
      const search = req.query.search as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const result = await webhookQueueService.getWebhookLogs({ event, status, search, limit, skip });
      return ResponseUtil.success(res, result, 'Webhook logs retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Get Dead Letter Queue (DLQ) Items
   * GET /api/admin/webhooks/dlq
   */
  public async getDLQItems(req: Request, res: Response, next: NextFunction) {
    try {
      const dlqStatus = req.query.dlqStatus as string;
      const search = req.query.search as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const skip = (page - 1) * limit;

      const result = await webhookQueueService.getDLQItems({ dlqStatus, search, limit, skip });
      return ResponseUtil.success(res, result, 'DLQ items retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Replay Single Webhook Event
   * POST /api/admin/webhooks/replay/:eventId
   */
  public async replayWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = String(req.params.eventId);
      const admin = (req as any).admin || (req as any).user;
      const result = await webhookQueueService.replayWebhook(eventId, admin);
      return ResponseUtil.success(res, result, result.message);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Batch Replay DLQ Items
   * POST /api/admin/webhooks/dlq/replay-batch
   */
  public async replayBatch(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventIds } = req.body;
      if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
        throw new BadRequestError('eventIds array is required.');
      }
      const admin = (req as any).admin || (req as any).user;
      const result = await webhookQueueService.replayBatch(eventIds, admin);
      return ResponseUtil.success(res, result, 'Batch replay triggered');
    } catch (err) {
      next(err);
    }
  }

  /**
   * Admin: Resolve DLQ Item
   * POST /api/admin/webhooks/dlq/:eventId/resolve
   */
  public async resolveDLQItem(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = String(req.params.eventId);
      const { notes } = req.body;
      const admin = (req as any).admin || (req as any).user;
      const result = await webhookQueueService.resolveDLQItem(eventId, notes || 'Resolved by admin', admin);
      return ResponseUtil.success(res, result, 'DLQ item resolved successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const webhookObservabilityController = new WebhookObservabilityController();
