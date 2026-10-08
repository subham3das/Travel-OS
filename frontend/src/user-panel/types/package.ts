export interface PackageItineraryDay {
  day: number;
  title: string;
  activities: string[];
  image?: string;
  overnightLocation?: string;
}

export interface PackageHotel {
  id: string;
  name: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  amenities: string[];
  location: string;
  imageUrl: string;
}

export interface PackageActivity {
  id: string;
  title: string;
  iconName: string;
  imageUrl: string;
}

export interface PackageFAQ {
  question: string;
  answer: string;
}

export interface PackageReview {
  id: string;
  travelerId: string;
  travelerName: string;
  travelerAvatar: string;
  date: string;
  rating: number;
  comment: string;
  photos?: string[];
}

export interface PackageDepartureInfo {
  departureId: string;
  departureDate: string;
  endDate: string;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  status: 'OPEN' | 'SOLDOUT' | 'BOOKING_CLOSED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  price?: number;
  isSelectable?: boolean;
}

export interface TourPackage {
  id: string;
  isBookable?: boolean;
  readiness?: any;
  agencyId: string;
  agencyName: string;
  agencyVerified?: boolean;
  agencyLocation?: string;
  destinationId: string;
  destinationName: string;
  title: string;
  category?: string;
  adventureType?: string;
  duration: string;
  price: string;
  discountPrice?: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  badgeType?: 'bestseller' | 'popular' | 'new' | 'luxury';
  overview: string;
  coverImage: string;
  gallery: string[];
  groupSize: string;
  difficulty: 'Easy' | 'Easy to Moderate' | 'Moderate' | 'Challenging';
  bestTime: string;
  vehicle: string;
  startLocation: string;
  endLocation: string;
  routeDetails?: {
    distance: string;
    travelTime: string;
    highway: string;
    stops: string[];
  };
  includes: string[];
  excludes: string[];
  itinerary: PackageItineraryDay[];
  accommodationConfirmed?: boolean;
  accommodations?: any[];
  hotels: PackageHotel[];
  activities: PackageActivity[];
  reviews: PackageReview[];
  faq: PackageFAQ[];
  departure?: PackageDepartureInfo;
  departures?: PackageDepartureInfo[];
}
