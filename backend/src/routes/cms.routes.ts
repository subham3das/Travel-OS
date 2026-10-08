import { Router } from 'express';
import { publicCMSController } from '../controllers/publicCMS.controller.js';
import { adminCMSController } from '../controllers/adminCMS.controller.js';
import { optionalAdminAuth, authenticateAdmin, requireSuperAdmin } from '../middlewares/adminAuth.middleware.js';

const router = Router();

// ─── PUBLIC STOREFRONT CMS APIS ───
router.get('/home', publicCMSController.getHomeCMS);

// ─── CMS GENERAL & GOVERNANCE APIS ───
router.get('/stats', optionalAdminAuth, adminCMSController.getKPIStats);
router.get('/search', optionalAdminAuth, adminCMSController.searchDatabase);
router.get('/audit-logs', optionalAdminAuth, adminCMSController.getAuditLogs);
router.get('/scheduled', optionalAdminAuth, adminCMSController.getScheduledItems);
router.get('/media', optionalAdminAuth, adminCMSController.getMediaLibrary);
router.post('/media', authenticateAdmin, adminCMSController.addMediaLibraryItem);

// ─── SEO MANAGEMENT ───
router.get('/seo/all', optionalAdminAuth, adminCMSController.getAllSEO);
router.get('/seo/:pageKey', publicCMSController.getSEO);
router.put('/seo/:pageKey', authenticateAdmin, adminCMSController.saveSEO);

// ─── HERO BANNERS ───
router.get('/hero-banners', optionalAdminAuth, adminCMSController.getHeroBanners);
router.post('/hero-banners', authenticateAdmin, adminCMSController.createHeroBanner);
router.patch('/hero-banners/:id', authenticateAdmin, adminCMSController.updateHeroBanner);
router.patch('/hero-banners/:id/toggle', authenticateAdmin, adminCMSController.toggleHeroBanner);
router.post('/hero-banners/:id/restore', authenticateAdmin, adminCMSController.restoreHeroBannerVersion);
router.delete('/hero-banners/:id', authenticateAdmin, adminCMSController.deleteHeroBanner);

// ─── ANNOUNCEMENTS ───
router.get('/announcements', optionalAdminAuth, adminCMSController.getAnnouncements);
router.post('/announcements', authenticateAdmin, adminCMSController.createAnnouncement);
router.patch('/announcements/:id', authenticateAdmin, adminCMSController.updateAnnouncement);
router.delete('/announcements/:id', authenticateAdmin, adminCMSController.deleteAnnouncement);

// ─── FEATURED AGENCIES ───
router.get('/featured-agencies', optionalAdminAuth, adminCMSController.getFeaturedAgencies);
router.post('/featured-agencies', authenticateAdmin, adminCMSController.featureAgency);
router.patch('/featured-agencies/:id', authenticateAdmin, adminCMSController.updateFeaturedAgency);
router.delete('/featured-agencies/:id', authenticateAdmin, adminCMSController.unfeatureAgency);

// ─── FEATURED TRIPS ───
router.get('/featured-trips', optionalAdminAuth, adminCMSController.getFeaturedTrips);
router.post('/featured-trips', authenticateAdmin, adminCMSController.featureTrip);
router.patch('/featured-trips/:id', authenticateAdmin, adminCMSController.updateFeaturedTrip);
router.delete('/featured-trips/:id', authenticateAdmin, adminCMSController.unfeatureTrip);

// ─── TRENDING DESTINATIONS ───
router.get('/trending-destinations', optionalAdminAuth, adminCMSController.getTrendingDestinations);
router.get('/trending-destinations/suggestions', optionalAdminAuth, adminCMSController.getDestinationSuggestions);
router.post('/trending-destinations', authenticateAdmin, adminCMSController.createTrendingDestination);
router.patch('/trending-destinations/:id', authenticateAdmin, adminCMSController.updateTrendingDestination);
router.delete('/trending-destinations/:id', authenticateAdmin, adminCMSController.deleteTrendingDestination);

// ─── CAMPAIGNS ───
router.get('/campaigns', optionalAdminAuth, adminCMSController.getCampaigns);
router.post('/campaigns', authenticateAdmin, adminCMSController.createCampaign);
router.patch('/campaigns/:id', authenticateAdmin, adminCMSController.updateCampaign);
router.delete('/campaigns/:id', authenticateAdmin, adminCMSController.deleteCampaign);

// ─── POPUPS ───
router.get('/popups', optionalAdminAuth, adminCMSController.getPopups);
router.post('/popups', authenticateAdmin, adminCMSController.createPopup);
router.patch('/popups/:id', authenticateAdmin, adminCMSController.updatePopup);
router.delete('/popups/:id', authenticateAdmin, adminCMSController.deletePopup);

// ─── UNIVERSAL CMS SELECTORS (BROWSE & SEARCH) ───
router.get('/select/packages', optionalAdminAuth, adminCMSController.selectPackages);
router.get('/select/agencies', optionalAdminAuth, adminCMSController.selectAgencies);
router.get('/select/destinations', optionalAdminAuth, adminCMSController.selectDestinations);
router.get('/select/trips', optionalAdminAuth, adminCMSController.selectTrips);
router.get('/select/vehicles', optionalAdminAuth, adminCMSController.selectVehicles);

// ─── BULK CMS FEATURING ───
router.post('/featured-trips/bulk', optionalAdminAuth, adminCMSController.bulkFeatureTrips);
router.post('/featured-agencies/bulk', optionalAdminAuth, adminCMSController.bulkFeatureAgencies);
router.post('/trending-destinations/bulk', optionalAdminAuth, adminCMSController.bulkCreateTrendingDestinations);

export default router;

