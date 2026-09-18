import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSession extends Document {
  adminId: mongoose.Types.ObjectId;
  adminEmail: string;
  jwtId?: string;
  browser: string;
  device: string;
  os: string;
  ip: string;
  location: string;
  country: string;
  flag?: string;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
      index: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    jwtId: {
      type: String,
      index: true,
    },
    browser: {
      type: String,
      default: 'Chrome',
    },
    device: {
      type: String,
      default: 'Desktop',
    },
    os: {
      type: String,
      default: 'Windows',
    },
    ip: {
      type: String,
      default: '127.0.0.1',
    },
    location: {
      type: String,
      default: 'India',
    },
    country: {
      type: String,
      default: 'India',
    },
    flag: {
      type: String,
      default: '🇮🇳',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '7d' },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'adminsessions',
  }
);

export const AdminSessionModel = mongoose.model<IAdminSession>('AdminSession', AdminSessionSchema);
