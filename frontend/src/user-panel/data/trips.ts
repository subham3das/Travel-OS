// ─── User Panel Master Trip & Booking Synchronization Model ─────────────────

export type MasterTripStatus =
  | 'Booking Confirmed'
  | 'Preparing Your Trip'
  | 'Trip Ready'
  | 'Upcoming'
  | 'Ongoing'
  | 'Completed'
  | 'Reviewed';

export interface TripHostInfo {
  name: string;
  photo: string;
  phone: string;
  role: string;
}

export interface GuideInfo {
  name: string;
  photo: string;
  phone: string;
  role: string;
}

export interface VehicleInfo {
  name: string;
  number: string;
  type: string;
  driverName: string;
  driverPhone: string;
  pickupTime: string;
  pickupLocation: string;
}

export interface HotelInfo {
  name: string;
  address: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  contactPhone: string;
  googleMapsUrl: string;
}

export interface CompanionInfo {
  id: string;
  photo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  relationship: string;
  isPrimary: boolean;
}

export interface TimelineMilestone {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  completedActivities: string[];
  currentActivity?: string;
  upcomingActivities: string[];
  status: 'completed' | 'current' | 'upcoming';
  tripNote?: string;
  delayNotice?: string;
  emergencyAlert?: string;
}

export interface TravelStats {
  totalTrips: number;
  upcomingTrips: number;
  completedTrips: number;
  countriesVisited: number;
  lifetimeSpend: string;
  avgRatingGiven: number;
  badges: { name: string; icon: string; description: string }[];
}

export interface UserBooking {
  id: string; // e.g. BK-2025-0012
  packageId: string;
  packageName: string;
  coverImage: string;
  bookingDate: string;
  departureDate: string;
  travelerCount: number;
  paymentStatus: 'PAID' | 'PARTIALLY_PAID' | 'REFUNDED';
  bookingStatus: MasterTripStatus;
  countdownDays: number;
  isConvertedToTrip: boolean;
  associatedTripId?: string;
  totalAmount: number;
  amountPaid: number;
  platformFees: number;
  invoiceUrl: string;
  transactionId: string;
}

export interface Trip {
  id: string;
  bookingId: string;
  destinationId: string;
  packageId: string;
  agencyId: string;
  title: string;
  locations: string;
  coverImage: string;
  status: MasterTripStatus;
  tripStartDate: string;
  tripEndDate: string;
  duration: string;
  travelerCount: number;
  countdown: {
    days: number;
    hours: number;
    mins: number;
    secs: number;
  };
  tripHost: TripHostInfo;
  guide: GuideInfo;
  vehicle: VehicleInfo;
  hotel: HotelInfo;
  meetingPoint: string;
  emergencyContact: string;
  companions: CompanionInfo[];
  agency: {
    id: string;
    name: string;
    logo: string;
    verified: boolean;
    rating: number;
    phone: string;
  };
  weather: {
    temp: string;
    condition: string;
    location: string;
  };
  checklist: Array<{
    id: string;
    label: string;
    completed: boolean;
  }>;
  expenses: {
    totalBudget: number;
    spent: number;
    remaining: number;
    percentage: number;
  };
  timeline: TimelineMilestone[];
  invoiceUrl?: string;
}

// ── Backend-Ready API Interface Contracts ──
// GET /api/user/bookings
// GET /api/user/trips
// GET /api/user/trips/:id
// GET /api/user/trips/:id/timeline
// GET /api/user/messages
// GET /api/user/payments
// GET /api/user/profile
// POST /api/user/reviews

export const USER_TRAVEL_STATS: TravelStats = {
  totalTrips: 12,
  upcomingTrips: 2,
  completedTrips: 10,
  countriesVisited: 4,
  lifetimeSpend: '₹1,84,500',
  avgRatingGiven: 4.9,
  badges: [
    { name: 'Himalayan Explorer', icon: '🏔️', description: 'Completed 3+ mountain treks' },
    { name: 'VIP Traveler', icon: '⭐', description: 'Loyal member for 2+ years' },
    { name: 'Eco Pioneer', icon: '🌿', description: 'Zero carbon footprint award' },
  ],
};

export const USER_BOOKINGS_DATA: UserBooking[] = [
  {
    id: 'BK-2025-0012',
    packageId: 'package-001',
    packageName: 'Magical Meghalaya Tour',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
    bookingDate: '12 May, 2025',
    departureDate: '20 May, 2025',
    travelerCount: 2,
    paymentStatus: 'PAID',
    bookingStatus: 'Trip Ready',
    countdownDays: 8,
    isConvertedToTrip: true,
    associatedTripId: 'trip-001',
    totalAmount: 45000,
    amountPaid: 45000,
    platformFees: 900,
    invoiceUrl: '#',
    transactionId: 'TXN-9988112233',
  },
  {
    id: 'BK-2025-0044',
    packageId: 'package-002',
    packageName: 'Spiti Valley Bike Odyssey',
    coverImage: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
    bookingDate: '01 Jun, 2025',
    departureDate: '15 Jul, 2025',
    travelerCount: 1,
    paymentStatus: 'PAID',
    bookingStatus: 'Preparing Your Trip',
    countdownDays: 45,
    isConvertedToTrip: false,
    totalAmount: 28000,
    amountPaid: 28000,
    platformFees: 560,
    invoiceUrl: '#',
    transactionId: 'TXN-4455667788',
  },
];

export const TRIPS_DATA: Trip[] = [
  {
    id: 'trip-001',
    bookingId: 'BK-2025-0012',
    destinationId: 'meghalaya',
    packageId: 'package-001',
    agencyId: 'agency-001',
    title: 'Magical Meghalaya',
    locations: 'Shillong • Cherrapunji • Mawlynnong',
    coverImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    status: 'Trip Ready',
    tripStartDate: '20 May, 2025',
    tripEndDate: '26 May, 2025',
    duration: '6 Days / 5 Nights',
    travelerCount: 2,
    countdown: {
      days: 8,
      hours: 2,
      mins: 45,
      secs: 18,
    },
    tripHost: {
      name: 'Subham Das',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
      phone: '+91 98765 43210',
      role: 'Lead Operations Host',
    },
    guide: {
      name: 'Ramesh Sangma',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      phone: '+91 91234 56789',
      role: 'Senior Eco Guide',
    },
    vehicle: {
      name: 'Toyota Innova Crysta 4x4',
      number: 'AS-06-AB-8921',
      type: 'Luxury AC SUV',
      driverName: 'Bikram Teron',
      driverPhone: '+91 94350 11223',
      pickupTime: '08:30 AM',
      pickupLocation: 'Guwahati Airport (GAU) Terminal 1 Exit Gate 3',
    },
    hotel: {
      name: 'Pine Brook Eco Resort & Spa',
      address: 'Upper Shillong Road, Near Elephant Falls, Shillong - 793009',
      roomType: 'Deluxe Mountain View Suite',
      checkIn: '12:00 PM',
      checkOut: '10:00 AM',
      contactPhone: '+91 364 224488',
      googleMapsUrl: 'https://maps.google.com/?q=25.5788,91.8933',
    },
    meetingPoint: 'Guwahati Airport Terminal 1 Exit Gate 3 at 08:30 AM',
    emergencyContact: '+91 98765 99999 (24x7 Helpline)',
    companions: [
      {
        id: 'c1',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
        name: 'Subham Das',
        age: 28,
        gender: 'Male',
        relationship: 'Self',
        isPrimary: true,
      },
      {
        id: 'c2',
        photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
        name: 'Priya Sharma',
        age: 26,
        gender: 'Female',
        relationship: 'Spouse',
        isPrimary: false,
      },
    ],
    agency: {
      id: 'agency-001',
      name: 'Wander North Travel',
      logo: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=150&auto=format&fit=crop',
      verified: true,
      rating: 4.9,
      phone: '+91 98765 43210',
    },
    weather: {
      temp: '22°C',
      condition: 'Partly Cloudy',
      location: 'Shillong, Meghalaya',
    },
    checklist: [
      { id: 'ch1', label: 'Government Photo ID Proof', completed: true },
      { id: 'ch2', label: 'Raincoats & Warm Layers', completed: fontChecklist(true) },
      { id: 'ch3', label: 'Comfortable Trekking Shoes', completed: false },
    ],
    expenses: {
      totalBudget: 45000,
      spent: 45000,
      remaining: 0,
      percentage: 100,
    },
    timeline: [
      {
        id: 't1',
        dayNumber: 1,
        title: 'Arrival in Guwahati & Drive to Shillong',
        description: 'Meet your driver Ramesh at Guwahati Airport exit gate. Scenic drive through Umiam Lake.',
        completedActivities: ['Airport Pickup Completed', 'Umiam Lake Sightseeing'],
        currentActivity: 'Resort Check-in',
        upcomingActivities: ['Evening Shillong Market Walk'],
        status: 'completed',
        tripNote: 'Driver Ramesh will wait with a sign holding your name at Terminal 1 Exit.',
      },
      {
        id: 't2',
        dayNumber: 2,
        title: 'Cherrapunji Waterfalls & Caves Exploration',
        description: 'Full day excursion to Nohkalikai Falls, Mawsmai Cave, and Seven Sisters Waterfalls.',
        completedActivities: [],
        currentActivity: 'Nohkalikai Viewpoint',
        upcomingActivities: ['Mawsmai Cave Walk', 'Eco Park Visit'],
        status: 'current',
        tripNote: 'Carry comfortable waterproof footwear for cave exploration.',
      },
      {
        id: 't3',
        dayNumber: 3,
        title: 'Mawlynnong Cleanest Village & Living Root Bridge',
        description: 'Visit the cleanest village in Asia and trek down to the famous Riwai Double Decker Root Bridge.',
        completedActivities: [],
        upcomingActivities: ['Living Root Bridge Trek', 'Mawlynnong Village Walk', 'Dawki Umngot River Boating'],
        status: 'upcoming',
      },
    ],
    invoiceUrl: '#',
  },
];

function fontChecklist(val: boolean) { return val; }

export const getTripById = (id: string): Trip => {
  return TRIPS_DATA.find((t) => t.id === id) || TRIPS_DATA[0];
};
