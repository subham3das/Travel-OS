import {
  SettingsKPIStats,
  GeneralSettingsData,
  FeatureFlagItem,
  SystemStatusMetric,
  ConnectedServiceItem,
  SettingsRecentChangeItem,
  IntegrationHealthItem,
  BackupTimelineItem,
  FeatureUsageItem,
  ApiUsagePoint,
} from '../types/settingsManagement';
import { adminApiClient } from './adminApiClient';

export const initialSettingsKPIStats: SettingsKPIStats = {
  platformHealth: {
    id: 'platformHealth',
    title: 'Platform Health',
    value: '99.8%',
    subtitle: 'Online & Stable',
    growth: '4.2%',
    isPositive: true,
    comparison: '▲ 4.2%',
    iconType: 'health',
    sparklineColor: '#6356E5',
  },
  activeIntegrations: {
    id: 'activeIntegrations',
    title: 'Active Integrations',
    value: '12 / 12',
    subtitle: 'All Connected',
    isPositive: true,
    comparison: 'All Connected',
    iconType: 'integrations',
  },
  enabledModules: {
    id: 'enabledModules',
    title: 'Enabled Modules',
    value: '16 / 16',
    subtitle: 'Active',
    isPositive: true,
    comparison: 'Active',
    iconType: 'modules',
  },
  storageUsage: {
    id: 'storageUsage',
    title: 'Storage Usage',
    value: '68%',
    subtitle: '136 GB / 200 GB',
    isPositive: true,
    comparison: '136 GB / 200 GB',
    iconType: 'storage',
    progressPercent: 68,
  },
  apiRequestsToday: {
    id: 'apiRequestsToday',
    title: 'API Requests Today',
    value: '24,392',
    growth: '18%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'api',
    sparklineColor: '#8B5CF6',
  },
  lastBackup: {
    id: 'lastBackup',
    title: 'Last Backup',
    value: 'May 18, 2024',
    subtitle: '10:42 AM',
    isPositive: true,
    comparison: '10:42 AM',
    iconType: 'backup',
  },
};

export const initialGeneralSettings: GeneralSettingsData = {
  platformName: 'Travel OS',
  companyEmail: 'support@travelos.com',
  websiteUrl: 'https://travelos.com',
  timezone: 'Asia/Kolkata',
  currency: 'INR (₹)',
  language: 'English',
  maintenanceMode: false,
  userRegistration: true,
  emailNotifications: true,
  pushNotifications: true,
  platformVersion: 'v2.4.1',
  buildNumber: '#2847',
  environment: 'Production',
  serverLocation: 'Mumbai, India',
  uptime: '18 days, 6 hours',
};

export const initialFeatureFlags: FeatureFlagItem[] = [
  { id: 'feat-community', name: 'Community Hub', description: 'Social traveler community', iconType: 'Users', enabled: true, isBeta: false },
  { id: 'feat-ai-itinerary', name: 'AI Smart Itinerary', description: 'AI trip planner', iconType: 'Sparkles', enabled: true, isBeta: true },
  { id: 'feat-live-tracking', name: 'Live GPS Tracking', description: 'Active traveler telemetry', iconType: 'Navigation', enabled: true, isBeta: false },
  { id: 'feat-multi-currency', name: 'Multi-Currency Payments', description: 'International checkout', iconType: 'CreditCard', enabled: true, isBeta: false },
];

export const initialSystemStatusMetrics: SystemStatusMetric[] = [
  { name: 'Core API Gateway', value: 98, status: 'good' },
  { name: 'MongoDB Primary Cluster', value: 100, status: 'good' },
  { name: 'Admin Auth & RBAC', value: 99, status: 'good' },
  { name: 'Media Storage & CDN', value: 95, status: 'good' },
];

export const initialConnectedServices: ConnectedServiceItem[] = [
  { id: 'srv-razorpay', name: 'Razorpay Payment Gateway', status: 'Connected', iconType: 'CreditCard' },
  { id: 'srv-stripe', name: 'Stripe Global Checkout', status: 'Connected', iconType: 'CreditCard' },
  { id: 'srv-sendgrid', name: 'Twilio SendGrid Email', status: 'Connected', iconType: 'Mail' },
];

export const initialSettingsRecentChanges: SettingsRecentChangeItem[] = [
  { id: 'chg-1', admin: 'Super Admin', action: 'Updated General Settings', timestamp: '10m ago', type: 'blue' },
];

export const initialIntegrationHealth: IntegrationHealthItem[] = [
  { name: 'Razorpay Webhooks', status: 'healthy', color: '#10B981' },
  { name: 'Google Maps Places API', status: 'healthy', color: '#10B981' },
];

export const initialApiUsagePoints: ApiUsagePoint[] = [
  { date: '00:00', requests: 1200 },
  { date: '04:00', requests: 450 },
  { date: '08:00', requests: 3800 },
  { date: '12:00', requests: 6400 },
  { date: '16:00', requests: 7200 },
  { date: '20:00', requests: 5800 },
];

export const initialBackupTimeline: BackupTimelineItem[] = [
  { id: 'bk-1', date: 'May 18, 2024', time: '10:42 AM', type: 'Auto Backup', status: 'Success' },
];

export const initialFeatureUsage: FeatureUsageItem[] = [
  { name: 'Community Circles', percentage: 78 },
  { name: 'AI Trip Builder', percentage: 62 },
];

class AdminSettingsManagementService {
  public async getKPIStats(): Promise<SettingsKPIStats> {
    try {
      const response = await adminApiClient.get<SettingsKPIStats>('/settings/stats');
      if (response.success && response.data) {
        return response.data;
      }
      return initialSettingsKPIStats;
    } catch {
      return initialSettingsKPIStats;
    }
  }

  public async getGeneralSettings(): Promise<GeneralSettingsData> {
    try {
      const response = await adminApiClient.get<GeneralSettingsData>('/settings/general');
      if (response.success && response.data) {
        return response.data;
      }
      return initialGeneralSettings;
    } catch {
      return initialGeneralSettings;
    }
  }

  public async updateGeneralSettings(data: Partial<GeneralSettingsData>): Promise<GeneralSettingsData> {
    const response = await adminApiClient.patch<GeneralSettingsData>('/settings/general', data);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update settings');
  }

  public async getFeatureFlags(): Promise<FeatureFlagItem[]> {
    try {
      const response = await adminApiClient.get<FeatureFlagItem[]>('/settings/feature-flags');
      if (response.success && response.data) {
        return response.data;
      }
      return initialFeatureFlags;
    } catch {
      return initialFeatureFlags;
    }
  }

  public async toggleFeatureFlag(id: string, enabled: boolean): Promise<FeatureFlagItem[]> {
    await adminApiClient.patch(`/settings/feature-flags/${id}/toggle`, { enabled });
    return this.getFeatureFlags();
  }

  public async getSystemMetrics(): Promise<SystemStatusMetric[]> {
    return initialSystemStatusMetrics;
  }

  public async getConnectedServices(): Promise<ConnectedServiceItem[]> {
    return initialConnectedServices;
  }

  public async getRecentChanges(): Promise<SettingsRecentChangeItem[]> {
    return initialSettingsRecentChanges;
  }

  public async getIntegrationHealth(): Promise<IntegrationHealthItem[]> {
    return initialIntegrationHealth;
  }

  public async getApiUsage(): Promise<ApiUsagePoint[]> {
    return initialApiUsagePoints;
  }

  public async getBackupTimeline(): Promise<BackupTimelineItem[]> {
    return initialBackupTimeline;
  }

  public async createBackup(): Promise<BackupTimelineItem> {
    return {
      id: `bk-${Date.now().toString().slice(-4)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      type: 'Manual Backup',
      status: 'Success',
    };
  }

  public async getFeatureUsage(): Promise<FeatureUsageItem[]> {
    return initialFeatureUsage;
  }

  public async resetToDefaults(): Promise<GeneralSettingsData> {
    return this.updateGeneralSettings(initialGeneralSettings);
  }
}

export const adminSettingsManagementService = new AdminSettingsManagementService();
