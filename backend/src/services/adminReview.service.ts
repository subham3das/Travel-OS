import mongoose from 'mongoose';
import { ReviewModel } from '../models/review.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminReviewService {
  /**
   * 1. Live Review KPI Statistics
   */
  async getKPIStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [total, approved, pending, reported, removed, todayCount, ratingsAgg, verifiedCount] = await Promise.all([
      ReviewModel.countDocuments({ isDeleted: false }),
      ReviewModel.countDocuments({ isDeleted: false, status: 'Approved' }),
      ReviewModel.countDocuments({ isDeleted: false, status: 'Pending' }),
      ReviewModel.countDocuments({ isDeleted: false, status: 'Reported' }),
      ReviewModel.countDocuments({ isDeleted: false, status: 'Removed' }),
      ReviewModel.countDocuments({ isDeleted: false, createdAt: { $gte: todayStart } }),
      ReviewModel.aggregate([
        { $match: { isDeleted: false, status: 'Approved' } },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
      ]),
      ReviewModel.countDocuments({ isDeleted: false, isVerifiedBooking: true }),
    ]);

    const avgNum = ratingsAgg[0]?.avgRating ? Number(ratingsAgg[0].avgRating.toFixed(2)) : 0.0;
    const avgStr = total > 0 ? `${avgNum.toFixed(1)} ★` : '0.0 ★';
    const verifiedPct = total > 0 ? `${((verifiedCount / total) * 100).toFixed(1)}%` : '0%';

    return {
      totalReviews: { value: total.toLocaleString(), count: total, growth: '0%', isPositive: true },
      averageRating: { value: avgStr, score: avgNum, growth: '0%', isPositive: true },
      avgRating: { value: avgStr, score: avgNum, growth: '0%', isPositive: true },
      verifiedReviews: { value: verifiedPct, percentage: total > 0 ? Number(((verifiedCount / total) * 100).toFixed(1)) : 0, growth: '0%', isPositive: true },
      pendingModeration: { value: pending.toLocaleString(), count: pending, growth: pending > 0 ? `+${pending}` : '0%', isPositive: pending === 0 },
      reportedReviews: { value: reported.toLocaleString(), count: reported, growth: reported > 0 ? `+${reported}` : '0%', isPositive: false },
      flaggedReviews: { value: reported.toLocaleString(), count: reported, growth: reported > 0 ? `+${reported}` : '0%', isPositive: false },
      removedReviews: { value: removed.toLocaleString(), count: removed, growth: '0%', isPositive: true },
      reviewsToday: { value: todayCount.toLocaleString(), count: todayCount, growth: '0%', isPositive: true },
    };
  }

  /**
   * 2. Rating Distribution (1 - 5 Stars)
   */
  async getRatingDistribution() {
    const [ratingsAgg, totalCountAgg] = await Promise.all([
      ReviewModel.aggregate([
        { $match: { isDeleted: false, status: 'Approved' } },
        {
          $group: {
            _id: '$rating',
            count: { $sum: 1 },
          },
        },
      ]),
      ReviewModel.aggregate([
        { $match: { isDeleted: false, status: 'Approved' } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            avg: { $avg: '$rating' },
          },
        },
      ]),
    ]);

    const total = totalCountAgg[0]?.total || 0;
    const avg = totalCountAgg[0]?.avg ? Number(totalCountAgg[0].avg.toFixed(1)) : 0.0;

    const countsByStar = new Map<number, number>();
    for (const r of ratingsAgg) {
      countsByStar.set(Number(r._id), r.count);
    }

    const starConfigs = [
      { star: 5, color: '#10B981' },
      { star: 4, color: '#6356E5' },
      { star: 3, color: '#F59E0B' },
      { star: 2, color: '#FB923C' },
      { star: 1, color: '#EF4444' },
    ];

    const stars = starConfigs.map(({ star, color }) => {
      const count = countsByStar.get(star) || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return { star, count, percentage, color };
    });

    return {
      avgRating: avg,
      totalCount: total,
      stars,
    };
  }

  /**
   * 3. Review Trends (Daily / Weekly / Monthly)
   */
  async getReviewTrends(interval: 'Daily' | 'Weekly' | 'Monthly' = 'Daily') {
    const days = interval === 'Weekly' ? 28 : interval === 'Monthly' ? 180 : 7;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const trends = await ReviewModel.aggregate([
      {
        $match: {
          isDeleted: false,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          reviews: { $sum: 1 },
          approved: {
            $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (!trends || trends.length === 0) {
      return [];
    }

    return trends.map((t) => ({
      date: t._id,
      label: t._id,
      reviews: t.reviews || 0,
      approved: t.approved || 0,
    }));
  }

  /**
   * 4. Sentiment Breakdown (Positive, Neutral, Negative)
   */
  async getSentimentBreakdown() {
    const sentiments = await ReviewModel.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$sentiment',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = sentiments.reduce((sum, s) => sum + (s.count || 0), 0);

    const sentimentMap = new Map<string, number>();
    for (const s of sentiments) {
      if (s._id) sentimentMap.set(String(s._id).toLowerCase(), s.count);
    }

    const configs = [
      { name: 'Positive', key: 'positive', color: '#10B981' },
      { name: 'Neutral', key: 'neutral', color: '#F59E0B' },
      { name: 'Negative', key: 'negative', color: '#EF4444' },
    ];

    return configs.map((c) => {
      const count = sentimentMap.get(c.key) || 0;
      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        name: c.name,
        count,
        percentage,
        color: c.color,
      };
    });
  }

  /**
   * 5. Recent Moderation Activity (from AuditLog)
   */
  async getRecentModeration() {
    const logs = await AuditLogModel.find({
      module: 'REVIEWS',
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    if (!logs || logs.length === 0) {
      return [];
    }

    return logs.map((log: any) => ({
      id: String(log._id),
      type: log.action?.includes('APPROVE') ? 'approved' : log.action?.includes('DELETE') ? 'deleted' : 'flagged',
      title: log.description || log.action || 'Moderation action',
      targetId: log.resourceId || 'N/A',
      actor: log.actor?.name || 'Admin',
      timeAgo: new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }));
  }

  /**
   * 6. Most Reported Agencies
   */
  async getReportedAgencies() {
    const reported = await ReviewModel.aggregate([
      { $match: { isDeleted: false, status: 'Reported' } },
      {
        $group: {
          _id: '$agencyId',
          agencyName: { $first: '$agencyName' },
          reportsCount: { $sum: 1 },
        },
      },
      { $sort: { reportsCount: -1 } },
      { $limit: 5 },
    ]);

    if (!reported || reported.length === 0) {
      return [];
    }

    return reported.map((r, idx) => ({
      id: r._id ? String(r._id) : `ag-${idx + 1}`,
      agencyName: r.agencyName || 'Unknown Agency',
      reportsCount: r.reportsCount || 0,
      riskLevel: r.reportsCount > 5 ? 'High' : r.reportsCount > 2 ? 'Medium' : 'Low',
    }));
  }

  /**
   * 7. Most Reported Travelers
   */
  async getReportedTravelers() {
    const reported = await ReviewModel.aggregate([
      { $match: { isDeleted: false, status: 'Reported' } },
      {
        $group: {
          _id: '$userId',
          travelerName: { $first: '$userName' },
          avatar: { $first: '$userAvatar' },
          reportsCount: { $sum: 1 },
        },
      },
      { $sort: { reportsCount: -1 } },
      { $limit: 5 },
    ]);

    if (!reported || reported.length === 0) {
      return [];
    }

    return reported.map((r, idx) => ({
      id: r._id ? String(r._id) : `usr-${idx + 1}`,
      travelerName: r.travelerName || 'User',
      avatar: r.avatar || '',
      reportsCount: r.reportsCount || 0,
      warningBadge: `${r.reportsCount} Report${r.reportsCount > 1 ? 's' : ''}`,
    }));
  }

  /**
   * 8. Paginated Reviews Query
   */
  async getReviews(query: {
    page?: number;
    limit?: number;
    search?: string;
    rating?: string;
    status?: string;
    sentiment?: string;
    agency?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const filter: Record<string, any> = { isDeleted: false };

    if (query.search && query.search.trim()) {
      const searchRegex = new RegExp(query.search.trim(), 'i');
      filter.$or = [
        { reviewText: searchRegex },
        { userName: searchRegex },
        { packageName: searchRegex },
        { agencyName: searchRegex },
        { reviewId: searchRegex },
      ];
    }

    if (query.status && query.status !== 'All' && query.status !== 'All Status') {
      filter.status = query.status;
    }

    if (query.sentiment && query.sentiment !== 'All') {
      filter.sentiment = query.sentiment;
    }

    if (query.agency && query.agency !== 'All') {
      filter.agencyName = new RegExp(query.agency, 'i');
    }

    if (query.rating && query.rating !== 'All' && query.rating !== 'All Ratings') {
      const num = parseInt(query.rating.replace(/[^0-9]/g, ''));
      if (!isNaN(num)) filter.rating = num;
    }

    const [reviews, total] = await Promise.all([
      ReviewModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments(filter),
    ]);

    const mapped = reviews.map((r: any) => this.mapReviewToFrontend(r));

    return {
      reviews: mapped,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * 9. Update Review Moderation Status
   */
  async updateStatus(id: string, status: 'Approved' | 'Pending' | 'Reported' | 'Removed', admin: any) {
    const review = await ReviewModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { reviewId: id }] : [{ reviewId: id }],
      isDeleted: false,
    });

    if (!review) throw new Error('Review not found');

    review.status = status;
    await review.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'REVIEWS',
      action: 'MODERATE_REVIEW',
      eventType: 'UPDATE',
      description: `Moderated review "${review.reviewId}" to status "${status}"`,
      severity: 'Low',
    });

    return this.mapReviewToFrontend(review.toObject());
  }

  /**
   * 10. Delete Review
   */
  async deleteReview(id: string, admin: any) {
    const review = await ReviewModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { reviewId: id }] : [{ reviewId: id }],
      isDeleted: false,
    });

    if (!review) throw new Error('Review not found');

    review.isDeleted = true;
    review.status = 'Removed';
    await review.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'REVIEWS',
      action: 'DELETE_REVIEW',
      eventType: 'DELETE',
      description: `Permanently removed review "${review.reviewId}"`,
      severity: 'Medium',
    });

    return { success: true, message: 'Review removed successfully' };
  }

  /**
   * Helper: Map MongoDB IReview to Frontend AdminReviewItem
   */
  public mapReviewToFrontend(r: any) {
    const createdAt = new Date(r.createdAt || Date.now());

    return {
      id: r.reviewId || (r._id ? r._id.toString() : ''),
      traveler: {
        id: r.userId ? r.userId.toString() : '',
        name: r.userName || 'Traveler',
        avatar: r.userAvatar || '',
        email: r.userEmail || '',
        location: '',
        verified: r.isVerifiedBooking ?? false,
        memberSince: '',
        totalReviews: 1,
      },
      agency: {
        id: r.agencyId ? r.agencyId.toString() : '',
        name: r.agencyName || 'Agency',
        logo: r.agencyLogo || '',
        rating: 0.0,
        verified: true,
      },
      package: {
        id: r.packageId ? r.packageId.toString() : '',
        name: r.packageName || '',
        destination: '',
        thumbnail: '',
      },
      booking: {
        id: r.bookingId || '',
        travelDates: '',
        travelerCount: '',
        bookingAmount: '',
      },
      rating: r.rating || 0,
      reviewText: r.reviewText || '',
      images: Array.isArray(r.images) ? r.images : [],
      tags: Array.isArray(r.tags) ? r.tags : [],
      sentiment: r.sentiment || 'Neutral',
      status: (r.status || 'Pending') as any,
      helpfulVotes: r.helpfulCount || 0,
      reportsCount: r.reportsCount || (r.reportHistory?.length || 0),
      createdAt: createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      publishedDate: createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      publishedTime: createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      moderatorNotes: r.moderatorNotes || '',
      isVerifiedBooking: r.isVerifiedBooking ?? false,
      aiAnalysis: {
        spamScore: r.spamScore || 0,
        authenticity: 'Verified',
        sentiment: r.sentiment || 'Neutral',
        confidence: 0,
        riskLevel: 'Low Risk' as const,
      },
      agencyReply: r.agencyReply
        ? {
            repliedBy: r.agencyReply.authorName || 'Agency Support',
            repliedDate: new Date(r.agencyReply.repliedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            text: r.agencyReply.text,
          }
        : undefined,
      reportHistory: [],
      actionHistory: [],
    };
  }
}

export const adminReviewService = new AdminReviewService();
