import { Request, Response } from 'express';
import { adminDepartureService } from '../services/adminDeparture.service.js';

export class AdminDepartureController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminDepartureService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve departure stats' });
    }
  }

  async getDepartures(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminDepartureService.getDepartures(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve departures' });
    }
  }

  async getDepartureById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await adminDepartureService.getDepartureById(id);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ success: false, message: error.message || 'Failed to retrieve departure' });
    }
  }
}

export const adminDepartureController = new AdminDepartureController();
