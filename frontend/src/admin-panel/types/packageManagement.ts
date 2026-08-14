// ─── Super Admin Package Management Interfaces ───────────────────────────────

export type PackageStatus = 'Active' | 'Draft' | 'Sold Out' | 'Pending' | 'Hidden';
export type PackageApprovalStatus = 'Approved' | 'Pending' | 'Rejected' | '—';

export interface PackageItineraryDay {
  day: number;
  title: string;
  description: string;
  meals?: string;
  stay?: string;
}

export interface PackageBookingRecord {
  id: string;
  bookingId: string;
  travelerName: string;
  travelerEmail: string;
  travelerAvatar: string;
  bookingDate: string;
  travelDate: string;
  seatsBooked: number;
  amount: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface PackageActivityItem {
  id: string;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface AdminPackageItem {
  id: string;
  packageId: string; // e.g. PKG-2024-0001
  title: string;
  subtitle: string;
  coverImage: string;
  galleryImages?: string[];
  agencyName: string;
  agencyLogo: string;
  destinationCountry: string;
  destinationRegion: string;
  destinationFlag: string;
  durationDays: number;
  durationNights: number;
  durationText: string; // e.g. 6D / 5N
  currentPrice: string; // e.g. ₹89,999
  originalPrice: string; // e.g. ₹1,20,000
  discountPercent?: string; // e.g. 25% OFF
  availableSeats: number; // e.g. 12
  totalSeats: number; // e.g. 20
  bookingsCount: number; // e.g. 18
  totalRevenue: string; // e.g. ₹16,19,982
  rating: number; // e.g. 4.8
  reviewCount: number; // e.g. 128
  status: PackageStatus;
  approvalStatus: PackageApprovalStatus;
  isFeatured: boolean;
  category: string; // e.g. Adventure, Honeymoon, Luxury, Beach, Cultural
  departureMonth: string; // e.g. May, June, July
  lastUpdated: string; // e.g. May 21, 2024

  // Quick Stats
  viewsCount: string; // e.g. 12,450
  wishlistCount: string; // e.g. 1,245
  conversionRate: string; // e.g. 2.8%
  cancellationRate: string; // e.g. 1.2%

  // Details
  description: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: PackageItineraryDay[];
  recentBookings: PackageBookingRecord[];
  activities: PackageActivityItem[];
}

export interface PackageKPIStats {
  totalPackages: { count: number; growth: string; isPositive: boolean };
  activePackages: { count: number; growth: string; isPositive: boolean };
  pendingReview: { count: number; growth: string; isPositive: boolean };
  draftPackages: { count: number; growth: string; isPositive: boolean };
  soldOut: { count: number; growth: string; isPositive: boolean };
  featuredPackages: { count: number; growth: string; isPositive: boolean };
}

export interface PackageFilters {
  status: string;
  destination: string;
  agency: string;
  category: string;
  duration: string;
  priceRange: string;
  departureMonth: string;
  rating: string;
  search: string;
}

export interface PackageSortConfig {
  key: 'name' | 'price' | 'duration' | 'bookings' | 'rating' | 'lastUpdated' | 'seats';
  direction: 'asc' | 'desc';
}
