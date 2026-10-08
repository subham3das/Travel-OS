import mongoose, { Schema, Document } from 'mongoose';

export type CouponDiscountType = 'percentage' | 'fixed';

export type CouponApplicablePlatform =
  | 'agency_subscription'
  | 'car_rental_subscription'
  | 'travel_package_booking'
  | 'car_booking'
  | 'hotels'
  | 'activities'
  | 'future_services';

export type CouponEligibility =
  | 'all'
  | 'new_users'
  | 'existing_users'
  | 'specific_user'
  | 'partner_only'
  | 'agency_only'
  | 'car_rental_only';

export type CouponStatus = 'active' | 'paused' | 'expired' | 'draft';

export interface ICouponRules {
  firstPurchaseOnly: boolean;
  canCombine: boolean;
  singleUse: boolean;
  recurring: boolean;
}

export interface ICoupon extends Document {
  code: string;
  description: string;
  type: CouponDiscountType;
  percentage?: number;
  fixedAmount?: number;
  minimumAmount: number;
  maximumDiscount?: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  remaining?: number;
  perUserLimit: number;
  applicablePlatforms: CouponApplicablePlatform[];
  eligibility: CouponEligibility;
  specificUserIds?: mongoose.Types.ObjectId[];
  status: CouponStatus;
  rules: ICouponRules;
  createdBy?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
      default: 'percentage',
    },
    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    fixedAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    minimumAmount: {
      type: Number,
      min: 0,
      default: 0,
    },
    maximumDiscount: {
      type: Number,
      min: 0,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      min: 1,
      default: 1000,
    },
    usedCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    perUserLimit: {
      type: Number,
      min: 1,
      default: 1,
    },
    applicablePlatforms: {
      type: [String],
      enum: [
        'agency_subscription',
        'car_rental_subscription',
        'travel_package_booking',
        'car_booking',
        'hotels',
        'activities',
        'future_services',
      ],
      default: ['agency_subscription', 'car_rental_subscription'],
    },
    eligibility: {
      type: String,
      enum: [
        'all',
        'new_users',
        'existing_users',
        'specific_user',
        'partner_only',
        'agency_only',
        'car_rental_only',
      ],
      default: 'all',
    },
    specificUserIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'paused', 'expired', 'draft'],
      default: 'active',
      index: true,
    },
    rules: {
      firstPurchaseOnly: { type: Boolean, default: false },
      canCombine: { type: Boolean, default: false },
      singleUse: { type: Boolean, default: true },
      recurring: { type: Boolean, default: false },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for remaining uses
CouponSchema.virtual('remaining').get(function (this: ICoupon) {
  if (this.usageLimit == null) return null;
  return Math.max(0, this.usageLimit - (this.usedCount || 0));
});

export const CouponModel = mongoose.model<ICoupon>('Coupon', CouponSchema);
