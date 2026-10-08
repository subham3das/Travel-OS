import mongoose, { Document, Schema } from 'mongoose';

export type AnnouncementType = 'info' | 'warning' | 'alert' | 'success';
export type AnnouncementTargetType = 'Package' | 'Agency' | 'Destination' | 'External' | 'None';
export type AnnouncementPlacement = 'all' | 'home_only' | 'mobile_only';
export type CMSContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export interface ICMSAnnouncement extends Document {
  announcementId: string;
  title: string;
  description?: string;
  type: AnnouncementType;
  bgColor?: string;
  textColor?: string;
  targetType: AnnouncementTargetType;
  targetId?: string;
  linkUrl?: string;
  ctaText?: string;
  placement: AnnouncementPlacement;
  isPinned: boolean;
  isDismissible: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  status: CMSContentStatus;
  isEnabled: boolean;
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSAnnouncementSchema = new Schema<ICMSAnnouncement>(
  {
    announcementId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: {
      type: String,
      enum: ['info', 'warning', 'alert', 'success'],
      default: 'info',
    },
    bgColor: { type: String, default: '#3B82F6' },
    textColor: { type: String, default: '#FFFFFF' },
    targetType: {
      type: String,
      enum: ['Package', 'Agency', 'Destination', 'External', 'None'],
      default: 'None',
    },
    targetId: { type: String },
    linkUrl: { type: String },
    ctaText: { type: String },
    placement: {
      type: String,
      enum: ['all', 'home_only', 'mobile_only'],
      default: 'all',
    },
    isPinned: { type: Boolean, default: false },
    isDismissible: { type: Boolean, default: true },
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
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSAnnouncementSchema.index({ isDeleted: 1, isEnabled: 1, status: 1, priority: 1 });

export const CMSAnnouncementModel =
  mongoose.models.CMSAnnouncement ||
  mongoose.model<ICMSAnnouncement>('CMSAnnouncement', CMSAnnouncementSchema, 'cms_announcements');
