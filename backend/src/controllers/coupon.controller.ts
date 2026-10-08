import { Request, Response, NextFunction } from 'express';
import { couponService } from '../services/coupon.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';

export class CouponController {
  /**
   * POST /api/coupons/validate or POST /api/coupons/apply
   * Validate and calculate coupon discount
   */
  public async validateOrApplyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, platform, amount, userEmail, userId, businessType } = req.body;
      const result = await couponService.validateAndApply({
        code,
        platform,
        amount: Number(amount) || 0,
        userEmail,
        userId,
        businessType,
      });

      ResponseUtil.success(res, result, result.message, HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/coupons
   * Admin: List coupons with pagination and filters
   */
  public async adminListCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, status, type, applicablePlatform, page, limit } = req.query;
      const result = await couponService.adminListCoupons({
        search: search as string,
        status: status as string,
        type: type as string,
        applicablePlatform: applicablePlatform as string,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      ResponseUtil.success(res, result, 'Coupons fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/admin/coupons
   * Admin: Create new coupon
   */
  public async adminCreateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = (req as any).admin?.id || (req as any).user?.id;
      const result = await couponService.adminCreateCoupon(req.body, adminId);
      ResponseUtil.success(res, result, 'Coupon created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/admin/coupons/:id
   * Admin: Update coupon
   */
  public async adminUpdateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
      const result = await couponService.adminUpdateCoupon(id, req.body);
      ResponseUtil.success(res, result, 'Coupon updated successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/admin/coupons/:id
   * Admin: Delete coupon
   */
  public async adminDeleteCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : String(req.params.id);
      const result = await couponService.adminDeleteCoupon(id);
      ResponseUtil.success(res, result, result.message, HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/coupons/stats
   * Admin: Overall KPI metrics
   */
  public async adminGetStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await couponService.adminGetStats();
      ResponseUtil.success(res, stats, 'Coupon statistics fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/coupons/analytics
   * Admin: Usage analytics & trends
   */
  public async adminGetAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { timeframe } = req.query;
      const tf = Array.isArray(timeframe) ? timeframe[0] : (timeframe as string) || 'daily';
      const analytics = await couponService.adminGetAnalytics(tf as any);
      ResponseUtil.success(res, analytics, 'Coupon analytics fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/admin/coupons/export
   * Admin: Export all coupons & usages
   */
  public async adminExportCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exportData = await couponService.adminExportCoupons();
      ResponseUtil.success(res, exportData, 'Coupon export data fetched successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

export const couponController = new CouponController();
