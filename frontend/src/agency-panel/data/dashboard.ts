// ─── Agency Panel Dashboard Data Types ────────────────────────────────────────

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
