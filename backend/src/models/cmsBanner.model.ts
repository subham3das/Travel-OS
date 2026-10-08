import mongoose, { Document, Schema } from 'mongoose';

export type BannerTargetType = 'Package' | 'Agency' | 'Destination' | 'Car Rental' | 'External';
export type CMSContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export interface IBannerVersion {
  version: number;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  targetType: BannerTargetType;
  targetId?: string;
  externalUrl?: string;
  ctaText?: string;
  savedBy: string;
  savedAt: Date;
}

export interface ICMSBanner extends Document {
  bannerId: string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage?: string;
  targetType: BannerTargetType;
  targetId?: string;
  externalUrl?: string;
  ctaText?: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  status: CMSContentStatus;
  isEnabled: boolean;
  version: number;
  versionHistory: IBannerVersion[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerVersionSchema = new Schema<IBannerVersion>(
  {
    version: { type: Number, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String },
    targetType: {
      type: String,
      enum: ['Package', 'Agency', 'Destination', 'Car Rental', 'External'],
      default: 'Package',
    },
    targetId: { type: String },
    externalUrl: { type: String },
    ctaText: { type: String },
    savedBy: { type: String, default: 'Super Admin' },
    savedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const CMSBannerSchema = new Schema<ICMSBanner>(
  {
    bannerId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    desktopImage: { type: String, required: true },
    mobileImage: { type: String },
    targetType: {
      type: String,
      enum: ['Package', 'Agency', 'Destination', 'Car Rental', 'External'],
      default: 'Package',
      required: true,
    },
    targetId: { type: String },
    externalUrl: { type: String },
    ctaText: { type: String, default: 'Explore Now' },
    priority: { type: Number, default: 1, index: true },
    startDate: { type: String },
    endDate: { type: String },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'expired', 'archived'],
      default: 'published',
      index: true,
    },
    isEnabled: { type: Boolean, default: true, index: true },
    version: { type: Number, default: 1 },
    versionHistory: { type: [BannerVersionSchema], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSBannerSchema.index({ isDeleted: 1, isEnabled: 1, status: 1, priority: 1 });

export const CMSBannerModel =
  mongoose.models.CMSBanner ||
  mongoose.model<ICMSBanner>('CMSBanner', CMSBannerSchema, 'cms_banners');
