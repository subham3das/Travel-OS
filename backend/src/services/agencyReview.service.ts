import mongoose from 'mongoose';
import { ReviewModel, IReview } from '../models/review.model.js';
import { PackageModel } from '../models/package.model.js';

export interface GetAgencyReviewsQuery {
  page?: number;
  limit?: number;
  rating?: number;
  status?: 'All' | 'Pending Reply' | 'Replied';
  sentiment?: 'Positive' | 'Neutral' | 'Negative';
  search?: string;
}

export class AgencyReviewService {
  /**
   * Auto-seed demo reviews for agency if none exist
   */
  private static async ensureInitialReviews(agencyId: string): Promise<void> {
    const aid = new mongoose.Types.ObjectId(agencyId);
    const existing = await ReviewModel.countDocuments({ agencyId: aid, isDeleted: false });
    if (existing > 0) return;

    const agencyPackages = await PackageModel.find({ agencyId: aid, isDeleted: false }).limit(3);
    const pkg1 = agencyPackages[0];
    const pkg2 = agencyPackages[1] || pkg1;

    const initialReviews = [
      {
        reviewId: 'REV-2025-001',
        agencyId: aid,
        agencyName: 'ApnaTrip Partner Agency',
        packageId: pkg1?._id,
        packageName: pkg1?.title || 'Ladakh Expedition & High Pass Trail',
        bookingId: 'BK-2024-00568',
        userName: 'Subham Das',
        userEmail: 'subhamdas@gmail.com',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        rating: 5,
        reviewText:
          'Unbelievable experience! The vehicle was comfortable, hotels in Leh and Nubra were very clean, and our guide Aman made sure we were acclimatized properly. Will definitely travel again!',
        images: ['https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600'],
        status: 'Approved' as const,
        sentiment: 'Positive' as const,
        helpfulCount: 14,
        agencyReply: {
          text: 'Thank you Subham! We are thrilled that you had a wonderful mountain expedition with us.',
          repliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          authorName: 'Operations Lead',
        },
      },
      {
        reviewId: 'REV-2025-002',
        agencyId: aid,
        agencyName: 'ApnaTrip Partner Agency',
        packageId: pkg1?._id,
        packageName: pkg1?.title || 'Ladakh Expedition & High Pass Trail',
        bookingId: 'BK-2024-00569',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@gmail.com',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
        rating: 4,
        reviewText:
          'Solo friendly trip! Felt super secure. Only feedback is Pangong cottage check-in took 25 minutes due to cold weather queue. Otherwise 10/10.',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600'],
        status: 'Approved' as const,
        sentiment: 'Positive' as const,
        helpfulCount: 8,
      },
      {
        reviewId: 'REV-2025-003',
        agencyId: aid,
        agencyName: 'ApnaTrip Partner Agency',
        packageId: pkg2?._id,
        packageName: pkg2?.title || 'Kashmir Paradise Circuit',
        bookingId: 'BK-2024-00570',
        userName: 'Rahul Verma',
        userEmail: 'rahul.verma@gmail.com',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200',
        rating: 5,
        reviewText:
          'Family trip was magical. Shikara ride at Dal Lake and Gulmarg Gondola arranged smoothly without standing in standard ticket lines.',
        images: [],
        status: 'Approved' as const,
        sentiment: 'Positive' as const,
        helpfulCount: 19,
        agencyReply: {
          text: 'Delighted to hear your family had a magical Kashmir holiday!',
          repliedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          authorName: 'Customer Experience Desk',
        },
      },
      {
        reviewId: 'REV-2025-004',
        agencyId: aid,
        agencyName: 'ApnaTrip Partner Agency',
        packageId: pkg2?._id,
        packageName: pkg2?.title || 'Spiti Valley Adventure',
        bookingId: 'BK-2024-00571',
        userName: 'Aman Gupta',
        userEmail: 'aman.gupta@gmail.com',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
        rating: 3,
        reviewText:
          'Terrain was rugged and exciting, but the morning breakfast on Day 3 was delayed by 45 mins. Driver Manoj was stellar though.',
        images: [],
        status: 'Approved' as const,
        sentiment: 'Neutral' as const,
        helpfulCount: 3,
      },
    ];

    await ReviewModel.insertMany(initialReviews);
  }

  /**
   * Fetch agency reviews with search & filters
   */
  static async getAgencyReviews(agencyId: string, query: GetAgencyReviewsQuery) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await this.ensureInitialReviews(agencyId);

    const filter: Record<string, any> = {
      agencyId: aid,
      isDeleted: false,
    };

    if (query.rating) {
      filter.rating = Number(query.rating);
    }

    if (query.sentiment) {
      filter.sentiment = query.sentiment;
    }

    if (query.status === 'Pending Reply') {
      filter.agencyReply = { $exists: false };
    } else if (query.status === 'Replied') {
      filter['agencyReply.text'] = { $exists: true, $ne: '' };
    }

    if (query.search) {
      const q = new RegExp(query.search.trim(), 'i');
      filter.$or = [{ userName: q }, { reviewText: q }, { packageName: q }, { bookingId: q }];
    }

    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ReviewModel.countDocuments(filter),
    ]);

    return {
      reviews: reviews.map((r: any) => ({
        id: r._id.toString(),
        reviewId: r.reviewId,
        userName: r.userName,
        userEmail: r.userEmail,
        userAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
        packageName: r.packageName,
        bookingId: r.bookingId,
        rating: r.rating,
        reviewText: r.reviewText,
        images: r.images || [],
        sentiment: r.sentiment,
        helpfulCount: r.helpfulCount || 0,
        agencyReply: r.agencyReply || null,
        createdAt: r.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Reviews Reputation KPIs & Rating Breakdown
   */
  static async getReviewStats(agencyId: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);
    await this.ensureInitialReviews(agencyId);

    const allReviews = await ReviewModel.find({ agencyId: aid, isDeleted: false }).lean();

    const totalReviews = allReviews.length;
    let sumRating = 0;
    let repliedCount = 0;
    let positiveCount = 0;

    const distribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    allReviews.forEach((r) => {
      sumRating += r.rating;
      if (r.rating in distribution) {
        distribution[r.rating as keyof typeof distribution]++;
      }
      if (r.agencyReply && r.agencyReply.text) repliedCount++;
      if (r.rating >= 4 || r.sentiment === 'Positive') positiveCount++;
    });

    const averageRating = totalReviews > 0 ? Number((sumRating / totalReviews).toFixed(1)) : 4.8;
    const replyRate = totalReviews > 0 ? `${Math.round((repliedCount / totalReviews) * 100)}%` : '92%';
    const positivePercent = totalReviews > 0 ? `${Math.round((positiveCount / totalReviews) * 100)}%` : '96%';

    return {
      averageRating,
      totalReviews,
      replyRate,
      positiveSentimentPercent: positivePercent,
      distribution: [
        { star: 5, count: distribution[5], percent: totalReviews ? Math.round((distribution[5] / totalReviews) * 100) : 75 },
        { star: 4, count: distribution[4], percent: totalReviews ? Math.round((distribution[4] / totalReviews) * 100) : 20 },
        { star: 3, count: distribution[3], percent: totalReviews ? Math.round((distribution[3] / totalReviews) * 100) : 5 },
        { star: 2, count: distribution[2], percent: totalReviews ? Math.round((distribution[2] / totalReviews) * 100) : 0 },
        { star: 1, count: distribution[1], percent: totalReviews ? Math.round((distribution[1] / totalReviews) * 100) : 0 },
      ],
    };
  }

  /**
   * Agency reply to review
   */
  static async replyToReview(agencyId: string, reviewIdOrObjectId: string, replyText: string, authorName = 'Agency Desk') {
    const aid = new mongoose.Types.ObjectId(agencyId);

    const review = await ReviewModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { reviewId: reviewIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(reviewIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(reviewIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      {
        $set: {
          agencyReply: {
            text: replyText,
            repliedAt: new Date(),
            authorName,
          },
        },
      },
      { new: true }
    );

    if (!review) throw new Error('Review not found');
    return review;
  }

  /**
   * Flag review
   */
  static async flagReview(agencyId: string, reviewIdOrObjectId: string, reason: string) {
    const aid = new mongoose.Types.ObjectId(agencyId);

    const review = await ReviewModel.findOneAndUpdate(
      {
        agencyId: aid,
        $or: [
          { reviewId: reviewIdOrObjectId },
          ...(mongoose.Types.ObjectId.isValid(reviewIdOrObjectId)
            ? [{ _id: new mongoose.Types.ObjectId(reviewIdOrObjectId) }]
            : []),
        ],
        isDeleted: false,
      },
      { $set: { status: 'Reported' } },
      { new: true }
    );

    if (!review) throw new Error('Review not found');
    return { success: true, message: 'Review reported to moderation team' };
  }
}
