import { Request, Response } from 'express';
import { cmsOverrideService } from '../services/cmsOverride.service.js';
import { SectionConfigurationModel } from '../models/sectionConfiguration.model.js';
import { discoveryEngineService } from '../services/discoveryEngine.service.js';

export class AdminDiscoveryController {
  /**
   * GET /api/admin/discovery/overrides
   */
  public async getOverrides(req: Request, res: Response): Promise<void> {
    try {
      const targetType = req.query.targetType as string;
      const overrides = await cmsOverrideService.getAllOverrides(targetType);
      res.status(200).json({ success: true, data: { overrides } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/admin/discovery/override
   */
  public async createOrUpdateOverride(req: Request, res: Response): Promise<void> {
    try {
      const {
        targetType,
        targetId,
        sectionId,
        overrideBadge,
        priority,
        isActive,
        startDate,
        endDate,
        notes,
      } = req.body;

      if (!targetType || !targetId) {
        res.status(400).json({
          success: false,
          message: 'targetType (PACKAGE/AGENCY) and targetId are required',
        });
        return;
      }

      const adminName = (req as any).admin?.name || 'Super Admin';

      const result = await cmsOverrideService.setOverride({
        targetType,
        targetId,
        sectionId: sectionId || 'all',
        overrideBadge,
        priority: priority !== undefined ? Number(priority) : 100,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        startDate,
        endDate,
        notes,
        createdAdmin: adminName,
      });

      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * DELETE /api/admin/discovery/override/:id
   */
  public async deleteOverride(req: Request, res: Response): Promise<void> {
    try {
      const overrideId = String(req.params.id || '');
      await cmsOverrideService.deleteOverride(overrideId);
      res.status(200).json({ success: true, message: 'Override removed. Item returned to auto ranking.' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/admin/discovery/sections
   */
  public async getSections(req: Request, res: Response): Promise<void> {
    try {
      await discoveryEngineService.ensureDefaultSectionConfigs();
      const sections = await SectionConfigurationModel.find()
        .sort({ order: 1 })
        .lean();

      res.status(200).json({ success: true, data: { sections } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * PUT /api/admin/discovery/sections/:sectionId
   */
  public async updateSection(req: Request, res: Response): Promise<void> {
    try {
      const sectionId = req.params.sectionId;
      const {
        title,
        subtitle,
        emoji,
        isEnabled,
        showOnHome,
        showOnExplore,
        order,
        minItems,
        maxItems,
        rankingRule,
        categoryFilter,
      } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (subtitle !== undefined) updateData.subtitle = subtitle;
      if (emoji !== undefined) updateData.emoji = emoji;
      if (isEnabled !== undefined) updateData.isEnabled = Boolean(isEnabled);
      if (showOnHome !== undefined) updateData.showOnHome = Boolean(showOnHome);
      if (showOnExplore !== undefined) updateData.showOnExplore = Boolean(showOnExplore);
      if (order !== undefined) updateData.order = Number(order);
      if (minItems !== undefined) updateData.minItems = Number(minItems);
      if (maxItems !== undefined) updateData.maxItems = Number(maxItems);
      if (rankingRule !== undefined) updateData.rankingRule = rankingRule;
      if (categoryFilter !== undefined) updateData.categoryFilter = categoryFilter;

      const updated = await SectionConfigurationModel.findOneAndUpdate(
        { sectionId },
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * PATCH /api/admin/discovery/sections/:sectionId/toggle
   */
  public async toggleSection(req: Request, res: Response): Promise<void> {
    try {
      const sectionId = req.params.sectionId;
      const existing = await SectionConfigurationModel.findOne({ sectionId });
      if (!existing) {
        res.status(404).json({ success: false, message: 'Section not found' });
        return;
      }

      existing.isEnabled = !existing.isEnabled;
      await existing.save();

      res.status(200).json({ success: true, data: existing });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/admin/discovery/sections/seed-default
   */
  public async seedDefaultSections(req: Request, res: Response): Promise<void> {
    try {
      await SectionConfigurationModel.deleteMany({});
      await discoveryEngineService.ensureDefaultSectionConfigs();
      const sections = await SectionConfigurationModel.find().sort({ order: 1 });
      res.status(200).json({ success: true, data: { sections } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const adminDiscoveryController = new AdminDiscoveryController();
