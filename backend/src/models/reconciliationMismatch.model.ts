import mongoose, { Document, Schema } from 'mongoose';

export type MismatchType =
  | 'AMOUNT_MISMATCH'
  | 'STATUS_MISMATCH'
  | 'MISSING_GATEWAY_RECORD'
  | 'MISSING_INTERNAL_RECORD'
  | 'COMMISSION_DISCREPANCY'
  | 'REFUND_DISCREPANCY'
  | 'UTR_MISSING'
  | 'TRANSFER_FAILED_AT_GATEWAY';

export type MismatchStatus = 'OPEN' | 'IN_INVESTIGATION' | 'RESOLVED' | 'ACCEPTED_VARIANCE';

export interface IReconciliationMismatch extends Document {
  mismatchId: string;
  reconciliationJobId: string;
  entityType: 'PAYMENT' | 'TRANSFER' | 'SETTLEMENT' | 'REFUND';
  internalId: string;
  gatewayId?: string;
  bookingId?: string;
  sellerId?: mongoose.Types.ObjectId;

  mismatchType: MismatchType;
  internalValue: any;
  gatewayValue: any;
  discrepancyAmount?: number;
  description: string;

  status: MismatchStatus;
  resolutionNotes?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  metadata?: Record<string, any>;

  detectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReconciliationMismatchSchema = new Schema<IReconciliationMismatch>(
  {
    mismatchId: { type: String, required: true, unique: true, index: true },
    reconciliationJobId: { type: String, required: true, index: true },
    entityType: {
      type: String,
      enum: ['PAYMENT', 'TRANSFER', 'SETTLEMENT', 'REFUND'],
      required: true,
      index: true,
    },
    internalId: { type: String, required: true, index: true },
    gatewayId: { type: String, index: true },
    bookingId: { type: String, index: true },
    sellerId: { type: Schema.Types.ObjectId, index: true },

    mismatchType: {
      type: String,
      enum: [
        'AMOUNT_MISMATCH',
        'STATUS_MISMATCH',
        'MISSING_GATEWAY_RECORD',
        'MISSING_INTERNAL_RECORD',
        'COMMISSION_DISCREPANCY',
        'REFUND_DISCREPANCY',
        'UTR_MISSING',
        'TRANSFER_FAILED_AT_GATEWAY',
      ],
      required: true,
      index: true,
    },
    internalValue: { type: Schema.Types.Mixed },
    gatewayValue: { type: Schema.Types.Mixed },
    discrepancyAmount: { type: Number, default: 0 },
    description: { type: String, required: true },

    status: {
      type: String,
      enum: ['OPEN', 'IN_INVESTIGATION', 'RESOLVED', 'ACCEPTED_VARIANCE'],
      default: 'OPEN',
      index: true,
    },
    resolutionNotes: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: String },
    metadata: { type: Schema.Types.Mixed },

    detectedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

ReconciliationMismatchSchema.index({ status: 1, detectedAt: -1 });

export const ReconciliationMismatchModel =
  mongoose.models.ReconciliationMismatch ||
  mongoose.model<IReconciliationMismatch>(
    'ReconciliationMismatch',
    ReconciliationMismatchSchema,
    'reconciliation_mismatches'
  );
