// ─── Super Admin Platform Settings & Global Configuration Types ──────────

export type SettingsCategoryType =
  | 'general'
  | 'branding'
  | 'payments'
  | 'apis'
  | 'notifications'
  | 'security'
  | 'integrations'
  | 'features'
  | 'maintenance'
  | 'storage'
  | 'backups'
  | 'advanced';

export interface SettingsKPICardItem {
  id: string;
  title: string;
  value: string;
  subtitle?: string;
  growth?: string;
  isPositive?: boolean;
  comparison?: string;
  iconType: 'health' | 'integrations' | 'modules' | 'storage' | 'api' | 'backup';
  sparklineColor?: string;
  progressPercent?: number;
}

export interface SettingsKPIStats {
  platformHealth: SettingsKPICardItem;
  activeIntegrations: SettingsKPICardItem;
  enabledModules: SettingsKPICardItem;
  storageUsage: SettingsKPICardItem;
  apiRequestsToday: SettingsKPICardItem;
  lastBackup: SettingsKPICardItem;
}

export interface GeneralSettingsData {
  platformName: string;
  companyEmail: string;
  websiteUrl: string;
  timezone: string;
  currency: string;
  language: string;
  logoUrl?: string;
  maintenanceMode: boolean;
  userRegistration: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  platformVersion: string;
  buildNumber: string;
  environment: string;
  serverLocation: string;
  uptime: string;
}

export interface FeatureFlagItem {
  id: string;
  name: string;
  description: string;
  iconType: string;
  enabled: boolean;
  isBeta?: boolean;
}

export interface SystemStatusMetric {
  name: string;
  value: number; // percentage e.g. 42
  status: 'good' | 'warning' | 'critical';
}

export interface ConnectedServiceItem {
  id: string;
  name: string;
  status: 'Connected' | 'Warning' | 'Offline';
  iconType: string;
}

export interface SettingsRecentChangeItem {
  id: string;
  action: string;
  timestamp: string;
  admin: string;
  type: 'green' | 'blue' | 'orange' | 'purple';
}

export interface IntegrationHealthItem {
  name: string;
  status: 'healthy' | 'warning' | 'offline';
  color: string;
}

export interface BackupTimelineItem {
  id: string;
  date: string;
  time: string;
  type: 'Manual Backup' | 'Auto Backup';
  status: 'Success' | 'Failed' | 'In Progress';
}

export interface FeatureUsageItem {
  name: string;
  percentage: number;
}

export interface ApiUsagePoint {
  date: string;
  requests: number;
}
