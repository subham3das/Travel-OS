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
import { adminApiClient } from './adminApiClient';

export const initialCommunityKPIStats: CommunityKPIStats = {
  totalPosts: {
    id: 'kpi-1',
    title: 'Total Posts',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. last month',
    iconType: 'posts',
    sparklineColor: '#6356E5',
  },
  storiesToday: {
    id: 'kpi-2',
    title: 'Stories Today',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. yesterday',
    iconType: 'stories',
    sparklineColor: '#10B981',
  },
  activeCircles: {
    id: 'kpi-3',
    title: 'Active Circles',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. last month',
    iconType: 'circles',
    sparklineColor: '#F59E0B',
  },
  activeMembers: {
    id: 'kpi-4',
    title: 'Active Members',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. last month',
    iconType: 'members',
    sparklineColor: '#3B82F6',
  },
  reportedContent: {
    id: 'kpi-5',
    title: 'Reported Content',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'pending review',
    iconType: 'reported',
    sparklineColor: '#EF4444',
  },
  removedContent: {
    id: 'kpi-6',
    title: 'Removed Content',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'this month',
    iconType: 'removed',
    sparklineColor: '#64748B',
  },
  totalComments: {
    id: 'kpi-7',
    title: 'Total Comments',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. last month',
    iconType: 'comments',
    sparklineColor: '#8B5CF6',
  },
  engagementRate: {
    id: 'kpi-8',
    title: 'Engagement Rate',
    value: '8.4%',
    growth: '+1.2%',
    isPositive: true,
    comparison: 'vs. industry avg (5.2%)',
    iconType: 'engagement',
    sparklineColor: '#EC4899',
  },
};

export const initialActivityDaily: CommunityActivityDataPoint[] = [
  { date: 'Mon', label: 'Mon', posts: 45, stories: 28, comments: 120, likes: 340, shares: 42 },
  { date: 'Tue', label: 'Tue', posts: 52, stories: 34, comments: 145, likes: 410, shares: 55 },
  { date: 'Wed', label: 'Wed', posts: 68, stories: 42, comments: 190, likes: 520, shares: 70 },
  { date: 'Thu', label: 'Thu', posts: 61, stories: 39, comments: 175, likes: 480, shares: 62 },
  { date: 'Fri', label: 'Fri', posts: 84, stories: 58, comments: 240, likes: 690, shares: 95 },
  { date: 'Sat', label: 'Sat', posts: 110, stories: 82, comments: 310, likes: 890, shares: 130 },
  { date: 'Sun', label: 'Sun', posts: 95, stories: 74, comments: 280, likes: 780, shares: 115 },
];

export const initialActivityWeekly: CommunityActivityDataPoint[] = [
  { date: 'Week 1', label: 'W1', posts: 320, stories: 180, comments: 840, likes: 2100, shares: 320 },
  { date: 'Week 2', label: 'W2', posts: 410, stories: 220, comments: 960, likes: 2650, shares: 410 },
  { date: 'Week 3', label: 'W3', posts: 480, stories: 290, comments: 1120, likes: 3100, shares: 490 },
  { date: 'Week 4', label: 'W4', posts: 560, stories: 340, comments: 1350, likes: 3800, shares: 580 },
];

export const initialActivityMonthly: CommunityActivityDataPoint[] = [
  { date: 'Jan', label: 'Jan', posts: 1200, stories: 640, comments: 3400, likes: 8900, shares: 1200 },
  { date: 'Feb', label: 'Feb', posts: 1450, stories: 780, comments: 4100, likes: 10400, shares: 1450 },
  { date: 'Mar', label: 'Mar', posts: 1800, stories: 950, comments: 5200, likes: 13200, shares: 1900 },
  { date: 'Apr', label: 'Apr', posts: 2100, stories: 1150, comments: 6100, likes: 15800, shares: 2300 },
];

export const initialEngagementFunnel: EngagementFunnelStage[] = [
  { stage: 'Views', value: '45.2K', count: 45200, percentage: '100%', color: '#6356E5', bgColor: 'rgba(99, 86, 229, 0.1)' },
  { stage: 'Likes', value: '18.4K', count: 18400, percentage: '40.7%', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  { stage: 'Comments', value: '4.8K', count: 4800, percentage: '10.6%', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.1)' },
  { stage: 'Shares', value: '1.9K', count: 1900, percentage: '4.2%', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.1)' },
  { stage: 'Bookmarks', value: '920', count: 920, percentage: '2.0%', color: '#EC4899', bgColor: 'rgba(236, 72, 153, 0.1)' },
];

export const initialContentTypeDistribution: ContentTypeDistributionItem[] = [
  { name: 'Posts', count: 840, percentage: 48, color: '#6356E5' },
  { name: 'Stories', count: 420, percentage: 24, color: '#10B981' },
  { name: 'Travel Circles', count: 210, percentage: 12, color: '#3B82F6' },
  { name: 'Questions', count: 160, percentage: 9, color: '#F59E0B' },
  { name: 'Guides', count: 120, percentage: 7, color: '#EC4899' },
];

export const initialTopActiveCommunities: TopActiveCommunityItem[] = [
  { rank: 1, name: 'Himalayan Trekkers Hub', memberCount: '12.4K', growth: '+14%', category: 'Trekking & Hiking' },
  { rank: 2, name: 'Solo Backpackers India', memberCount: '9.8K', growth: '+22%', category: 'Budget Travel' },
  { rank: 3, name: 'Goa Beach Lovers & Nomads', memberCount: '8.1K', growth: '+8%', category: 'Coastal & Leisure' },
  { rank: 4, name: 'Rajasthan Heritage Seekers', memberCount: '6.5K', growth: '+11%', category: 'Culture & Heritage' },
];

export const initialTrendingDestinations: TrendingDestinationItem[] = [
  { rank: 1, name: 'Spiti Valley', country: 'Himachal Pradesh', color: '#6356E5' },
  { rank: 2, name: 'Varkala Cliff', country: 'Kerala', color: '#10B981' },
  { rank: 3, name: 'Ziro Valley', country: 'Arunachal Pradesh', color: '#3B82F6' },
  { rank: 4, name: 'Gokarna Beaches', country: 'Karnataka', color: '#F59E0B' },
];

export const initialCommunityHealthScore: CommunityHealthScoreData = {
  overallScore: 94,
  statusText: 'Excellent Health',
  growthPercentage: '+4.2%',
  isGrowthPositive: true,
  metrics: {
    positiveSentiment: 92,
    spamRate: 2,
    engagementQuality: 88,
    growthRate: 15,
    retentionRate: 84,
  },
};

export const initialTopCreators: TopCreatorItem[] = [
  {
    rank: 1,
    name: 'Aanya Sharma',
    handle: '@aanya_travels',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    followersCount: '48.2K',
  },
  {
    rank: 2,
    name: 'Rohan Verma',
    handle: '@mountain_rohan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    followersCount: '34.5K',
  },
];

export const initialLiveActivityEvents: CommunityActivityEventItem[] = [
  {
    id: 'act-1',
    timeAgo: 'Just now',
    type: 'post',
    title: 'New community story published',
    subtitle: 'By @aanya_travels in Himalayan Trekkers',
    statusColor: 'text-[#6356E5]',
  },
];

class AdminCommunityManagementService {
  public async getKPIStats(): Promise<CommunityKPIStats> {
    try {
      const response = await adminApiClient.get<CommunityKPIStats>('/community/stats');
      if (response.success && response.data) {
        return {
          totalPosts: response.data.totalPosts || initialCommunityKPIStats.totalPosts,
          storiesToday: response.data.storiesToday || initialCommunityKPIStats.storiesToday,
          activeCircles: response.data.activeCircles || initialCommunityKPIStats.activeCircles,
          activeMembers: response.data.activeMembers || initialCommunityKPIStats.activeMembers,
          reportedContent: response.data.reportedContent || initialCommunityKPIStats.reportedContent,
          removedContent: response.data.removedContent || initialCommunityKPIStats.removedContent,
          totalComments: response.data.totalComments || initialCommunityKPIStats.totalComments,
          engagementRate: response.data.engagementRate || initialCommunityKPIStats.engagementRate,
        };
      }
      return initialCommunityKPIStats;
    } catch {
      return initialCommunityKPIStats;
    }
  }

  public async getActivityTimeline(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<CommunityActivityDataPoint[]> {
    try {
      const response = await adminApiClient.get<CommunityActivityDataPoint[]>('/community/timeline', { params: { interval } });
      if (response.success && response.data) {
        return response.data;
      }
      if (interval === 'Weekly') return initialActivityWeekly;
      if (interval === 'Monthly') return initialActivityMonthly;
      return initialActivityDaily;
    } catch {
      if (interval === 'Weekly') return initialActivityWeekly;
      if (interval === 'Monthly') return initialActivityMonthly;
      return initialActivityDaily;
    }
  }

  public async getEngagementFunnel(): Promise<EngagementFunnelStage[]> {
    return initialEngagementFunnel;
  }

  public async getContentTypeDistribution(): Promise<ContentTypeDistributionItem[]> {
    return initialContentTypeDistribution;
  }

  public async getTopActiveCommunities(): Promise<TopActiveCommunityItem[]> {
    return initialTopActiveCommunities;
  }

  public async getModerationQueue(typeFilter?: string, statusFilter?: string): Promise<ModerationCardItem[]> {
    try {
      const params: Record<string, any> = {};
      if (typeFilter && typeFilter !== 'All') params.typeFilter = typeFilter;
      if (statusFilter && statusFilter !== 'All') params.statusFilter = statusFilter;

      const response = await adminApiClient.get<ModerationCardItem[]>('/community/moderation-queue', { params });
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async getRecentFeed(searchQuery?: string): Promise<CommunityFeedRowItem[]> {
    try {
      const response = await adminApiClient.get<CommunityFeedRowItem[]>('/community/feed', { params: { search: searchQuery } });
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch {
      return [];
    }
  }

  public async getTrendingDestinations(): Promise<TrendingDestinationItem[]> {
    return initialTrendingDestinations;
  }

  public async getHealthScore(): Promise<CommunityHealthScoreData> {
    return initialCommunityHealthScore;
  }

  public async getTopCreators(): Promise<TopCreatorItem[]> {
    return initialTopCreators;
  }

  public async getLiveActivity(): Promise<CommunityActivityEventItem[]> {
    return initialLiveActivityEvents;
  }

  public async approveModerationItem(id: string): Promise<boolean> {
    const response = await adminApiClient.post(`/community/posts/${id}/approve`, {});
    return response.success;
  }

  public async rejectModerationItem(id: string): Promise<boolean> {
    const response = await adminApiClient.post(`/community/posts/${id}/reject`, {});
    return response.success;
  }

  public async removeModerationItem(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/community/posts/${id}`);
    return response.success;
  }

  public async toggleStarItem(id: string): Promise<boolean> {
    return true;
  }

  public async toggleHideItem(id: string): Promise<boolean> {
    return true;
  }

  public async warnUser(authorName: string, id: string): Promise<boolean> {
    return true;
  }

  public async createAnnouncement(payload: AnnouncementPayload): Promise<boolean> {
    const response = await adminApiClient.post('/community/announcements', payload);
    return response.success;
  }
}

export const adminCommunityManagementService = new AdminCommunityManagementService();
