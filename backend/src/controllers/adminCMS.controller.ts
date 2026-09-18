import { Request, Response } from 'express';
import { adminCMSService } from '../services/adminCMS.service.js';

export class AdminCMSController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminCMSService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch CMS KPIs' });
    }
  }

  async getHeroBanners(req: Request, res: Response) {
    try {
      const banners = await adminCMSService.getHeroBanners();
      res.status(200).json({ success: true, data: banners });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch hero banners' });
    }
  }

  async createHeroBanner(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const banner = await adminCMSService.createHeroBanner(req.body, admin);
      res.status(201).json({ success: true, data: banner, message: 'Hero banner created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create hero banner' });
    }
  }

  async deleteHeroBanner(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deleteHeroBanner(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Hero banner deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete hero banner' });
    }
  }

  async getAnnouncements(req: Request, res: Response) {
    try {
      const announcements = await adminCMSService.getAnnouncements();
      res.status(200).json({ success: true, data: announcements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch announcements' });
    }
  }

  async createAnnouncement(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const announcement = await adminCMSService.createAnnouncement(req.body, admin);
      res.status(201).json({ success: true, data: announcement, message: 'Announcement created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create announcement' });
    }
  }
}

export const adminCMSController = new AdminCMSController();
