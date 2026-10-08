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

  async getRatingDistribution(req: Request, res: Response) {
    try {
      const distribution = await adminReviewService.getRatingDistribution();
      res.status(200).json({ success: true, data: distribution });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch rating distribution' });
    }
  }

  async getReviewTrends(req: Request, res: Response) {
    try {
      const interval = (req.query.interval as 'Daily' | 'Weekly' | 'Monthly') || 'Daily';
      const trends = await adminReviewService.getReviewTrends(interval);
      res.status(200).json({ success: true, data: trends });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch review trends' });
    }
  }

  async getSentimentBreakdown(req: Request, res: Response) {
    try {
      const breakdown = await adminReviewService.getSentimentBreakdown();
      res.status(200).json({ success: true, data: breakdown });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch sentiment breakdown' });
    }
  }

  async getRecentModeration(req: Request, res: Response) {
    try {
      const moderation = await adminReviewService.getRecentModeration();
      res.status(200).json({ success: true, data: moderation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch moderation events' });
    }
  }

  async getReportedAgencies(req: Request, res: Response) {
    try {
      const agencies = await adminReviewService.getReportedAgencies();
      res.status(200).json({ success: true, data: agencies });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch reported agencies' });
    }
  }

  async getReportedTravelers(req: Request, res: Response) {
    try {
      const travelers = await adminReviewService.getReportedTravelers();
      res.status(200).json({ success: true, data: travelers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch reported travelers' });
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
