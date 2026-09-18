import { Request, Response } from 'express';
import { AgencyReviewService } from '../services/agencyReview.service.js';
import { ResponseUtil } from '../utils/response.util.js';

export class AgencyReviewController {
  static async getReviews(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyReviewService.getAgencyReviews(agencyId.toString(), req.query as any);
      return ResponseUtil.success(res, result, 'Reviews fetched successfully');
    } catch (error: any) {
      console.error('[AgencyReviewController.getReviews] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch reviews', 500);
    }
  }

  static async getReviewStats(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const stats = await AgencyReviewService.getReviewStats(agencyId.toString());
      return ResponseUtil.success(res, stats, 'Review statistics fetched successfully');
    } catch (error: any) {
      console.error('[AgencyReviewController.getReviewStats] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to fetch review stats', 500);
    }
  }

  static async replyToReview(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const updated = await AgencyReviewService.replyToReview(
        agencyId.toString(),
        String(req.params.id),
        req.body.replyText,
        req.body.authorName || 'Agency Operations'
      );
      return ResponseUtil.success(res, updated, 'Reply posted successfully');
    } catch (error: any) {
      console.error('[AgencyReviewController.replyToReview] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to post reply', 500);
    }
  }

  static async flagReview(req: Request, res: Response) {
    try {
      const agencyId = (req as any).agency?._id || (req as any).user?.agencyId;
      if (!agencyId) return ResponseUtil.error(res, 'Agency context missing', 401);

      const result = await AgencyReviewService.flagReview(agencyId.toString(), String(req.params.id), req.body.reason || 'Flagged by agency');
      return ResponseUtil.success(res, result, 'Review flagged successfully');
    } catch (error: any) {
      console.error('[AgencyReviewController.flagReview] Error:', error);
      return ResponseUtil.error(res, error.message || 'Failed to flag review', 500);
    }
  }
}
