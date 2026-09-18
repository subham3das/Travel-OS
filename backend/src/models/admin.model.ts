import mongoose, { Schema, Document } from 'mongoose';
import './role.model.js';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FINANCE_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'SUPPORT_MANAGER'
  | 'CONTENT_MANAGER';

export type AdminAuthProvider = 'credentials' | 'google' | 'both';

export interface IAdminPreferences {
  theme: 'Light' | 'Dark' | 'System';
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
}

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password?: string;
  passwordChangedAt?: Date;
  authProvider: AdminAuthProvider;
  googleId?: string;
  profileImage?: string;
  phone?: string;
  country?: string;
  timezone?: string;
  location?: string;
  recoveryEmail?: string;
  preferences?: IAdminPreferences;
  roleId?: mongoose.Types.ObjectId;
  role: AdminRole;
  department?: string;
  permissions?: string[];
  permissionsOverride?: string[];
  isActive: boolean;
  isSuperAdmin: boolean;
  invitationStatus?: 'Accepted' | 'Pending' | 'Expired';
  lastLogin?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name must be under 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    authProvider: {
      type: String,
      enum: ['credentials', 'google', 'both'],
      default: 'credentials',
    },
    googleId: {
      type: String,
      sparse: true,
      index: true,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    phone: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'India',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata (GMT +5:30)',
    },
    location: {
      type: String,
      default: 'New Delhi, India',
    },
    recoveryEmail: {
      type: String,
      default: '',
    },
    preferences: {
      theme: {
        type: String,
        enum: ['Light', 'Dark', 'System'],
        default: 'Light',
      },
      language: {
        type: String,
        default: 'English',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      smsNotifications: {
        type: Boolean,
        default: false,
      },
      desktopNotifications: {
        type: Boolean,
        default: true,
      },
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'Role',
      index: true,
    },
    role: {
      type: String,
      default: 'SUPER_ADMIN',
      index: true,
    },
    department: {
      type: String,
      default: 'Executive',
    },
    permissions: {
      type: [String],
      default: ['ALL'],
    },
    permissionsOverride: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isSuperAdmin: {
      type: Boolean,
      default: true,
    },
    invitationStatus: {
      type: String,
      enum: ['Accepted', 'Pending', 'Expired'],
      default: 'Accepted',
    },
    lastLogin: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'admins',
  }
);

export const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);
