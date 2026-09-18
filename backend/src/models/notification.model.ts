import mongoose, { Document, Schema } from 'mongoose';

export type NotificationRecipientType = 'ADMIN' | 'AGENCY' | 'USER';

export type NotificationCategory =
  | 'Bookings'
  | 'Payments'
  | 'Trips'
  | 'Announcements'
  | 'Traveler'
  | 'Reviews'
  | 'Refunds'
  | 'Admin'
  | 'Team'
  | 'System'
  | 'agency'
  | 'package'
  | 'booking'
  | 'payment'
  | 'user'
  | 'review'
  | 'community'
  | 'support'
  | 'security'
  | 'system';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type NotificationStatus = 'UNREAD' | 'READ' | 'ARCHIVED';
export type NotificationDateGroup = 'Today' | 'Yesterday' | 'This Week' | 'Earlier';

export interface INotificationAction {
  label: string;
  actionType: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export interface INotification extends Document {
  recipientType: NotificationRecipientType;
  recipientId?: mongoose.Types.ObjectId;
  agencyId?: mongoose.Types.ObjectId; // For backwards compatibility with IAgencyNotification
  category: NotificationCategory;
  title: string;
  description: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  isUnread: boolean;
  readAt?: Date;
  timestamp?: string;
  dateGroup?: NotificationDateGroup;
  timeGroup?: string;
  targetRoute?: string;
  ctaText?: string;
  ctaLink?: string;
  actionUrl?: string;
  actions?: INotificationAction[];
  relatedEntityType?: string;
  relatedEntityId?: string;
  relatedEntityName?: string;
  triggeredBy?: string;
  metadata?: Record<string, any>;
  isPinned?: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// For backwards compatibility
export type IAgencyNotification = INotification;

const NotificationSchema = new Schema<INotification>(
  {
    recipientType: {
      type: String,
      enum: ['ADMIN', 'AGENCY', 'USER'],
      default: 'AGENCY',
      index: true,
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      index: true,
      default: null,
    },
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
      index: true,
      default: null,
    },
    category: {
      type: String,
      default: 'System',
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      index: true,
    },
    status: {
      type: String,
      enum: ['UNREAD', 'READ', 'ARCHIVED'],
      default: 'UNREAD',
      index: true,
    },
    isUnread: {
      type: Boolean,
      default: true,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    timestamp: {
      type: String,
      default: '',
    },
    dateGroup: {
      type: String,
      enum: ['Today', 'Yesterday', 'This Week', 'Earlier'],
      default: 'Today',
    },
    timeGroup: {
      type: String,
      default: 'Today',
    },
    targetRoute: {
      type: String,
      default: '',
    },
    ctaText: {
      type: String,
      default: '',
    },
    ctaLink: {
      type: String,
      default: '',
    },
    actionUrl: {
      type: String,
      default: '',
    },
    actions: [
      {
        label: { type: String, required: true },
        actionType: { type: String, required: true },
        variant: { type: String, default: 'primary' },
      },
    ],
    relatedEntityType: {
      type: String,
      default: 'SYSTEM',
    },
    relatedEntityId: {
      type: String,
      default: '',
    },
    relatedEntityName: {
      type: String,
      default: '',
    },
    triggeredBy: {
      type: String,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for fast queries & scaling
NotificationSchema.index({ recipientType: 1, recipientId: 1, isDeleted: 1, createdAt: -1 });
NotificationSchema.index({ recipientType: 1, isUnread: 1, isDeleted: 1 });
NotificationSchema.index({ recipientType: 1, priority: 1, isDeleted: 1 });
NotificationSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
NotificationSchema.index({ agencyId: 1, status: 1, isDeleted: 1 });
NotificationSchema.index({ agencyId: 1, isUnread: 1, isDeleted: 1 });

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema, 'notifications');

export const AgencyNotificationModel = NotificationModel;
