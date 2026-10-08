import mongoose, { Document, Schema } from 'mongoose';

export type WebhookStatus =
  | 'QUEUED'
  | 'RECEIVED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'FAILED'
  | 'DUPLICATE_IGNORED'
  | 'RETRY_EXHAUSTED'
  | 'DLQ';

export type DLQStatus = 'PENDING_REVIEW' | 'REPLAYED' | 'RESOLVED' | 'ARCHIVED';

export interface IWebhookLog extends Document {
  eventId: string;
  event: string;
  source: 'Razorpay' | 'Stripe';
  status: WebhookStatus;
  signatureVerified: boolean;
  payload?: Record<string, any>;
  payloadHash?: string;
  responseMessage?: string;
  processingTimeMs?: number;
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
  lastError?: string;
  errorStack?: string;
  processedAt?: Date;
  firstSeenAt: Date;
  lastTriedAt?: Date;

  // Dead Letter Queue (DLQ) Architecture (Phase 5)
  isDLQ: boolean;
  dlqReason?: string;
  dlqMovedAt?: Date;
  dlqStatus?: DLQStatus;
  dlqResolvedAt?: Date;
  dlqResolvedBy?: string;
  dlqNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const WebhookLogSchema = new Schema<IWebhookLog>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    event: { type: String, required: true, index: true },
    source: { type: String, enum: ['Razorpay', 'Stripe'], default: 'Razorpay' },
    status: {
      type: String,
      enum: [
        'QUEUED',
        'RECEIVED',
        'PROCESSING',
        'PROCESSED',
        'FAILED',
        'DUPLICATE_IGNORED',
        'RETRY_EXHAUSTED',
        'DLQ',
      ],
      default: 'QUEUED',
      index: true,
    },
    signatureVerified: { type: Boolean, default: false },
    payload: { type: Schema.Types.Mixed },
    payloadHash: { type: String, index: true },
    responseMessage: { type: String },
    processingTimeMs: { type: Number },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 5 },
    nextRetryAt: { type: Date, index: true },
    lastError: { type: String },
    errorStack: { type: String },
    processedAt: { type: Date },
    firstSeenAt: { type: Date, default: Date.now },
    lastTriedAt: { type: Date },

    // Dead Letter Queue
    isDLQ: { type: Boolean, default: false, index: true },
    dlqReason: { type: String },
    dlqMovedAt: { type: Date, index: true },
    dlqStatus: {
      type: String,
      enum: ['PENDING_REVIEW', 'REPLAYED', 'RESOLVED', 'ARCHIVED'],
      default: 'PENDING_REVIEW',
      index: true,
    },
    dlqResolvedAt: { type: Date },
    dlqResolvedBy: { type: String },
    dlqNotes: { type: String },
  },
  { timestamps: true }
);

WebhookLogSchema.index({ createdAt: -1 });
WebhookLogSchema.index({ isDLQ: 1, dlqStatus: 1 });
WebhookLogSchema.index({ status: 1, nextRetryAt: 1 });

export const WebhookLogModel =
  mongoose.models.WebhookLog ||
  mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema, 'webhook_logs');
