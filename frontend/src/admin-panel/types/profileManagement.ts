// ─── Super Admin Profile & Account Management Types ─────────────────────────

export interface AdminPersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  timezone: string;
  language: string;
  location: string;
  memberSince: string;
  adminId: string;
  role: string;
}

export interface AdminSecuritySettings {
  lastLogin: string;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  recoveryEmail: string;
  activeSessionsCount: number;
}

export interface AdminPreferences {
  theme: 'Light' | 'Dark' | 'System';
  language: 'English' | 'Hindi';
  emailNotifications: boolean;
  smsNotifications: boolean;
  desktopNotifications: boolean;
}

export interface AdminActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  iconType: 'approve' | 'settings' | 'report' | 'login' | 'backup';
}

export interface AdminQuickStatItem {
  id: string;
  title: string;
  value: string;
  growth?: string;
  iconType: 'logins' | 'actions' | 'reports' | 'active';
}

export interface AdminDeviceItem {
  id: string;
  name: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  iconType: 'laptop' | 'desktop' | 'mobile';
}

export interface AdminAccountStatus {
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
  isEmailVerified: boolean;
  securityScore: number; // e.g. 94
}

export interface SuperAdminProfileData {
  personalInfo: AdminPersonalInfo;
  security: AdminSecuritySettings;
  preferences: AdminPreferences;
  activities: AdminActivityItem[];
  stats: AdminQuickStatItem[];
  devices: AdminDeviceItem[];
  accountStatus: AdminAccountStatus;
  avatarUrl: string;
}
