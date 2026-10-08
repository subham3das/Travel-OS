import { Request, Response } from 'express';
import { adminSettingsService } from '../services/adminSettings.service.js';
import { commissionService } from '../services/commission.service.js';

export class AdminSettingsController {
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminSettingsService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch settings KPIs' });
    }
  }

  async getGeneralSettings(req: Request, res: Response) {
    try {
      const settings = await adminSettingsService.getGeneralSettings();
      res.status(200).json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch settings' });
    }
  }

  async updateGeneralSettings(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const settings = await adminSettingsService.updateGeneralSettings(req.body, admin);
      res.status(200).json({ success: true, data: settings, message: 'Settings updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update settings' });
    }
  }

  async getFeatureFlags(req: Request, res: Response) {
    try {
      const flags = await adminSettingsService.getFeatureFlags();
      res.status(200).json({ success: true, data: flags });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch feature flags' });
    }
  }

  async toggleFeatureFlag(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { enabled } = req.body;
      const admin = (req as any).user;
      const result = await adminSettingsService.toggleFeatureFlag(id, enabled, admin);
      res.status(200).json({ success: true, data: result, message: 'Feature flag updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to toggle feature flag' });
    }
  }

  async getCommissionSettings(req: Request, res: Response) {
    try {
      const commission = await commissionService.getCommissionSettings();
      res.status(200).json({ success: true, data: commission });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch commission settings' });
    }
  }

  async updateCommissionSettings(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const updated = await commissionService.updateCommissionSettings(req.body, admin);
      res.status(200).json({ success: true, data: updated, message: 'Platform commission settings updated successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update commission settings' });
    }
  }
}

export const adminSettingsController = new AdminSettingsController();
