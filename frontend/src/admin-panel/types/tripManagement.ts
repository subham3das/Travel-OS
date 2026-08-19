// ─── Super Admin Trip Management Interfaces ──────────────────────────────────

export interface TripKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'total' | 'active' | 'upcoming' | 'completed' | 'cancelled' | 'travelers' | 'guides' | 'rating';
  sparklineColor: string;
}

export interface TripKPIStats {
  totalTrips: TripKPICardItem;
  activeTrips: TripKPICardItem;
  upcomingTrips: TripKPICardItem;
  completedTrips: TripKPICardItem;
  cancelledTrips: TripKPICardItem;
  travelersOnTrip: TripKPICardItem;
  guidesAssigned: TripKPICardItem;
  avgRating: TripKPICardItem;
}

export type TripStatus = 'Running' | 'Upcoming' | 'Completed' | 'Cancelled' | 'Delayed';

export interface TripGuide {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email?: string;
  rating?: number;
  isOnline: boolean;
}

export interface TripLiveStats {
  travelersCheckedIn: number;
  totalTravelers: number;
  seatsFilledPercentage: number;
  currentLocation: string;
  etaNextStop: string;
  weather: string;
  weatherTemp: string;
  checkpointsCovered: number;
  totalCheckpoints: number;
  distanceRemaining: string;
  safetyStatus: 'Normal' | 'Alert' | 'Caution';
}

export interface TripTimelineItem {
  id: string;
  title: string;
  time: string;
  status: 'completed' | 'active' | 'pending';
  description?: string;
}

export interface AdminTripItem {
  id: string; // e.g. TRIP-24081
  packageName: string;
  packageImage: string;
  destination: string;
  destinationState: string;
  destinationCity: string;
  agencyId: string;
  agencyName: string;
  agencyLogo: string;
  guide: TripGuide;
  departureDate: string; // e.g. 14 Jun, 2024
  departureTime: string; // e.g. 08:00 AM
  returnDate: string; // e.g. 19 Jun, 2024
  returnTime: string; // e.g. 06:00 PM
  duration: string; // e.g. 6D / 5N
  travelersCount: number;
  maxCapacity: number;
  vehicle: string; // e.g. Tempo Traveller (AS 01 AB 1234)
  vehicleType: 'Tempo Traveller' | 'Innova Crysta' | 'Mini Bus' | 'Bolero' | 'Luxury Coach';
  status: TripStatus;
  progress: number; // 0 - 100
  rating: number | null;
  tripType: 'Group Tour' | 'Private Tour' | 'Trekking' | 'Road Trip' | 'Weekend Getaway';
  revenue: string; // e.g. ₹4,32,000
  heroImage: string;
  liveStats: TripLiveStats;
  timeline: TripTimelineItem[];
  travelersList?: {
    id: string;
    name: string;
    phone: string;
    seatNumber: string;
    checkedIn: boolean;
    emergencyContact: string;
  }[];
}

export interface TripFilters {
  status: string;
  agency: string;
  destination: string;
  guide: string;
  tripType: string;
  departureDate: string;
  returnDate: string;
  city: string;
  state: string;
  search: string;
}

export interface TripActivityChartPoint {
  date: string;
  label: string;
  trips: number;
  travelers: number;
  revenue: number;
}

export interface TripStatusBreakdownItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface DestinationTripItem {
  destination: string;
  tripsCount: number;
  travelersCount: number;
  percentage: number;
}

export interface TopAgencyTripItem {
  id: string;
  agencyName: string;
  agencyLogo: string;
  trips: number;
  travelers: number;
  revenue: string;
  rating: number;
  growth: string;
  isGrowthPositive: boolean;
}

export interface MonthlyTripSummaryData {
  tripsStarted: string;
  tripsCompleted: string;
  avgDuration: string;
  occupancy: string;
  avgRating: string;
  tripSuccessRate: string;
}

export interface TripAlertItem {
  id: string;
  tripId: string;
  title: string;
  description: string;
  time: string;
  type: 'delay' | 'guide' | 'vehicle' | 'weather' | 'medical' | 'route';
  severity: 'low' | 'medium' | 'high';
}
