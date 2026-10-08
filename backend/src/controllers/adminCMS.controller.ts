import { Request, Response } from 'express';
import { adminCMSService } from '../services/adminCMS.service.js';

export class AdminCMSController {
  // KPI Stats
  async getKPIStats(req: Request, res: Response) {
    try {
      const stats = await adminCMSService.getKPIStats();
      res.status(200).json({ success: true, data: stats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch CMS KPIs' });
    }
  }

  // Hero Banners
  async getHeroBanners(req: Request, res: Response) {
    try {
      const banners = await adminCMSService.getHeroBanners();
      res.status(200).json({ success: true, data: banners });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch hero banners' });
    }
  }

  async createHeroBanner(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const banner = await adminCMSService.createHeroBanner(req.body, admin);
      res.status(201).json({ success: true, data: banner, message: 'Hero banner created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create hero banner' });
    }
  }

  async updateHeroBanner(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const banner = await adminCMSService.updateHeroBanner(id, req.body, admin);
      res.status(200).json({ success: true, data: banner, message: 'Hero banner updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update hero banner' });
    }
  }

  async toggleHeroBanner(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const { isEnabled } = req.body;
      const banner = await adminCMSService.toggleHeroBanner(id, isEnabled, admin);
      res.status(200).json({ success: true, data: banner, message: `Hero banner ${isEnabled ? 'enabled' : 'disabled'}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to toggle hero banner' });
    }
  }

  async restoreHeroBannerVersion(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const { version } = req.body;
      const banner = await adminCMSService.restoreHeroBannerVersion(id, Number(version), admin);
      res.status(200).json({ success: true, data: banner, message: `Restored to version ${version}` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to restore hero banner' });
    }
  }

  async deleteHeroBanner(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deleteHeroBanner(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Hero banner deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete hero banner' });
    }
  }

  // Announcements
  async getAnnouncements(req: Request, res: Response) {
    try {
      const announcements = await adminCMSService.getAnnouncements();
      res.status(200).json({ success: true, data: announcements });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch announcements' });
    }
  }

  async createAnnouncement(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const announcement = await adminCMSService.createAnnouncement(req.body, admin);
      res.status(201).json({ success: true, data: announcement, message: 'Announcement created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create announcement' });
    }
  }

  async updateAnnouncement(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const announcement = await adminCMSService.updateAnnouncement(id, req.body, admin);
      res.status(200).json({ success: true, data: announcement, message: 'Announcement updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update announcement' });
    }
  }

  async deleteAnnouncement(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deleteAnnouncement(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Announcement deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete announcement' });
    }
  }

  // Featured Agencies
  async getFeaturedAgencies(req: Request, res: Response) {
    try {
      const agencies = await adminCMSService.getFeaturedAgencies();
      res.status(200).json({ success: true, data: agencies });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch featured agencies' });
    }
  }

  async featureAgency(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const result = await adminCMSService.featureAgency(req.body, admin);
      res.status(201).json({ success: true, data: result, message: 'Agency featured successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to feature agency' });
    }
  }

  async updateFeaturedAgency(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.updateFeaturedAgency(id, req.body, admin);
      res.status(200).json({ success: true, data: result, message: 'Featured agency updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update featured agency' });
    }
  }

  async unfeatureAgency(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.unfeatureAgency(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Agency unfeatured' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to unfeature agency' });
    }
  }

  // Featured Trips
  async getFeaturedTrips(req: Request, res: Response) {
    try {
      const trips = await adminCMSService.getFeaturedTrips();
      res.status(200).json({ success: true, data: trips });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch featured trips' });
    }
  }

  async featureTrip(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const result = await adminCMSService.featureTrip(req.body, admin);
      res.status(201).json({ success: true, data: result, message: 'Package featured successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to feature package' });
    }
  }

  async updateFeaturedTrip(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.updateFeaturedTrip(id, req.body, admin);
      res.status(200).json({ success: true, data: result, message: 'Featured package updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update featured package' });
    }
  }

  async unfeatureTrip(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.unfeatureTrip(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Package unfeatured' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to unfeature package' });
    }
  }

  // Trending Destinations
  async getTrendingDestinations(req: Request, res: Response) {
    try {
      const dests = await adminCMSService.getTrendingDestinations();
      res.status(200).json({ success: true, data: dests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch trending destinations' });
    }
  }

  async createTrendingDestination(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const result = await adminCMSService.createTrendingDestination(req.body, admin);
      res.status(201).json({ success: true, data: result, message: 'Trending destination created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create trending destination' });
    }
  }

  async updateTrendingDestination(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.updateTrendingDestination(id, req.body, admin);
      res.status(200).json({ success: true, data: result, message: 'Trending destination updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update trending destination' });
    }
  }

  async deleteTrendingDestination(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deleteTrendingDestination(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Trending destination deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete trending destination' });
    }
  }

  async getDestinationSuggestions(req: Request, res: Response) {
    try {
      const suggestions = await adminCMSService.getDestinationSuggestions();
      res.status(200).json({ success: true, data: suggestions });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch destination suggestions' });
    }
  }

  // Campaigns
  async getCampaigns(req: Request, res: Response) {
    try {
      const campaigns = await adminCMSService.getCampaigns();
      res.status(200).json({ success: true, data: campaigns });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch campaigns' });
    }
  }

  async createCampaign(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const result = await adminCMSService.createCampaign(req.body, admin);
      res.status(201).json({ success: true, data: result, message: 'Campaign created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create campaign' });
    }
  }

  async updateCampaign(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.updateCampaign(id, req.body, admin);
      res.status(200).json({ success: true, data: result, message: 'Campaign updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update campaign' });
    }
  }

  async deleteCampaign(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deleteCampaign(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Campaign deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete campaign' });
    }
  }

  // Popups
  async getPopups(req: Request, res: Response) {
    try {
      const popups = await adminCMSService.getPopups();
      res.status(200).json({ success: true, data: popups });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch popups' });
    }
  }

  async createPopup(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const result = await adminCMSService.createPopup(req.body, admin);
      res.status(201).json({ success: true, data: result, message: 'Popup created' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to create popup' });
    }
  }

  async updatePopup(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.updatePopup(id, req.body, admin);
      res.status(200).json({ success: true, data: result, message: 'Popup updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to update popup' });
    }
  }

  async deletePopup(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const admin = (req as any).user;
      const result = await adminCMSService.deletePopup(id, admin);
      res.status(200).json({ success: true, data: result, message: 'Popup deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to delete popup' });
    }
  }

  // SEO
  async getSEO(req: Request, res: Response) {
    try {
      const pageKey = (req.params.pageKey || req.query.pageKey || 'home') as any;
      const seo = await adminCMSService.getSEO(pageKey);
      res.status(200).json({ success: true, data: seo });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch SEO' });
    }
  }

  async getAllSEO(req: Request, res: Response) {
    try {
      const list = await adminCMSService.getAllSEO();
      res.status(200).json({ success: true, data: list });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch SEO list' });
    }
  }

  async saveSEO(req: Request, res: Response) {
    try {
      const pageKey = (req.params.pageKey || req.body.pageKey || 'home') as any;
      const admin = (req as any).user;
      const seo = await adminCMSService.saveSEO(pageKey, req.body, admin);
      res.status(200).json({ success: true, data: seo, message: 'SEO settings saved' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to save SEO' });
    }
  }

  // Search Autocomplete
  async searchDatabase(req: Request, res: Response) {
    try {
      const query = (req.query.q as string) || '';
      const results = await adminCMSService.searchDatabase(query);
      res.status(200).json({ success: true, data: results });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Search failed' });
    }
  }

  // Audit Logs & Scheduled Content
  async getAuditLogs(req: Request, res: Response) {
    try {
      const logs = await adminCMSService.getCMSAuditLogs();
      res.status(200).json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch audit logs' });
    }
  }

  async getScheduledItems(req: Request, res: Response) {
    try {
      const items = await adminCMSService.getScheduledItems();
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch scheduled items' });
    }
  }

  // Media Library
  async getMediaLibrary(req: Request, res: Response) {
    try {
      const items = await adminCMSService.getMediaLibrary();
      res.status(200).json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to fetch media library' });
    }
  }

  async addMediaLibraryItem(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const item = await adminCMSService.addMediaLibraryItem(req.body, admin);
      res.status(201).json({ success: true, data: item, message: 'Asset added to media library' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to save media item' });
    }
  }

  // ─── CMS SELECTORS (BROWSE & SEARCH APIS) ───
  async selectPackages(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = (req.query.q || req.query.search || '') as string;
      const status = (req.query.status || '') as string;
      const category = (req.query.category || '') as string;
      const sortBy = (req.query.sortBy || req.query.sort || 'newest') as string;
      const result = await adminCMSService.selectPackages({ page, limit, search, status, category, sortBy });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to select packages' });
    }
  }

  async selectAgencies(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = (req.query.q || req.query.search || '') as string;
      const status = (req.query.status || '') as string;
      const sortBy = (req.query.sortBy || req.query.sort || 'newest') as string;
      const result = await adminCMSService.selectAgencies({ page, limit, search, status, sortBy });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to select agencies' });
    }
  }

  async selectDestinations(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = (req.query.q || req.query.search || '') as string;
      const sortBy = (req.query.sortBy || req.query.sort || 'most_booked') as string;
      const result = await adminCMSService.selectDestinations({ page, limit, search, sortBy });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to select destinations' });
    }
  }

  async selectTrips(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = (req.query.q || req.query.search || '') as string;
      const status = (req.query.status || '') as string;
      const sortBy = (req.query.sortBy || req.query.sort || 'newest') as string;
      const result = await adminCMSService.selectTrips({ page, limit, search, status, sortBy });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to select trips' });
    }
  }

  async selectVehicles(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const search = (req.query.q || req.query.search || '') as string;
      const type = (req.query.type || '') as string;
      const city = (req.query.city || '') as string;
      const sortBy = (req.query.sortBy || req.query.sort || 'newest') as string;
      const result = await adminCMSService.selectVehicles({ page, limit, search, type, city, sortBy });
      res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to select vehicles' });
    }
  }

  // ─── BULK CMS OPERATIONS ───
  async bulkFeatureTrips(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const packageIds = req.body.packageIds || (req.body.packageId ? [req.body.packageId] : []);
      const priority = req.body.priority || 1;
      const customBadge = req.body.customBadge || 'Featured Deal';
      const results = await adminCMSService.bulkFeatureTrips(packageIds, priority, customBadge, admin);
      res.status(200).json({
        success: true,
        data: results,
        message: `${results.length} package(s) featured successfully`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to bulk feature packages' });
    }
  }

  async bulkFeatureAgencies(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const agencyIds = req.body.agencyIds || (req.body.agencyId ? [req.body.agencyId] : []);
      const priority = req.body.priority || 1;
      const featuredBadge = req.body.featuredBadge || 'Top Rated Partner';
      const results = await adminCMSService.bulkFeatureAgencies(agencyIds, priority, featuredBadge, admin);
      res.status(200).json({
        success: true,
        data: results,
        message: `${results.length} agency(ies) featured successfully`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to bulk feature agencies' });
    }
  }

  async bulkCreateTrendingDestinations(req: Request, res: Response) {
    try {
      const admin = (req as any).user;
      const destinations = req.body.destinations || req.body.items || (req.body.name ? [req.body] : []);
      const results = await adminCMSService.bulkCreateTrendingDestinations(destinations, admin);
      res.status(200).json({
        success: true,
        data: results,
        message: `${results.length} destination(s) featured successfully`,
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message || 'Failed to bulk feature destinations' });
    }
  }
}

export const adminCMSController = new AdminCMSController();
