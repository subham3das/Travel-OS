import mongoose, { Schema, Document } from 'mongoose';

export interface ICouponUsage extends Document {
  couponId: mongoose.Types.ObjectId;
  couponCode: string;
  userId?: mongoose.Types.ObjectId;
  userEmail: string;
  bookingId?: mongoose.Types.ObjectId;
  subscriptionId?: mongoose.Types.ObjectId;
  discount: number;
  amount: number;
  finalAmount: number;
  businessType?: string;
  usedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CouponUsageSchema = new Schema<ICouponUsage>(
  {
    couponId: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
      index: true,
    },
    couponCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    subscriptionId: {
      type: Schema.Types.ObjectId,
      ref: 'PartnerSubscription',
      default: null,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    businessType: {
      type: String,
      enum: ['agency', 'car_rental', 'traveler', 'other'],
      default: 'agency',
    },
    usedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to check per-user usage quickly
CouponUsageSchema.index({ couponId: 1, userEmail: 1 });

export const CouponUsageModel = mongoose.model<ICouponUsage>('CouponUsage', CouponUsageSchema);
