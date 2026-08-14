// ─── Super Admin User Management Interfaces ──────────────────────────────────

export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Blocked';
export type UserVerificationStatus = 'Verified' | 'Pending';
export type MembershipTier = 'Free' | 'Silver' | 'Gold' | 'Platinum';

export interface UserBookingItem {
  id: string;
  bookingId: string;
  packageName: string;
  agencyName: string;
  bookingDate: string;
  travelDate: string;
  amount: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled' | 'Pending';
}

export interface UserTripItem {
  id: string;
  tripId: string;
  destination: string;
  agencyName: string;
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  amount: string;
  travelersCount: number;
}

export interface UserPaymentItem {
  id: string;
  invoiceNumber: string;
  amount: string;
  paymentMethod: 'Credit Card' | 'UPI' | 'Net Banking' | 'Debit Card';
  refundStatus: 'None' | 'Processed' | 'Pending';
  paymentStatus: 'Success' | 'Pending' | 'Failed';
  date: string;
}

export interface UserActivityItem {
  id: string;
  title: string;
  description: string;
  type: 'login' | 'search' | 'community' | 'review' | 'wishlist' | 'notification' | 'booking';
  timestamp: string;
}

export interface TravelerUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  state: string;
  country: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  nationality: string;
  passportStatus: 'Verified' | 'Pending' | 'Expired';
  emergencyContact: string;
  joinDate: string;
  joinTime?: string;
  status: UserStatus;
  verificationStatus: UserVerificationStatus;
  membership: MembershipTier;
  membershipSince: string;
  membershipValidTill: string;

  // Travel Stats
  tripsCompleted: number;
  totalBookings: number;
  countriesVisited: number;
  reviewsGiven: number;
  averageRating: number;
  cancellationRate: string;

  // Financial Stats
  totalSpend: string;
  walletBalance: string;
  pendingRefunds: string;
  lastTransactionDate: string;

  // Verification Breakdown
  kycVerification: 'Verified' | 'Pending';
  emailVerification: 'Verified' | 'Pending';
  phoneVerification: 'Verified' | 'Pending';
  passportVerification: 'Verified' | 'Pending';

  // Associated Collections
  bookings: UserBookingItem[];
  trips: UserTripItem[];
  payments: UserPaymentItem[];
  activities: UserActivityItem[];
}

export interface UserKPIStats {
  totalUsers: { count: number; growth: string; isPositive: boolean };
  activeUsers: { count: number; growth: string; isPositive: boolean };
  newUsersToday: { count: number; growth: string; isPositive: boolean };
  premiumMembers: { count: number; growth: string; isPositive: boolean };
  suspendedUsers: { count: number; growth: string; isPositive: boolean };
  verifiedTravelers: { count: number; growth: string; isPositive: boolean };
}

export interface UserFilters {
  userStatus: string;
  verification: string;
  membership: string;
  country: string;
  state: string;
  city: string;
  registrationDate: string;
  search: string;
}

export interface UserSortConfig {
  key: 'name' | 'trips' | 'bookings' | 'totalSpend' | 'joinDate' | 'status' | 'membership';
  direction: 'asc' | 'desc';
}
