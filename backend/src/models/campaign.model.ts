import mongoose, { Document, Schema } from 'mongoose';

export type CampaignType = 'Push' | 'Email' | 'SMS' | 'In-App';
export type CampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Completed' | 'Cancelled';
export type CampaignAudience = 'All Users' | 'Travel Agencies' | 'Verified Travelers' | 'Subscribed Users' | 'Custom Segment';

export interface ICampaign extends Document {
  campaignId: string;
  name: string;
  type: CampaignType;
  audience: CampaignAudience;
  audienceReach?: string;
  status: CampaignStatus;
  progressPercentage: number;
  sentDate?: string;
  scheduleTime?: string;
  createdBy: string;
  title: string;
  message: string;
  ctaText?: string;
  deepLink?: string;
  timeZone?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    campaignId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ['Push', 'Email', 'SMS', 'In-App'],
      default: 'Push',
      index: true,
    },
    audience: {
      type: String,
      enum: ['All Users', 'Travel Agencies', 'Verified Travelers', 'Subscribed Users', 'Custom Segment'],
      default: 'All Users',
      index: true,
    },
    audienceReach: { type: String, default: '100.0K' },
    status: {
      type: String,
      enum: ['Draft', 'Scheduled', 'Active', 'Completed', 'Cancelled'],
      default: 'Completed',
      index: true,
    },
    progressPercentage: { type: Number, default: 100 },
    sentDate: { type: String },
    scheduleTime: { type: String },
    createdBy: { type: String, default: 'Super Admin' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    ctaText: { type: String, default: 'Explore Now' },
    deepLink: { type: String, default: '/packages' },
    timeZone: { type: String, default: '(GMT +05:30) Asia/Kolkata' },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CampaignSchema.index({ createdAt: -1 });

export const CampaignModel =
  mongoose.models.Campaign ||
  mongoose.model<ICampaign>('Campaign', CampaignSchema, 'marketing_campaigns');
