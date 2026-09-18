import { apiClient } from '../../services/apiClient';

export interface CustomerReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  reviewText: string;
  packageName: string;
  createdAt: string;
  images?: string[];
  agencyReply?: {
    text: string;
    repliedAt: string;
    authorName: string;
  };
}

export interface SubmitReviewPayload {
  packageId?: string;
  agencyId?: string;
  rating: number;
  reviewText: string;
  images?: string[];
}

class ReviewService {
  public async getReviews(params?: { packageId?: string; agencyId?: string }): Promise<CustomerReview[]> {
    try {
      const res = await apiClient.get<{ reviews: CustomerReview[] }>('/reviews', {
        params,
        requiresAuth: false,
      });
      return res.data?.reviews || [];
    } catch {
      return [];
    }
  }

  public async submitReview(payload: SubmitReviewPayload): Promise<CustomerReview> {
    const res = await apiClient.post<{ review: CustomerReview }>('/reviews', payload);
    if (!res.data?.review) {
      throw new Error(res.message || 'Failed to submit review');
    }
    return res.data.review;
  }
}

export const reviewService = new ReviewService();
