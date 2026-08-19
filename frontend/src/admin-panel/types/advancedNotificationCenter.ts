// ─── Super Admin Advanced Notification Center Types ─────────────────────────

export type NotificationCategoryType =
  | 'all'
  | 'unread'
  | 'critical'
  | 'agency'
  | 'package'
  | 'support'
  | 'payment'
  | 'review'
  | 'system'
  | 'community'
  | 'trip'
  | 'user'
  | 'security'
  | 'cms'
  | 'finance'
  | 'audit';

export type NotificationPriorityType = 'High' | 'Medium' | 'Low' | 'Critical';

export interface NotificationCenterKPISummary {
  today: { count: number; growth: string; isPositive: boolean };
  actionRequired: { count: number; label: string };
  criticalAlerts: { count: number; label: string };
  unread: { count: number; label: string };
  responseTime: { value: string; growth: string; isPositive: boolean };
}

export interface NotificationFeedItemAction {
  label: string;
  actionType: string;
  variant?: 'primary' | 'danger' | 'secondary' | 'outline';
}

export interface NotificationFeedItem {
  id: string;
  category: NotificationCategoryType;
  title: string;
  description: string;
  metadata: string;
  time: string;
  timeGroup: 'Today' | 'Yesterday' | 'Earlier';
  priority: NotificationPriorityType;
  status: 'Pending' | 'Action Required' | 'Open' | 'Completed' | 'Resolved' | 'Archived';
  isRead: boolean;
  isPinned?: boolean;
  isStarred?: boolean;
  targetRoute: string;
  actions: NotificationFeedItemAction[];
  assignedAdmin?: string;
  notes?: string;
  history?: Array<{ event: string; admin: string; timestamp: string }>;
}

export interface SmartGroupItem {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  iconType: 'agency' | 'package' | 'support' | 'payment' | 'review' | 'system' | 'community';
}

export interface SavedFilterItem {
  id: string;
  title: string;
  count: number;
  iconType: 'high' | 'tickets' | 'payments' | 'alerts';
}

export interface PinnedNotificationItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  priority: NotificationPriorityType;
  iconType: 'agency' | 'package' | 'refund';
  targetRoute: string;
}

export interface AISummaryData {
  newCount: number;
  immediateActionCount: number;
  criticalAlertsCount: number;
  approvalsPendingCount: number;
  paymentFailuresCount: number;
  executiveSummary: string;
}

export interface NotificationPreferencesData {
  desktopPush: boolean;
  emailNotifications: boolean;
  soundAlerts: boolean;
  whatsappAlerts: boolean;
  snooze: string;
}

export interface NotificationAnalyticsCategory {
  category: string;
  count: number;
  percentage: number;
  color: string;
}

export interface NotificationRecentActivityItem {
  id: string;
  action: string;
  entity: string;
  time: string;
  admin: string;
}

export interface NotificationEscalationItem {
  id: string;
  title: string;
  priority: NotificationPriorityType;
  assignedTo: string;
  dueIn: string;
}

export interface NotificationDeliveryChannelStatus {
  delivered: number;
  pending: number;
  failed: number;
  rate: string;
}

export interface NotificationBottomWidgetsData {
  analytics: NotificationAnalyticsCategory[];
  recentActivity: NotificationRecentActivityItem[];
  escalations: NotificationEscalationItem[];
  deliveryStatus: {
    push: NotificationDeliveryChannelStatus;
    email: NotificationDeliveryChannelStatus;
    sms: NotificationDeliveryChannelStatus;
    whatsapp: NotificationDeliveryChannelStatus;
  };
}
