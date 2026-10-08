import mongoose, { Schema, Document } from 'mongoose';

export type PartnerBusinessType = 'agency' | 'car_rental';
export type SubscriptionStatus = 'pending_payment' | 'active' | 'expired' | 'cancelled';

export interface IPartnerSubscription extends Document {
  businessType: PartnerBusinessType;
  partnerName: string;
  email: string;
  phone: string;
  plan: string;
  amount: number;
  discount: number;
  amountPaid: number;
  couponId?: mongoose.Types.ObjectId;
  couponCode?: string;
  orderId?: string;
  paymentId?: string;
  status: SubscriptionStatus;
  agencyId?: mongoose.Types.ObjectId;
  partnerId?: mongoose.Types.ObjectId;
  draftId?: string;
  applicationId?: string;
  startedAt?: Date;
  expiresAt?: Date;
  invoiceId?: mongoose.Types.ObjectId;
  invoiceNumber?: string;
  onboardingCompleted: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSubscriptionSchema = new Schema<IPartnerSubscription>(
  {
    businessType: {
      type: String,
      enum: ['agency', 'car_rental'],
      required: true,
      index: true,
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    plan: {
      type: String,
      default: 'one_time_registration',
    },
    amount: {
      type: Number,
      required: true,
      default: 1000,
    },
    discount: {
      type: Number,
      default: 0,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null,
    },
    couponCode: {
      type: String,
      default: null,
      uppercase: true,
      trim: true,
    },
    orderId: {
      type: String,
      default: null,
      index: true,
    },
    paymentId: {
      type: String,
      default: null,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending_payment', 'active', 'expired', 'cancelled'],
      default: 'pending_payment',
      index: true,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      default: null,
    },
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      default: null,
    },
    draftId: {
      type: String,
      trim: true,
      default: null,
    },
    applicationId: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    invoiceNumber: {
      type: String,
      default: null,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const PartnerSubscriptionModel = mongoose.model<IPartnerSubscription>(
  'PartnerSubscription',
  PartnerSubscriptionSchema
);
