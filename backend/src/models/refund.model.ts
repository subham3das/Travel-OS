import mongoose, { Document, Schema } from 'mongoose';
import { SellerType } from './sellerPaymentProfile.model.js';

export type RefundStatus =
  | 'REQUESTED'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'FAILED'
  | 'PARTIALLY_REFUNDED'
  | 'FULLY_REFUNDED'
  | 'REVERSED';

export type RefundInitiator = 'ADMIN' | 'CUSTOMER' | 'AGENCY' | 'SYSTEM';

export interface IRefund extends Document {
  refundId: string; // Internal REF-XXXXXX-XXX
  bookingId: string;
  paymentId: mongoose.Types.ObjectId;
  razorpayPaymentId: string;
  sellerId: mongoose.Types.ObjectId;
  sellerType: SellerType;
  sellerName?: string;

  // Currency amounts (in floating INR, with integer paise tracked in paise fields)
  refundAmount: number;
  refundAmountPaise: number;
  originalGrossAmount: number;
  originalGrossAmountPaise: number;

  // Commission & Receivable Reversal Breakdown
  platformCommissionAmount: number;
  sellerReceivable: number;
  refundedCommission: number;
  refundedCommissionPaise: number;
  refundedSellerShare: number;
  refundedSellerSharePaise: number;

  // Lifecycle & Tracking
  status: RefundStatus;
  isPartial: boolean;
  cumulativeRefundedAmount: number;
  remainingRefundableAmount: number;

  initiatedBy: RefundInitiator;
  initiatorId?: string;
  initiatorEmail?: string;
  reason: string;
  notes?: string;

  // Gateway Reference
  razorpayRefundId?: string;
  gatewayResponse?: Record<string, any>;
  idempotencyKey: string;
  failureReason?: string;

  processedAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RefundSchema = new Schema<IRefund>(
  {
    refundId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    razorpayPaymentId: { type: String, required: true, index: true },
    sellerId: { type: Schema.Types.ObjectId, required: true, index: true },
    sellerType: {
      type: String,
      enum: ['Agency', 'Car Rental', 'Activity', 'Hotel'],
      default: 'Agency',
      index: true,
    },
    sellerName: { type: String, default: 'ApnaTrip Partner' },

    refundAmount: { type: Number, required: true },
    refundAmountPaise: { type: Number, required: true },
    originalGrossAmount: { type: Number, required: true },
    originalGrossAmountPaise: { type: Number, required: true },

    platformCommissionAmount: { type: Number, default: 0 },
    sellerReceivable: { type: Number, default: 0 },
    refundedCommission: { type: Number, default: 0 },
    refundedCommissionPaise: { type: Number, default: 0 },
    refundedSellerShare: { type: Number, default: 0 },
    refundedSellerSharePaise: { type: Number, default: 0 },

    status: {
      type: String,
      enum: [
        'REQUESTED',
        'PROCESSING',
        'PROCESSED',
        'FAILED',
        'PARTIALLY_REFUNDED',
        'FULLY_REFUNDED',
        'REVERSED',
      ],
      default: 'REQUESTED',
      index: true,
    },
    isPartial: { type: Boolean, default: false },
    cumulativeRefundedAmount: { type: Number, default: 0 },
    remainingRefundableAmount: { type: Number, default: 0 },

    initiatedBy: {
      type: String,
      enum: ['ADMIN', 'CUSTOMER', 'AGENCY', 'SYSTEM'],
      required: true,
      default: 'ADMIN',
      index: true,
    },
    initiatorId: { type: String },
    initiatorEmail: { type: String },
    reason: { type: String, required: true },
    notes: { type: String, default: '' },

    razorpayRefundId: { type: String, index: true },
    gatewayResponse: { type: Schema.Types.Mixed },
    idempotencyKey: { type: String, required: true, unique: true, index: true },
    failureReason: { type: String },

    processedAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RefundSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
RefundSchema.index({ bookingId: 1, createdAt: -1 });

export const RefundModel =
  mongoose.models.Refund || mongoose.model<IRefund>('Refund', RefundSchema, 'refunds');
