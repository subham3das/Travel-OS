import mongoose, { Document, Schema } from 'mongoose';

// ─── FEATURED AGENCY (REFERENCE BASED) ───
export interface ICMSFeaturedAgency extends Document {
  agencyId: mongoose.Types.ObjectId;
  priority: number;
  featuredBadge?: string;
  featuredStartDate?: string;
  featuredUntil?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSFeaturedAgencySchema = new Schema<ICMSFeaturedAgency>(
  {
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', required: true, index: true },
    priority: { type: Number, default: 1, index: true },
    featuredBadge: { type: String, default: 'Featured Partner' },
    featuredStartDate: { type: String },
    featuredUntil: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSFeaturedAgencySchema.index({ agencyId: 1, isDeleted: 1 });

export const CMSFeaturedAgencyModel =
  mongoose.models.CMSFeaturedAgency ||
  mongoose.model<ICMSFeaturedAgency>('CMSFeaturedAgency', CMSFeaturedAgencySchema, 'cms_featured_agencies');


// ─── FEATURED TRIP / PACKAGE (REFERENCE BASED) ───
export interface ICMSFeaturedTrip extends Document {
  packageId: mongoose.Types.ObjectId;
  priority: number;
  customBadge?: string;
  featuredStartDate?: string;
  featuredUntil?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSFeaturedTripSchema = new Schema<ICMSFeaturedTrip>(
  {
    packageId: { type: Schema.Types.ObjectId, ref: 'Package', required: true, index: true },
    priority: { type: Number, default: 1, index: true },
    customBadge: { type: String, default: 'Featured' },
    featuredStartDate: { type: String },
    featuredUntil: { type: String },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSFeaturedTripSchema.index({ packageId: 1, isDeleted: 1 });

export const CMSFeaturedTripModel =
  mongoose.models.CMSFeaturedTrip ||
  mongoose.model<ICMSFeaturedTrip>('CMSFeaturedTrip', CMSFeaturedTripSchema, 'cms_featured_trips');


// ─── TRENDING DESTINATIONS (AUTOCOMPLETE / SELECTION BASED) ───
export interface ICMSTrendingDestination extends Document {
  destinationName: string;
  region?: string;
  country: string;
  description?: string;
  imageUrl: string;
  priority: number;
  isTrending: boolean;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CMSTrendingDestinationSchema = new Schema<ICMSTrendingDestination>(
  {
    destinationName: { type: String, required: true, trim: true, index: true },
    region: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    priority: { type: Number, default: 1, index: true },
    isTrending: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

CMSTrendingDestinationSchema.index({ destinationName: 1, isDeleted: 1 });

export const CMSTrendingDestinationModel =
  mongoose.models.CMSTrendingDestination ||
  mongoose.model<ICMSTrendingDestination>('CMSTrendingDestination', CMSTrendingDestinationSchema, 'cms_trending_destinations');
