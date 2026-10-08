import mongoose from 'mongoose';
import { CouponModel, ICoupon, CouponApplicablePlatform } from '../models/coupon.model.js';
import { CouponUsageModel } from '../models/couponUsage.model.js';
import { AppError } from '../utils/errors.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export interface ValidateCouponInput {
  code: string;
  platform?: CouponApplicablePlatform | string;
  amount: number;
  userEmail?: string;
  userId?: string;
  businessType?: string;
}

export interface CouponValidationResult {
  isValid: boolean;
  code: string;
  type: 'percentage' | 'fixed';
  percentage?: number;
  fixedAmount?: number;
  discount: number;
  originalAmount: number;
  finalAmount: number;
  message: string;
  couponId: string;
}

export class CouponService {
  /**
   * Validate and calculate discount for a coupon code
   */
  public async validateAndApply(input: ValidateCouponInput): Promise<CouponValidationResult> {
    const rawCode = (input.code || '').trim().toUpperCase();
    if (!rawCode) {
      throw new AppError('Coupon code is required', HTTP_STATUS.BAD_REQUEST);
    }

    const coupon = await CouponModel.findOne({
      code: rawCode,
      isDeleted: false,
    });

    if (!coupon) {
      throw new AppError('Invalid coupon code. Coupon does not exist.', HTTP_STATUS.NOT_FOUND);
    }

    const now = new Date();

    // 1. Status Check
    if (coupon.status === 'paused') {
      throw new AppError('This coupon is currently paused.', HTTP_STATUS.BAD_REQUEST);
    }
    if (coupon.status === 'draft') {
      throw new AppError('This coupon is not active yet.', HTTP_STATUS.BAD_REQUEST);
    }
    if (coupon.status === 'expired' || coupon.expiryDate < now) {
      // Auto update status if expired
      if (coupon.status !== 'expired') {
        coupon.status = 'expired';
        await coupon.save();
      }
      throw new AppError('This coupon has expired.', HTTP_STATUS.BAD_REQUEST);
    }

    // 2. Start Date Check
    if (coupon.startDate && coupon.startDate > now) {
      throw new AppError('This coupon campaign has not started yet.', HTTP_STATUS.BAD_REQUEST);
    }

    // 3. Global Usage Limit Check
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('This coupon has reached its maximum global redemption limit.', HTTP_STATUS.BAD_REQUEST);
    }

    // 4. Minimum Purchase Amount Check
    const amount = Number(input.amount) || 0;
    if (coupon.minimumAmount && amount < coupon.minimumAmount) {
      throw new AppError(
        `Minimum order amount of ₹${coupon.minimumAmount.toLocaleString('en-IN')} required to use this coupon.`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // 5. Applicable Platform Check
    const platform = input.platform as CouponApplicablePlatform;
    if (platform && coupon.applicablePlatforms && coupon.applicablePlatforms.length > 0) {
      if (!coupon.applicablePlatforms.includes(platform)) {
        throw new AppError(
          `This coupon is not applicable for this service (${platform.replace(/_/g, ' ')}).`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // 6. Business Type & Eligibility Check
    if (coupon.eligibility) {
      if (coupon.eligibility === 'agency_only' && input.businessType && input.businessType !== 'agency') {
        throw new AppError('This coupon is exclusively valid for Travel Agency subscriptions.', HTTP_STATUS.BAD_REQUEST);
      }
      if (coupon.eligibility === 'car_rental_only' && input.businessType && input.businessType !== 'car_rental') {
        throw new AppError('This coupon is exclusively valid for Car Rental subscriptions.', HTTP_STATUS.BAD_REQUEST);
      }
      if (coupon.eligibility === 'partner_only' && input.businessType && !['agency', 'car_rental'].includes(input.businessType)) {
        throw new AppError('This coupon is reserved for partner subscriptions.', HTTP_STATUS.BAD_REQUEST);
      }
    }

    // 7. Per-User Usage Limit Check
    const userEmail = (input.userEmail || '').trim().toLowerCase();
    if (userEmail) {
      const userUsageCount = await CouponUsageModel.countDocuments({
        couponId: coupon._id,
        userEmail,
      });

      if (coupon.perUserLimit && userUsageCount >= coupon.perUserLimit) {
        throw new AppError(
          `You have already used this coupon the maximum permitted times (${coupon.perUserLimit}).`,
          HTTP_STATUS.BAD_REQUEST
        );
      }
    }

    // 8. Calculate Discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      const pct = coupon.percentage || 0;
      discount = Math.round((amount * pct) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = Math.min(coupon.fixedAmount || 0, amount);
    }

    const finalAmount = Math.max(0, amount - discount);

    return {
      isValid: true,
      code: coupon.code,
      type: coupon.type,
      percentage: coupon.percentage,
      fixedAmount: coupon.fixedAmount,
      discount,
      originalAmount: amount,
      finalAmount,
      message: `Coupon ${coupon.code} applied successfully!`,
      couponId: (coupon._id as any).toString(),
    };
  }

  /**
   * Record usage of a coupon after successful payment
   */
  public async recordUsage(data: {
    couponId: string | mongoose.Types.ObjectId;
    couponCode: string;
    userId?: string | mongoose.Types.ObjectId;
    userEmail: string;
    subscriptionId?: string | mongoose.Types.ObjectId;
    bookingId?: string | mongoose.Types.ObjectId;
    discount: number;
    amount: number;
    finalAmount: number;
    businessType?: string;
  }): Promise<void> {
    const usageDoc: any = {
      couponId: new mongoose.Types.ObjectId(data.couponId.toString()),
      couponCode: data.couponCode.toUpperCase(),
      userEmail: data.userEmail.toLowerCase(),
      discount: data.discount,
      amount: data.amount,
      finalAmount: data.finalAmount,
      businessType: data.businessType || 'agency',
      usedAt: new Date(),
    };

    if (data.userId && mongoose.Types.ObjectId.isValid(data.userId.toString())) {
      usageDoc.userId = new mongoose.Types.ObjectId(data.userId.toString());
    }
    if (data.subscriptionId && mongoose.Types.ObjectId.isValid(data.subscriptionId.toString())) {
      usageDoc.subscriptionId = new mongoose.Types.ObjectId(data.subscriptionId.toString());
    }
    if (data.bookingId && mongoose.Types.ObjectId.isValid(data.bookingId.toString())) {
      usageDoc.bookingId = new mongoose.Types.ObjectId(data.bookingId.toString());
    }

    await CouponUsageModel.create(usageDoc);

    // Atomically increment usedCount on Coupon
    await CouponModel.findByIdAndUpdate(data.couponId, {
      $inc: { usedCount: 1 },
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ADMIN OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Admin: List coupons with filters & search
   */
  public async adminListCoupons(query: {
    search?: string;
    status?: string;
    type?: string;
    applicablePlatform?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { isDeleted: false };

    if (query.search) {
      filter.$or = [
        { code: { $regex: query.search.trim(), $options: 'i' } },
        { description: { $regex: query.search.trim(), $options: 'i' } },
      ];
    }

    if (query.status && query.status !== 'all') {
      filter.status = query.status;
    }

    if (query.type && query.type !== 'all') {
      filter.type = query.type;
    }

    if (query.applicablePlatform && query.applicablePlatform !== 'all') {
      filter.applicablePlatforms = query.applicablePlatform;
    }

    const [coupons, total] = await Promise.all([
      CouponModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CouponModel.countDocuments(filter),
    ]);

    const formatted = coupons.map((c) => ({
      ...c,
      id: c._id,
      remaining: c.usageLimit != null ? Math.max(0, c.usageLimit - (c.usedCount || 0)) : null,
    }));

    return {
      coupons: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Admin: Create new coupon
   */
  public async adminCreateCoupon(data: any, adminId?: string) {
    const code = (data.code || '').trim().toUpperCase();
    if (!code) {
      throw new AppError('Coupon code is required', HTTP_STATUS.BAD_REQUEST);
    }

    const existing = await CouponModel.findOne({ code, isDeleted: false });
    if (existing) {
      throw new AppError(`Coupon code "${code}" already exists`, HTTP_STATUS.CONFLICT);
    }

    const couponData: any = {
      code,
      description: data.description || `Special discount code ${code}`,
      type: data.type === 'fixed' ? 'fixed' : 'percentage',
      percentage: Number(data.percentage) || 0,
      fixedAmount: Number(data.fixedAmount) || 0,
      minimumAmount: Number(data.minimumAmount) || 0,
      startDate: data.startDate ? new Date(data.startDate) : new Date(),
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: Number(data.usageLimit) || 1000,
      usedCount: 0,
      perUserLimit: Number(data.perUserLimit) || 1,
      applicablePlatforms: Array.isArray(data.applicablePlatforms) && data.applicablePlatforms.length > 0
        ? data.applicablePlatforms
        : ['agency_subscription', 'car_rental_subscription'],
      eligibility: data.eligibility || 'all',
      status: data.status || 'active',
      rules: {
        firstPurchaseOnly: Boolean(data.rules?.firstPurchaseOnly),
        canCombine: Boolean(data.rules?.canCombine),
        singleUse: data.rules?.singleUse !== undefined ? Boolean(data.rules.singleUse) : true,
        recurring: Boolean(data.rules?.recurring),
      },
    };

    if (data.maximumDiscount) {
      couponData.maximumDiscount = Number(data.maximumDiscount);
    }

    if (adminId && mongoose.Types.ObjectId.isValid(adminId)) {
      couponData.createdBy = new mongoose.Types.ObjectId(adminId);
    }

    const coupon = await CouponModel.create(couponData);
    return coupon;
  }

  /**
   * Admin: Update coupon
   */
  public async adminUpdateCoupon(id: string, data: any) {
    const coupon = await CouponModel.findOne({ _id: id, isDeleted: false });
    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
    }

    if (data.code && data.code.trim().toUpperCase() !== coupon.code) {
      const code = data.code.trim().toUpperCase();
      const existing = await CouponModel.findOne({ code, _id: { $ne: id }, isDeleted: false });
      if (existing) {
        throw new AppError(`Coupon code "${code}" already exists`, HTTP_STATUS.CONFLICT);
      }
      coupon.code = code;
    }

    if (data.description !== undefined) coupon.description = data.description;
    if (data.type !== undefined) coupon.type = data.type;
    if (data.percentage !== undefined) coupon.percentage = Number(data.percentage);
    if (data.fixedAmount !== undefined) coupon.fixedAmount = Number(data.fixedAmount);
    if (data.minimumAmount !== undefined) coupon.minimumAmount = Number(data.minimumAmount);
    if (data.maximumDiscount !== undefined) {
      coupon.maximumDiscount = data.maximumDiscount ? Number(data.maximumDiscount) : undefined;
    }
    if (data.startDate !== undefined) coupon.startDate = new Date(data.startDate);
    if (data.expiryDate !== undefined) coupon.expiryDate = new Date(data.expiryDate);
    if (data.usageLimit !== undefined) coupon.usageLimit = Number(data.usageLimit);
    if (data.perUserLimit !== undefined) coupon.perUserLimit = Number(data.perUserLimit);
    if (data.applicablePlatforms !== undefined) coupon.applicablePlatforms = data.applicablePlatforms;
    if (data.eligibility !== undefined) coupon.eligibility = data.eligibility;
    if (data.status !== undefined) coupon.status = data.status;
    if (data.rules !== undefined) {
      coupon.rules = {
        ...coupon.rules,
        ...data.rules,
      };
    }

    await coupon.save();
    return coupon;
  }

  /**
   * Admin: Soft delete coupon
   */
  public async adminDeleteCoupon(id: string) {
    const coupon = await CouponModel.findOne({ _id: id, isDeleted: false });
    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND);
    }

    coupon.isDeleted = true;
    coupon.status = 'expired';
    await coupon.save();
    return { success: true, message: 'Coupon deleted successfully' };
  }

  /**
   * Admin: Overall KPI Statistics
   */
  public async adminGetStats() {
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      upcomingExpiry,
      usageStats,
      recentUsageCount,
    ] = await Promise.all([
      CouponModel.countDocuments({ isDeleted: false }),
      CouponModel.countDocuments({ isDeleted: false, status: 'active', expiryDate: { $gt: now } }),
      CouponModel.countDocuments({
        isDeleted: false,
        $or: [{ status: 'expired' }, { expiryDate: { $lte: now } }],
      }),
      CouponModel.countDocuments({
        isDeleted: false,
        status: 'active',
        expiryDate: { $gt: now, $lte: next7Days },
      }),
      CouponUsageModel.aggregate([
        {
          $group: {
            _id: null,
            totalUsed: { $sum: 1 },
            totalDiscountGiven: { $sum: '$discount' },
            totalRevenueImpacted: { $sum: '$finalAmount' },
          },
        },
      ]),
      CouponUsageModel.countDocuments({ usedAt: { $gte: last24h } }),
    ]);

    const stats = usageStats[0] || {
      totalUsed: 0,
      totalDiscountGiven: 0,
      totalRevenueImpacted: 0,
    };

    return {
      totalCoupons,
      activeCoupons,
      expiredCoupons,
      totalUsed: stats.totalUsed,
      totalDiscountGiven: stats.totalDiscountGiven,
      totalRevenueImpacted: stats.totalRevenueImpacted,
      upcomingExpiry,
      recentUsageCount,
    };
  }

  /**
   * Admin: Detailed Usage & Analytics Charts
   */
  public async adminGetAnalytics(timeframe: 'daily' | 'weekly' | 'monthly' = 'daily') {
    // 1. Top Performing Coupons
    const topCoupons = await CouponUsageModel.aggregate([
      {
        $group: {
          _id: '$couponCode',
          redemptionCount: { $sum: 1 },
          totalDiscount: { $sum: '$discount' },
          totalRevenue: { $sum: '$finalAmount' },
        },
      },
      { $sort: { redemptionCount: -1 } },
      { $limit: 10 },
    ]);

    // 2. Timeline Aggregation (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const timeline = await CouponUsageModel.aggregate([
      { $match: { usedAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$usedAt' },
          },
          count: { $sum: 1 },
          discount: { $sum: '$discount' },
          revenue: { $sum: '$finalAmount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      topCoupons,
      timeline: timeline.map((t) => ({
        date: t._id,
        redemptions: t.count,
        discount: t.discount,
        revenue: t.revenue,
      })),
    };
  }

  /**
   * Admin: Export all coupons and recent usages
   */
  public async adminExportCoupons() {
    const [coupons, usages] = await Promise.all([
      CouponModel.find({ isDeleted: false }).sort({ createdAt: -1 }).lean(),
      CouponUsageModel.find().sort({ usedAt: -1 }).limit(1000).lean(),
    ]);

    return { coupons, usages };
  }

  /**
   * Automatically seed initial active coupons if collection is empty
   */
  public async seedDefaultCoupons() {
    try {
      const count = await CouponModel.countDocuments({ isDeleted: false });
      if (count === 0) {
        const defaultCoupons = [
          {
            code: 'SAVE20',
            description: '20% discount on ApnaTrip partner subscription registration',
            type: 'percentage' as const,
            percentage: 20,
            minimumAmount: 500,
            maximumDiscount: 500,
            startDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            usageLimit: 5000,
            usedCount: 0,
            perUserLimit: 1,
            applicablePlatforms: ['agency_subscription', 'car_rental_subscription'],
            eligibility: 'all' as const,
            status: 'active' as const,
            rules: { firstPurchaseOnly: false, canCombine: false, singleUse: true, recurring: false },
          },
          {
            code: 'PARTNER10',
            description: '10% promotional partner discount',
            type: 'percentage' as const,
            percentage: 10,
            minimumAmount: 0,
            maximumDiscount: 300,
            startDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            usageLimit: 10000,
            usedCount: 0,
            perUserLimit: 1,
            applicablePlatforms: ['agency_subscription', 'car_rental_subscription'],
            eligibility: 'all' as const,
            status: 'active' as const,
            rules: { firstPurchaseOnly: false, canCombine: false, singleUse: true, recurring: false },
          },
          {
            code: 'FLAT200',
            description: 'Flat ₹200 off on partner registration',
            type: 'fixed' as const,
            fixedAmount: 200,
            minimumAmount: 500,
            startDate: new Date(),
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            usageLimit: 2000,
            usedCount: 0,
            perUserLimit: 1,
            applicablePlatforms: ['agency_subscription', 'car_rental_subscription'],
            eligibility: 'all' as const,
            status: 'active' as const,
            rules: { firstPurchaseOnly: false, canCombine: false, singleUse: true, recurring: false },
          },
        ];
        await CouponModel.insertMany(defaultCoupons);
      }
    } catch (err) {
      console.warn('Coupon default seed skipped:', err);
    }
  }
}

export const couponService = new CouponService();
