import mongoose, { Document, Schema } from 'mongoose';

export type ApprovalServiceType = 'agency' | 'carRental';
export type ApprovalRegistrationStatus = 'Pending Approval' | 'Approved' | 'Rejected' | 'Under Review';

export interface IApprovalRequest extends Document {
  applicationId: string;
  userId?: mongoose.Types.ObjectId | string;
  agencyId: mongoose.Types.ObjectId;
  serviceType: ApprovalServiceType;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  city?: string;
  state?: string;
  businessDetails: Record<string, any>;
  profileDetails?: Record<string, any>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    status: string;
    uploadedAt?: string;
  }>;
  bank: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    branch?: string;
    upiId?: string;
    accountType?: string;
    payoutMethod?: string;
  };
  subscriptionId?: mongoose.Types.ObjectId;
  subscriptionPlan: string;
  subscriptionAmount: number;
  paymentId: string;
  paymentStatus: 'SUCCESS' | 'Paid' | 'PENDING' | 'FAILED';
  registrationStatus: ApprovalRegistrationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  rejectedReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalRequestSchema = new Schema<IApprovalRequest>(
  {
    applicationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      index: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      required: true,
    },
    serviceType: {
      type: String,
      enum: ['agency', 'carRental'],
      required: true,
      default: 'agency',
      index: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    businessDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
    profileDetails: {
      type: Schema.Types.Mixed,
      default: {},
    },
    documents: {
      type: [
        {
          id: { type: String },
          name: { type: String },
          type: { type: String },
          fileUrl: { type: String },
          status: { type: String, default: 'Pending' },
          uploadedAt: { type: String },
        },
      ],
      default: [],
    },
    bank: {
      accountHolderName: { type: String, default: '' },
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      branch: { type: String, default: '' },
      upiId: { type: String, default: '' },
      accountType: { type: String, default: 'Current Account' },
      payoutMethod: { type: String, default: 'bank' },
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'PartnerSubscription',
    },
    subscriptionPlan: {
      type: String,
      default: 'Partner Registration (₹1000)',
    },
    subscriptionAmount: {
      type: Number,
      default: 1000,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['SUCCESS', 'Paid', 'PENDING', 'FAILED'],
      default: 'SUCCESS',
    },
    registrationStatus: {
      type: String,
      enum: ['Pending Approval', 'Approved', 'Rejected', 'Under Review'],
      default: 'Pending Approval',
      index: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    rejectedReason: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'approval_requests',
  }
);

ApprovalRequestSchema.index({ registrationStatus: 1, submittedAt: -1 });
ApprovalRequestSchema.index({ agencyId: 1 }, { unique: true, sparse: true });


export const ApprovalRequestModel =
  mongoose.models.ApprovalRequest ||
  mongoose.model<IApprovalRequest>('ApprovalRequest', ApprovalRequestSchema, 'approval_requests');
