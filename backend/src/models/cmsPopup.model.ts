import mongoose, { Document, Schema } from 'mongoose';

export type PopupFrequency = 'once_per_user' | 'always_show' | 'once_per_session';
export type PopupMediaType = 'image' | 'video';
export type CMSContentStatus = 'draft' | 'scheduled' | 'published' | 'expired' | 'archived';

export interface ICMSPopup extends Document {
  popupId: string;
  title: string;
  description?: string;
  mediaType: PopupMediaType;
  mediaUrl: string;
  buttonText?: string;
  buttonLink?: string;
  targetType: 'Package' | 'Agency' | 'Destination' | 'Campaign' | 'External' | 'None';
  targetId?: string;
  delaySeconds: number;
  frequency: PopupFrequency;
  hasCloseButton: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  status: CMSContentStatus;
  isActive: boolean;
  version: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSPopupSchema = new Schema<ICMSPopup>(
  {
    popupId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    mediaUrl: { type: String, required: true },
    buttonText: { type: String, default: 'Learn More' },
    buttonLink: { type: String },
    targetType: {
      type: String,
      enum: ['Package', 'Agency', 'Destination', 'Campaign', 'External', 'None'],
      default: 'None',
    },
    targetId: { type: String },
    delaySeconds: { type: Number, default: 3 },
    frequency: {
      type: String,
      enum: ['once_per_user', 'always_show', 'once_per_session'],
      default: 'once_per_session',
    },
    hasCloseButton: { type: Boolean, default: true },
    priority: { type: Number, default: 1, index: true },
    startDate: { type: String },
    endDate: { type: String },
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

CMSPopupSchema.index({ isDeleted: 1, isActive: 1, status: 1, priority: 1 });

export const CMSPopupModel =
  mongoose.models.CMSPopup ||
  mongoose.model<ICMSPopup>('CMSPopup', CMSPopupSchema, 'cms_popups');
