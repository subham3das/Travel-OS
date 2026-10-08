import crypto from 'crypto';
import { logger } from '../config/logger.config.js';
import {
  PaymentRetryQueueModel,
  RetryOperationType,
  IPaymentRetryQueue,
} from '../models/paymentRetryQueue.model.js';
import { SettlementEventModel } from '../models/settlementEvent.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { BadRequestError, NotFoundError } from '../utils/errors.util.js';
import { settlementEngineService } from './settlementEngine.service.js';
import { refundService } from './refund.service.js';
import { sellerPaymentProfileService } from './sellerPaymentProfile.service.js';
import { reconciliationService } from './reconciliation.service.js';

export interface IScheduleRetryParams {
  operationType: RetryOperationType;
  entityId: string;
  entityType: string;
  payload?: Record<string, any>;
  idempotencyKey?: string;
  maxRetries?: number;
  baseDelayMs?: number;
  correlationId?: string;
}

export class RetryEngineService {
  private isWorkerRunning = false;
  private workerInterval: NodeJS.Timeout | null = null;
  private readonly DEFAULT_BASE_DELAY_MS = 30 * 1000; // 30s base delay
  private readonly DEFAULT_MAX_RETRIES = 5;

  constructor() {
    this.startWorker();
  }

  /**
   * Start recurring background retry processor
   */
  public startWorker(intervalMs = 30 * 1000) {
    if (this.workerInterval) return;
    this.workerInterval = setInterval(() => {
      this.processDueRetries().catch((err) => {
        logger.error('❌ RetryEngine background runner error:', err);
      });
    }, intervalMs);
    logger.info('⚙️ Centralized Payment RetryEngine worker initialized.');
  }

  public stopWorker() {
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
  }

  /**
   * Schedule or update an operation in the centralized retry queue
   */
  public async scheduleRetry(params: IScheduleRetryParams): Promise<IPaymentRetryQueue> {
    const {
      operationType,
      entityId,
      entityType,
      payload = {},
      idempotencyKey = `${operationType}:${entityId}`,
      maxRetries = this.DEFAULT_MAX_RETRIES,
      baseDelayMs = this.DEFAULT_BASE_DELAY_MS,
      correlationId = `corr_${Date.now().toString(36)}`,
    } = params;

    let existing = await PaymentRetryQueueModel.findOne({ idempotencyKey, isDeleted: false });

    if (existing) {
      if (existing.status === 'COMPLETED') {
        return existing;
      }
      // If exhausted or failed, re-arm with updated delay
      existing.nextAttemptAt = new Date(Date.now() + baseDelayMs);
      existing.status = 'SCHEDULED';
      if (payload) existing.payload = { ...(existing.payload || {}), ...payload };
      await existing.save();
      return existing;
    }

    const retryId = `RTR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newItem = await PaymentRetryQueueModel.create({
      retryId,
      operationType,
      entityId,
      entityType,
      idempotencyKey,
      payload,
      status: 'SCHEDULED',
      retryCount: 0,
      maxRetries,
      baseDelayMs,
      nextAttemptAt: new Date(Date.now() + baseDelayMs),
      retryHistory: [],
      correlationId,
      workerId: 'worker-retry-primary',
    });

    logger.info('📌 Scheduled operation %s for entity %s (RetryId: %s)', operationType, entityId, retryId);
    return newItem;
  }

  /**
   * Process all due retries using exponential backoff with jitter
   */
  public async processDueRetries(): Promise<number> {
    if (this.isWorkerRunning) return 0;
    this.isWorkerRunning = true;

    let processedCount = 0;
    try {
      const now = new Date();
      const dueItems = await PaymentRetryQueueModel.find({
        status: 'SCHEDULED',
        nextAttemptAt: { $lte: now },
        isDeleted: false,
      })
        .limit(20)
        .exec();

      for (const item of dueItems) {
        // Lock item
        item.status = 'IN_PROGRESS';
        item.lastAttemptAt = new Date();
        await item.save();

        const startTime = Date.now();
        try {
          const result = await this.executeOperation(item);
          const durationMs = Date.now() - startTime;

          item.status = 'COMPLETED';
          item.completedAt = new Date();
          item.retryHistory.push({
            attemptNumber: item.retryCount + 1,
            timestamp: new Date(),
            durationMs,
            gatewayResponse: result,
            workerId: item.workerId,
          });
          item.lastError = undefined;
          item.stackTrace = undefined;
          await item.save();

          await SettlementEventModel.create({
            eventType: 'OPERATION_RETRY_SUCCEEDED',
            previousStatus: 'SCHEDULED',
            newStatus: 'COMPLETED',
            eventSource: 'RETRY_ENGINE',
            notes: `Operation ${item.operationType} on ${item.entityType}:${item.entityId} succeeded after ${item.retryCount + 1} attempt(s).`,
            metadata: { retryId: item.retryId, operationType: item.operationType, entityId: item.entityId },
          }).catch(() => {});

          processedCount++;
        } catch (err: any) {
          const durationMs = Date.now() - startTime;
          const nextRetryCount = item.retryCount + 1;
          item.retryCount = nextRetryCount;
          item.lastError = err.message;
          item.stackTrace = err.stack;

          item.retryHistory.push({
            attemptNumber: nextRetryCount,
            timestamp: new Date(),
            durationMs,
            error: err.message,
            workerId: item.workerId,
          });

          if (nextRetryCount >= item.maxRetries) {
            item.status = 'EXHAUSTED';
            logger.error(
              '🚨 Centralized Retry Exhausted for %s on %s after %d retries: %s',
              item.operationType,
              item.entityId,
              nextRetryCount,
              err.message
            );

            await SettlementEventModel.create({
              eventType: 'OPERATION_RETRY_EXHAUSTED',
              previousStatus: 'IN_PROGRESS',
              newStatus: 'EXHAUSTED',
              eventSource: 'RETRY_ENGINE',
              notes: `Operation ${item.operationType} on ${item.entityType}:${item.entityId} exhausted all ${item.maxRetries} retries. Error: ${err.message}`,
              metadata: { retryId: item.retryId, error: err.message },
            }).catch(() => {});

            // Alert admin via notifications
            await NotificationDispatcher.notifyAdmin({
              category: 'Payments',
              title: `Payment Operation Failed: ${item.operationType}`,
              description: `Entity ${item.entityId} has exhausted ${item.maxRetries} automatic retries. Last error: ${err.message}`,
              priority: 'HIGH',
              targetRoute: '/admin/finance',
              metadata: { retryId: item.retryId, entityId: item.entityId, operationType: item.operationType },
            }).catch(() => {});
          } else {
            // Exponential backoff: baseDelayMs * 2^(retryCount) + jitter (0-20%)
            const jitter = Math.random() * 0.2 + 0.9; // 90% to 110%
            const delay = Math.round(item.baseDelayMs * Math.pow(2, nextRetryCount) * jitter);
            item.status = 'SCHEDULED';
            item.nextAttemptAt = new Date(Date.now() + delay);

            logger.warn(
              '⚠️ Operation %s failed (Attempt %d/%d). Next retry in %ds: %s',
              item.operationType,
              nextRetryCount,
              item.maxRetries,
              Math.round(delay / 1000),
              err.message
            );
          }

          await item.save();
        }
      }
    } finally {
      this.isWorkerRunning = false;
    }

    return processedCount;
  }

  /**
   * Internal operation executor router
   */
  private async executeOperation(item: IPaymentRetryQueue): Promise<any> {
    switch (item.operationType) {
      case 'TRANSFER_CREATION':
        return await settlementEngineService.retryPendingTransfer(item.entityId);

      case 'SETTLEMENT_SYNC':
        // Sync settlement status from gateway
        return await settlementEngineService.syncSingleSettlementFromGateway(item.entityId);

      case 'REFUND_EXECUTION':
        return await refundService.retryFailedRefund(item.entityId);

      case 'ROUTE_ONBOARDING':
      case 'FUND_ACCOUNT_CREATION':
      case 'LINKED_ACCOUNT_CREATION':
        return await sellerPaymentProfileService.retryProfileProvisioning(
          item.entityId,
          (item.payload?.sellerType as any) || 'Agency'
        );

      case 'RECONCILIATION_FETCH':
        return await reconciliationService.reconcileSingleDate(item.payload?.date);

      default:
        throw new BadRequestError(`Unsupported retry operation type: ${item.operationType}`);
    }
  }

  /**
   * Phase 9: Admin Manual Trigger for a single retry item
   */
  public async manualRetry(retryId: string, admin?: any) {
    const item = await PaymentRetryQueueModel.findOne({ retryId, isDeleted: false });
    if (!item) {
      throw new NotFoundError(`Retry queue entry not found: ${retryId}`);
    }

    const startTime = Date.now();
    item.status = 'IN_PROGRESS';
    item.lastAttemptAt = new Date();
    await item.save();

    try {
      const result = await this.executeOperation(item);
      const durationMs = Date.now() - startTime;

      item.status = 'COMPLETED';
      item.completedAt = new Date();
      item.retryHistory.push({
        attemptNumber: item.retryCount + 1,
        timestamp: new Date(),
        durationMs,
        gatewayResponse: result,
        workerId: `admin-${admin?.name || 'SuperAdmin'}`,
      });
      item.lastError = undefined;
      await item.save();

      await SettlementEventModel.create({
        eventType: 'OPERATION_MANUAL_RETRY_SUCCEEDED',
        previousStatus: 'FAILED',
        newStatus: 'COMPLETED',
        eventSource: 'ADMIN_OPERATIONS',
        actor: {
          id: admin?._id?.toString() || 'ADMIN',
          name: admin?.name || 'Super Admin',
          role: 'SUPER_ADMIN',
        },
        notes: `Manual retry for ${item.operationType} (${item.entityId}) executed with success.`,
        metadata: { retryId: item.retryId },
      }).catch(() => {});

      return { success: true, message: `Retry ${retryId} succeeded.`, result };
    } catch (err: any) {
      item.status = 'FAILED';
      item.lastError = err.message;
      item.stackTrace = err.stack;
      await item.save();
      throw err;
    }
  }

  /**
   * Cancel or abort an active retry item
   */
  public async cancelRetry(retryId: string, admin?: any) {
    const item = await PaymentRetryQueueModel.findOne({ retryId, isDeleted: false });
    if (!item) {
      throw new NotFoundError(`Retry queue entry not found: ${retryId}`);
    }

    item.status = 'CANCELLED';
    await item.save();

    await SettlementEventModel.create({
      eventType: 'OPERATION_RETRY_CANCELLED',
      previousStatus: 'SCHEDULED',
      newStatus: 'CANCELLED',
      eventSource: 'ADMIN_OPERATIONS',
      actor: {
        id: admin?._id?.toString() || 'ADMIN',
        name: admin?.name || 'Super Admin',
        role: 'SUPER_ADMIN',
      },
      notes: `Retry ${retryId} cancelled by admin.`,
      metadata: { retryId: item.retryId },
    }).catch(() => {});

    return { success: true, message: `Retry ${retryId} cancelled.` };
  }

  /**
   * Phase 9: Admin Query with filters, pagination, and status breakdown
   */
  public async getRetryQueue(filters: {
    operationType?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { operationType, status, search, page = 1, limit = 20 } = filters;
    const query: any = { isDeleted: false };

    if (operationType && operationType !== 'all') {
      query.operationType = operationType;
    }
    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { retryId: regex },
        { entityId: regex },
        { idempotencyKey: regex },
        { lastError: regex },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const [items, total, statsAgg] = await Promise.all([
      PaymentRetryQueueModel.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      PaymentRetryQueueModel.countDocuments(query),
      PaymentRetryQueueModel.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const stats = {
      scheduled: 0,
      inProgress: 0,
      completed: 0,
      failed: 0,
      exhausted: 0,
      cancelled: 0,
      total: 0,
    };

    statsAgg.forEach((g: any) => {
      if (g._id === 'SCHEDULED') stats.scheduled = g.count;
      if (g._id === 'IN_PROGRESS') stats.inProgress = g.count;
      if (g._id === 'COMPLETED') stats.completed = g.count;
      if (g._id === 'FAILED') stats.failed = g.count;
      if (g._id === 'EXHAUSTED') stats.exhausted = g.count;
      if (g._id === 'CANCELLED') stats.cancelled = g.count;
      stats.total += g.count;
    });

    return {
      items,
      total,
      page: Math.max(1, page),
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      stats,
    };
  }
}

export const retryEngineService = new RetryEngineService();
