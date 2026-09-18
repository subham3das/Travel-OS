import mongoose, { Schema, Document } from 'mongoose';

export type SecurityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IRole extends Document {
  name: string;
  slug: string;
  description: string;
  isSystemRole: boolean;
  securityLevel: SecurityLevel;
  permissions: string[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new Schema<IRole>(
  {
    name: {
      type: String,
      required: [true, 'Role name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Role slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    isSystemRole: {
      type: Boolean,
      default: false,
      index: true,
    },
    securityLevel: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    permissions: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: String,
      default: 'System',
    },
  },
  {
    timestamps: true,
    collection: 'roles',
  }
);

export const RoleModel = mongoose.model<IRole>('Role', RoleSchema);
