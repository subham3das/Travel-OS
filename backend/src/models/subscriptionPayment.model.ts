import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'created' | 'paid' | 'failed' | 'refunded';

export interface ISubscriptionPayment extends Document {
  orderId: string;
  paymentId: string;
  signature?: string;
  subscriptionId: mongoose.Types.ObjectId;
  businessType: 'agency' | 'car_rental';
  amount: number;
  currency: string;
  status: PaymentStatus;
  method?: string;
  gateway: string;
  email: string;
  phone: string;
  couponCode?: string;
  discountAmount?: number;
  rawResponse?: Record<string, any>;
  errorDetails?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPaymentSchema = new Schema<ISubscriptionPayment>(
  {
    orderId: {
      type: String,
      required: true,
      index: true,
    },
    paymentId: {
      type: String,
      required: true,
      index: true,
    },
    signature: {
      type: String,
      default: null,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'PartnerSubscription',
      required: true,
      index: true,
    },
    businessType: {
      type: String,
      enum: ['agency', 'car_rental'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
      index: true,
    },
    method: {
      type: String,
      default: 'Razorpay',
    },
    gateway: {
      type: String,
      default: 'Razorpay',
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
      default: null,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    rawResponse: {
      type: Schema.Types.Mixed,
      default: null,
    },
    errorDetails: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const SubscriptionPaymentModel = mongoose.model<ISubscriptionPayment>(
  'SubscriptionPayment',
  SubscriptionPaymentSchema
);
