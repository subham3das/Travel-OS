import { agencyApiClient } from './agencyApiClient';

export interface AgencyReviewItem {
  id: string;
  reviewId: string;
  userName: string;
  userEmail: string;
  userAvatar: string;
  packageName: string;
  bookingId: string;
  rating: number;
  reviewText: string;
  images: string[];
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  helpfulCount: number;
  agencyReply: {
    text: string;
    repliedAt: string;
    authorName: string;
  } | null;
  createdAt: string;
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  replyRate: string;
  positiveSentimentPercent: string;
  distribution: Array<{
    star: number;
    count: number;
    percent: number;
  }>;
}

export interface ReviewsListResponse {
  reviews: AgencyReviewItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
  status?: 'All' | 'Pending Reply' | 'Replied';
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  search?: string;
}

export class AgencyReviewsService {
  static async getReviews(params: GetReviewsParams = {}): Promise<ReviewsListResponse> {
    const queryParams: Record<string, any> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.rating) queryParams.rating = params.rating;
    if (params.status && params.status !== 'All') queryParams.status = params.status;
    if (params.sentiment) queryParams.sentiment = params.sentiment;
    if (params.search) queryParams.search = params.search;

    const response = await agencyApiClient.get<ReviewsListResponse>('/agency/reviews', { params: queryParams });
    if (!response.data) throw new Error(response.message || 'Failed to fetch reviews');
    return response.data;
  }

  static async getStats(): Promise<ReviewStatsResponse> {
    const response = await agencyApiClient.get<ReviewStatsResponse>('/agency/reviews/stats');
    if (!response.data) throw new Error(response.message || 'Failed to fetch review stats');
    return response.data;
  }

  static async replyToReview(reviewId: string, replyText: string, authorName = 'Agency Desk'): Promise<any> {
    const response = await agencyApiClient.post(`/agency/reviews/${reviewId}/reply`, { replyText, authorName });
    if (!response.data) throw new Error(response.message || 'Failed to reply to review');
    return response.data;
  }

  static async flagReview(reviewId: string, reason = 'Flagged by agency'): Promise<any> {
    const response = await agencyApiClient.patch(`/agency/reviews/${reviewId}/flag`, { reason });
    if (!response.data) throw new Error(response.message || 'Failed to flag review');
    return response.data;
  }
}

export const agencyReviewsService = AgencyReviewsService;
