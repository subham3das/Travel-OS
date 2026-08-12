// ─── Super Admin Agency Management Interfaces ──────────────────────────────

export type AgencyStatus = 'Active' | 'Pending' | 'Suspended' | 'Rejected';
export type VerificationStatus = 'Verified' | 'Under Review' | 'Documents Missing';
export type BusinessType = 'Tour Operator' | 'Adventure' | 'Travel Agency' | 'DMC' | 'OTA';

export interface AgencyOwner {
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface AgencyBankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  verified: boolean;
}

export interface AgencyDocument {
  id: string;
  name: string;
  type: 'KYC' | 'GST' | 'Business License' | 'Bank Verification';
  status: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  uploadedAt: string;
}

export interface AgencyPerformance {
  bookings: number;
  bookingsGrowth: string;
  trips: number;
  tripsGrowth: string;
  revenue: string;
  revenueGrowth: string;
  reviews: number;
  reviewsGrowth: string;
}

export interface AgencyActivity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'booking' | 'verification' | 'review' | 'payment' | 'update';
}

export interface AgencyVerification {
  kyc: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  gst: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  businessLicense: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
  bankVerification: 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
}

export interface AgencyRevenue {
  total: string;
  monthly: string;
  commission: string;
  pending: string;
}

export interface AgencyBookingStats {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
}

export interface Agency {
  id: string;
  name: string;
  logo: string;
  gstNumber: string;
  owner: AgencyOwner;
  phone: string;
  email: string;
  website?: string;
  businessType: BusinessType;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  packages: number;
  bookings: number;
  revenue: string;
  verification: VerificationStatus;
  status: AgencyStatus;
  joinDate: string;
  performance?: AgencyPerformance;
  verificationDetails?: AgencyVerification;
  activities?: AgencyActivity[];
  documents?: AgencyDocument[];
  bankDetails?: AgencyBankDetails;
}

export interface AgencySummaryItem {
  id: string;
  title: string;
  count: number;
  growth: string;
  isPositive: boolean;
  comparisonText: string;
  iconType: 'total' | 'active' | 'pending' | 'suspended' | 'rejected' | 'verified';
  bgColor: string;
  iconColor: string;
}

export interface AgencySummaryStats {
  totalAgencies: AgencySummaryItem;
  activeAgencies: AgencySummaryItem;
  pendingApproval: AgencySummaryItem;
  suspendedAgencies: AgencySummaryItem;
  rejectedAgencies: AgencySummaryItem;
  verifiedAgencies: AgencySummaryItem;
}

export interface AgencyFilters {
  status: string;
  verification: string;
  businessType: string;
  state: string;
  city: string;
  rating: string;
  dateJoined: string;
  search: string;
}
