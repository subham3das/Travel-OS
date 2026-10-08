import mongoose, { Document, Schema } from 'mongoose';

export type ServiceType = 'agency' | 'car_rental';

export interface IRegistrationDraft extends Document {
  draftId: string;
  userId?: mongoose.Types.ObjectId | string;
  serviceType: ServiceType;
  businessDetails: Record<string, any>;
  profileDetails?: Record<string, any>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    fileUrl: string;
    size?: number;
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
  subscription?: {
    plan?: string;
    amount?: number;
    discount?: number;
    couponCode?: string;
    orderId?: string;
  };
  paymentId?: string;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  currentStep: number;
  paymentPending: boolean;
  coupon?: string | Record<string, any>;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RegistrationDraftSchema = new Schema<IRegistrationDraft>(
  {
    draftId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      index: true,
    },
    serviceType: {
      type: String,
      enum: ['agency', 'car_rental'],
      required: true,
      default: 'agency',
    },
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
          size: { type: Number },
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
    subscription: {
      plan: { type: String, default: 'one_time_registration' },
      amount: { type: Number, default: 1000 },
      discount: { type: Number, default: 0 },
      couponCode: { type: String },
      orderId: { type: String },
    },
    paymentId: {
      type: String,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    paymentPending: {
      type: Boolean,
      default: true,
    },
    coupon: {
      type: Schema.Types.Mixed,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

RegistrationDraftSchema.index({ 'businessDetails.email': 1 });
RegistrationDraftSchema.index({ serviceType: 1, isCompleted: 1, updatedAt: -1 });

export const RegistrationDraftModel =
  mongoose.models.RegistrationDraft ||
  mongoose.model<IRegistrationDraft>('RegistrationDraft', RegistrationDraftSchema, 'registration_drafts');
