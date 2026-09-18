import mongoose, { Schema, Document } from 'mongoose';

export interface IAccessRequest extends Document {
  adminId: mongoose.Types.ObjectId;
  adminName: string;
  adminEmail: string;
  adminAvatar?: string;
  currentRole: string;
  requestedRole: string;
  requestedRoleId?: mongoose.Types.ObjectId;
  reason?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AccessRequestSchema = new Schema<IAccessRequest>(
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
    adminEmail: {
      type: String,
      required: true,
    },
    adminAvatar: {
      type: String,
    },
    currentRole: {
      type: String,
      required: true,
    },
    requestedRole: {
      type: String,
      required: true,
    },
    requestedRoleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'accessrequests',
  }
);

export const AccessRequestModel = mongoose.model<IAccessRequest>('AccessRequest', AccessRequestSchema);
