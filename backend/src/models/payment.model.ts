import mongoose, { Document, Schema } from 'mongoose';

export type PaymentStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
export type PaymentGateway = 'Razorpay' | 'Stripe' | 'UPI' | 'NetBanking' | 'PhonePe' | 'PayU';
export type SettlementStatus = 'Pending' | 'Settled' | 'Failed' | 'Processing';

export interface IPaymentTimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming' | 'failed';
}

export interface IPaymentActivityLog {
  id: string;
  actor: string;
  role: 'Super Admin' | 'Gateway' | 'Agency' | 'Traveler';
  action: string;
  details: string;
  timestamp: string;
}

export interface IPayment extends Document {
  paymentId: string;
  bookingId?: string;
  agencyId?: mongoose.Types.ObjectId;
  agencyName?: string;
  agencyLogo?: string;
  userId?: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  userAvatar?: string;
  packageName?: string;
  packageThumbnail?: string;
  destinationCountry?: string;
  destinationRegion?: string;
  durationText?: string;
  amount: number;
  platformFee?: number;
  gstAmount?: number;
  agencyEarnings?: number;
  netAmount?: number;
  couponDiscount?: number;
  couponCode?: string;
  currency: string;
  gateway: PaymentGateway;
  paymentMethod: string;
  status: PaymentStatus;
  settlementStatus: SettlementStatus;
  settlementAccount?: string;
  settlementId?: string;
  scheduledSettlementDate?: Date;
  transactionRef?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: string;
  authorizationCode?: string;
  failureReason?: string;
  paidAt?: Date;
  capturedAt?: Date;
  timeline?: IPaymentTimelineStep[];
  activities?: IPaymentActivityLog[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    paymentId: { type: String, required: true, unique: true, index: true },
    bookingId: { type: String, index: true },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', index: true },
    agencyName: { type: String, default: 'ApnaTrip Partner Agency' },
    agencyLogo: { type: String, default: '' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    userName: { type: String },
    userEmail: { type: String },
    userPhone: { type: String },
    userAvatar: { type: String, default: '' },
    packageName: { type: String },
    packageThumbnail: { type: String, default: '' },
    destinationCountry: { type: String, default: 'India' },
    destinationRegion: { type: String, default: 'North India' },
    durationText: { type: String, default: '3D / 2N' },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    agencyEarnings: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    currency: { type: String, default: 'INR' },
    gateway: {
      type: String,
      enum: ['Razorpay', 'Stripe', 'UPI', 'NetBanking', 'PhonePe', 'PayU'],
      default: 'Razorpay',
    },
    paymentMethod: { type: String, default: 'UPI' },
    status: {
      type: String,
      enum: ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'],
      default: 'SUCCESS',
      index: true,
    },
    settlementStatus: {
      type: String,
      enum: ['Pending', 'Settled', 'Failed', 'Processing'],
      default: 'Pending',
      index: true,
    },
    settlementAccount: { type: String, default: '' },
    settlementId: { type: String, default: '' },
    scheduledSettlementDate: { type: Date },
    transactionRef: { type: String },
    gatewayTransactionId: { type: String },
    gatewayResponse: { type: String, default: 'Authorized' },
    authorizationCode: { type: String, default: '' },
    failureReason: { type: String },
    paidAt: { type: Date, default: Date.now },
    capturedAt: { type: Date, default: Date.now },
    timeline: [
      {
        id: { type: String },
        title: { type: String },
        subtitle: { type: String },
        timestamp: { type: String },
        status: { type: String },
      },
    ],
    activities: [
      {
        id: { type: String },
        actor: { type: String },
        role: { type: String },
        action: { type: String },
        details: { type: String },
        timestamp: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PaymentSchema.index({ createdAt: -1 });
PaymentSchema.index({ status: 1, settlementStatus: 1, isDeleted: 1 });
PaymentSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
PaymentSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });

export const PaymentModel =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema, 'payments');

