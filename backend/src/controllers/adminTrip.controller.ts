import { Request, Response } from 'express';
import { adminTripService } from '../services/adminTrip.service.js';

export class AdminTripController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminTripService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve trip stats' });
    }
  }

  async getTrips(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminTripService.getTrips(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve operational trips' });
    }
  }

  async updateTripStatus(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { status, notes } = req.body;
      const result = await adminTripService.updateTripStatus(id, status, notes, (req as any).admin);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update trip status' });
    }
  }

  async broadcastAlert(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { message } = req.body;
      const result = await adminTripService.broadcastAlert(id, message, (req as any).admin);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to broadcast trip alert' });
    }
  }
}

export const adminTripController = new AdminTripController();
