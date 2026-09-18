import { Request, Response } from 'express';
import { adminFinanceService } from '../services/adminFinance.service.js';

export class AdminFinanceController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminFinanceService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve finance stats' });
    }
  }

  async getRevenueOverview(req: Request, res: Response): Promise<void> {
    try {
      const range = (req.query.range as string) || '30d';
      const chartPoints = await adminFinanceService.getRevenueOverview(range);
      res.status(200).json({ success: true, data: chartPoints });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve revenue chart' });
    }
  }

  async getCommissionBreakdown(req: Request, res: Response): Promise<void> {
    try {
      const breakdown = await adminFinanceService.getCommissionBreakdown();
      res.status(200).json({ success: true, data: breakdown });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve commission breakdown' });
    }
  }

  async getTopAgencies(req: Request, res: Response): Promise<void> {
    try {
      const agencies = await adminFinanceService.getTopAgencies();
      res.status(200).json({ success: true, data: agencies });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve top agencies' });
    }
  }

  async getSettlements(req: Request, res: Response): Promise<void> {
    try {
      const settlements = await adminFinanceService.getSettlements();
      res.status(200).json({ success: true, data: settlements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve settlements' });
    }
  }

  async processSettlement(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await adminFinanceService.processSettlement(id, (req as any).admin);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to process settlement' });
    }
  }
}

export const adminFinanceController = new AdminFinanceController();
