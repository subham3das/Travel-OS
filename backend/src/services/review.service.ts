import mongoose from 'mongoose';
import { ReviewModel, IReview } from '../models/review.model.js';
import { PackageModel } from '../models/package.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { UserModel } from '../models/user.model.js';
import { BookingModel } from '../models/booking.model.js';
import { NotificationDispatcher } from './notificationDispatcher.service.js';
import { NotFoundError, BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class ReviewService {
  /**
   * 1. Get reviews for a package or agency
   */
  public async getReviews(filter: { packageId?: string; agencyId?: string }): Promise<any[]> {
    const query: any = { isDeleted: false, status: 'Approved', isHidden: false };

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
      userAvatar: r.userAvatar || '',
      rating: r.rating,
      reviewText: r.reviewText,
      packageName: r.packageName,
      createdAt: new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      images: r.images || [],
      verifiedPurchase: Boolean(r.verifiedPurchase),
      agencyReply: r.agencyReply,
    }));
  }

  /**
   * 2. Submit a generic review
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
      bookingId: `BK-GEN-${Date.now().toString().slice(-6)}`,
      rating: Math.max(1, Math.min(5, payload.rating || 5)),
      reviewText: payload.reviewText,
      images: payload.images || [],
      status: 'Approved',
      verifiedPurchase: false,
      isHidden: false,
      sentiment: payload.rating >= 4 ? 'Positive' : (payload.rating === 3 ? 'Neutral' : 'Negative'),
    });

    if (pkg?._id) {
      await this.updatePackageRatingAggregation(pkg._id);
    }

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

  /**
   * 3. Submit verified review for a Package (Strict requirement: Completed booking only, once per booking)
   */
  public async submitPackageReview(userId: string, payload: {
    packageId: string;
    bookingId: string;
    rating: number;
    reviewText: string;
    images?: string[];
  }): Promise<any> {
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new NotFoundError('User not found');

    if (!payload.packageId || !payload.bookingId) {
      throw new BadRequestError('Package ID and Booking ID are required');
    }

    const ratingVal = Number(payload.rating);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      throw new BadRequestError('Rating must be an integer between 1 and 5 stars');
    }

    if (!payload.reviewText || !payload.reviewText.trim()) {
      throw new BadRequestError('Review text is required');
    }

    // Find the package
    const pkg = await PackageModel.findOne({
      $or: [
        { packageId: payload.packageId },
        ...(mongoose.Types.ObjectId.isValid(payload.packageId) ? [{ _id: payload.packageId }] : []),
      ],
      isDeleted: false,
    });

    if (!pkg) {
      throw new NotFoundError('Package not found');
    }

    // Verify booking
    const booking = await BookingModel.findOne({
      $or: [
        { bookingId: payload.bookingId },
        ...(mongoose.Types.ObjectId.isValid(payload.bookingId) ? [{ _id: payload.bookingId }] : []),
      ],
      isDeleted: false,
    }).lean();

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    if (String(booking.userId) !== String(user._id)) {
      throw new BadRequestError('You can only review trips from your own account');
    }

    if (booking.status !== 'COMPLETED') {
      throw new BadRequestError('Review can only be submitted after your trip is completed');
    }

    // Check if user already submitted a review for this booking
    const existingReview = await ReviewModel.findOne({
      packageId: pkg._id,
      bookingId: booking.bookingId,
      userId: user._id,
      isDeleted: false,
    });

    if (existingReview) {
      throw new BadRequestError('You have already submitted a review for this completed trip');
    }

    // Create verified package review
    const review = await ReviewModel.create({
      reviewId: `REV-${Date.now().toString().slice(-6)}`,
      userId: user._id,
      userName: user.fullName || user.username || 'Verified Traveler',
      userEmail: user.email || 'traveler@apnatrip.com',
      userAvatar: user.avatar || '',
      agencyId: pkg.agencyId,
      agencyName: pkg.agencyName,
      agencyLogo: pkg.agencyLogo || '',
      packageId: pkg._id,
      packageName: pkg.title,
      bookingId: booking.bookingId,
      tripId: String(booking._id),
      rating: Math.round(ratingVal),
      reviewText: payload.reviewText.trim(),
      images: Array.isArray(payload.images) ? payload.images : [],
      status: 'Approved',
      verifiedPurchase: true,
      isHidden: false,
      sentiment: ratingVal >= 4 ? 'Positive' : (ratingVal === 3 ? 'Neutral' : 'Negative'),
    });

    // Update package aggregates via Mongo aggregation
    await this.updatePackageRatingAggregation(pkg._id as mongoose.Types.ObjectId);

    // Notify agency
    if (pkg.agencyId) {
      try {
        await NotificationDispatcher.notifyAgency(pkg.agencyId.toString(), {
          title: `New Verified ${ratingVal}★ Review!`,
          description: `"${payload.reviewText.slice(0, 80)}..." by ${review.userName}`,
          category: 'Reviews',
        });
      } catch (err: any) {
        logger.warn('Failed to notify agency of review: %s', err.message);
      }
    }

    return review;
  }

  /**
   * 4. Aggregate package rating from verified, approved, non-hidden reviews
   */
  public async updatePackageRatingAggregation(packageObjectId: mongoose.Types.ObjectId): Promise<{ averageRating: number; reviewCount: number }> {
    const stats = await ReviewModel.aggregate([
      {
        $match: {
          packageId: packageObjectId,
          status: 'Approved',
          isHidden: false,
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: '$packageId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const averageRating = stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0;
    const reviewCount = stats.length > 0 ? stats[0].reviewCount : 0;

    await PackageModel.findByIdAndUpdate(packageObjectId, {
      rating: averageRating,
      reviewCount: reviewCount,
    });

    return { averageRating, reviewCount };
  }

  /**
   * 5. Get Package Reviews with pagination
   */
  public async getPackageReviews(packageIdentifier: string, page = 1, limit = 20) {
    const pkg = await PackageModel.findOne({
      $or: [
        { packageId: packageIdentifier },
        ...(mongoose.Types.ObjectId.isValid(packageIdentifier) ? [{ _id: packageIdentifier }] : []),
      ],
      isDeleted: false,
    }).lean();

    if (!pkg) {
      throw new NotFoundError('Package not found');
    }

    const skip = (page - 1) * limit;
    const query = {
      packageId: pkg._id,
      status: 'Approved',
      isHidden: false,
      isDeleted: false,
    };

    const [total, reviews] = await Promise.all([
      ReviewModel.countDocuments(query),
      ReviewModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const mapped = reviews.map((r) => ({
      id: r.reviewId || r._id.toString(),
      _id: r._id.toString(),
      travelerId: r.userId ? String(r.userId) : '',
      travelerName: r.userName || 'Verified Traveler',
      travelerAvatar: r.userAvatar || '',
      date: new Date(r.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      rating: r.rating,
      comment: r.reviewText,
      photos: r.images || [],
      verifiedPurchase: Boolean(r.verifiedPurchase),
      agencyReply: r.agencyReply,
    }));

    return {
      reviews: mapped,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * 6. Get Package Rating Breakdown and Live Aggregated Average
   */
  public async getPackageRatingStats(packageIdentifier: string) {
    const pkg = await PackageModel.findOne({
      $or: [
        { packageId: packageIdentifier },
        ...(mongoose.Types.ObjectId.isValid(packageIdentifier) ? [{ _id: packageIdentifier }] : []),
      ],
      isDeleted: false,
    }).lean();

    if (!pkg) {
      throw new NotFoundError('Package not found');
    }

    const reviews = await ReviewModel.find({
      packageId: pkg._id,
      status: 'Approved',
      isHidden: false,
      isDeleted: false,
    }).lean();

    const count = reviews.length;
    let average = 0;
    const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (count > 0) {
      let sum = 0;
      reviews.forEach((r) => {
        const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
        distribution[star] = (distribution[star] || 0) + 1;
        sum += r.rating;
      });
      average = Math.round((sum / count) * 10) / 10;
    }

    return {
      average,
      count,
      distribution,
    };
  }
}

export const reviewService = new ReviewService();
