import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminActivity extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminAvatar?: string;
  action: string;
  module: string;
  resourceId?: string;
  ip?: string;
  device?: string;
  browser?: string;
  createdAt: Date;
}

const AdminActivitySchema = new Schema<IAdminActivity>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    adminName: {
      type: String,
      required: true,
    },
    adminAvatar: {
      type: String,
    },
    action: {
      type: String,
      required: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
    },
    ip: {
      type: String,
    },
    device: {
      type: String,
    },
    browser: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'adminactivities',
  }
);

export const AdminActivityModel = mongoose.model<IAdminActivity>('AdminActivity', AdminActivitySchema);
