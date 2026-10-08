import mongoose, { Document, Schema } from 'mongoose';

export type CMSCampaignType = 'Discount' | 'Festival' | 'Seasonal' | 'Referral';
export type CMSContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export interface ICMSCampaign extends Document {
  campaignId: string;
  title: string;
  slug: string;
  description?: string;
  campaignType: CMSCampaignType;
  bannerImage: string;
  landingUrl?: string;
  couponId?: mongoose.Types.ObjectId;
  couponCode?: string;
  discountPercentage?: number;
  startDate?: string;
  endDate?: string;
  priority: number;
  status: CMSContentStatus;
  isActive: boolean;
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSCampaignSchema = new Schema<ICMSCampaign>(
  {
    campaignId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
    campaignType: {
      type: String,
      enum: ['Discount', 'Festival', 'Seasonal', 'Referral'],
      default: 'Festival',
    },
    bannerImage: { type: String, required: true },
    landingUrl: { type: String },
    couponId: { type: Schema.Types.ObjectId, ref: 'Coupon' },
    couponCode: { type: String, trim: true },
    discountPercentage: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    priority: { type: Number, default: 1, index: true },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
      default: 'published',
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    version: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSCampaignSchema.index({ isDeleted: 1, isActive: 1, status: 1 });

export const CMSCampaignModel =
  mongoose.models.CMSCampaign ||
  mongoose.model<ICMSCampaign>('CMSCampaign', CMSCampaignSchema, 'cms_campaigns');
