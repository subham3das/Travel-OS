import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSettings extends Document {
  key: string;
  general: {
    platformName: string;
    companyEmail: string;
    websiteUrl: string;
    timezone: string;
    currency: string;
    language: string;
    maintenanceMode: boolean;
    userRegistration: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    platformVersion: string;
    buildNumber: string;
    environment: string;
    serverLocation: string;
    uptime: string;
  };
  featureFlags: Array<{
    id: string;
    name: string;
    description: string;
    iconType: string;
    enabled: boolean;
    isBeta: boolean;
    environment: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingsSchema = new Schema<ISystemSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'GLOBAL_SETTINGS' },
    general: {
      platformName: { type: String, default: 'Travel OS' },
      companyEmail: { type: String, default: 'support@travelos.com' },
      websiteUrl: { type: String, default: 'https://travelos.com' },
      timezone: { type: String, default: 'Asia/Kolkata' },
      currency: { type: String, default: 'INR (₹)' },
      language: { type: String, default: 'English' },
      maintenanceMode: { type: Boolean, default: false },
      userRegistration: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      platformVersion: { type: String, default: 'v2.4.1' },
      buildNumber: { type: String, default: '#2847' },
      environment: { type: String, default: 'Production' },
      serverLocation: { type: String, default: 'Mumbai, India' },
      uptime: { type: String, default: '18 days, 6 hours' },
    },
    featureFlags: [
      {
        id: { type: String },
        name: { type: String },
        description: { type: String },
        iconType: { type: String },
        enabled: { type: Boolean, default: true },
        isBeta: { type: Boolean, default: false },
        environment: { type: String, default: 'All' },
      },
    ],
  },
  { timestamps: true }
);

export const SystemSettingsModel =
  mongoose.models.SystemSettings ||
  mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema, 'system_settings');
