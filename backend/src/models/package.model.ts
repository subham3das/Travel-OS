import mongoose, { Document, Schema } from 'mongoose';

export type PackageApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DRAFT';

export interface IPackageItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
}

export interface IPackageActivity {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface IPackage extends Document {
  packageId: string;
  title: string;
  subtitle?: string;
  description?: string;
  agencyId?: mongoose.Types.ObjectId;
  agencyName: string;
  agencyLogo?: string;
  destination: string;
  destinationCountry?: string;
  destinationRegion?: string;
  destinationFlag?: string;
  category: string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice?: number;
  discountPercent?: string;
  availableSeats: number;
  totalSeats: number;
  bookingsCount: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  featuredImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  status: PackageApprovalStatus;
  isActive: boolean;
  isFeatured: boolean;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: IPackageItineraryDay[];
  activities?: IPackageActivity[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    packageId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', index: true },
    agencyName: { type: String, required: true },
    agencyLogo: { type: String, default: '' },
    destination: { type: String, required: true, trim: true },
    destinationCountry: { type: String, default: '' },
    destinationRegion: { type: String, default: '' },
    destinationFlag: { type: String, default: '🌍' },
    category: { type: String, default: 'Adventure', index: true },
    durationDays: { type: Number, default: 3 },
    durationNights: { type: Number, default: 2 },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    discountPercent: { type: String, default: '' },
    availableSeats: { type: Number, default: 20 },
    totalSeats: { type: Number, default: 20 },
    bookingsCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    featuredImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DRAFT'],
      default: 'PENDING',
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        meals: { type: String, default: '' },
        stay: { type: String, default: '' },
      },
    ],
    activities: [
      {
        id: { type: String },
        adminName: { type: String },
        action: { type: String },
        details: { type: String },
        timestamp: { type: String },
      },
    ],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ status: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
PackageSchema.index({ title: 'text', destination: 'text', category: 'text' });

export const PackageModel =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema, 'packages');

