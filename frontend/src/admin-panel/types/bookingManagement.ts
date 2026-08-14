// ─── Super Admin Booking Management Interfaces ───────────────────────────────

export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Refunded';
export type PaymentStatus = 'Paid' | 'Pending' | 'Refunded' | 'Failed';

export interface BookingTravelerItem {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  passportNumber?: string;
  phone?: string;
  email?: string;
  isPrimary?: boolean;
}

export interface BookingActivityItem {
  id: string;
  actor: string;
  role: 'Super Admin' | 'Agency' | 'Traveler' | 'System';
  action: string;
  details: string;
  timestamp: string;
}

export interface BookingTimelineStep {
  id: string;
  title: string;
  subtitle?: string;
  timestamp?: string;
  status: 'completed' | 'current' | 'upcoming';
  iconType?: string;
}

export interface AdminBookingItem {
  id: string;
  bookingId: string; // e.g. BK-2024-0001
  bookedAtDate: string; // e.g. May 1, 2024
  bookedAtTime: string; // e.g. 10:30 AM
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookingSource: 'Web' | 'Mobile App' | 'Agent Direct';

  // Traveler Details
  travelerName: string;
  travelerEmail: string;
  travelerPhone: string;
  travelerAvatar: string;
  additionalTravelersCount: number; // e.g. 1
  travelersSummary: string; // e.g. 2 Adults

  // Package Details
  packageId: string; // e.g. PKG-2024-0001
  packageName: string; // e.g. Swiss Alps Explorer
  packageThumbnail: string;
  destinationCountry: string; // e.g. Switzerland
  destinationRegion: string; // e.g. Interlaken
  durationText: string; // e.g. 6D / 5N
  travelStartDate: string; // e.g. May 20, 2024
  travelEndDate: string; // e.g. May 27, 2024
  travelDatesText: string; // e.g. May 20 – May 27, 2024

  // Agency Details
  agencyName: string; // e.g. Wanderlust Holidays
  agencyLogo: string;
  isAgencyVerified: boolean;

  // Financial Breakdown
  totalAmount: string; // e.g. ₹89,999
  basePrice: string; // e.g. ₹82,000
  taxesAndFees: string; // e.g. ₹5,999
  platformFee: string; // e.g. ₹2,000
  discountAmount: string; // e.g. - ₹8,000
  discountCode?: string; // e.g. EARLY10
  insuranceFee?: string; // e.g. ₹0
  grandTotal: string; // e.g. ₹89,999

  // Payment Details
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Debit Card';
  transactionId: string; // e.g. TXN7845123654
  paidAmount: string; // e.g. ₹89,999
  paidDate: string; // e.g. May 1, 2024 • 10:32 AM

  // Travelers List & Timelines
  travelers: BookingTravelerItem[];
  activities: BookingActivityItem[];
  timeline: BookingTimelineStep[];
}

export interface BookingKPIStats {
  totalBookings: { count: number; growth: string; isPositive: boolean };
  confirmedBookings: { count: number; growth: string; isPositive: boolean };
  pendingBookings: { count: number; growth: string; isPositive: boolean };
  cancelledBookings: { count: number; growth: string; isPositive: boolean };
  totalRevenue: { value: string; growth: string; isPositive: boolean };
  refundedAmount: { value: string; growth: string; isPositive: boolean };
}

export interface BookingFilters {
  bookingStatus: string;
  paymentStatus: string;
  package: string;
  agency: string;
  destination: string;
  travelDate: string;
  bookingDate: string;
  user: string;
  amountRange: string;
  search: string;
}

export interface BookingSortConfig {
  key: 'bookingId' | 'traveler' | 'package' | 'amount' | 'bookingDate' | 'status';
  direction: 'asc' | 'desc';
}
