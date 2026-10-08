import mongoose, { Document, Schema } from 'mongoose';

export type DiscoverySectionType = 'package' | 'agency' | 'destination' | 'car_rental';

export interface ISectionConfiguration extends Document {
  sectionId: string;
  title: string;
  subtitle: string;
  emoji?: string;
  type: DiscoverySectionType;
  categoryFilter?: string;
  rankingRule?: string;
  isEnabled: boolean;
  showOnHome: boolean;
  showOnExplore: boolean;
  order: number;
  minItems: number;
  maxItems: number;
  viewAllLink?: string;
  impressions: number;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
}

const SectionConfigurationSchema = new Schema<ISectionConfiguration>(
  {
    sectionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    emoji: {
      type: String,
      default: '✨',
    },
    type: {
      type: String,
      enum: ['package', 'agency', 'destination', 'car_rental'],
      default: 'package',
      index: true,
    },
    categoryFilter: {
      type: String,
      default: '',
      index: true,
    },
    rankingRule: {
      type: String,
      default: 'trending',
    },
    isEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },
    showOnHome: {
      type: Boolean,
      default: true,
    },
    showOnExplore: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
      index: true,
    },
    minItems: {
      type: Number,
      default: 4,
    },
    maxItems: {
      type: Number,
      default: 12,
    },
    viewAllLink: {
      type: String,
      default: '',
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

SectionConfigurationSchema.index({ isEnabled: 1, order: 1 });

export const SectionConfigurationModel =
  mongoose.models.SectionConfiguration ||
  mongoose.model<ISectionConfiguration>(
    'SectionConfiguration',
    SectionConfigurationSchema,
    'section_configurations'
  );
