import crypto from 'crypto';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';
import { WebhookLogModel } from '../models/webhookLog.model.js';
import { DeadLetterQueueModel } from '../models/deadLetterQueue.model.js';
import { SettlementEventModel } from '../models/settlementEvent.model.js';
import { paymentService } from './payment.service.js';
import { BadRequestError } from '../utils/errors.util.js';

export class WebhookQueueService {
  private isProcessing = false;
  private workerInterval: NodeJS.Timeout | null = null;
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAYS_MS = [
    30 * 1000, // Retry 1: 30 seconds
    2 * 60 * 1000, // Retry 2: 2 minutes
    10 * 60 * 1000, // Retry 3: 10 minutes
  ];

  constructor() {
    this.startWorker();
  }

  /**
   * Validate signature, persist raw event immediately, and queue for async execution
   */
  public async enqueueWebhook(
    rawBody: Buffer | string,
    signature: string,
    payload: any
  ): Promise<{ received: boolean; queued: boolean; eventId: string; status?: string }> {
    if (!signature) {
      throw new BadRequestError('Webhook signature header missing.');
    }

    const secret = envConfig.RAZORPAY_WEBHOOK_SECRET;
    const bodyStr = typeof rawBody === 'string' ? rawBody : rawBody.toString('utf-8');

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(bodyStr)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(signature, 'utf-8');

    if (
      expectedBuffer.length !== signatureBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)
    ) {
      logger.error('❌ Razorpay webhook signature verification failed.');
      throw new BadRequestError('Invalid webhook signature');
    }

    const event = payload.event;
    const eventId =
      payload.event_id ||
      payload.id ||
      payload.payload?.payment?.entity?.id ||
      crypto.createHash('md5').update(`${event}_${bodyStr}`).digest('hex');

    // Check for duplicate already processed or queued
    const existingLog = await WebhookLogModel.findOne({ eventId });
    if (existingLog) {
      logger.info('♻️ Idempotency: Duplicate webhook event %s already recorded (status: %s). Ignoring safely.', eventId, existingLog.status);
      return { received: true, queued: false, eventId, status: 'duplicate_ignored' };
    }

    // Persist to queue with status QUEUED
    await WebhookLogModel.findOneAndUpdate(
      { eventId },
      {
        eventId,
        event,
        source: 'Razorpay',
        status: 'QUEUED',
        signatureVerified: true,
        payload,
        nextRetryAt: new Date(),
        retryCount: 0,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    logger.info('📥 Webhook %s queued for reliable asynchronous processing (ID: %s)', event, eventId);

    // Trigger immediate async execution on next event loop tick
    setImmediate(() => {
      this.processQueue().catch((err) => {
        logger.error('Error during immediate webhook processing tick:', err);
      });
    });

    return { received: true, queued: true, eventId, status: 'queued' };
  }

  /**
   * Start background queue worker
   */
  public startWorker(): void {
    if (this.workerInterval) return;
    this.workerInterval = setInterval(() => {
      this.processQueue().catch((err) => {
        logger.error('Error in webhook queue worker iteration:', err);
      });
    }, 5000);
  }

  /**
   * Stop background worker (for graceful shutdown and tests)
   */
  public stopWorker(): void {
    if (this.workerInterval) {
      clearInterval(this.workerInterval);
      this.workerInterval = null;
    }
  }

  /**
   * Process all pending and retry-ready webhook items in queue
   */
  public async processQueue(): Promise<number> {
    if (this.isProcessing) return 0;
    this.isProcessing = true;

    let processedCount = 0;

    try {
      const now = new Date();
      const pendingEvents = await WebhookLogModel.find({
        status: { $in: ['QUEUED', 'FAILED'] },
        $or: [{ nextRetryAt: { $exists: false } }, { nextRetryAt: { $lte: now } }],
        retryCount: { $lt: this.MAX_RETRIES },
      })
        .sort({ createdAt: 1 })
        .limit(10);

      for (const log of pendingEvents) {
        log.status = 'PROCESSING';
        await log.save();

        const startTime = Date.now();
        try {
          await paymentService.processVerifiedWebhookPayload(log.event, log.eventId, log.payload);

          log.status = 'PROCESSED';
          log.processingTimeMs = Date.now() - startTime;
          log.processedAt = new Date();
          log.lastError = undefined;
          await log.save();

          processedCount++;
          logger.info('✅ Webhook event %s processed successfully in %dms (ID: %s)', log.event, log.processingTimeMs, log.eventId);
        } catch (err: any) {
          const newRetryCount = log.retryCount + 1;
          const isExhausted = newRetryCount >= this.MAX_RETRIES;

          const delay = this.RETRY_DELAYS_MS[newRetryCount - 1] || 7200000;
          log.retryCount = newRetryCount;
          log.processingTimeMs = Date.now() - startTime;
          log.lastError = err.message;
          log.errorStack = err.stack;
          log.lastTriedAt = new Date();

          if (isExhausted) {
            // Phase 2: Move to Dedicated Dead Letter Queue (DLQ)
            log.status = 'DLQ';
            log.isDLQ = true;
            log.dlqReason = `Max retries (${newRetryCount}) exhausted: ${err.message}`;
            log.dlqMovedAt = new Date();
            log.dlqStatus = 'PENDING_REVIEW';
            log.nextRetryAt = undefined;

            const payloadStr = JSON.stringify(log.payload || {});
            const payloadHash = crypto.createHash('sha256').update(payloadStr).digest('hex');
            const paymentId =
              log.payload?.payload?.payment?.entity?.id ||
              log.payload?.paymentId ||
              log.payload?.payload?.transfer?.entity?.source;
            const bookingId =
              log.payload?.payload?.payment?.entity?.notes?.bookingId ||
              log.payload?.notes?.bookingId ||
              log.payload?.payload?.transfer?.entity?.notes?.bookingId;

            await DeadLetterQueueModel.findOneAndUpdate(
              { eventId: log.eventId },
              {
                dlqId: `DLQ-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                originalPayload: log.payload,
                payloadHash,
                eventId: log.eventId,
                event: log.event,
                source: 'Razorpay',
                paymentId,
                bookingId,
                retryCount: newRetryCount,
                failureReason: err.message,
                stackTrace: err.stack,
                firstReceivedAt: (log as any).createdAt || new Date(),
                lastAttemptedAt: new Date(),
                status: 'PENDING_REVIEW',
                archived: false,
                workerId: 'worker-webhook-dlq',
              },
              { upsert: true, returnDocument: 'after' }
            ).catch((dlqErr) => {
              logger.error('Failed to persist to DeadLetterQueueModel:', dlqErr);
            });

            await SettlementEventModel.create({
              bookingId,
              paymentReferenceId: paymentId,
              eventType: 'WEBHOOK_MOVED_TO_DLQ',
              previousStatus: 'FAILED',
              newStatus: 'DLQ',
              eventSource: 'WEBHOOK_DLQ',
              notes: `Webhook event ${log.event} (${log.eventId}) moved to DLQ after ${newRetryCount} failed attempts. Reason: ${err.message}`,
              webhookId: log.eventId,
              razorpayReference: log.event,
            }).catch(() => {});

            logger.error(
              '🚨 Webhook event %s (ID: %s) moved to Dead Letter Queue (DLQ) after %d failed attempts.',
              log.event,
              log.eventId,
              newRetryCount
            );
          } else {
            log.status = 'FAILED';
            log.nextRetryAt = new Date(Date.now() + delay);
            logger.error(
              '⚠️ Webhook event %s failed (Attempt %d/5): %s. Next retry: %s',
              log.event,
              newRetryCount,
              err.message,
              log.nextRetryAt ? log.nextRetryAt.toISOString() : 'None'
            );
          }

          await log.save();
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return processedCount;
  }

  /**
   * Phase 5 & 6: Query Webhook Logs with Full Observability Filters
   */
  public async getWebhookLogs(filters: {
    event?: string;
    status?: string;
    search?: string;
    isDLQ?: boolean;
    limit?: number;
    skip?: number;
  }) {
    const query: any = {};
    if (filters.event && filters.event !== 'ALL') {
      query.event = filters.event;
    }
    if (filters.status && filters.status !== 'ALL') {
      query.status = filters.status;
    }
    if (filters.isDLQ !== undefined) {
      query.isDLQ = filters.isDLQ;
    }
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [{ eventId: regex }, { event: regex }, { lastError: regex }];
    }

    const limit = filters.limit || 20;
    const skip = filters.skip || 0;

    const [items, total] = await Promise.all([
      WebhookLogModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      WebhookLogModel.countDocuments(query),
    ]);

    return { items, total, page: Math.floor(skip / limit) + 1, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Phase 5: Get Dead Letter Queue (DLQ) Items
   */
  public async getDLQItems(filters: { dlqStatus?: string; search?: string; limit?: number; skip?: number }) {
    const query: any = { isDLQ: true };
    if (filters.dlqStatus && filters.dlqStatus !== 'ALL') {
      query.dlqStatus = filters.dlqStatus;
    }
    if (filters.search) {
      const regex = new RegExp(filters.search, 'i');
      query.$or = [{ eventId: regex }, { event: regex }, { dlqReason: regex }];
    }

    const limit = filters.limit || 20;
    const skip = filters.skip || 0;

    const [items, total] = await Promise.all([
      WebhookLogModel.find(query).sort({ dlqMovedAt: -1 }).skip(skip).limit(limit).lean(),
      WebhookLogModel.countDocuments(query),
    ]);

    return { items, total, page: Math.floor(skip / limit) + 1, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Phase 2 & 9: Replay Single DLQ or Failed Webhook Event
   */
  public async replayWebhook(eventId: string, admin?: any) {
    const log = await WebhookLogModel.findOne({ eventId });
    if (!log) {
      throw new BadRequestError(`Webhook event not found: ${eventId}`);
    }

    const startTime = Date.now();
    try {
      await paymentService.processVerifiedWebhookPayload(log.event, log.eventId, log.payload);

      log.status = 'PROCESSED';
      log.isDLQ = false;
      log.dlqStatus = 'REPLAYED';
      log.dlqResolvedAt = new Date();
      log.dlqResolvedBy = admin?.name || admin?.email || 'Super Admin';
      log.processingTimeMs = Date.now() - startTime;
      log.processedAt = new Date();
      log.lastError = undefined;
      await log.save();

      // Update dedicated DLQ model
      await DeadLetterQueueModel.findOneAndUpdate(
        { eventId },
        {
          status: 'REPLAYED',
          replayedAt: new Date(),
          replayedBy: admin?.name || admin?.email || 'Super Admin',
          resolutionNotes: `Manual replay executed successfully by ${admin?.name || 'Super Admin'}`,
        }
      );

      // Append immutable audit log
      await SettlementEventModel.create({
        bookingId: log.payload?.notes?.bookingId || log.payload?.payload?.payment?.entity?.notes?.bookingId,
        paymentReferenceId: log.payload?.paymentId || log.payload?.payload?.payment?.entity?.id,
        eventType: 'WEBHOOK_REPLAYED',
        previousStatus: 'DLQ',
        newStatus: 'PROCESSED',
        eventSource: 'ADMIN_OPERATIONS',
        actor: { id: admin?._id?.toString() || 'ADMIN', name: admin?.name || 'Super Admin', role: 'SUPER_ADMIN' },
        notes: `DLQ event ${eventId} (${log.event}) replayed manually with success.`,
        webhookId: eventId,
        razorpayReference: log.event,
      }).catch(() => {});

      return { success: true, message: `Webhook ${eventId} successfully replayed.`, log };
    } catch (err: any) {
      log.lastError = `Replay failed: ${err.message}`;
      log.errorStack = err.stack;
      log.lastTriedAt = new Date();
      await log.save();
      throw err;
    }
  }

  /**
   * Phase 5: Batch Replay DLQ Events
   */
  public async replayBatch(eventIds: string[], admin?: any) {
    const results = [];
    for (const id of eventIds) {
      try {
        const res = await this.replayWebhook(id, admin);
        results.push({ eventId: id, success: true, message: res.message });
      } catch (err: any) {
        results.push({ eventId: id, success: false, error: err.message });
      }
    }
    return results;
  }

  /**
   * Phase 2 & 9: Mark DLQ Item as Resolved / Archived
   */
  public async resolveDLQItem(eventId: string, notes: string, admin?: any) {
    const log = await WebhookLogModel.findOne({ eventId });
    if (log) {
      log.dlqStatus = 'RESOLVED';
      log.dlqResolvedAt = new Date();
      log.dlqResolvedBy = admin?.name || admin?.email || 'Super Admin';
      log.dlqNotes = notes;
      await log.save();
    }

    const dlq = await DeadLetterQueueModel.findOneAndUpdate(
      { eventId },
      {
        status: 'ARCHIVED',
        archived: true,
        archivedAt: new Date(),
        archivedBy: admin?.name || admin?.email || 'Super Admin',
        resolutionNotes: notes,
      },
      { returnDocument: 'after' }
    );

    if (!log && !dlq) {
      throw new BadRequestError(`DLQ item not found: ${eventId}`);
    }

    await SettlementEventModel.create({
      bookingId:
        log?.payload?.notes?.bookingId ||
        log?.payload?.payload?.payment?.entity?.notes?.bookingId ||
        dlq?.bookingId,
      paymentReferenceId:
        log?.payload?.paymentId ||
        log?.payload?.payload?.payment?.entity?.id ||
        dlq?.paymentId,
      eventType: 'WEBHOOK_DLQ_ARCHIVED',
      previousStatus: 'DLQ',
      newStatus: 'ARCHIVED',
      eventSource: 'ADMIN_OPERATIONS',
      actor: { id: admin?._id?.toString() || 'ADMIN', name: admin?.name || 'Super Admin', role: 'SUPER_ADMIN' },
      notes: `DLQ item ${eventId} archived. Resolution notes: ${notes}`,
      webhookId: eventId,
    }).catch(() => {});

    return { success: true, log: log || dlq };
  }

  /**
   * Phase 9: Archive DLQ Item
   */
  public async archiveDLQItem(eventId: string, notes = 'Archived by admin', admin?: any) {
    return this.resolveDLQItem(eventId, notes, admin);
  }

  /**
   * Phase 2: Fetch dedicated DLQ collection records with filtering & search
   */
  public async getDedicatedDLQItems(filters: {
    status?: string;
    search?: string;
    archived?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { status, search, archived, page = 1, limit = 20 } = filters;
    const query: any = { isDeleted: false };

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }
    if (archived !== undefined) {
      query.archived = archived;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { dlqId: regex },
        { eventId: regex },
        { event: regex },
        { paymentId: regex },
        { bookingId: regex },
        { failureReason: regex },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const [items, total] = await Promise.all([
      DeadLetterQueueModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      DeadLetterQueueModel.countDocuments(query),
    ]);

    return {
      items,
      total,
      page: Math.max(1, page),
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}

export const webhookQueueService = new WebhookQueueService();
