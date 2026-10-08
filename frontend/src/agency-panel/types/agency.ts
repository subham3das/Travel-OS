// ─── Agency Panel Types ─────────────────────────────────────────────────────

export enum AgencyVerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export type PartnerOnboardingStatus =
  | 'ACCOUNT_CREATED'
  | 'EMAIL_VERIFIED'
  | 'PHONE_VERIFIED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_COMPLETED'
  | 'DOCUMENTS_SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export interface Agency {
  id: string;
  agencyId?: string;
  name: string;
  agencyDisplayName?: string;
  legalBusinessName?: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  description?: string;
  email: string;
  loginEmail?: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  gstin?: string;
  licenseNumber?: string;
  onboardingStatus?: PartnerOnboardingStatus;
  verificationStatus: AgencyVerificationStatus;
  status?: string;
  passwordChanged?: boolean;
  applicationId?: string;
  applicationSubmittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  totalPackages: number;
  totalBookings: number;
  businessTypes?: ('agency' | 'car_rental')[];
  activeBusiness?: 'agency' | 'car_rental';
  carRentalVerificationStatus?: 'NOT_REGISTERED' | 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  carRentalProfile?: any;
  timeline?: Array<{
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    desc?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyUser {
  id: string;
  agencyId: string;
  customAgencyId?: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'manager' | 'staff';
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface AgencyAuthState {
  isAuthenticated: boolean;
  agencyUser: AgencyUser | null;
  agency: Agency | null;
  token: string | null;
}
