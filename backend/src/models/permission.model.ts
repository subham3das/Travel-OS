import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
  module: string;
  action: string;
  key: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema<IPermission>(
  {
    module: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['view', 'create', 'edit', 'delete', 'approve', 'export', 'assign', 'fullAccess'],
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'permissions',
  }
);

export const PermissionModel = mongoose.model<IPermission>('Permission', PermissionSchema);
