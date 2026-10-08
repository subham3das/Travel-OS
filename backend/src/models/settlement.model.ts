import mongoose, { Document, Schema } from 'mongoose';
import { SellerType } from './sellerPaymentProfile.model.js';

export type SettlementEntityStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'TRANSFERRED'
  | 'SETTLED'
  | 'FAILED'
  | 'REVERSED';

export interface ISettlement extends Document {
  settlementId: string;
  transferId: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  bookingId: string;
  sellerId: mongoose.Types.ObjectId;
  sellerType: SellerType;
  sellerName: string;

  amount: number;
  currency: string;
  commissionDeducted: number;
  netSettledAmount: number;

  bankAccountMasked?: string;
  bankName?: string;
  ifscCode?: string;

  gatewaySettlementId?: string;
  utr?: string;
  expectedSettlementDate?: Date;
  settledAt?: Date;

  // Settlement Stage & SLA Tracking
  currentStage:
    | 'WAITING_FOR_PROCESSING'
    | 'TRANSFER_INITIATED'
    | 'IN_TRANSIT'
    | 'SETTLED'
    | 'DELAYED'
    | 'FAILED';
  isDelayed: boolean;
  delayDurationHours?: number;
  delayedNotifiedAt?: Date;

  commissionSnapshot?: {
    grossAmount: number;
    platformCommissionRate: number;
    platformCommissionType: 'PERCENTAGE' | 'FIXED';
    platformCommissionAmount: number;
    netSettledAmount: number;
  };

  status: SettlementEntityStatus;
  failureReason?: string;
  metadata?: Record<string, any>;

  isLocked?: boolean;
  lockedAt?: Date;
  lockReason?: string;
  adjustmentHistory?: Array<{
    adjustmentId: string;
    amount: number;
    reason: string;
    adjustedBy: string;
    adjustedAt: Date;
    notes?: string;
  }>;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SettlementSchema = new Schema<ISettlement>(
  {
    settlementId: { type: String, required: true, unique: true, index: true },
    transferId: { type: Schema.Types.ObjectId, ref: 'Transfer', required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', index: true },
    bookingId: { type: String, required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, required: true, index: true },
    sellerType: {
      type: String,
      enum: ['Agency', 'Car Rental', 'Activity', 'Hotel'],
      default: 'Agency',
      index: true,
    },
    sellerName: { type: String, default: 'ApnaTrip Partner' },

    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    commissionDeducted: { type: Number, default: 0 },
    netSettledAmount: { type: Number, required: true },

    bankAccountMasked: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },

    gatewaySettlementId: { type: String, index: true },
    utr: { type: String, index: true },
    expectedSettlementDate: { type: Date },
    settledAt: { type: Date },

    currentStage: {
      type: String,
      enum: ['WAITING_FOR_PROCESSING', 'TRANSFER_INITIATED', 'IN_TRANSIT', 'SETTLED', 'DELAYED', 'FAILED'],
      default: 'WAITING_FOR_PROCESSING',
      index: true,
    },
    isDelayed: { type: Boolean, default: false, index: true },
    delayDurationHours: { type: Number, default: 0 },
    delayedNotifiedAt: { type: Date },

    commissionSnapshot: {
      grossAmount: { type: Number },
      platformCommissionRate: { type: Number },
      platformCommissionType: { type: String, enum: ['PERCENTAGE', 'FIXED'] },
      platformCommissionAmount: { type: Number },
      netSettledAmount: { type: Number },
    },

    isLocked: { type: Boolean, default: false, index: true },
    lockedAt: { type: Date },
    lockReason: { type: String },
    adjustmentHistory: [
      {
        adjustmentId: { type: String, required: true },
        amount: { type: Number, required: true },
        reason: { type: String, required: true },
        adjustedBy: { type: String, default: 'ADMIN' },
        adjustedAt: { type: Date, default: Date.now },
        notes: { type: String },
      },
    ],

    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'TRANSFERRED', 'SETTLED', 'FAILED', 'REVERSED'],
      default: 'PENDING',
      index: true,
    },
    failureReason: { type: String },
    metadata: { type: Schema.Types.Mixed },

    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Financial locking guard: once isLocked is true or status is SETTLED, prevent mutation of financial fields
SettlementSchema.pre('save', function () {
  if (this.status === 'SETTLED' && !this.isLocked) {
    this.isLocked = true;
    this.lockedAt = new Date();
    this.lockReason = 'Auto-locked upon final SETTLED state';
  }

  if (this.isLocked && !this.isNew) {
    if (
      this.isModified('amount') ||
      this.isModified('commissionDeducted') ||
      this.isModified('netSettledAmount') ||
      this.isModified('commissionSnapshot')
    ) {
      throw new Error(
        'FinancialLockError: Settlement is locked. Direct modifications to financial amounts are strictly prohibited. Use adjustment ledger instead.'
      );
    }
  }
});

SettlementSchema.index({ sellerId: 1, status: 1, createdAt: -1 });

export const SettlementModel =
  mongoose.models.Settlement ||
  mongoose.model<ISettlement>('Settlement', SettlementSchema, 'settlements');
