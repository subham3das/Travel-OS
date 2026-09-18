// ─── Super Admin Panel Types ──────────────────────────────────────────────────

import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'FINANCE_MANAGER'
  | 'OPERATIONS_MANAGER'
  | 'SUPPORT_MANAGER'
  | 'CONTENT_MANAGER'
  | 'REVIEWER';

export interface Admin {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  role: AdminRole;
  permissions?: string[];
  avatar?: string;
  profileImage?: string;
  lastLogin?: string;
  isActive: boolean;
  isSuperAdmin?: boolean;
  authProvider?: 'credentials' | 'google' | 'both';
  preferences?: {
    theme?: 'Light' | 'Dark' | 'System';
    language?: string;
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    desktopNotifications?: boolean;
  };
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: Admin | null;
  token: string | null;
  refreshToken?: string | null;
  sessionStartedAt?: string | null;
}

export interface AgencyDocument {
  id: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface AgencyApplication {
  id: string;
  agencyId: string;
  agencyName: string;
  email: string;
  phone: string;
  status: AgencyVerificationStatus;
  submittedAt: string;
  documents: AgencyDocument[];
}

export interface AgencySummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  verificationStatus: AgencyVerificationStatus;
  submittedAt: string;
}

export interface DashboardStats {
  totalAgencies: number;
  pendingVerifications: number;
  approvedAgencies: number;
  rejectedAgencies: number;
}
