// ─── Agency Panel Dashboard Mock Data ───────────────────────────────────────

export interface AgencyKPIStat {
  id: string;
  label: string;
  count: string | number;
  growth: string;
  type: 'bookings' | 'trips' | 'packages' | 'revenue' | 'awaiting_payment';
}

export interface AgencyUpcomingTrip {
  id: string;
  name: string;
  coverImage: string;
  startDateText: string;
  travelerCount: number;
  badgeText: string;
  badgeColor: 'purple' | 'amber' | 'blue';
}

export interface AgencyRecentBooking {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  packageName: string;
  amount: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface AgencyPendingMessage {
  id: string;
  travelerName: string;
  travelerAvatar: string;
  messageSnippet: string;
  timeText: string;
  unreadCount: number;
}

export const MOCK_AGENCY_KPI_STATS: AgencyKPIStat[] = [
  {
    id: 'kpi-revenue',
    label: 'Total Revenue',
    count: '₹4,28,750',
    growth: '↑ 18.6%',
    type: 'revenue',
  },
  {
    id: 'kpi-bookings',
    label: 'Total Bookings',
    count: 128,
    growth: '↑ 12.4%',
    type: 'bookings',
  },
  {
    id: 'kpi-awaiting-payments',
    label: 'Awaiting Payment',
    count: '12 Travelers',
    growth: 'Action Required',
    type: 'awaiting_payment',
  },
  {
    id: 'kpi-trips',
    label: 'Active Trips',
    count: 14,
    growth: '↑ 7.1%',
    type: 'trips',
  },
];

export const MOCK_UPCOMING_TRIPS: AgencyUpcomingTrip[] = [
  {
    id: 'trip-1',
    name: 'Ladakh Adventure',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=300',
    startDateText: 'Starts Tomorrow',
    travelerCount: 18,
    badgeText: 'Tomorrow',
    badgeColor: 'purple',
  },
  {
    id: 'trip-2',
    name: 'Meghalaya Explorer',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=300',
    startDateText: 'Starts in 3 Days',
    travelerCount: 12,
    badgeText: '3 Days',
    badgeColor: 'amber',
  },
  {
    id: 'trip-3',
    name: 'Sikkim Serenity',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300',
    startDateText: 'Starts in 7 Days',
    travelerCount: 8,
    badgeText: '7 Days',
    badgeColor: 'blue',
  },
];

export const MOCK_RECENT_BOOKINGS: AgencyRecentBooking[] = [
  {
    id: 'b-1',
    travelerName: 'Rohit Sharma',
    travelerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    packageName: 'Ladakh Adventure',
    amount: '₹24,500',
    status: 'Confirmed',
  },
  {
    id: 'b-2',
    travelerName: 'Ananya Das',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    packageName: 'Meghalaya Explorer',
    amount: '₹18,000',
    status: 'Pending',
  },
  {
    id: 'b-3',
    travelerName: 'Vikram Mehta',
    travelerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    packageName: 'Sikkim Serenity',
    amount: '₹16,800',
    status: 'Confirmed',
  },
];

export const MOCK_PENDING_MESSAGES: AgencyPendingMessage[] = [
  {
    id: 'msg-1',
    travelerName: 'Priya Nair',
    travelerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
    messageSnippet: 'Hi, I wanted to know about the itinerary...',
    timeText: '10:30 AM',
    unreadCount: 2,
  },
];
