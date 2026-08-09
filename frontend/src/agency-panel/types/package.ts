// ─── Package Types ───────────────────────────────────────────────────────────

export type PackageStatus = 'draft' | 'active' | 'paused' | 'archived';

export interface PackageItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: ('breakfast' | 'lunch' | 'dinner')[];
  accommodation?: string;
}

export interface PackageInclusion {
  id: string;
  label: string;
  type: 'included' | 'excluded';
}

export interface Package {
  id: string;
  agencyId: string;
  title: string;
  slug: string;
  destination: string;
  destinationId?: string;
  coverImage: string;
  images: string[];
  duration: number; // days
  nights: number;
  groupSize: { min: number; max: number };
  price: number;
  discountedPrice?: number;
  currency: string;
  category: string;
  tags: string[];
  description: string;
  highlights: string[];
  inclusions: PackageInclusion[];
  itinerary: PackageItineraryDay[];
  status: PackageStatus;
  rating: number;
  reviewCount: number;
  bookingCount: number;
  createdAt: string;
  updatedAt: string;
}
