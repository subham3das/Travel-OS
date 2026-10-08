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
    growth: '0%',
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
    value: '0.0 ★',
    growth: '0%',
    isPositive: true,
    comparison: 'across all packages',
    iconType: 'rating',
    sparklineColor: '#10B981',
  },
  reviewsToday: {
    id: 'kpi-6',
    title: 'Reviews Submitted Today',
    value: '0',
    growth: '0%',
    isPositive: true,
    comparison: 'vs. yesterday',
    iconType: 'today',
    sparklineColor: '#8B5CF6',
  },
};

export const initialRatingDistribution: RatingDistributionData = {
  avgRating: 0.0,
  totalCount: 0,
  stars: [
    { star: 5, count: 0, percentage: 0, color: '#10B981' },
    { star: 4, count: 0, percentage: 0, color: '#6356E5' },
    { star: 3, count: 0, percentage: 0, color: '#F59E0B' },
    { star: 2, count: 0, percentage: 0, color: '#FB923C' },
    { star: 1, count: 0, percentage: 0, color: '#EF4444' },
  ],
};

export const initialReviewTrendDaily: ReviewTrendDataPoint[] = [];
export const initialReviewTrendWeekly: ReviewTrendDataPoint[] = [];
export const initialReviewTrendMonthly: ReviewTrendDataPoint[] = [];

export const initialSentimentBreakdown: SentimentBreakdownItem[] = [
  { name: 'Positive', count: 0, percentage: 0, color: '#10B981' },
  { name: 'Neutral', count: 0, percentage: 0, color: '#F59E0B' },
  { name: 'Negative', count: 0, percentage: 0, color: '#EF4444' },
];

export const initialRecentModeration: RecentModerationActivityItem[] = [];
export const initialReportedAgencies: ReportedAgencyItem[] = [];
export const initialReportedTravelers: ReportedTravelerItem[] = [];

class AdminReviewManagementService {
  public async getKPIStats(): Promise<ReviewKPIStats> {
    try {
      const response = await adminApiClient.get<any>('/admin/reviews/stats');
      if (response.success && response.data) {
        const d = response.data;
        return {
          totalReviews: {
            ...initialReviewKPIStats.totalReviews,
            value: d.totalReviews?.value || String(d.totalReviews?.count ?? '0'),
            growth: d.totalReviews?.growth || '0%',
            isPositive: d.totalReviews?.isPositive ?? true,
          },
          pendingModeration: {
            ...initialReviewKPIStats.pendingModeration,
            value: d.pendingModeration?.value || String(d.pendingModeration?.count ?? '0'),
            growth: d.pendingModeration?.growth || '0%',
            isPositive: d.pendingModeration?.isPositive ?? true,
          },
          reportedReviews: {
            ...initialReviewKPIStats.reportedReviews,
            value: d.reportedReviews?.value || d.flaggedReviews?.value || String(d.reportedReviews?.count || d.flaggedReviews?.count || '0'),
            growth: d.reportedReviews?.growth || d.flaggedReviews?.growth || '0%',
            isPositive: d.reportedReviews?.isPositive ?? false,
          },
          removedReviews: {
            ...initialReviewKPIStats.removedReviews,
            value: d.removedReviews?.value || String(d.removedReviews?.count ?? '0'),
            growth: d.removedReviews?.growth || '0%',
            isPositive: d.removedReviews?.isPositive ?? true,
          },
          avgRating: {
            ...initialReviewKPIStats.avgRating,
            value: d.avgRating?.value || d.averageRating?.value || '0.0 ★',
            growth: d.avgRating?.growth || d.averageRating?.growth || '0%',
            isPositive: d.avgRating?.isPositive ?? true,
          },
          reviewsToday: {
            ...initialReviewKPIStats.reviewsToday,
            value: d.reviewsToday?.value || String(d.reviewsToday?.count ?? '0'),
            growth: d.reviewsToday?.growth || '0%',
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
    try {
      const res = await adminApiClient.get<RatingDistributionData>('/admin/reviews/distribution');
      if (res.success && res.data) return res.data;
      return initialRatingDistribution;
    } catch {
      return initialRatingDistribution;
    }
  }

  public async getReviewTrends(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<ReviewTrendDataPoint[]> {
    try {
      const res = await adminApiClient.get<ReviewTrendDataPoint[]>(`/admin/reviews/trends?interval=${interval}`);
      if (res.success && res.data) return res.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getSentimentBreakdown(): Promise<SentimentBreakdownItem[]> {
    try {
      const res = await adminApiClient.get<SentimentBreakdownItem[]>('/admin/reviews/sentiment');
      if (res.success && res.data) return res.data;
      return initialSentimentBreakdown;
    } catch {
      return initialSentimentBreakdown;
    }
  }

  public async getRecentModeration(): Promise<RecentModerationActivityItem[]> {
    try {
      const res = await adminApiClient.get<RecentModerationActivityItem[]>('/admin/reviews/moderation');
      if (res.success && res.data) return res.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getReportedAgencies(): Promise<ReportedAgencyItem[]> {
    try {
      const res = await adminApiClient.get<ReportedAgencyItem[]>('/admin/reviews/reported-agencies');
      if (res.success && res.data) return res.data;
      return [];
    } catch {
      return [];
    }
  }

  public async getReportedTravelers(): Promise<ReportedTravelerItem[]> {
    try {
      const res = await adminApiClient.get<ReportedTravelerItem[]>('/admin/reviews/reported-travelers');
      if (res.success && res.data) return res.data;
      return [];
    } catch {
      return [];
    }
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
          id: r.id || r.reviewId || (r._id ? String(r._id) : ''),
          traveler: {
            id: r.traveler?.id || r.userId || '',
            name: r.traveler?.name || r.userName || 'Traveler',
            avatar: r.traveler?.avatar || r.userAvatar || '',
            email: r.traveler?.email || r.userEmail || '',
            location: r.traveler?.location || '',
            verified: r.traveler?.verified ?? false,
            memberSince: r.traveler?.memberSince || '',
            totalReviews: r.traveler?.totalReviews || 1,
          },
          agency: {
            id: r.agency?.id || r.agencyId || '',
            name: r.agency?.name || r.agencyName || 'Agency',
            logo: r.agency?.logo || r.agencyLogo || '',
            rating: r.agency?.rating || 0.0,
            verified: r.agency?.verified ?? false,
          },
          package: {
            id: r.package?.id || r.packageId || '',
            name: r.package?.name || r.packageName || '',
            destination: r.package?.destination || '',
            thumbnail: r.package?.thumbnail || '',
          },
          booking: {
            id: r.booking?.id || r.bookingId || '',
            travelDates: r.booking?.travelDates || '',
            travelerCount: r.booking?.travelerCount || '',
            bookingAmount: r.booking?.bookingAmount || '',
          },
          rating: r.rating || 0,
          reviewText: r.reviewText || '',
          images: Array.isArray(r.images) ? r.images : [],
          tags: Array.isArray(r.tags) ? r.tags : [],
          sentiment: r.sentiment || 'Neutral',
          status: (r.status || 'Pending') as any,
          helpfulVotes: r.helpfulVotes || r.helpfulCount || 0,
          reportsCount: r.reportsCount || 0,
          createdAt: r.createdAt || '',
          publishedDate: r.publishedDate || r.createdAt || '',
          publishedTime: r.publishedTime || '',
          moderatorNotes: r.moderatorNotes || '',
          isVerifiedBooking: r.isVerifiedBooking ?? false,
          aiAnalysis: {
            spamScore: r.aiAnalysis?.spamScore ?? 0,
            authenticity: r.aiAnalysis?.authenticity || 'Verified',
            sentiment: r.aiAnalysis?.sentiment || r.sentiment || 'Neutral',
            confidence: r.aiAnalysis?.confidence ?? 0,
            riskLevel: r.aiAnalysis?.riskLevel || 'Low Risk',
          },
          agencyReply: r.agencyReply,
          reportHistory: r.reportHistory || [],
          actionHistory: r.actionHistory || [],
        }));
      }
      return [];
    } catch {
      return [];
    }
  }

  public async updateReviewStatus(
    id: string,
    status: 'Approved' | 'Pending' | 'Reported' | 'Removed'
  ): Promise<boolean> {
    const response = await adminApiClient.patch(`/admin/reviews/${id}/status`, { status });
    return response.success;
  }

  public async approveReview(id: string): Promise<boolean> {
    return this.updateReviewStatus(id, 'Approved');
  }

  public async hideReview(id: string): Promise<boolean> {
    return this.updateReviewStatus(id, 'Pending');
  }

  public async removeReview(id: string): Promise<boolean> {
    return this.updateReviewStatus(id, 'Removed');
  }

  public async warnUser(userName: string, reviewId: string): Promise<boolean> {
    const response = await adminApiClient.post('/admin/notifications/feed', {
      title: 'Policy Warning',
      message: `Warning issued regarding review ${reviewId} by ${userName}`,
      type: 'warning',
    }).catch(() => ({ success: true }));
    return Boolean(response);
  }

  public async warnAgency(agencyName: string, reviewId: string): Promise<boolean> {
    const response = await adminApiClient.post('/admin/notifications/feed', {
      title: 'Agency Compliance Notice',
      message: `Compliance notice issued to ${agencyName} regarding review ${reviewId}`,
      type: 'warning',
    }).catch(() => ({ success: true }));
    return Boolean(response);
  }

  public async updateModeratorNotes(id: string, notes: string): Promise<boolean> {
    const response = await adminApiClient.patch(`/admin/reviews/${id}/status`, { moderatorNotes: notes });
    return response.success;
  }

  public async deleteReview(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/reviews/${id}`);
    return response.success;
  }
}

export const adminReviewManagementService = new AdminReviewManagementService();
