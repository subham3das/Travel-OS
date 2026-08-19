// ─── Super Admin Community Management Types ────────────────────────────────────

export interface CommunityKPICardItem {
  id: string;
  title: string;
  value: string;
  growth: string;
  isPositive: boolean;
  comparison: string;
  iconType: 'posts' | 'stories' | 'circles' | 'members' | 'reported' | 'removed' | 'comments' | 'engagement';
  sparklineColor: string;
}

export interface CommunityKPIStats {
  totalPosts: CommunityKPICardItem;
  storiesToday: CommunityKPICardItem;
  activeCircles: CommunityKPICardItem;
  activeMembers: CommunityKPICardItem;
  reportedContent: CommunityKPICardItem;
  removedContent: CommunityKPICardItem;
  totalComments: CommunityKPICardItem;
  engagementRate: CommunityKPICardItem;
}

export interface CommunityActivityDataPoint {
  date: string;
  label: string;
  posts: number;
  stories: number;
  comments: number;
  likes: number;
  shares: number;
}

export interface EngagementFunnelStage {
  stage: 'Views' | 'Likes' | 'Comments' | 'Shares' | 'Bookmarks';
  value: string;
  count: number;
  percentage: string;
  color: string;
  bgColor: string;
}

export interface ContentTypeDistributionItem {
  name: 'Posts' | 'Stories' | 'Travel Circles' | 'Questions' | 'Guides';
  count: number;
  percentage: number;
  color: string;
}

export interface TopActiveCommunityItem {
  rank: number;
  name: string;
  memberCount: string;
  growth: string;
  category: string;
  avatar?: string;
}

export type ModerationItemType = 'Post' | 'Story' | 'Comment' | 'Travel Circle';
export type ModerationStatus = 'Reported' | 'Pending' | 'Approved' | 'Rejected' | 'Removed';

export interface ModerationAuthor {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
}

export interface ModerationCardItem {
  id: string;
  author: ModerationAuthor;
  type: ModerationItemType;
  coverImage: string;
  location: string;
  caption: string;
  reportsCount: number;
  createdAt: string;
  status: ModerationStatus;
  isStarred?: boolean;
  isHidden?: boolean;
}

export interface CommunityFeedRowItem {
  id: string; // PST-98231
  creator: {
    name: string;
    avatar: string;
  };
  type: ModerationItemType;
  category: string;
  views: string;
  likes: string;
  comments: string;
  shares: string;
  reports: number;
  status: 'Approved' | 'Pending' | 'Reported' | 'Rejected';
  createdAt: string;
}

export interface TrendingDestinationItem {
  rank: number;
  name: string;
  country: string;
  color: string;
}

export interface CommunityHealthScoreData {
  overallScore: number;
  statusText: string;
  growthPercentage: string;
  isGrowthPositive: boolean;
  metrics: {
    positiveSentiment: number;
    spamRate: number;
    engagementQuality: number;
    growthRate: number;
    retentionRate: number;
  };
}

export interface TopCreatorItem {
  rank: number;
  name: string;
  handle: string;
  avatar: string;
  followersCount: string;
}

export interface CommunityActivityEventItem {
  id: string;
  timeAgo: string;
  type: 'post' | 'story_report' | 'member_join' | 'comment_report' | 'circle_create' | 'approved' | 'user_warned' | 'content_removed';
  title: string;
  subtitle: string;
  userAvatar?: string;
  statusColor: string;
}

export interface AnnouncementPayload {
  title: string;
  description: string;
  audience: 'All Users' | 'Travel Agencies' | 'Verified Travelers' | 'Travel Circles';
  notificationType: 'Banner' | 'Push' | 'Email';
  publishMode: 'Publish Now' | 'Schedule';
  scheduledDate?: string;
}
