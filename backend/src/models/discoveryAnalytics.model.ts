import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscoveryAnalytics extends Document {
  sectionId: string;
  entityType: 'section' | 'package' | 'agency' | 'car';
  entityId?: string;
  eventType: 'impression' | 'click' | 'wishlist' | 'booking';
  userId?: string;
  timestamp: Date;
}

const DiscoveryAnalyticsSchema = new Schema<IDiscoveryAnalytics>(
  {
    sectionId: { type: String, required: true, index: true },
    entityType: {
      type: String,
      enum: ['section', 'package', 'agency', 'car'],
      required: true,
    },
    entityId: { type: String },
    eventType: {
      type: String,
      enum: ['impression', 'click', 'wishlist', 'booking'],
      required: true,
      index: true,
    },
    userId: { type: String },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

DiscoveryAnalyticsSchema.index({ sectionId: 1, eventType: 1 });
DiscoveryAnalyticsSchema.index({ entityId: 1, eventType: 1 });

export const DiscoveryAnalyticsModel =
  mongoose.models.DiscoveryAnalytics ||
  mongoose.model<IDiscoveryAnalytics>(
    'DiscoveryAnalytics',
    DiscoveryAnalyticsSchema,
    'discovery_analytics'
  );
