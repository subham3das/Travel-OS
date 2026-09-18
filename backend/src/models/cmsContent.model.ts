import mongoose, { Document, Schema } from 'mongoose';

export type CMSContentType = 'hero_banner' | 'announcement' | 'promo_popup' | 'section' | 'seo';

export interface ICMSContent extends Document {
  contentId: string;
  type: CMSContentType;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  desktopImage?: string;
  mobileImage?: string;
  startDate?: string;
  endDate?: string;
  priority?: number;
  isEnabled: boolean;
  status: 'draft' | 'published' | 'archived';
  meta?: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSContentSchema = new Schema<ICMSContent>(
  {
    contentId: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ['hero_banner', 'announcement', 'promo_popup', 'section', 'seo'],
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    ctaText: { type: String },
    ctaLink: { type: String },
    desktopImage: { type: String },
    mobileImage: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    priority: { type: Number, default: 1 },
    isEnabled: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
      index: true,
    },
    meta: { type: Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSContentSchema.index({ type: 1, isDeleted: 1 });

export const CMSContentModel =
  mongoose.models.CMSContent ||
  mongoose.model<ICMSContent>('CMSContent', CMSContentSchema, 'cms_contents');
