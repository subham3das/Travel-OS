import mongoose, { Document, Schema } from 'mongoose';
import { SellerType } from './sellerPaymentProfile.model.js';

export type TransferStatus = 'PENDING' | 'PROCESSED' | 'FAILED' | 'REVERSED';

export interface ITransferRetryAttempt {
  attemptNumber: number;
  attemptedAt: Date;
  status: 'SUCCESS' | 'FAILED';
  failureReason?: string;
  gatewayResponse?: Record<string, any>;
  gatewayTransferId?: string;
  initiatedBy?: string;
}

export interface ITransfer extends Document {
  transferId: string;
  idempotencyKey?: string;
  paymentId: mongoose.Types.ObjectId;
  bookingId: string;
  sellerId: mongoose.Types.ObjectId;
  sellerType: SellerType;
  sellerName: string;
  recipientAccountId?: string;

  grossAmount: number;
  platformCommissionRate: number;
  platformCommissionType: 'PERCENTAGE' | 'FIXED';
  platformCommissionAmount: number;
  transferAmount: number; // Net seller receivable
  currency: string;

  gateway: 'Razorpay' | 'Stripe' | 'Manual';
  gatewayTransferId?: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;

  status: TransferStatus;
  failureReason?: string;
  reversalReason?: string;
  reversedAmount?: number;

  // Retry Architecture (Phase 4)
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: Date;
  retryAttempts: ITransferRetryAttempt[];

  // Financial Locking (Phase 7)
  isLocked: boolean;
  lockedAt?: Date;
  lockReason?: string;

  metadata?: Record<string, any>;

  processedAt?: Date;
  reversedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TransferSchema = new Schema<ITransfer>(
  {
    transferId: { type: String, required: true, unique: true, index: true },
    idempotencyKey: { type: String, unique: true, sparse: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    bookingId: { type: String, required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, required: true, index: true },
    sellerType: {
      type: String,
      enum: ['Agency', 'Car Rental', 'Activity', 'Hotel'],
      default: 'Agency',
      index: true,
    },
    sellerName: { type: String, default: 'ApnaTrip Partner' },
    recipientAccountId: { type: String },

    grossAmount: { type: Number, required: true },
    platformCommissionRate: { type: Number, required: true },
    platformCommissionType: { type: String, enum: ['PERCENTAGE', 'FIXED'], default: 'PERCENTAGE' },
    platformCommissionAmount: { type: Number, required: true },
    transferAmount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    gateway: { type: String, enum: ['Razorpay', 'Stripe', 'Manual'], default: 'Razorpay' },
    gatewayTransferId: { type: String, index: true },
    gatewayOrderId: { type: String },
    gatewayPaymentId: { type: String },

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'FAILED', 'REVERSED'],
      default: 'PENDING',
      index: true,
    },
    failureReason: { type: String },
    reversalReason: { type: String },
    reversedAmount: { type: Number, default: 0 },

    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    nextRetryAt: { type: Date, index: true },
    retryAttempts: [
      {
        attemptNumber: { type: Number, required: true },
        attemptedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['SUCCESS', 'FAILED'], required: true },
        failureReason: { type: String },
        gatewayResponse: { type: Schema.Types.Mixed },
        gatewayTransferId: { type: String },
        initiatedBy: { type: String, default: 'SYSTEM' },
      },
    ],

    isLocked: { type: Boolean, default: false, index: true },
    lockedAt: { type: Date },
    lockReason: { type: String },

    metadata: { type: Schema.Types.Mixed },

    processedAt: { type: Date },
    reversedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Financial locking guard: once isLocked is true, disallow direct mutations to financial amounts
TransferSchema.pre('save', function () {
  if (this.isLocked && !this.isNew) {
    if (
      this.isModified('grossAmount') ||
      this.isModified('platformCommissionAmount') ||
      this.isModified('transferAmount')
    ) {
      throw new Error(
        'FinancialLockError: Transfer is settled/locked. Financial fields cannot be directly modified.'
      );
    }
  }
});

TransferSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
TransferSchema.index({ status: 1, nextRetryAt: 1 });

export const TransferModel =
  mongoose.models.Transfer || mongoose.model<ITransfer>('Transfer', TransferSchema, 'transfers');
