import mongoose, { Document, Schema } from 'mongoose';

export type PackageApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DRAFT'
  | 'INACTIVE'
  | 'ACTIVE'
  | 'HIDDEN'
  | 'ARCHIVED';

export interface IPackageItineraryPlan {
  text: string;
  icon?: string;
  notes?: string;
}

export interface IPackageItineraryDay {
  day: number;
  title: string;
  description?: string;
  plans?: IPackageItineraryPlan[];
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

export interface IPackageAccommodation {
  hotelName: string;
  hotelImages?: string[];
  category?: string;
  address?: string;
  city?: string;
  amenities?: string[];
  roomType?: string;
  checkIn?: string;
  checkOut?: string;
  shortDescription?: string;
  dayRange?: string;
}

export const ADVENTURE_TYPES = [
  'Trekking',
  'Camping',
  'Backpacking',
  'Expedition',
  'Road Trip',
  'Wildlife Safari',
  'Desert Safari',
  'Cycling',
  'River Rafting',
  'Skiing',
  'Snow Adventure',
  'Scuba Diving',
  'Paragliding',
  'General Adventure',
] as const;

export type AdventureType = (typeof ADVENTURE_TYPES)[number];
export const DEFAULT_ADVENTURE_TYPE: AdventureType = 'General Adventure';

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
  adventureType: AdventureType | string;
  durationDays: number;
  durationNights: number;
  price: number;
  originalPrice?: number;
  discountPercent?: string;
  availableSeats: number;
  totalSeats: number;
  bookingsCount: number;
  viewsCount?: number;
  wishlistCount?: number;
  totalRevenue: number;
  rating: number;
  reviewCount: number;
  featuredImage?: string;
  coverImage?: string;
  galleryImages?: string[];
  status: PackageApprovalStatus;
  isActive: boolean;
  isFeatured: boolean;
  isPopular?: boolean;
  isTrending?: boolean;
  isMostPopular?: boolean;
  autoRankEnabled?: boolean;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: IPackageItineraryDay[];
  accommodationConfirmed?: boolean;
  accommodations?: IPackageAccommodation[];
  activities?: IPackageActivity[];
  requiresPassport?: boolean;
  requiresVisa?: boolean;
  requiresAadhaar?: boolean;
  requiresEmergencyContact?: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    packageId: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    agencyId: { type: Schema.Types.ObjectId, ref: 'Agency' },
    agencyName: { type: String, required: true },
    agencyLogo: { type: String, default: '' },
    destination: { type: String, required: true, trim: true },
    destinationCountry: { type: String, default: '' },
    destinationRegion: { type: String, default: '' },
    destinationFlag: { type: String, default: '🌍' },
    category: { type: String, default: 'Adventure', index: true },
    adventureType: {
      type: String,
      default: DEFAULT_ADVENTURE_TYPE,
      index: true,
      trim: true,
    },
    durationDays: { type: Number, default: 3 },
    durationNights: { type: Number, default: 2 },
    price: { type: Number, required: true },
    originalPrice: { type: Number, default: 0 },
    discountPercent: { type: String, default: '' },
    availableSeats: { type: Number, default: 20 },
    totalSeats: { type: Number, default: 20 },
    bookingsCount: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    wishlistCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    accommodationConfirmed: { type: Boolean, default: false },
    accommodations: [
      {
        hotelName: { type: String, required: true },
        hotelImages: [{ type: String }],
        category: { type: String, default: 'Hotel' },
        address: { type: String, default: '' },
        city: { type: String, default: '' },
        amenities: [{ type: String }],
        roomType: { type: String, default: '' },
        checkIn: { type: String, default: '' },
        checkOut: { type: String, default: '' },
        shortDescription: { type: String, default: '' },
        dayRange: { type: String, default: '' },
      },
    ],
    featuredImage: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DRAFT', 'INACTIVE', 'ACTIVE', 'HIDDEN', 'ARCHIVED'],
      default: 'PENDING',
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false, index: true },
    isPopular: { type: Boolean, default: false, index: true },
    isTrending: { type: Boolean, default: false, index: true },
    isMostPopular: { type: Boolean, default: false, index: true },
    autoRankEnabled: { type: Boolean, default: true },
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    itinerary: [
      {
        day: { type: Number, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
        plans: [
          {
            text: { type: String, required: true },
            icon: { type: String, default: '' },
            notes: { type: String, default: '' },
          },
        ],
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
    requiresPassport: { type: Boolean, default: false },
    requiresVisa: { type: Boolean, default: false },
    requiresAadhaar: { type: Boolean, default: false },
    requiresEmergencyContact: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ status: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ adventureType: 1, status: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
PackageSchema.index({ title: 'text', destination: 'text', category: 'text', adventureType: 'text' });

export const PackageModel =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema, 'packages');


