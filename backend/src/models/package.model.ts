import mongoose, { Document, Schema } from 'mongoose';

export type PackageApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'DRAFT'
  | 'INACTIVE'
  | 'ACTIVE'
  | 'PUBLISHED'
  | 'HIDDEN'
  | 'ARCHIVED';

export interface IGalleryImage {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  bytes?: number;
  uploadedAt?: string | Date;
  originalFilename?: string;
  category?: string;
}

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
  galleryImages?: IGalleryImage[];
  status: PackageApprovalStatus;
  isDraft?: boolean;
  isPublished?: boolean;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'DRAFT' | 'HIDDEN';
  publishedAt?: Date | null;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  deletedAt?: Date | null;
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
  pickupCity?: string;
  dropOffCity?: string;
  pickupLocation?: string;
  dropOffLocation?: string;
  whatsappGroupLink?: string;
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
    galleryImages: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
        width: { type: Number },
        height: { type: Number },
        format: { type: String, default: '' },
        size: { type: Number },
        bytes: { type: Number },
        uploadedAt: { type: Schema.Types.Mixed },
        originalFilename: { type: String, default: '' },
        category: { type: String, default: '' },
      },
    ],
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'DRAFT', 'INACTIVE', 'ACTIVE', 'PUBLISHED', 'HIDDEN', 'ARCHIVED'],
      default: 'PENDING',
    },
    isDraft: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },
    visibility: {
      type: String,
      enum: ['PUBLIC', 'PRIVATE', 'DRAFT', 'HIDDEN'],
      default: 'PUBLIC',
      index: true,
    },
    publishedAt: { type: Date, default: null },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
      index: true,
    },
    deletedAt: { type: Date, default: null },
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
    pickupCity: { type: String, default: '', trim: true },
    dropOffCity: { type: String, default: '', trim: true },
    pickupLocation: { type: String, default: '', trim: true },
    dropOffLocation: { type: String, default: '', trim: true },
    whatsappGroupLink: { type: String, default: '', trim: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-normalize any legacy string URLs in galleryImages into standard IGalleryImage objects
// and normalize itinerary day plans resolving any title/description mismatches
PackageSchema.pre('validate', function () {
  console.log('[8. Immediately before new PackageModel() / package.set() (pre-validate hook)]', this.galleryImages);
  if (Array.isArray(this.galleryImages)) {
    this.galleryImages = this.galleryImages
      .map((img: any) => {
        if (typeof img === 'string') {
          return {
            url: img,
            publicId: '',
            uploadedAt: new Date(),
          };
        }
        if (img && typeof img === 'object') {
          const resolvedUrl =
            typeof img.url === 'string'
              ? img.url
              : typeof img.url === 'object' && img.url?.url
              ? img.url.url
              : img.secure_url || img.secureUrl || img.imageUrl || '';
          if (resolvedUrl) {
            img.url = resolvedUrl;
          }
        }
        return img;
      })
      .filter((img: any) => Boolean(img && img.url)) as any;
  }

  // Auto-normalize itinerary plans to guarantee strict schema conformity
  if (Array.isArray(this.itinerary)) {
    this.itinerary = this.itinerary.map((day: any, dIdx: number) => {
      if (!day || typeof day !== 'object') return day;
      let rawPlans = day.plans;
      if ((!rawPlans || !Array.isArray(rawPlans) || rawPlans.length === 0) && Array.isArray(day.activities) && day.activities.length > 0) {
        rawPlans = day.activities;
      }
      if (Array.isArray(rawPlans)) {
        day.plans = rawPlans
          .map((p: any) => {
            if (typeof p === 'string') {
              const text = p.replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
              return { text, icon: '', notes: '' };
            }
            if (p && typeof p === 'object') {
              const resolvedText = (
                p.text ??
                p.title ??
                p.description ??
                p.content ??
                p.name ??
                ''
              ).toString().replace(/^\d{1,2}:\d{2}\s*[-–—]?\s*/, '').trim();
              return {
                text: resolvedText,
                icon: typeof p.icon === 'string' ? p.icon : '',
                notes: typeof p.notes === 'string' ? p.notes : '',
              };
            }
            return p;
          });
      }
      return day;
    }) as any;
  }
});

PackageSchema.index({ createdAt: -1 });
PackageSchema.index({ status: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ isPublished: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ status: 1, isPublished: 1, visibility: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ adventureType: 1, status: 1, isActive: 1, isDeleted: 1 });
PackageSchema.index({ agencyId: 1, isDeleted: 1, createdAt: -1 });
PackageSchema.index({ publishedAt: -1 });
PackageSchema.index({ title: 'text', destination: 'text', category: 'text', adventureType: 'text' });

export const PackageModel =
  mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema, 'packages');


