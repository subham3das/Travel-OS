import {
  CommunityKPIStats,
  CommunityActivityDataPoint,
  EngagementFunnelStage,
  ContentTypeDistributionItem,
  TopActiveCommunityItem,
  ModerationCardItem,
  CommunityFeedRowItem,
  TrendingDestinationItem,
  CommunityHealthScoreData,
  TopCreatorItem,
  CommunityActivityEventItem,
  AnnouncementPayload,
} from '../types/communityManagement';
import {
  initialCommunityKPIStats,
  initialActivityDaily,
  initialActivityWeekly,
  initialActivityMonthly,
  initialEngagementFunnel,
  initialContentTypeDistribution,
  initialTopActiveCommunities,
  initialModerationQueueData,
  initialRecentFeedData,
  initialTrendingDestinations,
  initialCommunityHealthScore,
  initialTopCreators,
  initialLiveActivityEvents,
} from '../data/communityData';

class AdminCommunityManagementService {
  private kpiStats: CommunityKPIStats = initialCommunityKPIStats;
  private moderationQueue: ModerationCardItem[] = initialModerationQueueData;
  private feedRows: CommunityFeedRowItem[] = initialRecentFeedData;
  private liveActivity: CommunityActivityEventItem[] = initialLiveActivityEvents;
  private activeCommunities: TopActiveCommunityItem[] = initialTopActiveCommunities;
  private healthScore: CommunityHealthScoreData = initialCommunityHealthScore;

  public async getKPIStats(): Promise<CommunityKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getActivityTimeline(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<CommunityActivityDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (interval === 'Weekly') resolve(initialActivityWeekly);
        else if (interval === 'Monthly') resolve(initialActivityMonthly);
        else resolve(initialActivityDaily);
      }, 40);
    });
  }

  public async getEngagementFunnel(): Promise<EngagementFunnelStage[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialEngagementFunnel), 40));
  }

  public async getContentTypeDistribution(): Promise<ContentTypeDistributionItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialContentTypeDistribution), 40));
  }

  public async getTopActiveCommunities(): Promise<TopActiveCommunityItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.activeCommunities), 40));
  }

  public async getModerationQueue(typeFilter?: string, statusFilter?: string): Promise<ModerationCardItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.moderationQueue];
        if (typeFilter && typeFilter !== 'All') {
          result = result.filter((item) => item.type.toLowerCase() === typeFilter.toLowerCase());
        }
        if (statusFilter && statusFilter !== 'All') {
          result = result.filter((item) => item.status.toLowerCase() === statusFilter.toLowerCase());
        }
        resolve(result);
      }, 40);
    });
  }

  public async getRecentFeed(searchQuery?: string): Promise<CommunityFeedRowItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.feedRows];
        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          result = result.filter(
            (r) =>
              r.id.toLowerCase().includes(q) ||
              r.creator.name.toLowerCase().includes(q) ||
              r.category.toLowerCase().includes(q)
          );
        }
        resolve(result);
      }, 40);
    });
  }

  public async getTrendingDestinations(): Promise<TrendingDestinationItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTrendingDestinations), 40));
  }

  public async getHealthScore(): Promise<CommunityHealthScoreData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.healthScore), 40));
  }

  public async getTopCreators(): Promise<TopCreatorItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(initialTopCreators), 40));
  }

  public async getLiveActivity(): Promise<CommunityActivityEventItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.liveActivity), 40));
  }

  public async approveModerationItem(id: string): Promise<boolean> {
    this.moderationQueue = this.moderationQueue.filter((item) => item.id !== id);
    this.feedRows = this.feedRows.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r));
    this.liveActivity = [
      {
        id: `act-${Date.now()}`,
        timeAgo: 'Just now',
        type: 'approved',
        title: 'Post approved by Super Admin',
        subtitle: id,
        statusColor: 'text-emerald-500',
      },
      ...this.liveActivity,
    ];
    return true;
  }

  public async rejectModerationItem(id: string): Promise<boolean> {
    this.moderationQueue = this.moderationQueue.map((item) =>
      item.id === id ? { ...item, status: 'Rejected' as const } : item
    );
    this.feedRows = this.feedRows.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r));
    return true;
  }

  public async removeModerationItem(id: string): Promise<boolean> {
    this.moderationQueue = this.moderationQueue.filter((item) => item.id !== id);
    this.feedRows = this.feedRows.filter((r) => r.id !== id);
    this.liveActivity = [
      {
        id: `act-${Date.now()}`,
        timeAgo: 'Just now',
        type: 'content_removed',
        title: 'Content removed by Super Admin',
        subtitle: id,
        statusColor: 'text-rose-500',
      },
      ...this.liveActivity,
    ];
    return true;
  }

  public async toggleStarItem(id: string): Promise<boolean> {
    this.moderationQueue = this.moderationQueue.map((item) =>
      item.id === id ? { ...item, isStarred: !item.isStarred } : item
    );
    return true;
  }

  public async toggleHideItem(id: string): Promise<boolean> {
    this.moderationQueue = this.moderationQueue.map((item) =>
      item.id === id ? { ...item, isHidden: !item.isHidden } : item
    );
    return true;
  }

  public async warnUser(authorName: string, id: string): Promise<boolean> {
    this.liveActivity = [
      {
        id: `act-${Date.now()}`,
        timeAgo: 'Just now',
        type: 'user_warned',
        title: `User warned: ${authorName}`,
        subtitle: `Ref: ${id}`,
        statusColor: 'text-amber-500',
      },
      ...this.liveActivity,
    ];
    return true;
  }

  public async createAnnouncement(payload: AnnouncementPayload): Promise<boolean> {
    this.liveActivity = [
      {
        id: `act-${Date.now()}`,
        timeAgo: 'Just now',
        type: 'post',
        title: `Broadcast Announcement: ${payload.title}`,
        subtitle: `Target: ${payload.audience} • ${payload.notificationType}`,
        statusColor: 'text-[#6356E5]',
      },
      ...this.liveActivity,
    ];
    return true;
  }
}

export const adminCommunityManagementService = new AdminCommunityManagementService();
