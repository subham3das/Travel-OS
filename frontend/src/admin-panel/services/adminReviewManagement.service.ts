import {
  AdminReviewItem,
  ReviewKPIStats,
  RatingDistributionData,
  ReviewTrendDataPoint,
  SentimentBreakdownItem,
  RecentModerationActivityItem,
  ReportedAgencyItem,
  ReportedTravelerItem,
  ReviewFilters,
} from '../types/reviewManagement';
import { adminApiClient } from './adminApiClient';

export const initialReviewKPIStats: ReviewKPIStats = {
  totalReviews: {
    id: 'kpi-1',
    title: 'Total Reviews',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. last month',
    iconType: 'total',
    sparklineColor: '#6356E5',
  },
  pendingModeration: {
    id: 'kpi-2',
    title: 'Pending Moderation',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'requires action',
    iconType: 'pending',
    sparklineColor: '#F59E0B',
  },
  reportedReviews: {
    id: 'kpi-3',
    title: 'Reported Reviews',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'flagged by users',
    iconType: 'reported',
    sparklineColor: '#EF4444',
  },
  removedReviews: {
    id: 'kpi-4',
    title: 'Removed / Spam',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'auto & manual',
    iconType: 'removed',
    sparklineColor: '#64748B',
  },
  avgRating: {
    id: 'kpi-5',
    title: 'Platform Avg Rating',
    value: '4.8 ★',
    growth: '+0.1',
    isPositive: true,
    comparison: 'across all packages',
    iconType: 'rating',
    sparklineColor: '#10B981',
  },
  reviewsToday: {
    id: 'kpi-6',
    title: 'Reviews Submitted Today',
    value: '0',
    growth: '+0.0%',
    isPositive: true,
    comparison: 'vs. yesterday',
    iconType: 'today',
    sparklineColor: '#8B5CF6',
  },
};

export const initialRatingDistribution: RatingDistributionData = {
  avgRating: 4.8,
  totalCount: 0,
  stars: [
    { star: 5, count: 0, percentage: 82, color: '#10B981' },
    { star: 4, count: 0, percentage: 12, color: '#6356E5' },
    { star: 3, count: 0, percentage: 4, color: '#F59E0B' },
    { star: 2, count: 0, percentage: 1, color: '#FB923C' },
    { star: 1, count: 0, percentage: 1, color: '#EF4444' },
  ],
};

export const initialReviewTrendDaily: ReviewTrendDataPoint[] = [
  { date: 'Mon', label: 'Mon', reviews: 14, approved: 12 },
  { date: 'Tue', label: 'Tue', reviews: 22, approved: 19 },
  { date: 'Wed', label: 'Wed', reviews: 35, approved: 31 },
  { date: 'Thu', label: 'Thu', reviews: 28, approved: 26 },
  { date: 'Fri', label: 'Fri', reviews: 42, approved: 38 },
  { date: 'Sat', label: 'Sat', reviews: 58, approved: 52 },
  { date: 'Sun', label: 'Sun', reviews: 49, approved: 45 },
];

export const initialReviewTrendWeekly: ReviewTrendDataPoint[] = [
  { date: 'Week 1', label: 'W1', reviews: 120, approved: 110 },
  { date: 'Week 2', label: 'W2', reviews: 165, approved: 152 },
  { date: 'Week 3', label: 'W3', reviews: 210, approved: 198 },
  { date: 'Week 4', label: 'W4', reviews: 245, approved: 232 },
];

export const initialReviewTrendMonthly: ReviewTrendDataPoint[] = [
  { date: 'Jan', label: 'Jan', reviews: 450, approved: 410 },
  { date: 'Feb', label: 'Feb', reviews: 580, approved: 540 },
  { date: 'Mar', label: 'Mar', reviews: 720, approved: 680 },
  { date: 'Apr', label: 'Apr', reviews: 890, approved: 840 },
];

export const initialSentimentBreakdown: SentimentBreakdownItem[] = [
  { name: 'Positive', count: 0, percentage: 88, color: '#10B981' },
  { name: 'Neutral', count: 0, percentage: 8, color: '#F59E0B' },
  { name: 'Negative', count: 0, percentage: 4, color: '#EF4444' },
];

export const initialRecentModeration: RecentModerationActivityItem[] = [
  {
    id: 'act-1',
    type: 'approved',
    title: 'Approved review REV-12842',
    targetId: 'REV-12842',
    actor: 'Super Admin',
    timeAgo: '10m ago',
  },
];

export const initialReportedAgencies: ReportedAgencyItem[] = [
  { id: 'ag-1', agencyName: 'Himalayan Highs Ltd', reportsCount: 3, riskLevel: 'Medium' },
  { id: 'ag-2', agencyName: 'Goa Coastal Journeys', reportsCount: 1, riskLevel: 'Low' },
];

export const initialReportedTravelers: ReportedTravelerItem[] = [
  {
    id: 'usr-1',
    travelerName: 'Vikram Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    reportsCount: 2,
    warningBadge: '1 Warning Active',
  },
];

class AdminReviewManagementService {
  public async getKPIStats(): Promise<ReviewKPIStats> {
    try {
      const response = await adminApiClient.get<any>('/admin/reviews/stats');
      if (response.success && response.data) {
        const d = response.data;
        return {
          totalReviews: {
            ...initialReviewKPIStats.totalReviews,
            value: d.totalReviews?.value || String(d.totalReviews?.count ?? initialReviewKPIStats.totalReviews.value),
            growth: d.totalReviews?.growth || initialReviewKPIStats.totalReviews.growth,
            isPositive: d.totalReviews?.isPositive ?? initialReviewKPIStats.totalReviews.isPositive,
          },
          pendingModeration: {
            ...initialReviewKPIStats.pendingModeration,
            value: d.pendingModeration?.value || String(d.pendingModeration?.count ?? initialReviewKPIStats.pendingModeration.value),
            growth: d.pendingModeration?.growth || initialReviewKPIStats.pendingModeration.growth,
            isPositive: d.pendingModeration?.isPositive ?? initialReviewKPIStats.pendingModeration.isPositive,
          },
          reportedReviews: {
            ...initialReviewKPIStats.reportedReviews,
            value:
              d.reportedReviews?.value ||
              d.flaggedReviews?.value ||
              String(d.reportedReviews?.count || d.flaggedReviews?.count || initialReviewKPIStats.reportedReviews.value),
            growth: d.reportedReviews?.growth || d.flaggedReviews?.growth || initialReviewKPIStats.reportedReviews.growth,
            isPositive: d.reportedReviews?.isPositive ?? false,
          },
          removedReviews: {
            ...initialReviewKPIStats.removedReviews,
            value: d.removedReviews?.value || String(d.removedReviews?.count ?? initialReviewKPIStats.removedReviews.value),
            growth: d.removedReviews?.growth || initialReviewKPIStats.removedReviews.growth,
            isPositive: d.removedReviews?.isPositive ?? true,
          },
          avgRating: {
            ...initialReviewKPIStats.avgRating,
            value: d.avgRating?.value || d.averageRating?.value || initialReviewKPIStats.avgRating.value,
            growth: d.avgRating?.growth || d.averageRating?.growth || initialReviewKPIStats.avgRating.growth,
            isPositive: d.avgRating?.isPositive ?? true,
          },
          reviewsToday: {
            ...initialReviewKPIStats.reviewsToday,
            value: d.reviewsToday?.value || String(d.reviewsToday?.count ?? initialReviewKPIStats.reviewsToday.value),
            growth: d.reviewsToday?.growth || initialReviewKPIStats.reviewsToday.growth,
            isPositive: d.reviewsToday?.isPositive ?? true,
          },
        };
      }
      return initialReviewKPIStats;
    } catch {
      return initialReviewKPIStats;
    }
  }

  public async getRatingDistribution(): Promise<RatingDistributionData> {
    return initialRatingDistribution;
  }

  public async getReviewTrends(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<ReviewTrendDataPoint[]> {
    if (interval === 'Weekly') return initialReviewTrendWeekly;
    if (interval === 'Monthly') return initialReviewTrendMonthly;
    return initialReviewTrendDaily;
  }

  public async getSentimentBreakdown(): Promise<SentimentBreakdownItem[]> {
    return initialSentimentBreakdown;
  }

  public async getRecentModeration(): Promise<RecentModerationActivityItem[]> {
    return initialRecentModeration;
  }

  public async getReportedAgencies(): Promise<ReportedAgencyItem[]> {
    return initialReportedAgencies;
  }

  public async getReportedTravelers(): Promise<ReportedTravelerItem[]> {
    return initialReportedTravelers;
  }

  public async getReviews(filters?: Partial<ReviewFilters>): Promise<AdminReviewItem[]> {
    try {
      const params: Record<string, any> = {};
      if (filters?.quickStatus && filters.quickStatus !== 'All') params.status = filters.quickStatus;
      if (filters?.status && filters.status !== 'All' && filters.status !== 'All Status') params.status = filters.status;
      if (filters?.rating && filters.rating !== 'All Ratings') params.rating = filters.rating;
      if (filters?.agency && filters.agency !== 'All Agencies') params.agency = filters.agency;
      if (filters?.search) params.search = filters.search;

      const response = await adminApiClient.get<any>('/admin/reviews', { params });
      if (response.success && response.data) {
        const rawReviews: any[] = Array.isArray(response.data)
          ? response.data
          : response.data.reviews || [];

        return rawReviews.map((r: any) => ({
          id: r.id || r.reviewId || (r._id ? String(r._id) : 'REV-001'),
          traveler: {
            id: r.traveler?.id || r.userId || 'usr-1',
            name: r.traveler?.name || r.userName || 'Verified Traveler',
            avatar:
              r.traveler?.avatar ||
              r.userAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            email: r.traveler?.email || r.userEmail || 'traveler@email.com',
            location: r.traveler?.location || 'India',
            verified: r.traveler?.verified ?? true,
            memberSince: r.traveler?.memberSince || '2024',
            totalReviews: r.traveler?.totalReviews ?? 1,
          },
          agency: {
            id: r.agency?.id || r.agencyId || 'ag-1',
            name: r.agency?.name || r.agencyName || 'Partner Agency',
            logo:
              r.agency?.logo ||
              r.agencyLogo ||
              'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=200&auto=format&fit=crop',
            rating: r.agency?.rating ?? 4.8,
            verified: r.agency?.verified ?? true,
          },
          package: {
            id: r.package?.id || r.packageId || 'pkg-1',
            name: r.package?.name || r.packageName || 'Trip Package',
            destination: r.package?.destination || 'India',
            thumbnail:
              r.package?.thumbnail ||
              'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=400&auto=format&fit=crop',
          },
          booking: {
            id: r.booking?.id || r.bookingId || 'BK-1001',
            travelDates: r.booking?.travelDates || 'Recent',
            travelerCount: r.booking?.travelerCount || '1 Traveler',
            bookingAmount: r.booking?.bookingAmount || '₹0',
          },
          rating: r.rating ?? 5,
          reviewText: r.reviewText || '',
          images: r.images || [],
          status: r.status || 'Approved',
          reportsCount: r.reportsCount ?? 0,
          createdAt: r.createdAt || r.publishedDate || 'Recent',
          aiAnalysis: r.aiAnalysis || {
            spamScore: 0,
            authenticity: '100% Verified',
            sentiment: 'Positive',
            confidence: 98,
            riskLevel: 'Very Low Risk',
          },
          moderatorNotes: r.moderatorNotes || '',
          isVerifiedBooking: r.isVerifiedBooking ?? true,
          reportsHistory: r.reportsHistory || [],
          actionHistory: r.actionHistory || [],
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  public async approveReview(reviewId: string): Promise<boolean> {
    const response = await adminApiClient.patch(`/admin/reviews/${reviewId}/status`, { status: 'Approved' });
    return response.success;
  }

  public async hideReview(reviewId: string): Promise<boolean> {
    const response = await adminApiClient.patch(`/admin/reviews/${reviewId}/status`, { status: 'Pending' });
    return response.success;
  }

  public async removeReview(reviewId: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/reviews/${reviewId}`);
    return response.success;
  }

  public async warnUser(travelerName: string, reviewId: string): Promise<boolean> {
    return true;
  }

  public async warnAgency(agencyName: string, reviewId: string): Promise<boolean> {
    return true;
  }

  public async updateModeratorNotes(reviewId: string, notes: string): Promise<boolean> {
    return true;
  }
}

export const adminReviewManagementService = new AdminReviewManagementService();
