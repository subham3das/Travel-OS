// ─── Agency Panel Customer CRM Data Model & Mock Data ───────────────────────

export type CustomerLoyaltyBadge = 'VIP Traveler' | 'Frequent Traveler' | 'Returning Traveler' | 'New Traveler' | 'Inactive';
export type CustomerTravelerType = 'Solo Traveler' | 'Group Traveler';
export type CustomerStatus = 'Active' | 'Inactive' | 'VIP' | 'New';

export interface EmergencyContactInfo {
  name: string;
  relationship: string;
  phone: string;
}

export interface TravelPreferencesInfo {
  preferredDestination: string;
  preferredTripType: string;
  preferredRoomType: string;
  preferredMealPreference: string;
  preferredSeat: string;
  languagesSpoken: string[];
}

export interface CustomerTripHistoryItem {
  id: string;
  tripId: string;
  tripName: string;
  departureDate: string;
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  rating: number;
  amountPaidFormatted: string;
}

export interface CustomerBookingHistoryItem {
  id: string;
  bookingId: string;
  packageName: string;
  bookingDate: string;
  travelDate: string;
  travelersCount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
}

export interface CustomerReviewItem {
  id: string;
  packageName: string;
  rating: number;
  reviewText: string;
  reviewDate: string;
}

export interface AgencyNoteItem {
  id: string;
  noteText: string;
  author: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  city: string;
  memberSince: string;
  status: CustomerStatus;
  loyaltyBadge: CustomerLoyaltyBadge;
  travelerType: CustomerTravelerType;
  totalTrips: number;
  completedTrips: number;
  upcomingTrips: number;
  lifetimeSpend: number;
  lifetimeSpendFormatted: string;
  lastTrip: {
    name: string;
    date: string;
  };
  hasUpcomingTrip: boolean;
  upcomingTripDetails?: {
    tripId: string;
    name: string;
    date: string;
  };
  rating: number; // Avg rating given by agency/staff or by customer
  referralCount: number;
  emergencyContact: EmergencyContactInfo;
  travelPreferences: TravelPreferencesInfo;
  tripHistory: CustomerTripHistoryItem[];
  bookingHistory: CustomerBookingHistoryItem[];
  reviews: CustomerReviewItem[];
  notes: AgencyNoteItem[];
}

// ── Backend API Endpoints (Docs only, ready for API integration) ──────────────
// GET    /api/agency/customers
// GET    /api/agency/customers/:id
// GET    /api/agency/customers/:id/bookings
// GET    /api/agency/customers/:id/trips
// GET    /api/agency/customers/:id/reviews
// POST   /api/agency/customers/:id/notes
// PUT    /api/agency/customers/:id/notes/:noteId
// DELETE /api/agency/customers/:id/notes/:noteId

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Subham Das',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    phone: '+91 98765 43210',
    email: 'subhamdas@gmail.com',
    gender: 'Male',
    age: 32,
    city: 'Kolkata, West Bengal',
    memberSince: 'Jan 2023',
    status: 'VIP',
    loyaltyBadge: 'VIP Traveler',
    travelerType: 'Group Traveler',
    totalTrips: 5,
    completedTrips: 4,
    upcomingTrips: 1,
    lifetimeSpend: 142000,
    lifetimeSpendFormatted: '₹1,42,000',
    lastTrip: {
      name: 'Ladakh Expedition',
      date: 'Jan 2026',
    },
    hasUpcomingTrip: true,
    upcomingTripDetails: {
      tripId: 'LD-1505-2024',
      name: 'Ladakh Expedition 2024',
      date: '15 May 2024',
    },
    rating: 5,
    referralCount: 3,
    emergencyContact: {
      name: 'Rohit Das',
      relationship: 'Brother',
      phone: '+91 98765 00000',
    },
    travelPreferences: {
      preferredDestination: 'Ladakh & High Altitudes',
      preferredTripType: 'Adventure & Trekking',
      preferredRoomType: 'Deluxe Twin Sharing',
      preferredMealPreference: 'Vegetarian Meals',
      preferredSeat: 'Front Window Seat',
      languagesSpoken: ['English', 'Hindi', 'Bengali'],
    },
    tripHistory: [
      { id: 'th-1', tripId: 'LD-1505-2024', tripName: 'Ladakh Expedition', departureDate: '15 May 2024', status: 'Upcoming', rating: 5, amountPaidFormatted: '₹48,000' },
      { id: 'th-2', tripId: 'KS-1022-2023', tripName: 'Kashmir Paradise Tour', departureDate: '10 Dec 2023', status: 'Completed', rating: 5, amountPaidFormatted: '₹36,000' },
      { id: 'th-3', tripId: 'MG-0814-2023', tripName: 'Meghalaya Backpacking', departureDate: '14 Aug 2023', status: 'Completed', rating: 5, amountPaidFormatted: '₹28,000' },
      { id: 'th-4', tripId: 'SP-0601-2023', tripName: 'Spiti Valley Circuit', departureDate: '01 Jun 2023', status: 'Completed', rating: 5, amountPaidFormatted: '₹30,000' },
    ],
    bookingHistory: [
      { id: 'bk-1', bookingId: 'BK-2024-00568', packageName: 'Ladakh Expedition 7D/6N', bookingDate: '10 Apr 2024', travelDate: '15 May 2024', travelersCount: 4, paymentStatus: 'Paid' },
      { id: 'bk-2', bookingId: 'BK-2023-00892', packageName: 'Kashmir Paradise Tour', bookingDate: '01 Nov 2023', travelDate: '10 Dec 2023', travelersCount: 2, paymentStatus: 'Paid' },
      { id: 'bk-3', bookingId: 'BK-2023-00411', packageName: 'Meghalaya Backpacking', bookingDate: '20 Jul 2023', travelDate: '14 Aug 2023', travelersCount: 2, paymentStatus: 'Paid' },
    ],
    reviews: [
      { id: 'rev-1', packageName: 'Kashmir Paradise Tour', rating: 5, reviewText: 'Excellently managed trip! Transport and hotels were top notch.', reviewDate: '18 Dec 2023' },
      { id: 'rev-2', packageName: 'Meghalaya Backpacking', rating: 5, reviewText: 'Best trekking experience ever. Special thanks to guide Aman.', reviewDate: '20 Aug 2023' },
    ],
    notes: [
      { id: 'n-1', noteText: 'Prefers vegetarian food on all mountain trips.', author: 'John Smith', createdAt: '15 Jan 2024' },
      { id: 'n-2', noteText: 'VIP client — always offer front row bus seating.', author: 'Megha Singh', createdAt: '10 Nov 2023' },
    ],
  },
  {
    id: 'cust-2',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    phone: '+91 91234 56789',
    email: 'priya.sharma@gmail.com',
    gender: 'Female',
    age: 29,
    city: 'New Delhi',
    memberSince: 'Mar 2023',
    status: 'Active',
    loyaltyBadge: 'Frequent Traveler',
    travelerType: 'Solo Traveler',
    totalTrips: 3,
    completedTrips: 3,
    upcomingTrips: 0,
    lifetimeSpend: 87500,
    lifetimeSpendFormatted: '₹87,500',
    lastTrip: {
      name: 'Meghalaya Tour',
      date: 'Dec 2025',
    },
    hasUpcomingTrip: false,
    rating: 4,
    referralCount: 1,
    emergencyContact: {
      name: 'Sanjay Sharma',
      relationship: 'Father',
      phone: '+91 98111 22334',
    },
    travelPreferences: {
      preferredDestination: 'North East India',
      preferredTripType: 'Solo & Cultural Trips',
      preferredRoomType: 'Single Occupancy Room',
      preferredMealPreference: 'No Special Restriction',
      preferredSeat: 'Aisle Seat',
      languagesSpoken: ['English', 'Hindi'],
    },
    tripHistory: [
      { id: 'th-5', tripId: 'MG-1205-2025', tripName: 'Meghalaya Tour', departureDate: '05 Dec 2025', status: 'Completed', rating: 4, amountPaidFormatted: '₹32,500' },
      { id: 'th-6', tripId: 'KL-0810-2024', tripName: 'Kerala Backwaters', departureDate: '10 Aug 2024', status: 'Completed', rating: 4, amountPaidFormatted: '₹28,000' },
      { id: 'th-7', tripId: 'GA-0315-2023', tripName: 'Goa Fun Escape', departureDate: '15 Mar 2023', status: 'Completed', rating: 4, amountPaidFormatted: '₹27,000' },
    ],
    bookingHistory: [
      { id: 'bk-4', bookingId: 'BK-2025-01123', packageName: 'Meghalaya Tour 6D', bookingDate: '10 Nov 2025', travelDate: '05 Dec 2025', travelersCount: 1, paymentStatus: 'Paid' },
      { id: 'bk-5', bookingId: 'BK-2024-00654', packageName: 'Kerala Backwaters 5D', bookingDate: '15 Jul 2024', travelDate: '10 Aug 2024', travelersCount: 1, paymentStatus: 'Paid' },
    ],
    reviews: [
      { id: 'rev-3', packageName: 'Meghalaya Tour 6D', rating: 4, reviewText: 'Wonderful experience, solo friendly and safe.', reviewDate: '12 Dec 2025' },
    ],
    notes: [
      { id: 'n-3', noteText: 'Solo female traveler, prefers verified female roommate or single room.', author: 'Ankit Verma', createdAt: '10 Nov 2025' },
    ],
  },
  {
    id: 'cust-3',
    name: 'Rahul Verma',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300',
    phone: '+91 99887 76655',
    email: 'rahul.verma@gmail.com',
    gender: 'Male',
    age: 34,
    city: 'Mumbai, Maharashtra',
    memberSince: 'May 2023',
    status: 'Active',
    loyaltyBadge: 'Returning Traveler',
    travelerType: 'Group Traveler',
    totalTrips: 2,
    completedTrips: 2,
    upcomingTrips: 0,
    lifetimeSpend: 56000,
    lifetimeSpendFormatted: '₹56,000',
    lastTrip: {
      name: 'Kashmir Escape',
      date: 'Nov 2025',
    },
    hasUpcomingTrip: false,
    rating: 4,
    referralCount: 2,
    emergencyContact: {
      name: 'Neha Verma',
      relationship: 'Spouse',
      phone: '+91 99887 00000',
    },
    travelPreferences: {
      preferredDestination: 'Kashmir & Himachal Pradesh',
      preferredTripType: 'Family & Group Trips',
      preferredRoomType: 'King Bed Suite',
      preferredMealPreference: 'Non-Vegetarian',
      preferredSeat: 'Middle Window',
      languagesSpoken: ['English', 'Hindi', 'Marathi'],
    },
    tripHistory: [
      { id: 'th-8', tripId: 'KS-1110-2025', tripName: 'Kashmir Escape', departureDate: '10 Nov 2025', status: 'Completed', rating: 4, amountPaidFormatted: '₹36,000' },
      { id: 'th-9', tripId: 'SH-0504-2023', tripName: 'Shimla Manali Package', departureDate: '04 May 2023', status: 'Completed', rating: 4, amountPaidFormatted: '₹20,000' },
    ],
    bookingHistory: [
      { id: 'bk-6', bookingId: 'BK-2025-00987', packageName: 'Kashmir Escape 6D', bookingDate: '01 Oct 2025', travelDate: '10 Nov 2025', travelersCount: 2, paymentStatus: 'Paid' },
    ],
    reviews: [
      { id: 'rev-4', packageName: 'Kashmir Escape 6D', rating: 4, reviewText: 'Driver was punctual and polite.', reviewDate: '18 Nov 2025' },
    ],
    notes: [
      { id: 'n-4', noteText: 'Travels with wife. Requested quiet room away from main elevator.', author: 'John Smith', createdAt: '02 Oct 2025' },
    ],
  },
  {
    id: 'cust-4',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    phone: '+91 90001 23456',
    email: 'ananya.iyer@gmail.com',
    gender: 'Female',
    age: 26,
    city: 'Bengaluru, Karnataka',
    memberSince: 'Oct 2025',
    status: 'New',
    loyaltyBadge: 'New Traveler',
    travelerType: 'Solo Traveler',
    totalTrips: 1,
    completedTrips: 1,
    upcomingTrips: 0,
    lifetimeSpend: 18500,
    lifetimeSpendFormatted: '₹18,500',
    lastTrip: {
      name: 'Goa Fun Trip',
      date: 'Oct 2025',
    },
    hasUpcomingTrip: false,
    rating: 3,
    referralCount: 0,
    emergencyContact: {
      name: 'Kavita Iyer',
      relationship: 'Mother',
      phone: '+91 90001 00000',
    },
    travelPreferences: {
      preferredDestination: 'Beaches & Coastal Places',
      preferredTripType: 'Budget Solo Escapes',
      preferredRoomType: 'Shared Dorm / Standard',
      preferredMealPreference: 'Eggetarian / Vegan',
      preferredSeat: 'Any Seat',
      languagesSpoken: ['English', 'Kannada', 'Tamil'],
    },
    tripHistory: [
      { id: 'th-10', tripId: 'GA-1015-2025', tripName: 'Goa Fun Trip', departureDate: '15 Oct 2025', status: 'Completed', rating: 3, amountPaidFormatted: '₹18,500' },
    ],
    bookingHistory: [
      { id: 'bk-7', bookingId: 'BK-2025-00765', packageName: 'Goa Fun Trip 4D', bookingDate: '01 Oct 2025', travelDate: '15 Oct 2025', travelersCount: 1, paymentStatus: 'Paid' },
    ],
    reviews: [
      { id: 'rev-5', packageName: 'Goa Fun Trip 4D', rating: 3, reviewText: 'Good trip but hotel check in took 30 mins.', reviewDate: '20 Oct 2025' },
    ],
    notes: [
      { id: 'n-5', noteText: 'New customer. Requested late check out flexibility.', author: 'Megha Singh', createdAt: '02 Oct 2025' },
    ],
  },
  {
    id: 'cust-5',
    name: 'Aman Gupta',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    phone: '+91 87654 32109',
    email: 'aman.gupta@gmail.com',
    gender: 'Male',
    age: 35,
    city: 'Chandigarh',
    memberSince: 'Jul 2025',
    status: 'Inactive',
    loyaltyBadge: 'Inactive',
    travelerType: 'Group Traveler',
    totalTrips: 1,
    completedTrips: 1,
    upcomingTrips: 0,
    lifetimeSpend: 22000,
    lifetimeSpendFormatted: '₹22,000',
    lastTrip: {
      name: 'Spiti Valley',
      date: 'Jul 2025',
    },
    hasUpcomingTrip: false,
    rating: 3,
    referralCount: 0,
    emergencyContact: {
      name: 'Vikram Gupta',
      relationship: 'Brother',
      phone: '+91 87654 00000',
    },
    travelPreferences: {
      preferredDestination: 'Spiti & Offbeat Trails',
      preferredTripType: 'Motorcycle & Biking Tours',
      preferredRoomType: 'Twin Sharing',
      preferredMealPreference: 'Standard Meals',
      preferredSeat: 'Rear Seat',
      languagesSpoken: ['English', 'Punjabi', 'Hindi'],
    },
    tripHistory: [
      { id: 'th-11', tripId: 'SP-0710-2025', tripName: 'Spiti Valley Biking', departureDate: '10 Jul 2025', status: 'Completed', rating: 3, amountPaidFormatted: '₹22,000' },
    ],
    bookingHistory: [
      { id: 'bk-8', bookingId: 'BK-2025-00432', packageName: 'Spiti Valley Biking 7D', bookingDate: '20 Jun 2025', travelDate: '10 Jul 2025', travelersCount: 2, paymentStatus: 'Paid' },
    ],
    reviews: [],
    notes: [
      { id: 'n-6', noteText: 'Inquired about Rajasthan winter trip but didn’t complete booking.', author: 'John Smith', createdAt: '15 Nov 2025' },
    ],
  },
];
