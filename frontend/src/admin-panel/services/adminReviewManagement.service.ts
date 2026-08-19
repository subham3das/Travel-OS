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
import {
  initialReviewKPIStats,
  initialRatingDistribution,
  initialReviewTrendDaily,
  initialReviewTrendWeekly,
  initialReviewTrendMonthly,
  initialSentimentBreakdown,
  initialRecentModeration,
  initialReportedAgencies,
  initialReportedTravelers,
  initialReviewsData,
} from '../data/reviewsData';

class AdminReviewManagementService {
  private reviews: AdminReviewItem[] = initialReviewsData;
  private kpiStats: ReviewKPIStats = initialReviewKPIStats;
  private ratingDistribution: RatingDistributionData = initialRatingDistribution;
  private sentimentBreakdown: SentimentBreakdownItem[] = initialSentimentBreakdown;
  private recentModeration: RecentModerationActivityItem[] = initialRecentModeration;
  private reportedAgencies: ReportedAgencyItem[] = initialReportedAgencies;
  private reportedTravelers: ReportedTravelerItem[] = initialReportedTravelers;

  public async getKPIStats(): Promise<ReviewKPIStats> {
    return new Promise((resolve) => setTimeout(() => resolve(this.kpiStats), 40));
  }

  public async getRatingDistribution(): Promise<RatingDistributionData> {
    return new Promise((resolve) => setTimeout(() => resolve(this.ratingDistribution), 40));
  }

  public async getReviewTrends(interval: 'Daily' | 'Weekly' | 'Monthly'): Promise<ReviewTrendDataPoint[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (interval === 'Weekly') resolve(initialReviewTrendWeekly);
        else if (interval === 'Monthly') resolve(initialReviewTrendMonthly);
        else resolve(initialReviewTrendDaily);
      }, 40);
    });
  }

  public async getSentimentBreakdown(): Promise<SentimentBreakdownItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.sentimentBreakdown), 40));
  }

  public async getRecentModeration(): Promise<RecentModerationActivityItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.recentModeration), 40));
  }

  public async getReportedAgencies(): Promise<ReportedAgencyItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.reportedAgencies), 40));
  }

  public async getReportedTravelers(): Promise<ReportedTravelerItem[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.reportedTravelers), 40));
  }

  public async getReviews(filters?: Partial<ReviewFilters>): Promise<AdminReviewItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...this.reviews];

        if (filters) {
          // Quick Status Pill Filter
          if (filters.quickStatus && filters.quickStatus !== 'All') {
            result = result.filter((r) => r.status.toLowerCase() === filters.quickStatus?.toLowerCase());
          }

          // Agency Dropdown
          if (filters.agency && filters.agency !== 'All Agencies' && filters.agency !== 'all') {
            result = result.filter((r) => r.agency.name.toLowerCase().includes(filters.agency!.toLowerCase()));
          }

          // Destination Dropdown
          if (filters.destination && filters.destination !== 'All Destinations' && filters.destination !== 'all') {
            result = result.filter((r) => r.package.destination.toLowerCase().includes(filters.destination!.toLowerCase()));
          }

          // Rating Dropdown
          if (filters.rating && filters.rating !== 'All Ratings' && filters.rating !== 'all') {
            const star = parseInt(filters.rating, 10);
            if (!isNaN(star)) {
              result = result.filter((r) => r.rating === star);
            }
          }

          // Status Dropdown
          if (filters.status && filters.status !== 'All Status' && filters.status !== 'all') {
            result = result.filter((r) => r.status.toLowerCase() === filters.status?.toLowerCase());
          }

          // Reported Dropdown
          if (filters.reported && filters.reported !== 'All' && filters.reported !== 'all') {
            if (filters.reported === 'Reported Only') {
              result = result.filter((r) => r.reportsCount > 0);
            } else if (filters.reported === 'No Reports') {
              result = result.filter((r) => r.reportsCount === 0);
            }
          }

          // Verified Booking Dropdown
          if (filters.verifiedBooking && filters.verifiedBooking !== 'All' && filters.verifiedBooking !== 'all') {
            if (filters.verifiedBooking === 'Verified Only') {
              result = result.filter((r) => r.isVerifiedBooking);
            }
          }

          // Search Query
          if (filters.search && filters.search.trim() !== '') {
            const q = filters.search.toLowerCase();
            result = result.filter(
              (r) =>
                r.id.toLowerCase().includes(q) ||
                r.traveler.name.toLowerCase().includes(q) ||
                r.agency.name.toLowerCase().includes(q) ||
                r.package.name.toLowerCase().includes(q) ||
                r.reviewText.toLowerCase().includes(q)
            );
          }
        }

        resolve(result);
      }, 40);
    });
  }

  public async approveReview(reviewId: string): Promise<boolean> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, status: 'Approved' as const } : r
    );
    this.recentModeration = [
      {
        id: `act-${Date.now()}`,
        type: 'approved',
        title: `Approved review ${reviewId}`,
        targetId: reviewId,
        actor: 'Super Admin',
        timeAgo: 'Just now',
      },
      ...this.recentModeration,
    ];
    return true;
  }

  public async hideReview(reviewId: string): Promise<boolean> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, status: 'Pending' as const } : r
    );
    return true;
  }

  public async removeReview(reviewId: string): Promise<boolean> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, status: 'Removed' as const, reviewText: '[Content removed by Super Admin]' } : r
    );
    this.recentModeration = [
      {
        id: `act-${Date.now()}`,
        type: 'removed',
        title: `Removed review ${reviewId}`,
        targetId: reviewId,
        actor: 'Super Admin',
        timeAgo: 'Just now',
      },
      ...this.recentModeration,
    ];
    return true;
  }

  public async warnUser(travelerName: string, reviewId: string): Promise<boolean> {
    this.recentModeration = [
      {
        id: `act-${Date.now()}`,
        type: 'warned_user',
        title: `Warned user ${travelerName}`,
        targetId: reviewId,
        actor: 'Super Admin',
        timeAgo: 'Just now',
      },
      ...this.recentModeration,
    ];
    return true;
  }

  public async warnAgency(agencyName: string, reviewId: string): Promise<boolean> {
    this.recentModeration = [
      {
        id: `act-${Date.now()}`,
        type: 'warned_agency',
        title: `Warned agency ${agencyName}`,
        targetId: reviewId,
        actor: 'Super Admin',
        timeAgo: 'Just now',
      },
      ...this.recentModeration,
    ];
    return true;
  }

  public async updateModeratorNotes(reviewId: string, notes: string): Promise<boolean> {
    this.reviews = this.reviews.map((r) =>
      r.id === reviewId ? { ...r, moderatorNotes: notes } : r
    );
    return true;
  }
}

export const adminReviewManagementService = new AdminReviewManagementService();
