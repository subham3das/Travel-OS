import { Request, Response } from 'express';
import { adminPackageService } from '../services/adminPackage.service.js';

export class AdminPackageController {
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await adminPackageService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve package stats' });
    }
  }

  async getPackages(req: Request, res: Response): Promise<void> {
    try {
      const result = await adminPackageService.getPackages(req.query as any);
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve packages' });
    }
  }

  async getPackageById(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const pkg = await adminPackageService.getPackageById(id);
      if (!pkg) {
        res.status(404).json({ success: false, message: 'Package not found' });
        return;
      }
      res.status(200).json({ success: true, data: pkg });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to retrieve package' });
    }
  }

  async createPackage(req: Request, res: Response): Promise<void> {
    try {
      const pkg = await adminPackageService.createPackage(req.body, (req as any).admin);
      res.status(201).json({ success: true, data: pkg, message: 'Package created successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to create package' });
    }
  }

  async updatePackage(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const pkg = await adminPackageService.updatePackage(id, req.body, (req as any).admin);
      res.status(200).json({ success: true, data: pkg, message: 'Package updated successfully' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update package' });
    }
  }

  async updateApproval(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { approvalStatus, notes } = req.body;
      const pkg = await adminPackageService.updateApprovalStatus(id, approvalStatus, notes, (req as any).admin);
      res.status(200).json({ success: true, data: pkg, message: `Package ${approvalStatus.toLowerCase()} successfully` });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to update approval status' });
    }
  }

  async toggleFeatured(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { isFeatured } = req.body;
      const pkg = await adminPackageService.toggleFeatured(id, !!isFeatured, (req as any).admin);
      res.status(200).json({ success: true, data: pkg, message: 'Featured status updated' });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to toggle featured status' });
    }
  }

  async deletePackage(req: Request, res: Response): Promise<void> {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const result = await adminPackageService.deletePackage(id, (req as any).admin);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to delete package' });
    }
  }

  async bulkAction(req: Request, res: Response): Promise<void> {
    try {
      const { packageIds, action } = req.body;
      const result = await adminPackageService.bulkAction(packageIds, action, (req as any).admin);
      res.status(200).json({ success: true, data: result, message: `Bulk action "${action}" completed successfully` });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to execute bulk action' });
    }
  }
}

export const adminPackageController = new AdminPackageController();
