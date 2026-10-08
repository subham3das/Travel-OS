import mongoose, { Document, Schema } from 'mongoose';

export type RetryOperationType =
  | 'TRANSFER_CREATION'
  | 'SETTLEMENT_SYNC'
  | 'REFUND_EXECUTION'
  | 'ROUTE_ONBOARDING'
  | 'FUND_ACCOUNT_CREATION'
  | 'LINKED_ACCOUNT_CREATION'
  | 'RECONCILIATION_FETCH';

export type RetryQueueStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'EXHAUSTED'
  | 'CANCELLED';

export interface IRetryAttempt {
  attemptNumber: number;
  timestamp: Date;
  durationMs?: number;
  error?: string;
  gatewayResponse?: any;
  workerId?: string;
}

export interface IPaymentRetryQueue extends Document {
  retryId: string;
  operationType: RetryOperationType;
  entityId: string;
  entityType: string;
  idempotencyKey: string;
  payload?: Record<string, any>;

  status: RetryQueueStatus;
  retryCount: number;
  maxRetries: number;
  baseDelayMs: number;
  nextAttemptAt: Date;
  lastAttemptAt?: Date;
  completedAt?: Date;

  lastError?: string;
  stackTrace?: string;
  retryHistory: IRetryAttempt[];

  workerId?: string;
  correlationId?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RetryAttemptSchema = new Schema<IRetryAttempt>(
  {
    attemptNumber: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    durationMs: { type: Number },
    error: { type: String },
    gatewayResponse: { type: Schema.Types.Mixed },
    workerId: { type: String },
  },
  { _id: false }
);

const PaymentRetryQueueSchema = new Schema<IPaymentRetryQueue>(
  {
    retryId: { type: String, required: true, unique: true, index: true },
    operationType: {
      type: String,
      enum: [
        'TRANSFER_CREATION',
        'SETTLEMENT_SYNC',
        'REFUND_EXECUTION',
        'ROUTE_ONBOARDING',
        'FUND_ACCOUNT_CREATION',
        'LINKED_ACCOUNT_CREATION',
        'RECONCILIATION_FETCH',
      ],
      required: true,
      index: true,
    },
    entityId: { type: String, required: true, index: true },
    entityType: { type: String, required: true, index: true },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    payload: { type: Schema.Types.Mixed },

    status: {
      type: String,
      enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'EXHAUSTED', 'CANCELLED'],
      default: 'SCHEDULED',
      index: true,
    },
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 5 },
    baseDelayMs: { type: Number, default: 30000 },
    nextAttemptAt: { type: Date, required: true, index: true },
    lastAttemptAt: { type: Date },
    completedAt: { type: Date },

    lastError: { type: String },
    stackTrace: { type: String },
    retryHistory: [RetryAttemptSchema],

    workerId: { type: String, default: 'worker-retry-primary' },
    correlationId: { type: String, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PaymentRetryQueueSchema.index({ status: 1, nextAttemptAt: 1, isDeleted: 1 });
PaymentRetryQueueSchema.index({ operationType: 1, entityId: 1 });

export const PaymentRetryQueueModel =
  mongoose.models.PaymentRetryQueue ||
  mongoose.model<IPaymentRetryQueue>('PaymentRetryQueue', PaymentRetryQueueSchema, 'payment_retry_queues');
