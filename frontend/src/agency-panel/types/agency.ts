// ─── Agency Panel Types ─────────────────────────────────────────────────────

export enum AgencyVerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  coverImage?: string;
  tagline?: string;
  description?: string;
  email: string;
  phone: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country: string;
  gstin?: string;
  licenseNumber?: string;
  verificationStatus: AgencyVerificationStatus;
  applicationId?: string;
  applicationSubmittedAt?: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  totalPackages: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyUser {
  id: string;
  agencyId: string;
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
