import { Request, Response } from 'express';
import { adminReportService } from '../services/adminReport.service.js';

export class AdminReportController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminReportService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch report KPIs' });
    }
  }

  async getLibrary(req: Request, res: Response) {
    try {
      const library = await adminReportService.getLibrary();
      res.status(200).json({ success: true, data: library });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch report library' });
    }
  }

  async getRevenueTrend(req: Request, res: Response) {
    try {
      const interval = (req.query.interval as string) || 'Daily';
      const data = await adminReportService.getRevenueTrend(interval);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch revenue trend' });
    }
  }

  async getBookingHeatmap(req: Request, res: Response) {
    try {
      const data = await adminReportService.getBookingHeatmap();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch booking heatmap' });
    }
  }

  async getGeographicData(req: Request, res: Response) {
    try {
      const data = await adminReportService.getGeographicData();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch geographic data' });
    }
  }

  async getTopDestinations(req: Request, res: Response) {
    try {
      const data = await adminReportService.getTopDestinations();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch top destinations' });
    }
  }

  async getAgencyMatrix(req: Request, res: Response) {
    try {
      const data = await adminReportService.getAgencyMatrix();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch agency matrix' });
    }
  }

  async getCategoryPerformance(req: Request, res: Response) {
    try {
      const data = await adminReportService.getCategoryPerformance();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch category performance' });
    }
  }

  async getAIInsights(req: Request, res: Response) {
    try {
      const data = await adminReportService.getAIInsights();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch AI insights' });
    }
  }

  async getQuickStats(req: Request, res: Response) {
    try {
      const data = await adminReportService.getQuickStats();
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch quick stats' });
    }
  }
}

export const adminReportController = new AdminReportController();
