import mongoose, { Document, Schema } from 'mongoose';
import { SellerType } from './sellerPaymentProfile.model.js';

export type DisputeStatus =
  | 'DISPUTE_OPENED'
  | 'EVIDENCE_REQUIRED'
  | 'EVIDENCE_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'WON'
  | 'LOST'
  | 'CLOSED';

export interface IDisputeEvidence {
  documentType: string;
  documentUrl: string;
  description?: string;
  submittedAt: Date;
  submittedBy?: string;
}

export interface IDispute extends Document {
  disputeId: string; // Internal DISP-XXXXXX-XXX
  razorpayDisputeId?: string;
  paymentId: mongoose.Types.ObjectId;
  razorpayPaymentId?: string;
  bookingId: string;
  sellerId: mongoose.Types.ObjectId;
  sellerType: SellerType;
  sellerName?: string;

  amount: number;
  amountPaise: number;
  currency: string;

  reason: string;
  category?: string;
  evidence: IDisputeEvidence[];
  status: DisputeStatus;
  deadline?: Date;

  openedAt: Date;
  closedAt?: Date;
  result?: 'WON' | 'LOST' | 'CLOSED' | 'CANCELLED';
  notes?: string;

  idempotencyKey?: string;
  gatewayResponse?: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DisputeSchema = new Schema<IDispute>(
  {
    disputeId: { type: String, required: true, unique: true, index: true },
    razorpayDisputeId: { type: String, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true, index: true },
    razorpayPaymentId: { type: String, index: true },
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
    amountPaise: { type: Number, required: true },
    currency: { type: String, default: 'INR' },

    reason: { type: String, required: true },
    category: { type: String, default: 'general' },
    evidence: [
      {
        documentType: { type: String, required: true },
        documentUrl: { type: String, required: true },
        description: { type: String },
        submittedAt: { type: Date, default: Date.now },
        submittedBy: { type: String },
      },
    ],
    status: {
      type: String,
      enum: [
        'DISPUTE_OPENED',
        'EVIDENCE_REQUIRED',
        'EVIDENCE_SUBMITTED',
        'UNDER_REVIEW',
        'WON',
        'LOST',
        'CLOSED',
      ],
      default: 'DISPUTE_OPENED',
      index: true,
    },
    deadline: { type: Date },

    openedAt: { type: Date, default: Date.now },
    closedAt: { type: Date },
    result: { type: String, enum: ['WON', 'LOST', 'CLOSED', 'CANCELLED'] },
    notes: { type: String, default: '' },

    idempotencyKey: { type: String, index: true },
    gatewayResponse: { type: Schema.Types.Mixed },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

DisputeSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
DisputeSchema.index({ bookingId: 1, createdAt: -1 });

export const DisputeModel =
  mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema, 'disputes');
