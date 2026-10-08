import mongoose, { Document, Schema } from 'mongoose';

export interface ICMSMediaItem extends Document {
  mediaId: string;
  title: string;
  url: string;
  publicId: string;
  folder: string;
  format?: string;
  resourceType: 'image' | 'video';
  sizeBytes?: number;
  width?: number;
  height?: number;
  uploadedBy: string;
  tags: string[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSMediaItemSchema = new Schema<ICMSMediaItem>(
  {
    mediaId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    folder: { type: String, default: 'travelos/cms' },
    format: { type: String },
    resourceType: { type: String, enum: ['image', 'video'], default: 'image' },
    sizeBytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    uploadedBy: { type: String, default: 'Super Admin' },
    tags: { type: [String], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSMediaItemSchema.index({ isDeleted: 1, createdAt: -1 });

export const CMSMediaItemModel =
  mongoose.models.CMSMediaItem ||
  mongoose.model<ICMSMediaItem>('CMSMediaItem', CMSMediaItemSchema, 'cms_media');
