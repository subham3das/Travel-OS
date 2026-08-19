// ─── Super Admin Notifications Management Types ──────────────────────────────

export type CampaignNotificationType = 'Push' | 'Email' | 'SMS' | 'In-App';
export type CampaignStatus = 'Draft' | 'Scheduled' | 'Sending' | 'Completed' | 'Failed';

export interface NotificationKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'sent' | 'delivery_rate' | 'open_rate' | 'click_rate' | 'scheduled' | 'failed';
  sparklineColor: string;
}

export interface NotificationKPIStats {
  sentToday: NotificationKPICardItem;
  deliveryRate: NotificationKPICardItem;
  openRate: NotificationKPICardItem;
  clickRate: NotificationKPICardItem;
  scheduledCampaigns: NotificationKPICardItem;
  failedDeliveries: NotificationKPICardItem;
}

export interface CampaignItem {
  id: string;
  name: string;
  type: CampaignNotificationType;
  audience: string;
  audienceReach: string;
  status: CampaignStatus;
  progressPercentage?: number;
  scheduleTime?: string;
  createdBy: string;
  createdAt: string;
  title: string;
  message: string;
  bannerImage?: string;
  ctaText: string;
  deepLink: string;
  timeZone: string;
  sentDate?: string;
}

export interface DeliveryFunnelStage {
  stage: 'Sent' | 'Delivered' | 'Opened' | 'Clicked' | 'Converted';
  count: string;
  percentage: string;
  color: string;
}

export interface AudienceSegmentItem {
  name: string;
  count: string;
  percentage: number;
  color: string;
}

export interface CampaignActivityItem {
  id: string;
  type: 'completed' | 'scheduled' | 'sending' | 'draft_created';
  title: string;
  author: string;
  timeAgo: string;
  statusColor: string;
}

export interface NotificationAnalyticsData {
  deliveryFunnel: DeliveryFunnelStage[];
  hourlyHeatmap: number[][]; // 7 days x 24 hours intensity (0 to 1)
  audienceSegmentation: AudienceSegmentItem[];
  recentActivity: CampaignActivityItem[];
}
