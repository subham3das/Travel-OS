import mongoose, { Document, Schema } from 'mongoose';

export type SettlementEventSource =
  | 'CHECKOUT_FLOW'
  | 'RAZORPAY_WEBHOOK'
  | 'MANUAL_ADMIN'
  | 'SYSTEM_CRON'
  | 'RECONCILIATION'
  | 'SELLER_ONBOARDING'
  | 'RECOVERY_WORKER'
  | 'REFUND_ENGINE'
  | 'DISPUTE_LIFECYCLE'
  | 'DLQ_REPLAY'
  | 'RETRY_ENGINE'
  | 'ADMIN_OPERATIONS'
  | 'WEBHOOK_DLQ'
  | 'DLQ_ARCHIVED';

export interface ISettlementEvent extends Document {
  settlementId?: mongoose.Types.ObjectId;
  settlementReferenceId?: string;
  transferId?: mongoose.Types.ObjectId;
  transferReferenceId?: string;
  paymentId?: mongoose.Types.ObjectId;
  paymentReferenceId?: string;
  refundId?: string;
  disputeId?: string;
  bookingId?: string;
  sellerId?: mongoose.Types.ObjectId;

  actor?: {
    id?: string;
    name?: string;
    role?: string;
    email?: string;
  };
  eventType?: string;
  previousStatus: string;
  newStatus: string;
  eventSource: SettlementEventSource;
  razorpayEvent?: string;
  razorpayReference?: string;
  requestId?: string;
  webhookId?: string;
  utr?: string;
  amount?: number;
  notes: string;
  metadata?: Record<string, any>;

  // Phase 10: Operational Observability Tracking
  processingTimeMs?: number;
  queueTimeMs?: number;
  retryCount?: number;
  gatewayLatencyMs?: number;
  failureReason?: string;
  workerId?: string;
  correlationId?: string;

  timestamp: Date;
  createdAt: Date;
}

const SettlementEventSchema = new Schema<ISettlementEvent>(
  {
    settlementId: { type: Schema.Types.ObjectId, ref: 'Settlement', index: true },
    settlementReferenceId: { type: String, index: true },
    transferId: { type: Schema.Types.ObjectId, ref: 'Transfer', index: true },
    transferReferenceId: { type: String, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', index: true },
    paymentReferenceId: { type: String, index: true },
    refundId: { type: String, index: true },
    disputeId: { type: String, index: true },
    bookingId: { type: String, index: true },
    sellerId: { type: Schema.Types.ObjectId, index: true },

    actor: {
      id: { type: String },
      name: { type: String },
      role: { type: String },
      email: { type: String },
    },
    eventType: { type: String, index: true },
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    eventSource: {
      type: String,
      enum: [
        'CHECKOUT_FLOW',
        'RAZORPAY_WEBHOOK',
        'MANUAL_ADMIN',
        'SYSTEM_CRON',
        'RECONCILIATION',
        'SELLER_ONBOARDING',
        'RECOVERY_WORKER',
        'REFUND_ENGINE',
        'DISPUTE_LIFECYCLE',
        'DLQ_REPLAY',
        'RETRY_ENGINE',
        'ADMIN_OPERATIONS',
        'WEBHOOK_DLQ',
        'DLQ_ARCHIVED',
      ],
      required: true,
      default: 'CHECKOUT_FLOW',
    },
    razorpayEvent: { type: String },
    razorpayReference: { type: String, index: true },
    requestId: { type: String, index: true },
    webhookId: { type: String, index: true },
    utr: { type: String },
    amount: { type: Number },
    notes: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed },

    processingTimeMs: { type: Number },
    queueTimeMs: { type: Number },
    retryCount: { type: Number },
    gatewayLatencyMs: { type: Number },
    failureReason: { type: String },
    workerId: { type: String },
    correlationId: { type: String, index: true },

    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Append-only immutable ledger
);

SettlementEventSchema.index({ settlementReferenceId: 1, timestamp: 1 });
SettlementEventSchema.index({ sellerId: 1, timestamp: -1 });

export const SettlementEventModel =
  mongoose.models.SettlementEvent ||
  mongoose.model<ISettlementEvent>('SettlementEvent', SettlementEventSchema, 'settlement_events');
