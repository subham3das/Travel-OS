import { Request, Response } from 'express';
import { AgencyAnalyticsService } from '../services/agencyAnalytics.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyAnalyticsController {
  static async getAnalytics(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const range = String(req.query.range || '7D');
      const data = await AgencyAnalyticsService.getAgencyAnalytics(agencyId.toString(), range);
      return ResponseUtil.success(res, data, 'Analytics data fetched successfully');
    } catch (error: any) {
      console.error('[AgencyAnalyticsController.getAnalytics] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch analytics', 500);
    }
  }
}
