import {
  NotificationKPIStats,
  CampaignItem,
  NotificationAnalyticsData,
  CampaignStatus,
} from '../types/notificationsManagement';
import { adminApiClient } from './adminApiClient';

export const initialNotificationKPIStats: NotificationKPIStats = {
  sentToday: {
    id: 'sentToday',
    title: 'Notifications Sent Today',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'sent',
    sparklineColor: '#6356E5',
  },
  deliveryRate: {
    id: 'deliveryRate',
    title: 'Delivery Rate',
    value: '98.32%',
    growth: '2.4%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'delivery_rate',
    sparklineColor: '#F97316',
  },
  openRate: {
    id: 'openRate',
    title: 'Open Rate',
    value: '32.45%',
    growth: '5.7%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'open_rate',
    sparklineColor: '#3B82F6',
  },
  clickRate: {
    id: 'clickRate',
    title: 'Click Rate',
    value: '8.74%',
    growth: '1.8%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'click_rate',
    sparklineColor: '#10B981',
  },
  scheduledCampaigns: {
    id: 'scheduledCampaigns',
    title: 'Scheduled Campaigns',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs yesterday',
    iconType: 'scheduled',
    sparklineColor: '#8B5CF6',
  },
  failedDeliveries: {
    id: 'failedDeliveries',
    title: 'Failed Deliveries',
    value: '0',
    growth: '0%',
    isPositive: false,
    comparison: 'vs yesterday',
    iconType: 'failed',
    sparklineColor: '#EF4444',
  },
};

export const initialNotificationAnalytics: NotificationAnalyticsData = {
  deliveryFunnel: [
    { stage: 'Sent', count: '54,682', percentage: '100%', color: '#6356E5' },
    { stage: 'Delivered', count: '53,763', percentage: '98.3%', color: '#3B82F6' },
    { stage: 'Opened', count: '17,446', percentage: '32.4%', color: '#10B981' },
    { stage: 'Clicked', count: '4,699', percentage: '8.7%', color: '#F59E0B' },
    { stage: 'Converted', count: '1,422', percentage: '2.6%', color: '#EC4899' },
  ],
  hourlyHeatmap: [
    [0.1, 0.2, 0.4, 0.7, 0.9, 0.8, 0.5],
    [0.2, 0.3, 0.5, 0.8, 0.95, 0.85, 0.6],
    [0.1, 0.2, 0.4, 0.7, 0.9, 0.8, 0.5],
  ],
  audienceSegmentation: [
    { name: 'All Users', count: '245.6K', percentage: 100, color: '#6356E5' },
    { name: 'Verified Travelers', count: '142.8K', percentage: 58, color: '#10B981' },
    { name: 'Subscribed Users', count: '89.2K', percentage: 36, color: '#3B82F6' },
    { name: 'Travel Agencies', count: '2.4K', percentage: 1, color: '#F59E0B' },
  ],
  recentActivity: [
    {
      id: 'act-1',
      type: 'completed',
      title: 'Campaign "Summer Travel Sale" broadcast completed',
      author: 'Super Admin',
      timeAgo: '10m ago',
      statusColor: 'text-emerald-500',
    },
  ],
};

export const initialCampaignsData: CampaignItem[] = [];

class AdminNotificationsManagementService {
  public async getKPIStats(): Promise<NotificationKPIStats> {
    try {
      const response = await adminApiClient.get<NotificationKPIStats>('/notifications/stats');
      if (response.success && response.data) {
        return response.data;
      }
      return initialNotificationKPIStats;
    } catch {
      return initialNotificationKPIStats;
    }
  }

  public async getCampaigns(statusFilter?: string, searchQuery?: string): Promise<CampaignItem[]> {
    try {
      const params: Record<string, any> = {};
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;
      if (searchQuery) params.search = searchQuery;

      const response = await adminApiClient.get<CampaignItem[]>('/notifications/campaigns', { params });
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async getAnalytics(): Promise<NotificationAnalyticsData> {
    return initialNotificationAnalytics;
  }

  public async saveCampaign(campaign: Partial<CampaignItem>): Promise<CampaignItem> {
    const response = await adminApiClient.post<CampaignItem>('/notifications/campaigns', campaign);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to save campaign');
  }

  public async sendCampaign(id: string): Promise<boolean> {
    return true;
  }

  public async duplicateCampaign(id: string): Promise<CampaignItem> {
    const campaigns = await this.getCampaigns();
    const source = campaigns.find((c) => c.id === id) || campaigns[0];
    const copy = await this.saveCampaign({
      ...source,
      name: `${source?.name || 'Campaign'} (Copy)`,
      status: 'Draft',
    });
    return copy;
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/notifications/campaigns/${id}`);
    return response.success;
  }
}

export const adminNotificationsManagementService = new AdminNotificationsManagementService();
