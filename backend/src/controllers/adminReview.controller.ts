import { Request, Response } from 'express';
import { adminReviewService } from '../services/adminReview.service.js';

export class AdminReviewController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminReviewService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch review KPIs' });
    }
  }

  async getReviews(req: Request, res: Response) {
    try {
      const { page, limit, search, rating, status, sentiment, agency } = req.query;
      const result = await adminReviewService.getReviews({
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
        search: search as string,
        rating: rating as string,
        status: status as string,
        sentiment: sentiment as string,
        agency: agency as string,
      });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch reviews' });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { status } = req.body;
      const admin = (req as any).user;
      const result = await adminReviewService.updateStatus(id, status, admin);
      res.status(200).json({ success: true, data: result, message: 'Review status updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update review status' });
    }
  }

  async deleteReview(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminReviewService.deleteReview(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Review removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete review' });
    }
  }
}

export const adminReviewController = new AdminReviewController();
