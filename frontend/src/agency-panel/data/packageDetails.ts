// ─── Package Details Mock Repository ──────────────────────────────────────────

export interface PackageReviewItem {
  id: string;
  travelerName: string;
  travelerAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  tripDate: string;
}

export interface DepartureItem {
  id: string;
  departureDate: string;
  returnDate: string;
  seatsFilled: number;
  totalCapacity: number;
  bookingDeadline: string;
  status: 'OPEN' | 'READY_FOR_TRIP' | 'MOVED_TO_TRIP' | 'MINIMUM_NOT_REACHED';
}

export interface ItineraryDayDetail {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  stay: string;
  transportation: string[];
  notes?: string;
}

export interface DetailedPackage {
  id: string; // e.g. "pkg-ladakh-1"
  packageId: string; // e.g. "PKG-1024"
  packageName: string;
  status: 'Active' | 'Draft' | 'Hidden' | 'Archived';
  destination: string;
  duration: string;
  packageType: 'Domestic' | 'International';
  tripDifficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';
  price: number;
  originalPrice: number;
  discountedPrice: number;
  taxesPercent: number;
  rating: number;
  reviewCount: number;
  totalBookings: number;
  coverImage: string;
  galleryImages: string[];
  description: string;
  highlights: string[];
  bestSeason: string;
  minTravelers: number;
  maxTravelers: number;
  included: string[];
  excluded: string[];
  pricingModel: string;
  itinerary: ItineraryDayDetail[];
  accommodation: {
    hotelName: string;
    roomType: string;
    mealsIncluded: string;
    vehicleType: string;
    pickupLocation: string;
    dropLocation: string;
  };
  upcomingDepartures: DepartureItem[];
  reviews: {
    averageRating: number;
    ratingBreakdown: { stars: number; count: number; percentage: number }[];
    latestReviews: PackageReviewItem[];
  };
  analytics: {
    totalRevenue: number;
    totalBookings: number;
    occupancyRate: number;
    conversionRate: number;
  };
  recentBookings: {
    id: string;
    travelerName: string;
    travelersCount: number;
    bookingDate: string;
    amount: number;
    paymentStatus: string;
  }[];
}

export const MOCK_DETAILED_PACKAGES: Record<string, DetailedPackage> = {
  'pkg-ladakh-1': {
    id: 'pkg-ladakh-1',
    packageId: 'PKG-1024',
    packageName: 'Ladakh Adventure Expedition',
    status: 'Active',
    destination: 'Leh, Pangong Tso, Nubra Valley',
    duration: '7 Days / 6 Nights',
    packageType: 'Domestic',
    tripDifficulty: 'Challenging',
    price: 18999,
    originalPrice: 24999,
    discountedPrice: 18999,
    taxesPercent: 5,
    rating: 4.9,
    reviewCount: 48,
    totalBookings: 142,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    ],
    description:
      'Embark on an unforgettable high-altitude adventure through the mesmerizing landscapes of Ladakh. From crossing the iconic Khardung La Pass to camping under starlit nights beside the turquoise Pangong Lake.',
    highlights: [
      'Drive across Khardung La – World’s highest motorable pass',
      'Starlit camping beside Pangong Tso Lake',
      'Double-humped Bactrian camel ride at Hunder Sand Dunes',
      'Visit historic Diskit Monastery & 106ft Buddha Statue',
      'Magnetic Hill & Confluence of Indus and Zanskar Rivers',
    ],
    bestSeason: 'May to September',
    minTravelers: 8,
    maxTravelers: 20,
    included: [
      'Accommodation in 3-star hotels and luxury tents',
      'Daily breakfast & buffet dinners',
      'Tempo Traveller transfers & Inner Line Permits',
      'Oxygen cylinder & First-Aid medical support',
      'Experienced mountain guide & trip coordinator',
    ],
    excluded: [
      'Airfare to and from Leh Airport',
      'Personal expenses & monument entry fees',
      'Camel safari rides & adventure activities',
      'Travel insurance & medical evacuation',
    ],
    pricingModel: 'Per Person Twin Sharing',
    itinerary: [
      {
        dayNumber: 1,
        title: 'Arrival in Leh & Acclimatization',
        description: 'Arrive at Leh Kushok Bakula Rimpoche Airport. Transfer to hotel and rest for mandatory acclimatization.',
        activities: ['Airport Transfer', 'Acclimatization Rest', 'Evening Leh Market Stroll'],
        meals: ['Dinner'],
        stay: 'Grand Dragon Leh (3-Star Hotel)',
        transportation: ['Private Tempo Traveller'],
        notes: 'Strict rest advised due to 11,500ft altitude gain.',
      },
      {
        dayNumber: 2,
        title: 'Leh Local Sightseeing & Confluence',
        description: 'Visit Hall of Fame, Magnetic Hill, and Sangam (Indus & Zanskar confluence).',
        activities: ['Hall of Fame Visit', 'Magnetic Hill Gravity Test', 'Indus-Zanskar Sangam Photo Stop'],
        meals: ['Breakfast', 'Dinner'],
        stay: 'Grand Dragon Leh',
        transportation: ['Tempo Traveller'],
      },
      {
        dayNumber: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass',
        description: 'Ascend Khardung La Pass (17,582ft). Descend into Nubra Valley and check-in to camps.',
        activities: ['Khardung La Pass Photo Stop', 'Diskit Monastery Tour', 'Hunder Sand Dunes Camel Ride'],
        meals: ['Breakfast', 'Dinner'],
        stay: 'Hunder Desert Luxury Camps',
        transportation: ['Tempo Traveller'],
      },
      {
        dayNumber: 4,
        title: 'Nubra Valley to Pangong Lake via Shyok River Route',
        description: 'Scenic drive alongside Shyok River reaching Pangong Lake by sunset.',
        activities: ['Shyok River Scenic Drive', 'Pangong Lake Sunset Walk', 'Stargazing Photography'],
        meals: ['Breakfast', 'Dinner'],
        stay: 'Pangong Wooden Cottages',
        transportation: ['Tempo Traveller'],
      },
      {
        dayNumber: 5,
        title: 'Pangong Tso to Leh via Chang La Pass',
        description: 'Early morning sunrise view over Pangong Lake, then return drive to Leh.',
        activities: ['Pangong Sunrise View', 'Chang La Pass Stop', 'Thiksey Monastery Visit'],
        meals: ['Breakfast', 'Dinner'],
        stay: 'Grand Dragon Leh',
        transportation: ['Tempo Traveller'],
      },
      {
        dayNumber: 6,
        title: 'Leh Cultural Tour & Shopping',
        description: 'Explore Shanti Stupa, Leh Palace, and pick up souvenirs at local bazaars.',
        activities: ['Shanti Stupa Sunset', 'Leh Palace Tour', 'Souvenir Shopping'],
        meals: ['Breakfast', 'Dinner'],
        stay: 'Grand Dragon Leh',
        transportation: ['Tempo Traveller'],
      },
      {
        dayNumber: 7,
        title: 'Departure from Leh',
        description: 'Check out after breakfast and transfer to Leh Airport for onwards journey.',
        activities: ['Breakfast', 'Airport Drop'],
        meals: ['Breakfast'],
        stay: 'N/A',
        transportation: ['Tempo Traveller'],
      },
    ],
    accommodation: {
      hotelName: 'Grand Dragon Leh & Hunder Luxury Tents',
      roomType: 'Deluxe Twin Sharing Room',
      mealsIncluded: 'Breakfast & Dinner (MAP Plan)',
      vehicleType: '12-Seater AC Tempo Traveller',
      pickupLocation: 'Leh Airport (IXL)',
      dropLocation: 'Leh Airport (IXL)',
    },
    upcomingDepartures: [
      {
        id: 'dep-1',
        departureDate: '15 Jun 2024',
        returnDate: '21 Jun 2024',
        seatsFilled: 20,
        totalCapacity: 20,
        bookingDeadline: '10 Jun 2024',
        status: 'READY_FOR_TRIP',
      },
      {
        id: 'dep-2',
        departureDate: '10 Jul 2024',
        returnDate: '16 Jul 2024',
        seatsFilled: 12,
        totalCapacity: 20,
        bookingDeadline: '05 Jul 2024',
        status: 'OPEN',
      },
    ],
    reviews: {
      averageRating: 4.9,
      ratingBreakdown: [
        { stars: 5, count: 42, percentage: 88 },
        { stars: 4, count: 5, percentage: 10 },
        { stars: 3, count: 1, percentage: 2 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ],
      latestReviews: [
        {
          id: 'rev-1',
          travelerName: 'Ankit Sharma',
          rating: 5,
          date: '02 Jul 2024',
          comment: 'Mind-blowing trip! The coordinator Ankit was extremely helpful during the Khardung La ascent.',
          tripDate: '15 Jun 2024',
        },
        {
          id: 'rev-2',
          travelerName: 'Sneha Patel',
          rating: 5,
          date: '28 Jun 2024',
          comment: 'Pangong lake starlit night camp was the highlight. Very well organized by the agency.',
          tripDate: '15 Jun 2024',
        },
        {
          id: 'rev-3',
          travelerName: 'Vikram Sengupta',
          rating: 4,
          date: '20 Jun 2024',
          comment: 'Great itinerary and food. Vehicle was clean and driver was super experienced.',
          tripDate: '15 Jun 2024',
        },
      ],
    },
    analytics: {
      totalRevenue: 2697858,
      totalBookings: 142,
      occupancyRate: 94.2,
      conversionRate: 6.8,
    },
    recentBookings: [
      {
        id: 'BK-2024-00568',
        travelerName: 'Rohit Sharma',
        travelersCount: 4,
        bookingDate: '02 May 2024',
        amount: 75996,
        paymentStatus: 'PAID',
      },
      {
        id: 'BK-2024-00570',
        travelerName: 'Priya Nair',
        travelersCount: 2,
        bookingDate: '05 May 2024',
        amount: 37998,
        paymentStatus: 'PAID',
      },
      {
        id: 'BK-2024-00572',
        travelerName: 'Arjun Mehta',
        travelersCount: 1,
        bookingDate: '10 May 2024',
        amount: 18999,
        paymentStatus: 'PAID',
      },
    ],
  },
};

export function getDetailedPackageById(id: string): DetailedPackage {
  if (MOCK_DETAILED_PACKAGES[id]) {
    return MOCK_DETAILED_PACKAGES[id];
  }

  // Fallback default detailed package
  return {
    ...MOCK_DETAILED_PACKAGES['pkg-ladakh-1'],
    id,
    packageId: `PKG-${id.replace(/[^0-9]/g, '') || '9999'}`,
    packageName: id.replace(/-/g, ' ').toUpperCase(),
  };
}
