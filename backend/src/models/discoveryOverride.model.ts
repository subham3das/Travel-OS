import mongoose, { Document, Schema } from 'mongoose';

export type OverrideTargetType = 'PACKAGE' | 'AGENCY';

export type DiscoveryOverrideBadge =
  | 'Normal'
  | 'Trending'
  | 'Popular'
  | 'Featured'
  | 'Most Popular'
  | "Editor's Pick"
  | 'Hidden Gem'
  | 'Premium'
  | 'Festival Featured'
  | 'Homepage Hero'
  | 'Explore Hero'
  | 'Recommended'
  | 'Premium Partner'
  | "Editor's Choice";

export interface IDiscoveryOverride extends Document {
  targetType: OverrideTargetType;
  targetId: mongoose.Types.ObjectId;
  sectionId: string;
  overrideBadge: DiscoveryOverrideBadge | string;
  priority: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  notes?: string;
  createdAdmin?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DiscoveryOverrideSchema = new Schema<IDiscoveryOverride>(
  {
    targetType: {
      type: String,
      enum: ['PACKAGE', 'AGENCY'],
      required: true,
      index: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
      index: true,
    },
    sectionId: {
      type: String,
      required: true,
      default: 'all',
      index: true,
    },
    overrideBadge: {
      type: String,
      default: 'Featured',
    },
    priority: {
      type: Number,
      default: 100,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    startDate: { type: String },
    endDate: { type: String },
    notes: { type: String, default: '' },
    createdAdmin: { type: String, default: 'Super Admin' },
  },
  { timestamps: true }
);

DiscoveryOverrideSchema.index({ sectionId: 1, targetType: 1, isActive: 1, priority: -1 });
DiscoveryOverrideSchema.index({ targetId: 1, sectionId: 1 }, { unique: true });

export const DiscoveryOverrideModel =
  mongoose.models.DiscoveryOverride ||
  mongoose.model<IDiscoveryOverride>('DiscoveryOverride', DiscoveryOverrideSchema, 'discovery_overrides');
