// ─── Agency Panel Package Management Mock Data ─────────────────────────────

export type PackageStatus = 'Active' | 'Draft' | 'Hidden' | 'Archived';
export type PackageCategory = 'Domestic' | 'International';

export interface AgencyPackage {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  duration: string; // e.g. "6 Days / 5 Nights"
  price: number; // e.g. 18999
  rating: number; // e.g. 4.8, or 0 if no reviews
  reviewCount: number; // e.g. 126
  bookings: number; // e.g. 18
  status: PackageStatus;
  lastUpdated: string; // e.g. "2 hours ago"
  packageType: PackageCategory;
  coverImage: string;
}

export const MOCK_AGENCY_PACKAGES: AgencyPackage[] = [
  {
    id: 'pkg-1',
    packageId: 'PKG-1001',
    packageName: 'Ladakh Expedition',
    destination: 'Leh, Nubra, Pangong',
    duration: '6 Days / 5 Nights',
    price: 18999,
    rating: 4.8,
    reviewCount: 126,
    bookings: 18,
    status: 'Active',
    lastUpdated: '2 hours ago',
    packageType: 'Domestic',
    coverImage: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-2',
    packageId: 'PKG-1002',
    packageName: 'Switzerland Delight',
    destination: 'Zurich, Interlaken, Lucerne',
    duration: '7 Days / 6 Nights',
    price: 149999,
    rating: 4.9,
    reviewCount: 98,
    bookings: 21,
    status: 'Active',
    lastUpdated: '1 day ago',
    packageType: 'International',
    coverImage: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-3',
    packageId: 'PKG-1003',
    packageName: 'Goa Beach Escape',
    destination: 'North Goa, South Goa',
    duration: '4 Days / 3 Nights',
    price: 8999,
    rating: 4.6,
    reviewCount: 73,
    bookings: 32,
    status: 'Active',
    lastUpdated: '3 days ago',
    packageType: 'Domestic',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-4',
    packageId: 'PKG-1004',
    packageName: 'Kerala Backwaters',
    destination: 'Kochi, Alleppey, Munnar',
    duration: '5 Days / 4 Nights',
    price: 12499,
    rating: 0,
    reviewCount: 0,
    bookings: 0,
    status: 'Draft',
    lastUpdated: '5 days ago',
    packageType: 'Domestic',
    coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-5',
    packageId: 'PKG-1005',
    packageName: 'Singapore Getaway',
    destination: 'Singapore City Tour',
    duration: '4 Days / 3 Nights',
    price: 29999,
    rating: 4.7,
    reviewCount: 56,
    bookings: 8,
    status: 'Hidden',
    lastUpdated: '1 week ago',
    packageType: 'International',
    coverImage: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'pkg-6',
    packageId: 'PKG-1006',
    packageName: 'Himachal Snow Experience',
    destination: 'Manali, Solang, Shimla',
    duration: '6 Days / 5 Nights',
    price: 15999,
    rating: 4.5,
    reviewCount: 42,
    bookings: 14,
    status: 'Archived',
    lastUpdated: '2 weeks ago',
    packageType: 'Domestic',
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80',
  },
];
