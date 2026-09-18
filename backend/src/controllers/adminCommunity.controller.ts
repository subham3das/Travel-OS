import { Request, Response } from 'express';
import { adminCommunityService } from '../services/adminCommunity.service.js';

export class AdminCommunityController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminCommunityService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch community KPIs' });
    }
  }

  async getActivityTimeline(req: Request, res: Response) {
    try {
      const interval = (req.query.interval as 'Daily' | 'Weekly' | 'Monthly') || 'Daily';
      const timeline = await adminCommunityService.getActivityTimeline(interval);
      res.status(200).json({ success: true, data: timeline });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch activity timeline' });
    }
  }

  async getModerationQueue(req: Request, res: Response) {
    try {
      const { typeFilter, statusFilter } = req.query;
      const queue = await adminCommunityService.getModerationQueue({
        typeFilter: typeFilter as string,
        statusFilter: statusFilter as string,
      });
      res.status(200).json({ success: true, data: queue });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch moderation queue' });
    }
  }

  async getRecentFeed(req: Request, res: Response) {
    try {
      const { search } = req.query;
      const feed = await adminCommunityService.getRecentFeed(search as string);
      res.status(200).json({ success: true, data: feed });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch community feed' });
    }
  }

  async approvePost(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCommunityService.approvePost(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Post approved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to approve post' });
    }
  }

  async rejectPost(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCommunityService.rejectPost(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Post rejected' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to reject post' });
    }
  }

  async removePost(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCommunityService.removePost(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Post removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to remove post' });
    }
  }

  async createAnnouncement(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const announcement = await adminCommunityService.createAnnouncement(req.body, admin);
      res.status(201).json({ success: true, data: announcement, message: 'Announcement created successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create announcement' });
    }
  }
}

export const adminCommunityController = new AdminCommunityController();
