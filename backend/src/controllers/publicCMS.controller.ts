import { Request, Response } from 'express';
import { publicCMSService } from '../services/publicCMS.service.js';

export class PublicCMSController {
  async getHomeCMS(req: Request, res: Response) {
    try {
      const data = await publicCMSService.getHomeCMSData();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch storefront CMS content' });
    }
  }

  async getSEO(req: Request, res: Response) {
    try {
      const pageKey = (req.params.pageKey || 'home') as any;
      const seo = await publicCMSService.getSEO(pageKey);
      res.status(200).json({ success: true, data: seo });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch SEO settings' });
    }
  }
}

export const publicCMSController = new PublicCMSController();
