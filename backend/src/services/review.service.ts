import mongoose from 'mongoose';
import { ReviewModel, IReview } from '../models/review.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { UserModel } from '../models/user.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class ReviewService {
  /**
   * 1. Get reviews for a package or agency
   */
  public async getReviews(filter: { packageId?: string; agencyId?: string }): Promise<any[]> {
    const query: any = { isDeleted: false, status: 'Approved' };

    if (filter.packageId && mongoose.Types.ObjectId.isValid(filter.packageId)) {
      query.packageId = new mongoose.Types.ObjectId(filter.packageId);
    }
    if (filter.agencyId && mongoose.Types.ObjectId.isValid(filter.agencyId)) {
      query.agencyId = new mongoose.Types.ObjectId(filter.agencyId);
    }

    const reviews = await ReviewModel.find(query).sort({ createdAt: -1 }).limit(50).lean();

    return reviews.map((r) => ({
      id: r.reviewId || r._id.toString(),
      _id: r._id.toString(),
      userName: r.userName,
      userAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: r.rating,
      reviewText: r.reviewText,
      packageName: r.packageName,
      createdAt: new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      images: r.images || [],
      agencyReply: r.agencyReply,
    }));
  }

  /**
   * 2. Submit a review
   */
  public async submitReview(userId: string, payload: {
    packageId?: string;
    agencyId?: string;
    rating: number;
    reviewText: string;
    images?: string[];
  }): Promise<any> {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new NotFoundError('User not found');

    const pkg = payload.packageId && mongoose.Types.ObjectId.isValid(payload.packageId)
      ? await PackageModel.findById(payload.packageId).lean()
      : null;
    const agencyIdToUse = payload.agencyId || pkg?.agencyId;
    const agency = agencyIdToUse && mongoose.Types.ObjectId.isValid(String(agencyIdToUse))
      ? await AgencyModel.findById(agencyIdToUse).lean()
      : null;

    const review = await ReviewModel.create({
      reviewId: `REV-${Date.now().toString().slice(-6)}`,
      userId: user._id,
      userName: user.fullName || user.username || 'Verified Traveler',
      userEmail: user.email || 'traveler@apnatrip.com',
      userAvatar: user.avatar || '',
      agencyId: agency?._id || undefined,
      agencyName: agency?.businessName || pkg?.agencyName || 'Partner Agency',
      packageId: pkg?._id || undefined,
      packageName: pkg?.title || 'Tour Experience',
      rating: Math.max(1, Math.min(5, payload.rating || 5)),
      reviewText: payload.reviewText,
      images: payload.images || [],
      status: 'Approved',
      sentiment: payload.rating >= 4 ? 'Positive' : (payload.rating === 3 ? 'Neutral' : 'Negative'),
    });

    // Notify Agency in real time
    if (agency?._id) {
      try {
        await NotificationDispatcher.notifyAgency(agency._id.toString(), {
          title: `New ${payload.rating}★ Review Received!`,
          description: `"${payload.reviewText.slice(0, 80)}..." by ${review.userName}`,
          category: 'Reviews',
        });
      } catch (err: any) {
        logger.warn('Failed to notify agency of review: %s', err.message);
      }
    }

    logger.info('⭐ Review created: %s for package: %s', review.reviewId, pkg?.title);

    return review;
  }
}

export const reviewService = new ReviewService();
