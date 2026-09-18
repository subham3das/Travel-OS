import { Request, Response } from 'express';
import { adminGlobalSearchService } from '../services/adminGlobalSearch.service.js';

export class AdminGlobalSearchController {
  async search(req: Request, res: Response) {
    try {
      const q = (req.query.q as string) || '';
      const results = await adminGlobalSearchService.search(q);
      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Global search failed' });
    }
  }
}

export const adminGlobalSearchController = new AdminGlobalSearchController();
