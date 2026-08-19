// ─── Super Admin Access Control & IAM Types ─────────────────────────

export type AdminAccountStatus = 'Active' | 'Pending Invitation' | 'Suspended' | 'Disabled';

export type AdminInvitationStatus = 'Accepted' | 'Pending' | 'Expired';

export interface AuthorizedAdminItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  roleId: string;
  department: string;
  accountStatus: AdminAccountStatus;
  invitationStatus: AdminInvitationStatus;
  invitationToken?: string;
  lastLogin: string;
  createdAt: string;
  twoFactorEnabled: boolean;
}

export interface AdminAccessKPIs {
  totalAuthorized: number;
  activeAccounts: number;
  pendingInvitations: number;
  blockedAccounts: number;
}

export interface AdminSecurityActivityItem {
  id: string;
  event: string;
  user: string;
  time: string;
  type: 'login' | 'invite' | 'suspend' | 'role_change' | 'security';
}

export interface AdminSecurityOverview {
  failedLoginsCount: number;
  successfulLoginsToday: number;
  lockedAccountsCount: number;
  pendingInvitations: number;
  recentActivity: AdminSecurityActivityItem[];
}
