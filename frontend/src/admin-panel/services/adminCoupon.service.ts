import { adminApiClient, AdminApiResponse } from './adminApiClient';

export interface AdminCouponItem {
  id: string;
  _id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed';
  percentage?: number;
  fixedAmount?: number;
  minimumAmount: number;
  maximumDiscount?: number;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  remaining?: number;
  perUserLimit: number;
  applicablePlatforms: string[];
  eligibility: string;
  status: 'active' | 'paused' | 'expired' | 'draft';
  rules: {
    firstPurchaseOnly: boolean;
    canCombine: boolean;
    singleUse: boolean;
    recurring: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CouponKPIStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalUsed: number;
  totalDiscountGiven: number;
  totalRevenueImpacted: number;
  upcomingExpiry: number;
  recentUsageCount: number;
}

export interface CouponAnalyticsData {
  topCoupons: Array<{
    _id: string;
    redemptionCount: number;
    totalDiscount: number;
    totalRevenue: number;
  }>;
  timeline: Array<{
    date: string;
    redemptions: number;
    discount: number;
    revenue: number;
  }>;
}

class AdminCouponService {
  /**
   * List coupons with filters
   */
  public async getCoupons(params?: {
    search?: string;
    status?: string;
    type?: string;
    applicablePlatform?: string;
    page?: number;
    limit?: number;
  }): Promise<{ coupons: AdminCouponItem[]; pagination: any }> {
    const res = await adminApiClient.get<{ coupons: AdminCouponItem[]; pagination: any }>(
      '/admin/coupons',
      { params: params as any }
    );
    return res.data || { coupons: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
  }

  /**
   * Get KPI statistics
   */
  public async getStats(): Promise<CouponKPIStats> {
    const res = await adminApiClient.get<CouponKPIStats>('/admin/coupons/stats');
    return (
      res.data || {
        totalCoupons: 0,
        activeCoupons: 0,
        expiredCoupons: 0,
        totalUsed: 0,
        totalDiscountGiven: 0,
        totalRevenueImpacted: 0,
        upcomingExpiry: 0,
        recentUsageCount: 0,
      }
    );
  }

  /**
   * Get analytics & charts
   */
  public async getAnalytics(timeframe: 'daily' | 'weekly' | 'monthly' = 'daily'): Promise<CouponAnalyticsData> {
    const res = await adminApiClient.get<CouponAnalyticsData>('/admin/coupons/analytics', {
      params: { timeframe },
    });
    return res.data || { topCoupons: [], timeline: [] };
  }

  /**
   * Create new coupon
   */
  public async createCoupon(data: any): Promise<AdminApiResponse<AdminCouponItem>> {
    return adminApiClient.post<AdminCouponItem>('/admin/coupons', data);
  }

  /**
   * Update existing coupon
   */
  public async updateCoupon(id: string, data: any): Promise<AdminApiResponse<AdminCouponItem>> {
    return adminApiClient.patch<AdminCouponItem>(`/admin/coupons/${encodeURIComponent(id)}`, data);
  }

  /**
   * Delete coupon
   */
  public async deleteCoupon(id: string): Promise<AdminApiResponse<{ success: boolean; message: string }>> {
    return adminApiClient.delete(`/admin/coupons/${encodeURIComponent(id)}`);
  }

  /**
   * Export all coupons & usage data
   */
  public async exportData(): Promise<{ coupons: AdminCouponItem[]; usages: any[] }> {
    const res = await adminApiClient.get<{ coupons: AdminCouponItem[]; usages: any[] }>('/admin/coupons/export');
    return res.data || { coupons: [], usages: [] };
  }
}

export const adminCouponService = new AdminCouponService();
