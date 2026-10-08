import { Request, Response } from 'express';
import { discoveryEngineService } from '../services/discoveryEngine.service.js';
import { homepageService } from '../services/homepage.service.js';
import { SectionConfigurationModel } from '../models/sectionConfiguration.model.js';
import { DiscoveryAnalyticsModel } from '../models/discoveryAnalytics.model.js';

export class DiscoveryController {
  /**
   * GET /api/explore or GET /api/discovery/explore
   */
  public async getExploreFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.query.userId as string);
      const category = (req.query.category as string) || 'all';
      const adventureType = (req.query.adventureType as string) || undefined;
      const search = (req.query.search as string) || (req.query.q as string);

      const feed = await discoveryEngineService.getExploreFeed({
        userId,
        category,
        adventureType,
        search,
      });

      res.status(200).json({
        success: true,
        data: feed,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to load explore discovery feed',
      });
    }
  }

  /**
   * GET /api/homepage or GET /api/discovery/homepage
   */
  public async getHomepageFeed(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.query.userId as string);
      const feed = await homepageService.getHomepageFeed(userId);

      res.status(200).json({
        success: true,
        data: feed,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to load homepage feed',
      });
    }
  }

  /**
   * GET /api/discovery/sections
   */
  public async getSections(req: Request, res: Response): Promise<void> {
    try {
      await discoveryEngineService.ensureDefaultSectionConfigs();
      const sections = await SectionConfigurationModel.find({ isEnabled: true })
        .sort({ order: 1 })
        .lean();

      res.status(200).json({
        success: true,
        data: { sections },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch discovery sections',
      });
    }
  }

  /**
   * GET /api/discovery/trending
   */
  public async getTrending(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const packages = await discoveryEngineService.getTrending(limit);
      res.status(200).json({ success: true, data: { packages } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/discovery/popular
   */
  public async getPopular(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const packages = await discoveryEngineService.getPopular(limit);
      res.status(200).json({ success: true, data: { packages } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/discovery/recommended
   */
  public async getRecommended(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req.query.userId as string);
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const packages = await discoveryEngineService.getRecommended(userId, limit);
      res.status(200).json({ success: true, data: { packages } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/discovery/agencies
   */
  public async getAgencies(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const agencies = await discoveryEngineService.getAgencies(limit);
      res.status(200).json({ success: true, data: { agencies } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/discovery/destinations
   */
  public async getDestinations(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 8;
      const destinations = await discoveryEngineService.getDestinations(limit);
      res.status(200).json({ success: true, data: { destinations } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * GET /api/discovery/car-rentals
   */
  public async getCarRentals(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 6;
      const cars = await discoveryEngineService.getCarRentals(limit);
      res.status(200).json({ success: true, data: { cars } });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  /**
   * POST /api/discovery/track
   */
  public async trackAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const { sectionId, entityType, entityId, eventType } = req.body;
      const userId = (req as any).user?.userId;

      if (!sectionId || !eventType) {
        res.status(400).json({ success: false, message: 'sectionId and eventType are required' });
        return;
      }

      await DiscoveryAnalyticsModel.create({
        sectionId,
        entityType: entityType || 'section',
        entityId,
        eventType,
        userId,
      });

      // Increment counters in SectionConfiguration
      if (eventType === 'impression') {
        await SectionConfigurationModel.updateOne({ sectionId }, { $inc: { impressions: 1 } });
      } else if (eventType === 'click') {
        await SectionConfigurationModel.updateOne({ sectionId }, { $inc: { clicks: 1 } });
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const discoveryController = new DiscoveryController();
