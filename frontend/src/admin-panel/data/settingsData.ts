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

export const initialSettingsKPIStats: SettingsKPIStats = {
  platformHealth: {
    id: 'platformHealth',
    title: 'Platform Health',
    value: '98%',
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
    value: '14 / 16',
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
  {
    id: 'feat-community',
    name: 'Community',
    description: 'Social community for travelers',
    iconType: 'Users',
    enabled: true,
    isBeta: true,
  },
  {
    id: 'feat-wallet',
    name: 'Wallet',
    description: 'In-app wallet & payments',
    iconType: 'Wallet',
    enabled: true,
  },
  {
    id: 'feat-passport',
    name: 'Passport',
    description: 'Digital travel passport',
    iconType: 'BookMarked',
    enabled: true,
  },
  {
    id: 'feat-rewards',
    name: 'Rewards',
    description: 'Loyalty & cashback',
    iconType: 'Gift',
    enabled: true,
  },
  {
    id: 'feat-ai-assistant',
    name: 'AI Assistant',
    description: 'AI travel assistant',
    iconType: 'Sparkles',
    enabled: false,
  },
  {
    id: 'feat-group-trips',
    name: 'Group Trips',
    description: 'Group travel & pooling',
    iconType: 'Users2',
    enabled: true,
  },
  {
    id: 'feat-stories',
    name: 'Stories',
    description: 'Travel stories & moments',
    iconType: 'Film',
    enabled: true,
  },
  {
    id: 'feat-events',
    name: 'Events',
    description: 'Travel events & meetups',
    iconType: 'Calendar',
    enabled: true,
  },
];

export const initialSystemStatusMetrics: SystemStatusMetric[] = [
  { name: 'CPU', value: 42, status: 'good' },
  { name: 'Memory', value: 67, status: 'good' },
  { name: 'Database', value: 38, status: 'good' },
  { name: 'Cache', value: 76, status: 'good' },
  { name: 'CDN', value: 92, status: 'good' },
];

export const initialConnectedServices: ConnectedServiceItem[] = [
  { id: 'srv-gmaps', name: 'Google Maps', status: 'Connected', iconType: 'MapPin' },
  { id: 'srv-openai', name: 'OpenAI', status: 'Connected', iconType: 'Bot' },
  { id: 'srv-stripe', name: 'Stripe', status: 'Connected', iconType: 'CreditCard' },
  { id: 'srv-whatsapp', name: 'WhatsApp', status: 'Warning', iconType: 'MessageSquare' },
  { id: 'srv-firebase', name: 'Firebase', status: 'Connected', iconType: 'Flame' },
  { id: 'srv-smtp', name: 'SMTP', status: 'Connected', iconType: 'Mail' },
];

export const initialSettingsRecentChanges: SettingsRecentChangeItem[] = [
  {
    id: 'rc-1',
    action: 'Payment Gateway Updated',
    timestamp: 'May 18, 10:24 AM',
    admin: 'Admin',
    type: 'green',
  },
  {
    id: 'rc-2',
    action: 'API Key Changed',
    timestamp: 'May 17, 4:12 PM',
    admin: 'Super Admin',
    type: 'blue',
  },
  {
    id: 'rc-3',
    action: 'Backup Created',
    timestamp: 'May 17, 11:45 AM',
    admin: 'System',
    type: 'orange',
  },
  {
    id: 'rc-4',
    action: 'Feature Enabled: Rewards',
    timestamp: 'May 16, 6:32 PM',
    admin: 'Admin',
    type: 'green',
  },
];

export const initialIntegrationHealth: IntegrationHealthItem[] = [
  { name: 'Google Maps', status: 'healthy', color: '#3B82F6' },
  { name: 'Firebase', status: 'healthy', color: '#10B981' },
  { name: 'Stripe', status: 'warning', color: '#F97316' },
  { name: 'WhatsApp', status: 'healthy', color: '#06B6D4' },
  { name: 'Others', status: 'healthy', color: '#8B5CF6' },
];

export const initialApiUsagePoints: ApiUsagePoint[] = [
  { date: 'May 12', requests: 12400 },
  { date: 'May 13', requests: 11800 },
  { date: 'May 14', requests: 15200 },
  { date: 'May 15', requests: 13900 },
  { date: 'May 16', requests: 18400 },
  { date: 'May 17', requests: 16700 },
  { date: 'May 18', requests: 24392 },
];

export const initialBackupTimeline: BackupTimelineItem[] = [
  { id: 'bk-1', date: 'May 18, 2024', time: '10:42 AM', type: 'Manual Backup', status: 'Success' },
  { id: 'bk-2', date: 'May 17, 2024', time: '02:14 AM', type: 'Auto Backup', status: 'Success' },
  { id: 'bk-3', date: 'May 16, 2024', time: '02:14 AM', type: 'Auto Backup', status: 'Success' },
];

export const initialFeatureUsage: FeatureUsageItem[] = [
  { name: 'Bookings', percentage: 92 },
  { name: 'Payments', percentage: 87 },
  { name: 'CMS', percentage: 76 },
  { name: 'Community', percentage: 62 },
  { name: 'Rewards', percentage: 48 },
];
