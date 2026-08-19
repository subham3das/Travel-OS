import {
  NotificationKPIStats,
  CampaignItem,
  NotificationAnalyticsData,
  CampaignStatus,
} from '../types/notificationsManagement';
import {
  initialNotificationKPIStats,
  initialCampaignsData,
  initialNotificationAnalytics,
} from '../data/notificationsData';

class AdminNotificationsManagementService {
  private kpiStats: NotificationKPIStats = initialNotificationKPIStats;
  private campaigns: CampaignItem[] = initialCampaignsData;
  private analytics: NotificationAnalyticsData = initialNotificationAnalytics;

  public async getKPIStats(): Promise<NotificationKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getCampaigns(statusFilter?: string, searchQuery?: string): Promise<CampaignItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.campaigns];

        if (statusFilter && statusFilter !== 'All') {
          result = result.filter(
            (c) => c.status.toLowerCase() === statusFilter.toLowerCase()
          );
        }

        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.title.toLowerCase().includes(q) ||
              c.type.toLowerCase().includes(q) ||
              c.audience.toLowerCase().includes(q)
          );
        }

        resolve(result);
      }, 40);
    });
  }

  public async getAnalytics(): Promise<NotificationAnalyticsData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.analytics), 40));
  }

  public async saveCampaign(campaign: Partial<CampaignItem>): Promise<CampaignItem> {
    const existingIdx = this.campaigns.findIndex((c) => c.id === campaign.id);
    if (existingIdx >= 0) {
      this.campaigns[existingIdx] = {
        ...this.campaigns[existingIdx],
        ...campaign,
      } as CampaignItem;
      return this.campaigns[existingIdx];
    } else {
      const newCampaign: CampaignItem = {
        id: `CMP-${Date.now().toString().slice(-4)}`,
        name: campaign.title || 'Untitled Campaign',
        type: campaign.type || 'Push',
        audience: campaign.audience || 'All Users',
        audienceReach: '245,631',
        status: campaign.status || 'Draft',
        createdBy: 'You',
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: campaign.title || 'Untitled Campaign',
        message: campaign.message || '',
        bannerImage: campaign.bannerImage,
        ctaText: campaign.ctaText || 'Visit App',
        deepLink: campaign.deepLink || '/home',
        timeZone: campaign.timeZone || '(GMT +05:30) Asia/Kolkata',
      };
      this.campaigns = [newCampaign, ...this.campaigns];
      return newCampaign;
    }
  }

  public async sendCampaign(id: string): Promise<boolean> {
    this.campaigns = this.campaigns.map((c) =>
      c.id === id ? { ...c, status: 'Sending' as CampaignStatus, progressPercentage: 10 } : c
    );

    this.analytics.recentActivity = [
      {
        id: `act-${Date.now()}`,
        type: 'sending',
        title: `Campaign "${this.campaigns.find((c) => c.id === id)?.name}" is sending`,
        author: 'You',
        timeAgo: 'Just now',
        statusColor: 'text-blue-500',
      },
      ...this.analytics.recentActivity,
    ];
    return true;
  }

  public async duplicateCampaign(id: string): Promise<CampaignItem> {
    const source = this.campaigns.find((c) => c.id === id) || this.campaigns[0];
    const copy: CampaignItem = {
      ...source,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      name: `${source.name} (Copy)`,
      status: 'Draft',
      createdAt: 'Just now',
      createdBy: 'You',
    };
    this.campaigns = [copy, ...this.campaigns];
    return copy;
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    return true;
  }
}

export const adminNotificationsManagementService = new AdminNotificationsManagementService();
