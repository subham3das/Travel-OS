import mongoose from 'mongoose';
import { SellerPaymentProfileModel } from '../models/sellerPaymentProfile.model.js';
import { TransferModel } from '../models/transfer.model.js';
import { SettlementModel } from '../models/settlement.model.js';
import { WebhookLogModel } from '../models/webhookLog.model.js';
import { DeadLetterQueueModel } from '../models/deadLetterQueue.model.js';
import { PaymentRetryQueueModel } from '../models/paymentRetryQueue.model.js';
import { SettlementEventModel } from '../models/settlementEvent.model.js';
import { RefundModel } from '../models/refund.model.js';
import { PaymentModel } from '../models/payment.model.js';
import { BookingModel } from '../models/booking.model.js';
import { DisputeModel } from '../models/dispute.model.js';
import { envConfig } from '../config/env.config.js';
import { logger } from '../config/logger.config.js';

export interface OperationalMetrics {
  // Phase 6: System & Gateway Health
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'ACTION_REQUIRED';
  gatewayHealth: 'HEALTHY' | 'DEGRADED' | 'DOWN';

  // Queue Lengths & DLQ
  queueLength: number;
  webhookQueue: number;
  dlqCount: number;
  retryQueue: number;

  // Processing & Settlement Time Averages
  averageSettlementTime: string;
  averageProcessingTime: string;

  // Success & Failure Percentages
  webhookSuccessRate: number;
  webhookFailureRate: number;
  transferSuccessRate: number;
  refundSuccessRate: number;

  // Failed Financial Operations
  failedTransfers: number;
  failedRefunds: number;
  failedSettlements: number;

  // Real-Time Today's Numbers
  todaysGMV: number;
  todaysCommission: number;
  pendingTransfers: number;
  processingTransfers: number;

  // Existing Operational Breakdown & Alerts
  failedOnboardingAttempts: number;
  delayedSettlements: number;
  delayedSettlementsAmount: number;
  failedWebhooks: number;
  webhookRetryCount: number;
  queueBacklog: number;
  apiFailures: number;
  totalActiveSellers: number;
  totalSettledAmount: number;
  alerts: Array<{
    id: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    title: string;
    message: string;
    suggestedAction: string;
    createdAt: Date;
  }>;
  checkedAt: Date;
}

export class OperationalMonitoringService {
  /**
   * Aggregate real-time operational health metrics for Super Admin Dashboard (Phase 6)
   */
  public async getOperationalMetrics(): Promise<OperationalMetrics> {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      failedOnboardingCount,
      failedTransfersCount,
      delayedSettlementsDocs,
      failedWebhooksCount,
      webhookRetryAgg,
      webhookQueueCount,
      dlqCount,
      retryQueueCount,
      totalActiveSellersCount,
      totalSettledAgg,
      recentErrorsCount,
      failedRefundsCount,
      failedSettlementsCount,
      pendingTransfersCount,
      processingTransfersCount,
      transferStatsAgg,
      refundStatsAgg,
      webhookStatsAgg,
      todaysPaymentsAgg,
      todaysSettlementsAgg,
      avgSettlementTimeAgg,
    ] = await Promise.all([
      SellerPaymentProfileModel.countDocuments({
        isDeleted: false,
        $or: [
          { status: 'FAILED' },
          { bankVerificationStatus: 'FAILED' },
          { recoveryStatus: 'MANUAL_INTERVENTION_REQUIRED' },
        ],
      }),
      TransferModel.countDocuments({ status: 'FAILED', isDeleted: false }),
      SettlementModel.find({
        isDeleted: false,
        status: { $in: ['PENDING', 'PROCESSING', 'TRANSFERRED'] },
        expectedSettlementDate: { $lt: now },
      }).lean(),
      WebhookLogModel.countDocuments({ status: { $in: ['FAILED', 'RETRY_EXHAUSTED', 'DLQ'] } }),
      WebhookLogModel.aggregate([{ $group: { _id: null, totalRetries: { $sum: '$retryCount' } } }]),
      WebhookLogModel.countDocuments({ status: 'QUEUED' }),
      DeadLetterQueueModel.countDocuments({ archived: false, status: 'PENDING_REVIEW' }),
      PaymentRetryQueueModel.countDocuments({
        status: { $in: ['SCHEDULED', 'IN_PROGRESS'] },
        isDeleted: false,
      }),
      SellerPaymentProfileModel.countDocuments({ status: 'APPROVED', routeEnabled: true, isDeleted: false }),
      SettlementModel.aggregate([
        { $match: { status: 'SETTLED', isDeleted: false } },
        { $group: { _id: null, total: { $sum: '$netSettledAmount' } } },
      ]),
      SettlementEventModel.countDocuments({
        newStatus: { $in: ['FAILED', 'REVERSED', 'RETRY_EXHAUSTED'] },
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      RefundModel.countDocuments({ status: 'FAILED' }),
      SettlementModel.countDocuments({ status: 'FAILED', isDeleted: false }),
      TransferModel.countDocuments({ status: 'PENDING', isDeleted: false }),
      TransferModel.countDocuments({ status: 'PROCESSING', isDeleted: false }),
      // Transfer success aggregation
      TransferModel.aggregate([
        { $match: { isDeleted: false } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            successful: { $sum: { $cond: [{ $eq: ['$status', 'PROCESSED'] }, 1, 0] } },
          },
        },
      ]),
      // Refund success aggregation
      RefundModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            successful: { $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] } },
          },
        },
      ]),
      // Webhook success & avg processing time aggregation
      WebhookLogModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            processed: { $sum: { $cond: [{ $eq: ['$status', 'PROCESSED'] }, 1, 0] } },
            failed: { $sum: { $cond: [{ $in: ['$status', ['FAILED', 'DLQ', 'RETRY_EXHAUSTED']] }, 1, 0] } },
            avgTimeMs: { $avg: '$processingTimeMs' },
          },
        },
      ]),
      // Today's Payments GMV
      PaymentModel.aggregate([
        {
          $match: {
            status: { $in: ['CAPTURED', 'PAID', 'SUCCESS'] },
            createdAt: { $gte: startOfToday },
          },
        },
        { $group: { _id: null, totalGMV: { $sum: '$amount' } } },
      ]),
      // Today's Platform Commission
      SettlementModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            isDeleted: false,
          },
        },
        { $group: { _id: null, totalCommission: { $sum: '$commissionDeducted' } } },
      ]),
      // Average settlement delivery time
      SettlementModel.aggregate([
        {
          $match: {
            status: 'SETTLED',
            settledAt: { $exists: true },
            isDeleted: false,
          },
        },
        {
          $project: {
            diffHours: {
              $divide: [{ $subtract: ['$settledAt', '$createdAt'] }, 1000 * 60 * 60],
            },
          },
        },
        { $group: { _id: null, avgHours: { $avg: '$diffHours' } } },
      ]),
    ]);

    const delayedSettlements = delayedSettlementsDocs.length;
    const delayedSettlementsAmount = delayedSettlementsDocs.reduce(
      (acc, s) => acc + (s.netSettledAmount || s.amount || 0),
      0
    );
    const webhookRetryCount = webhookRetryAgg[0]?.totalRetries || 0;
    const totalSettledAmount = totalSettledAgg[0]?.total || 0;

    // Rates calculation
    const totalWebhooks = webhookStatsAgg[0]?.total || 0;
    const processedWebhooks = webhookStatsAgg[0]?.processed || 0;
    const failedWebhooksTotal = webhookStatsAgg[0]?.failed || 0;
    const webhookSuccessRate = totalWebhooks > 0 ? Math.round((processedWebhooks / totalWebhooks) * 100) : 100;
    const webhookFailureRate = 100 - webhookSuccessRate;
    const avgProcMs = Math.round(webhookStatsAgg[0]?.avgTimeMs || 145);
    const averageProcessingTime = `${avgProcMs}ms`;

    const totalTransfers = transferStatsAgg[0]?.total || 0;
    const successTransfers = transferStatsAgg[0]?.successful || 0;
    const transferSuccessRate = totalTransfers > 0 ? Math.round((successTransfers / totalTransfers) * 100) : 100;

    const totalRefunds = refundStatsAgg[0]?.total || 0;
    const successRefunds = refundStatsAgg[0]?.successful || 0;
    const refundSuccessRate = totalRefunds > 0 ? Math.round((successRefunds / totalRefunds) * 100) : 100;

    const avgHours = Math.round(avgSettlementTimeAgg[0]?.avgHours || 24);
    const averageSettlementTime = `${avgHours} hours`;

    const todaysGMV = todaysPaymentsAgg[0]?.totalGMV || 0;
    const todaysCommission = todaysSettlementsAgg[0]?.totalCommission || 0;

    const queueLength = webhookQueueCount + retryQueueCount;

    // Gateway Health check
    let gatewayHealth: OperationalMetrics['gatewayHealth'] = 'HEALTHY';
    if (!envConfig.RAZORPAY_KEY_ID || !envConfig.RAZORPAY_KEY_SECRET) {
      gatewayHealth = 'DOWN';
    } else if (failedTransfersCount > 5 || failedWebhooksTotal > 10) {
      gatewayHealth = 'DEGRADED';
    }

    // Proactive alerts
    const alerts: OperationalMetrics['alerts'] = [];

    if (failedTransfersCount > 0) {
      alerts.push({
        id: 'alert_failed_transfers',
        severity: 'CRITICAL',
        title: `${failedTransfersCount} Failed Route Transfer(s) Detected`,
        message: 'One or more payouts to partner sellers failed gateway execution.',
        suggestedAction: 'Review failed transfer logs and initiate recovery or manual intervention.',
        createdAt: now,
      });
    }

    if (delayedSettlements > 0) {
      alerts.push({
        id: 'alert_delayed_settlements',
        severity: 'HIGH',
        title: `${delayedSettlements} Settlement(s) Past SLA`,
        message: `₹${delayedSettlementsAmount.toLocaleString('en-IN')} in seller settlements is delayed beyond expected bank delivery time.`,
        suggestedAction: 'Check Razorpay Route settlement webhook status and UTR reconciliation.',
        createdAt: now,
      });
    }

    if (failedOnboardingCount > 0) {
      alerts.push({
        id: 'alert_failed_onboarding',
        severity: 'MEDIUM',
        title: `${failedOnboardingCount} Seller Onboarding Failure(s)`,
        message: 'Partner agencies encountered bank validation or Route linked account errors.',
        suggestedAction: 'Inspect seller bank credentials and verify Razorpay merchant Route permissions.',
        createdAt: now,
      });
    }

    if (dlqCount > 0) {
      alerts.push({
        id: 'alert_dlq_events',
        severity: 'HIGH',
        title: `${dlqCount} Webhook(s) in Dead Letter Queue (DLQ)`,
        message: 'Events exhausted automatic retries and require admin review.',
        suggestedAction: 'Inspect payload in DLQ workspace and trigger manual replay or archive.',
        createdAt: now,
      });
    }

    // Determine overall health
    let systemHealth: OperationalMetrics['systemHealth'] = 'HEALTHY';
    if (failedTransfersCount > 0 || delayedSettlements > 5 || queueLength > 30 || dlqCount > 5) {
      systemHealth = 'ACTION_REQUIRED';
    } else if (delayedSettlements > 0 || failedOnboardingCount > 0 || failedWebhooksCount > 0 || dlqCount > 0) {
      systemHealth = 'DEGRADED';
    }

    return {
      systemHealth,
      gatewayHealth,
      queueLength,
      webhookQueue: webhookQueueCount,
      dlqCount,
      retryQueue: retryQueueCount,
      averageSettlementTime,
      averageProcessingTime,
      webhookSuccessRate,
      webhookFailureRate,
      transferSuccessRate,
      refundSuccessRate,
      failedTransfers: failedTransfersCount,
      failedRefunds: failedRefundsCount,
      failedSettlements: failedSettlementsCount,
      todaysGMV,
      todaysCommission,
      pendingTransfers: pendingTransfersCount,
      processingTransfers: processingTransfersCount,
      failedOnboardingAttempts: failedOnboardingCount,
      delayedSettlements,
      delayedSettlementsAmount,
      failedWebhooks: failedWebhooksCount,
      webhookRetryCount,
      queueBacklog: webhookQueueCount,
      apiFailures: recentErrorsCount,
      totalActiveSellers: totalActiveSellersCount,
      totalSettledAmount,
      alerts,
      checkedAt: now,
    };
  }

  /**
   * Phase 7: Global Finance Search across all financial entities
   */
  public async globalFinanceSearch(searchQuery: string) {
    if (!searchQuery || !searchQuery.trim()) {
      return {
        query: '',
        totalMatches: 0,
        results: {
          payments: [],
          bookings: [],
          transfers: [],
          settlements: [],
          refunds: [],
          disputes: [],
        },
      };
    }

    const q = searchQuery.trim();
    const regex = new RegExp(q, 'i');
    const isObjectId = mongoose.Types.ObjectId.isValid(q);
    const objId = isObjectId ? new mongoose.Types.ObjectId(q) : null;

    const [payments, bookings, transfers, settlements, refunds, disputes] = await Promise.all([
      // 1. Payments
      PaymentModel.find({
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { paymentId: regex },
          { orderId: regex },
          { customerEmail: regex },
          { customerName: regex },
          { gatewayPaymentId: regex },
          { transactionId: regex },
        ],
      })
        .limit(10)
        .lean(),

      // 2. Bookings
      BookingModel.find({
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { bookingId: regex },
          { customerName: regex },
          { customerEmail: regex },
          { agencyName: regex },
        ],
      })
        .limit(10)
        .lean(),

      // 3. Transfers
      TransferModel.find({
        isDeleted: false,
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { transferId: regex },
          { gatewayTransferId: regex },
          { bookingId: regex },
          { sellerName: regex },
        ],
      })
        .limit(10)
        .lean(),

      // 4. Settlements
      SettlementModel.find({
        isDeleted: false,
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { settlementId: regex },
          { gatewaySettlementId: regex },
          { utr: regex },
          { bookingId: regex },
          { sellerName: regex },
        ],
      })
        .limit(10)
        .lean(),

      // 5. Refunds
      RefundModel.find({
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { refundId: regex },
          { gatewayRefundId: regex },
          { bookingId: regex },
          { reason: regex },
        ],
      })
        .limit(10)
        .lean(),

      // 6. Disputes
      DisputeModel.find({
        $or: [
          ...(objId ? [{ _id: objId }] : []),
          { disputeId: regex },
          { razorpayDisputeId: regex },
          { bookingId: regex },
          { sellerName: regex },
        ],
      })
        .limit(10)
        .lean(),
    ]);

    const totalMatches =
      payments.length +
      bookings.length +
      transfers.length +
      settlements.length +
      refunds.length +
      disputes.length;

    return {
      query: q,
      totalMatches,
      results: {
        payments,
        bookings,
        transfers,
        settlements,
        refunds,
        disputes,
      },
    };
  }

  /**
   * Search and paginate immutable financial audit logs
   */
  public async getAuditLogs(filter: {
    search?: string;
    eventType?: string;
    eventSource?: string;
    sellerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, eventType, eventSource, sellerId, startDate, endDate, page = 1, limit = 20 } = filter;

    const query: any = {};

    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }
    if (eventSource && eventSource !== 'all') {
      query.eventSource = eventSource;
    }
    if (sellerId) {
      query.sellerId = sellerId;
    }
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { bookingId: regex },
        { transferReferenceId: regex },
        { settlementReferenceId: regex },
        { paymentReferenceId: regex },
        { utr: regex },
        { razorpayReference: regex },
        { notes: regex },
        { 'actor.name': regex },
        { 'actor.email': regex },
      ];
    }

    const skip = (Math.max(1, page) - 1) * limit;

    const [logs, total] = await Promise.all([
      SettlementEventModel.find(query).sort({ timestamp: -1, _id: -1 }).skip(skip).limit(limit).lean(),
      SettlementEventModel.countDocuments(query),
    ]);

    return {
      logs: logs.map((log: any) => ({
        id: log._id.toString(),
        timestamp: log.timestamp || log.createdAt,
        actor: log.actor || { role: 'System', name: 'ApnaTrip Engine' },
        eventType: log.eventType || log.newStatus,
        previousState: log.previousStatus,
        newState: log.newStatus,
        source: log.eventSource,
        requestId: log.requestId,
        webhookId: log.webhookId,
        razorpayReference: log.razorpayReference || log.razorpayEvent,
        bookingId: log.bookingId,
        transferId: log.transferReferenceId,
        settlementId: log.settlementReferenceId,
        amount: log.amount,
        notes: log.notes,
        metadata: log.metadata,
      })),
      total,
      page: Math.max(1, page),
      limit,
      pages: Math.ceil(total / limit) || 1,
    };
  }
}

export const operationalMonitoringService = new OperationalMonitoringService();
