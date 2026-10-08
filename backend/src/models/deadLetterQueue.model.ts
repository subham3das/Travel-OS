import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export type DLQStatus = 'PENDING_REVIEW' | 'REPLAYED' | 'ARCHIVED' | 'IGNORED';

export interface IDeadLetterQueue extends Document {
  dlqId: string;
  originalPayload: any;
  payloadHash: string;
  eventId: string;
  event: string;
  source: string;
  paymentId?: string;
  bookingId?: string;
  sellerId?: mongoose.Types.ObjectId;
  retryCount: number;
  failureReason: string;
  stackTrace?: string;
  firstReceivedAt: Date;
  lastAttemptedAt: Date;
  status: DLQStatus;
  archived: boolean;
  archivedAt?: Date;
  archivedBy?: string;
  replayedAt?: Date;
  replayedBy?: string;
  resolutionNotes?: string;
  workerId?: string;
  correlationId?: string;
  metadata?: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeadLetterQueueSchema = new Schema<IDeadLetterQueue>(
  {
    dlqId: { type: String, required: true, unique: true, index: true },
    originalPayload: { type: Schema.Types.Mixed, required: true },
    payloadHash: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    event: { type: String, required: true, index: true },
    source: { type: String, default: 'Razorpay', index: true },
    paymentId: { type: String, index: true },
    bookingId: { type: String, index: true },
    sellerId: { type: Schema.Types.ObjectId, index: true },
    retryCount: { type: Number, required: true, default: 0 },
    failureReason: { type: String, required: true },
    stackTrace: { type: String },
    firstReceivedAt: { type: Date, required: true, default: Date.now },
    lastAttemptedAt: { type: Date, required: true, default: Date.now },
    status: {
      type: String,
      enum: ['PENDING_REVIEW', 'REPLAYED', 'ARCHIVED', 'IGNORED'],
      default: 'PENDING_REVIEW',
      index: true,
    },
    archived: { type: Boolean, default: false, index: true },
    archivedAt: { type: Date },
    archivedBy: { type: String },
    replayedAt: { type: Date },
    replayedBy: { type: String },
    resolutionNotes: { type: String },
    workerId: { type: String, default: 'worker-primary' },
    correlationId: { type: String, index: true },
    metadata: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

DeadLetterQueueSchema.index({ status: 1, archived: 1, createdAt: -1 });
DeadLetterQueueSchema.index({ eventId: 1, payloadHash: 1 });

export const DeadLetterQueueModel =
  mongoose.models.DeadLetterQueue ||
  mongoose.model<IDeadLetterQueue>('DeadLetterQueue', DeadLetterQueueSchema, 'dead_letter_queues');
