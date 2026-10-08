import mongoose from 'mongoose';
import { CMSBannerModel, ICMSBanner } from '../models/cmsBanner.model.js';
import { CMSAnnouncementModel, ICMSAnnouncement } from '../models/cmsAnnouncement.model.js';
import {
  CMSFeaturedAgencyModel,
  CMSFeaturedTripModel,
  CMSTrendingDestinationModel,
} from '../models/cmsFeature.model.js';
import { CMSCampaignModel, ICMSCampaign } from '../models/cmsCampaign.model.js';
import { CMSPopupModel, ICMSPopup } from '../models/cmsPopup.model.js';
import { CMSSEOModel, ICMSEO, CMSSEOPageKey } from '../models/cmsSEO.model.js';
import { CMSMediaItemModel } from '../models/cmsMedia.model.js';
import { AgencyModel } from '../models/agency.model.js';
import { PackageModel } from '../models/package.model.js';
import { CouponModel } from '../models/coupon.model.js';
import { TripModel } from '../models/trip.model.js';
import { CarModel } from '../models/car.model.js';
import { AuditLogModel } from '../models/auditLog.model.js';
import { AuditLoggerService } from './auditLogger.service.js';
import { socketService } from './socket.service.js';
import { logger } from '../config/logger.config.js';

export class AdminCMSService {
  /**
   * Helper to emit realtime update to all connected storefront clients & admin
   */
  private emitUpdate(contentType: string, action: string, data?: any) {
    try {
      const io = socketService.getIO();
      if (io) {
        io.emit('cms:content_updated', {
          type: contentType,
          action,
          data,
          timestamp: new Date().toISOString(),
        });
        logger.info(`📢 CMS real-time broadcast: cms:content_updated [${contentType}:${action}]`);
      }
    } catch (err: any) {
      logger.warn('Socket broadcast error: %s', err?.message);
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. REAL CMS KPI STATS
  // ═══════════════════════════════════════════════════════════════════════════
  async getKPIStats() {
    const [
      publishedBanners,
      liveAnnouncements,
      publishedCampaigns,
      publishedPopups,
      activeCoupons,
      trendingDestinations,
      featuredAgencies,
      featuredTrips,
    ] = await Promise.all([
      CMSBannerModel.countDocuments({ isDeleted: false, isEnabled: true, status: 'published' }),
      CMSAnnouncementModel.countDocuments({ isDeleted: false, isEnabled: true, status: 'published' }),
      CMSCampaignModel.countDocuments({ isDeleted: false, isActive: true, status: 'published' }),
      CMSPopupModel.countDocuments({ isDeleted: false, isActive: true, status: 'published' }),
      CouponModel.countDocuments({ isDeleted: false, isActive: true }),
      CMSTrendingDestinationModel.countDocuments({ isDeleted: false, isActive: true }),
      CMSFeaturedAgencyModel.countDocuments({ isDeleted: false, isActive: true }),
      CMSFeaturedTripModel.countDocuments({ isDeleted: false, isActive: true }),
    ]);

    const totalActiveShowcases = trendingDestinations + featuredAgencies + featuredTrips;

    return {
      publishedBanners: {
        value: publishedBanners,
        label: 'Active Banners',
        growth: '+100%',
        subtitle: `${publishedBanners} Live on Hero`,
      },
      liveAnnouncements: {
        value: liveAnnouncements,
        label: 'Live Broadcasts',
        growth: '0%',
        subtitle: `${liveAnnouncements} Active Notice`,
      },
      publishedCampaigns: {
        value: publishedCampaigns,
        label: 'Active Campaigns',
        growth: '+12%',
        subtitle: `${activeCoupons} Coupons Linked`,
      },
      publishedPopups: {
        value: publishedPopups,
        label: 'Active Popups',
        growth: '0%',
        subtitle: 'Storefront Modal',
      },
      activeCoupons: {
        value: activeCoupons,
        label: 'Coupons in System',
        growth: '+5%',
        subtitle: 'Promotional Codes',
      },
      totalShowcases: {
        value: totalActiveShowcases,
        label: 'Featured Showcases',
        growth: '+8%',
        subtitle: `${featuredAgencies} Ag, ${featuredTrips} Pkg, ${trendingDestinations} Dest`,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. HERO BANNERS (WITH INTERNAL ROUTING, VERSIONING, SCHEDULING)
  // ═══════════════════════════════════════════════════════════════════════════
  async getHeroBanners() {
    const banners = await CMSBannerModel.find({ isDeleted: false })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return banners.map((b: any) => ({
      id: b.bannerId || b._id.toString(),
      _id: b._id.toString(),
      bannerId: b.bannerId,
      title: b.title,
      subtitle: b.subtitle || '',
      desktopImage: b.desktopImage,
      mobileImage: b.mobileImage || b.desktopImage,
      targetType: b.targetType || 'Package',
      targetId: b.targetId || '',
      externalUrl: b.externalUrl || '',
      ctaText: b.ctaText || 'Explore Now',
      priority: b.priority || 1,
      startDate: b.startDate || '',
      endDate: b.endDate || '',
      status: b.status || 'published',
      isEnabled: b.isEnabled !== false,
      version: b.version || 1,
      versionHistory: b.versionHistory || [],
    }));
  }

  async createHeroBanner(payload: any, admin: any) {
    const bannerId = `ban-${Date.now().toString().slice(-6)}`;
    const banner = await CMSBannerModel.create({
      bannerId,
      title: payload.title,
      subtitle: payload.subtitle,
      desktopImage: payload.desktopImage,
      mobileImage: payload.mobileImage || payload.desktopImage,
      targetType: payload.targetType || 'Package',
      targetId: payload.targetId,
      externalUrl: payload.externalUrl,
      ctaText: payload.ctaText || 'Explore Now',
      priority: Number(payload.priority) || 1,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status || 'published',
      isEnabled: payload.isEnabled !== false,
      version: 1,
      versionHistory: [
        {
          version: 1,
          title: payload.title,
          subtitle: payload.subtitle,
          desktopImage: payload.desktopImage,
          mobileImage: payload.mobileImage,
          targetType: payload.targetType || 'Package',
          targetId: payload.targetId,
          externalUrl: payload.externalUrl,
          ctaText: payload.ctaText,
          savedBy: admin?.name || 'Super Admin',
          savedAt: new Date(),
        },
      ],
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'CREATE_HERO_BANNER',
      eventType: 'CREATE',
      description: `Created hero banner "${banner.title}" (Version 1)`,
      severity: 'Medium',
    });

    this.emitUpdate('banner', 'create', banner);
    return banner;
  }

  async updateHeroBanner(id: string, payload: any, admin: any) {
    const banner = await CMSBannerModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { bannerId: id }] : [{ bannerId: id }],
      isDeleted: false,
    });
    if (!banner) throw new Error('Hero banner not found');

    // Archive current state into versionHistory
    const currentVersionNum = banner.version || 1;
    const historyItem = {
      version: currentVersionNum,
      title: banner.title,
      subtitle: banner.subtitle,
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage,
      targetType: banner.targetType,
      targetId: banner.targetId,
      externalUrl: banner.externalUrl,
      ctaText: banner.ctaText,
      savedBy: admin?.name || 'Super Admin',
      savedAt: new Date(),
    };

    banner.versionHistory = banner.versionHistory || [];
    banner.versionHistory.unshift(historyItem);
    // Keep max 10 past versions
    if (banner.versionHistory.length > 10) {
      banner.versionHistory = banner.versionHistory.slice(0, 10);
    }

    banner.version = currentVersionNum + 1;
    if (payload.title !== undefined) banner.title = payload.title;
    if (payload.subtitle !== undefined) banner.subtitle = payload.subtitle;
    if (payload.desktopImage !== undefined) banner.desktopImage = payload.desktopImage;
    if (payload.mobileImage !== undefined) banner.mobileImage = payload.mobileImage;
    if (payload.targetType !== undefined) banner.targetType = payload.targetType;
    if (payload.targetId !== undefined) banner.targetId = payload.targetId;
    if (payload.externalUrl !== undefined) banner.externalUrl = payload.externalUrl;
    if (payload.ctaText !== undefined) banner.ctaText = payload.ctaText;
    if (payload.priority !== undefined) banner.priority = Number(payload.priority);
    if (payload.startDate !== undefined) banner.startDate = payload.startDate;
    if (payload.endDate !== undefined) banner.endDate = payload.endDate;
    if (payload.status !== undefined) banner.status = payload.status;
    if (payload.isEnabled !== undefined) banner.isEnabled = payload.isEnabled;

    await banner.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'UPDATE_HERO_BANNER',
      eventType: 'UPDATE',
      description: `Updated hero banner "${banner.title}" to version ${banner.version}`,
      severity: 'Low',
    });

    this.emitUpdate('banner', 'update', banner);
    return banner;
  }

  async toggleHeroBanner(id: string, isEnabled: boolean, admin: any) {
    const banner = await CMSBannerModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { bannerId: id }] : [{ bannerId: id }],
      isDeleted: false,
    });
    if (!banner) throw new Error('Hero banner not found');

    banner.isEnabled = isEnabled;
    await banner.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: isEnabled ? 'BANNER_ENABLED' : 'BANNER_DISABLED',
      eventType: 'UPDATE',
      description: `${isEnabled ? 'Enabled' : 'Disabled'} hero banner "${banner.title}"`,
      severity: 'Low',
    });

    this.emitUpdate('banner', isEnabled ? 'enable' : 'disable', banner);
    return banner;
  }

  async restoreHeroBannerVersion(id: string, versionNumber: number, admin: any) {
    const banner = await CMSBannerModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { bannerId: id }] : [{ bannerId: id }],
      isDeleted: false,
    });
    if (!banner) throw new Error('Hero banner not found');

    const targetVersion = banner.versionHistory?.find((v: any) => v.version === versionNumber);
    if (!targetVersion) throw new Error(`Version ${versionNumber} not found in history`);

    // Snapshot current state
    banner.versionHistory.unshift({
      version: banner.version,
      title: banner.title,
      subtitle: banner.subtitle,
      desktopImage: banner.desktopImage,
      mobileImage: banner.mobileImage,
      targetType: banner.targetType,
      targetId: banner.targetId,
      externalUrl: banner.externalUrl,
      ctaText: banner.ctaText,
      savedBy: admin?.name || 'Super Admin',
      savedAt: new Date(),
    });

    banner.title = targetVersion.title;
    banner.subtitle = targetVersion.subtitle;
    banner.desktopImage = targetVersion.desktopImage;
    banner.mobileImage = targetVersion.mobileImage;
    banner.targetType = targetVersion.targetType;
    banner.targetId = targetVersion.targetId;
    banner.externalUrl = targetVersion.externalUrl;
    banner.ctaText = targetVersion.ctaText;
    banner.version = banner.version + 1;

    await banner.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'RESTORE_BANNER_VERSION',
      eventType: 'UPDATE',
      description: `Restored hero banner "${banner.title}" from version ${versionNumber}`,
      severity: 'Medium',
    });

    this.emitUpdate('banner', 'restore', banner);
    return banner;
  }

  async deleteHeroBanner(id: string, admin: any) {
    const banner = await CMSBannerModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { bannerId: id }] : [{ bannerId: id }],
      isDeleted: false,
    });
    if (!banner) throw new Error('Hero banner not found');

    banner.isDeleted = true;
    await banner.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'DELETE_HERO_BANNER',
      eventType: 'DELETE',
      description: `Deleted hero banner "${banner.title}"`,
      severity: 'Medium',
    });

    this.emitUpdate('banner', 'delete', { id: banner.bannerId });
    return { success: true, message: 'Hero banner deleted' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ANNOUNCEMENTS (BROADCASTS & ALERTS)
  // ═══════════════════════════════════════════════════════════════════════════
  async getAnnouncements() {
    const announcements = await CMSAnnouncementModel.find({ isDeleted: false })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return announcements.map((a: any) => ({
      id: a.announcementId || a._id.toString(),
      _id: a._id.toString(),
      announcementId: a.announcementId,
      title: a.title,
      description: a.description || '',
      type: a.type || 'info',
      bgColor: a.bgColor || '#3B82F6',
      textColor: a.textColor || '#FFFFFF',
      targetType: a.targetType || 'None',
      targetId: a.targetId || '',
      linkUrl: a.linkUrl || '',
      ctaText: a.ctaText || '',
      placement: a.placement || 'all',
      isPinned: !!a.isPinned,
      isDismissible: a.isDismissible !== false,
      priority: a.priority || 1,
      startDate: a.startDate || '',
      endDate: a.endDate || '',
      status: a.status || 'published',
      isEnabled: a.isEnabled !== false,
    }));
  }

  async createAnnouncement(payload: any, admin: any) {
    const announcementId = `ann-${Date.now().toString().slice(-6)}`;
    const announcement = await CMSAnnouncementModel.create({
      announcementId,
      title: payload.title,
      description: payload.description,
      type: payload.type || 'info',
      bgColor: payload.bgColor || '#3B82F6',
      textColor: payload.textColor || '#FFFFFF',
      targetType: payload.targetType || 'None',
      targetId: payload.targetId,
      linkUrl: payload.linkUrl,
      ctaText: payload.ctaText,
      placement: payload.placement || 'all',
      isPinned: !!payload.isPinned,
      isDismissible: payload.isDismissible !== false,
      priority: Number(payload.priority) || 1,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status || 'published',
      isEnabled: payload.isEnabled !== false,
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'CREATE_CMS_ANNOUNCEMENT',
      eventType: 'CREATE',
      description: `Published platform announcement "${announcement.title}"`,
      severity: 'Medium',
    });

    this.emitUpdate('announcement', 'create', announcement);
    return announcement;
  }

  async updateAnnouncement(id: string, payload: any, admin: any) {
    const announcement = await CMSAnnouncementModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { announcementId: id }] : [{ announcementId: id }],
      isDeleted: false,
    });
    if (!announcement) throw new Error('Announcement not found');

    if (payload.title !== undefined) announcement.title = payload.title;
    if (payload.description !== undefined) announcement.description = payload.description;
    if (payload.type !== undefined) announcement.type = payload.type;
    if (payload.bgColor !== undefined) announcement.bgColor = payload.bgColor;
    if (payload.textColor !== undefined) announcement.textColor = payload.textColor;
    if (payload.targetType !== undefined) announcement.targetType = payload.targetType;
    if (payload.targetId !== undefined) announcement.targetId = payload.targetId;
    if (payload.linkUrl !== undefined) announcement.linkUrl = payload.linkUrl;
    if (payload.ctaText !== undefined) announcement.ctaText = payload.ctaText;
    if (payload.placement !== undefined) announcement.placement = payload.placement;
    if (payload.isPinned !== undefined) announcement.isPinned = payload.isPinned;
    if (payload.isDismissible !== undefined) announcement.isDismissible = payload.isDismissible;
    if (payload.priority !== undefined) announcement.priority = Number(payload.priority);
    if (payload.startDate !== undefined) announcement.startDate = payload.startDate;
    if (payload.endDate !== undefined) announcement.endDate = payload.endDate;
    if (payload.status !== undefined) announcement.status = payload.status;
    if (payload.isEnabled !== undefined) announcement.isEnabled = payload.isEnabled;

    await announcement.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'UPDATE_CMS_ANNOUNCEMENT',
      eventType: 'UPDATE',
      description: `Updated platform announcement "${announcement.title}"`,
      severity: 'Low',
    });

    this.emitUpdate('announcement', 'update', announcement);
    return announcement;
  }

  async deleteAnnouncement(id: string, admin: any) {
    const announcement = await CMSAnnouncementModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { announcementId: id }] : [{ announcementId: id }],
      isDeleted: false,
    });
    if (!announcement) throw new Error('Announcement not found');

    announcement.isDeleted = true;
    await announcement.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'DELETE_CMS_ANNOUNCEMENT',
      eventType: 'DELETE',
      description: `Deleted platform announcement "${announcement.title}"`,
      severity: 'Low',
    });

    this.emitUpdate('announcement', 'delete', { id: announcement.announcementId });
    return { success: true, message: 'Announcement deleted' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. FEATURED AGENCIES (REFERENCE BASED, ZERO DUPLICATE DATA)
  // ═══════════════════════════════════════════════════════════════════════════
  async getFeaturedAgencies() {
    const list = await CMSFeaturedAgencyModel.find({ isDeleted: false })
      .populate('agencyId')
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return list
      .filter((item: any) => item.agencyId) // Ensure referenced agency exists
      .map((item: any) => {
        const agency = item.agencyId;
        return {
          id: item._id.toString(),
          agencyDocId: agency._id.toString(),
          agencyId: agency.agencyId || agency._id.toString(),
          agencyName: agency.companyName || agency.name || 'Verified Agency',
          agencyLogo: agency.profile?.logoUrl || agency.logo || '',
          rating: agency.rating || 4.8,
          isVerified: agency.isVerified !== false,
          featuredBadge: item.featuredBadge || 'Featured Partner',
          featuredUntil: item.featuredUntil || '',
          priority: item.priority || 1,
          isEnabled: item.isActive !== false,
        };
      });
  }

  async featureAgency(payload: { agencyId: string; priority?: number; featuredBadge?: string; featuredUntil?: string }, admin: any) {
    // Validate agency exists
    const agency = await AgencyModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(payload.agencyId)
        ? [{ _id: payload.agencyId }, { agencyId: payload.agencyId }]
        : [{ agencyId: payload.agencyId }],
    });
    if (!agency) throw new Error('Agency does not exist in directory');

    // Check if already featured
    let featured = await CMSFeaturedAgencyModel.findOne({ agencyId: agency._id });
    if (featured) {
      featured.isDeleted = false;
      featured.isActive = true;
      if (payload.priority !== undefined) featured.priority = Number(payload.priority);
      if (payload.featuredBadge !== undefined) featured.featuredBadge = payload.featuredBadge;
      if (payload.featuredUntil !== undefined) featured.featuredUntil = payload.featuredUntil;
      await featured.save();
    } else {
      featured = await CMSFeaturedAgencyModel.create({
        agencyId: agency._id,
        priority: Number(payload.priority) || 1,
        featuredBadge: payload.featuredBadge || 'Featured Partner',
        featuredUntil: payload.featuredUntil,
        isActive: true,
        isDeleted: false,
      });
    }

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'FEATURE_AGENCY',
      eventType: 'CREATE',
      description: `Featured agency "${agency.companyName || agency.name}" on storefront`,
      severity: 'Medium',
    });

    this.emitUpdate('agency', 'featured', { agencyId: agency._id });
    return featured;
  }

  async updateFeaturedAgency(id: string, payload: any, admin: any) {
    const featured = await CMSFeaturedAgencyModel.findById(id);
    if (!featured) throw new Error('Featured agency record not found');

    if (payload.priority !== undefined) featured.priority = Number(payload.priority);
    if (payload.featuredBadge !== undefined) featured.featuredBadge = payload.featuredBadge;
    if (payload.featuredUntil !== undefined) featured.featuredUntil = payload.featuredUntil;
    if (payload.isEnabled !== undefined) featured.isActive = payload.isEnabled;

    await featured.save();
    this.emitUpdate('agency', 'update', featured);
    return featured;
  }

  async unfeatureAgency(id: string, admin: any) {
    const featured = await CMSFeaturedAgencyModel.findById(id);
    if (!featured) throw new Error('Featured agency record not found');

    featured.isDeleted = true;
    featured.isActive = false;
    await featured.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'UNFEATURE_AGENCY',
      eventType: 'DELETE',
      description: `Removed agency from featured showcase`,
      severity: 'Low',
    });

    this.emitUpdate('agency', 'unfeature', { id });
    return { success: true, message: 'Agency removed from featured showcase' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. FEATURED TRIPS / PACKAGES (REFERENCE BASED)
  // ═══════════════════════════════════════════════════════════════════════════
  async getFeaturedTrips() {
    const list = await CMSFeaturedTripModel.find({ isDeleted: false })
      .populate('packageId')
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return list
      .filter((item: any) => item.packageId)
      .map((item: any) => {
        const pkg = item.packageId;
        return {
          id: item._id.toString(),
          packageDocId: pkg._id.toString(),
          packageId: pkg.packageId || pkg._id.toString(),
          tripTitle: pkg.title,
          agencyName: pkg.agencyName || 'Verified Operator',
          bannerImage: pkg.coverImage || pkg.images?.[0] || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
          price: pkg.price,
          duration: `${pkg.durationDays || 3}D${pkg.durationNights || 2}N`,
          destination: pkg.destination,
          discountBadge: item.customBadge || pkg.discountPercent || 'Featured',
          priority: item.priority || 1,
          featuredUntil: item.featuredUntil || '',
          isEnabled: item.isActive !== false,
        };
      });
  }

  async featureTrip(payload: { packageId: string; priority?: number; customBadge?: string; featuredUntil?: string }, admin: any) {
    const pkg = await PackageModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(payload.packageId)
        ? [{ _id: payload.packageId }, { packageId: payload.packageId }]
        : [{ packageId: payload.packageId }],
    });
    if (!pkg) throw new Error('Package does not exist');

    let featured = await CMSFeaturedTripModel.findOne({ packageId: pkg._id });
    if (featured) {
      featured.isDeleted = false;
      featured.isActive = true;
      if (payload.priority !== undefined) featured.priority = Number(payload.priority);
      if (payload.customBadge !== undefined) featured.customBadge = payload.customBadge;
      if (payload.featuredUntil !== undefined) featured.featuredUntil = payload.featuredUntil;
      await featured.save();
    } else {
      featured = await CMSFeaturedTripModel.create({
        packageId: pkg._id,
        priority: Number(payload.priority) || 1,
        customBadge: payload.customBadge || 'Featured',
        featuredUntil: payload.featuredUntil,
        isActive: true,
        isDeleted: false,
      });
    }

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'FEATURE_TRIP',
      eventType: 'CREATE',
      description: `Featured package "${pkg.title}" on homepage`,
      severity: 'Medium',
    });

    this.emitUpdate('trip', 'featured', { packageId: pkg._id });
    return featured;
  }

  async updateFeaturedTrip(id: string, payload: any, admin: any) {
    const featured = await CMSFeaturedTripModel.findById(id);
    if (!featured) throw new Error('Featured trip record not found');

    if (payload.priority !== undefined) featured.priority = Number(payload.priority);
    if (payload.customBadge !== undefined) featured.customBadge = payload.customBadge;
    if (payload.featuredUntil !== undefined) featured.featuredUntil = payload.featuredUntil;
    if (payload.isEnabled !== undefined) featured.isActive = payload.isEnabled;

    await featured.save();
    this.emitUpdate('trip', 'update', featured);
    return featured;
  }

  async unfeatureTrip(id: string, admin: any) {
    const featured = await CMSFeaturedTripModel.findById(id);
    if (!featured) throw new Error('Featured trip record not found');

    featured.isDeleted = true;
    featured.isActive = false;
    await featured.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'UNFEATURE_TRIP',
      eventType: 'DELETE',
      description: `Removed tour package from featured showcase`,
      severity: 'Low',
    });

    this.emitUpdate('trip', 'unfeature', { id });
    return { success: true, message: 'Trip removed from featured showcase' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. TRENDING DESTINATIONS (AUTOCOMPLETE & CURATED SELECTION)
  // ═══════════════════════════════════════════════════════════════════════════
  async getTrendingDestinations() {
    const list = await CMSTrendingDestinationModel.find({ isDeleted: false })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return list.map((d: any) => ({
      id: d._id.toString(),
      name: d.destinationName,
      country: d.country || 'India',
      region: d.region || '',
      description: d.description || '',
      imageUrl: d.imageUrl,
      priority: d.priority || 1,
      isTrending: d.isTrending !== false,
      isEnabled: d.isActive !== false,
    }));
  }

  async createTrendingDestination(payload: any, admin: any) {
    const dest = await CMSTrendingDestinationModel.create({
      destinationName: payload.name || payload.destinationName,
      region: payload.region,
      country: payload.country || 'India',
      description: payload.description,
      imageUrl: payload.imageUrl,
      priority: Number(payload.priority) || 1,
      isTrending: payload.isTrending !== false,
      isActive: payload.isEnabled !== false,
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'CREATE_TRENDING_DESTINATION',
      eventType: 'CREATE',
      description: `Added "${dest.destinationName}" to trending destinations`,
      severity: 'Medium',
    });

    this.emitUpdate('destination', 'create', dest);
    return dest;
  }

  async updateTrendingDestination(id: string, payload: any, admin: any) {
    const dest = await CMSTrendingDestinationModel.findById(id);
    if (!dest) throw new Error('Trending destination not found');

    if (payload.name !== undefined) dest.destinationName = payload.name;
    if (payload.destinationName !== undefined) dest.destinationName = payload.destinationName;
    if (payload.region !== undefined) dest.region = payload.region;
    if (payload.country !== undefined) dest.country = payload.country;
    if (payload.description !== undefined) dest.description = payload.description;
    if (payload.imageUrl !== undefined) dest.imageUrl = payload.imageUrl;
    if (payload.priority !== undefined) dest.priority = Number(payload.priority);
    if (payload.isTrending !== undefined) dest.isTrending = payload.isTrending;
    if (payload.isEnabled !== undefined) dest.isActive = payload.isEnabled;

    await dest.save();
    this.emitUpdate('destination', 'update', dest);
    return dest;
  }

  async deleteTrendingDestination(id: string, admin: any) {
    const dest = await CMSTrendingDestinationModel.findById(id);
    if (!dest) throw new Error('Trending destination not found');

    dest.isDeleted = true;
    dest.isActive = false;
    await dest.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'DELETE_TRENDING_DESTINATION',
      eventType: 'DELETE',
      description: `Deleted trending destination "${dest.destinationName}"`,
      severity: 'Low',
    });

    this.emitUpdate('destination', 'delete', { id });
    return { success: true, message: 'Trending destination deleted' };
  }

  async getDestinationSuggestions() {
    // Aggregate distinct destination names from real Packages
    const distinctDests = await PackageModel.aggregate([
      { $match: { isDeleted: false, destination: { $exists: true, $ne: '' } } },
      {
        $group: {
          _id: '$destination',
          packageCount: { $sum: 1 },
          country: { $first: '$destinationCountry' },
          sampleImage: { $first: '$coverImage' },
        },
      },
      { $sort: { packageCount: -1 } },
      { $limit: 30 },
    ]);

    return distinctDests.map((d) => ({
      name: d._id,
      country: d.country || 'India',
      packageCount: d.packageCount,
      imageUrl: d.sampleImage || '',
    }));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. PROMOTIONAL CAMPAIGNS (CONNECTED WITH REAL COUPONS)
  // ═══════════════════════════════════════════════════════════════════════════
  async getCampaigns() {
    const campaigns = await CMSCampaignModel.find({ isDeleted: false })
      .populate('couponId')
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return campaigns.map((c: any) => ({
      id: c.campaignId || c._id.toString(),
      _id: c._id.toString(),
      campaignId: c.campaignId,
      title: c.title,
      slug: c.slug,
      description: c.description || '',
      campaignType: c.campaignType || 'Festival',
      bannerImage: c.bannerImage,
      landingUrl: c.landingUrl || `/campaigns/${c.slug}`,
      couponId: c.couponId?._id?.toString() || '',
      couponCode: c.couponCode || c.couponId?.code || '',
      discountPercentage: c.discountPercentage || 0,
      startDate: c.startDate || '',
      endDate: c.endDate || '',
      priority: c.priority || 1,
      status: c.status || 'published',
      isEnabled: c.isActive !== false,
    }));
  }

  async createCampaign(payload: any, admin: any) {
    const campaignId = `camp-${Date.now().toString().slice(-6)}`;
    const slug = (payload.slug || payload.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Validate coupon if provided
    let couponObjectId: any = undefined;
    if (payload.couponCode) {
      const coupon = await CouponModel.findOne({ code: payload.couponCode.toUpperCase() });
      if (coupon) couponObjectId = coupon._id;
    }

    const campaign = await CMSCampaignModel.create({
      campaignId,
      title: payload.title,
      slug: `${slug}-${Math.random().toString(36).substring(2, 5)}`,
      description: payload.description,
      campaignType: payload.campaignType || 'Festival',
      bannerImage: payload.bannerImage,
      landingUrl: payload.landingUrl || `/campaigns/${slug}`,
      couponId: couponObjectId,
      couponCode: payload.couponCode?.toUpperCase(),
      discountPercentage: Number(payload.discountPercentage) || undefined,
      startDate: payload.startDate,
      endDate: payload.endDate,
      priority: Number(payload.priority) || 1,
      status: payload.status || 'published',
      isActive: payload.isEnabled !== false,
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'CREATE_CMS_CAMPAIGN',
      eventType: 'CREATE',
      description: `Launched promotional campaign "${campaign.title}"`,
      severity: 'Medium',
    });

    this.emitUpdate('campaign', 'create', campaign);
    return campaign;
  }

  async updateCampaign(id: string, payload: any, admin: any) {
    const campaign = await CMSCampaignModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { campaignId: id }] : [{ campaignId: id }],
      isDeleted: false,
    });
    if (!campaign) throw new Error('Campaign not found');

    if (payload.title !== undefined) campaign.title = payload.title;
    if (payload.description !== undefined) campaign.description = payload.description;
    if (payload.campaignType !== undefined) campaign.campaignType = payload.campaignType;
    if (payload.bannerImage !== undefined) campaign.bannerImage = payload.bannerImage;
    if (payload.landingUrl !== undefined) campaign.landingUrl = payload.landingUrl;
    if (payload.couponCode !== undefined) {
      campaign.couponCode = payload.couponCode.toUpperCase();
      const cp = await CouponModel.findOne({ code: campaign.couponCode });
      if (cp) campaign.couponId = cp._id;
    }
    if (payload.discountPercentage !== undefined) campaign.discountPercentage = Number(payload.discountPercentage);
    if (payload.startDate !== undefined) campaign.startDate = payload.startDate;
    if (payload.endDate !== undefined) campaign.endDate = payload.endDate;
    if (payload.priority !== undefined) campaign.priority = Number(payload.priority);
    if (payload.status !== undefined) campaign.status = payload.status;
    if (payload.isEnabled !== undefined) campaign.isActive = payload.isEnabled;

    await campaign.save();
    this.emitUpdate('campaign', 'update', campaign);
    return campaign;
  }

  async deleteCampaign(id: string, admin: any) {
    const campaign = await CMSCampaignModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { campaignId: id }] : [{ campaignId: id }],
      isDeleted: false,
    });
    if (!campaign) throw new Error('Campaign not found');

    campaign.isDeleted = true;
    campaign.isActive = false;
    await campaign.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'DELETE_CMS_CAMPAIGN',
      eventType: 'DELETE',
      description: `Deleted promotional campaign "${campaign.title}"`,
      severity: 'Low',
    });

    this.emitUpdate('campaign', 'delete', { id: campaign.campaignId });
    return { success: true, message: 'Campaign deleted' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. POPUP MANAGER
  // ═══════════════════════════════════════════════════════════════════════════
  async getPopups() {
    const popups = await CMSPopupModel.find({ isDeleted: false })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    return popups.map((p: any) => ({
      id: p.popupId || p._id.toString(),
      _id: p._id.toString(),
      popupId: p.popupId,
      title: p.title,
      description: p.description || '',
      mediaType: p.mediaType || 'image',
      imageUrl: p.mediaUrl,
      mediaUrl: p.mediaUrl,
      buttonText: p.buttonText || 'Claim Voucher',
      buttonLink: p.buttonLink || '',
      targetType: p.targetType || 'None',
      targetId: p.targetId || '',
      delaySeconds: p.delaySeconds || 3,
      frequency: p.frequency || 'once_per_session',
      hasCloseButton: p.hasCloseButton !== false,
      priority: p.priority || 1,
      startDate: p.startDate || '',
      endDate: p.endDate || '',
      status: p.status || 'published',
      isEnabled: p.isActive !== false,
    }));
  }

  async createPopup(payload: any, admin: any) {
    const popupId = `pop-${Date.now().toString().slice(-6)}`;
    const popup = await CMSPopupModel.create({
      popupId,
      title: payload.title,
      description: payload.description,
      mediaType: payload.mediaType || 'image',
      mediaUrl: payload.mediaUrl || payload.imageUrl,
      buttonText: payload.buttonText || 'Learn More',
      buttonLink: payload.buttonLink,
      targetType: payload.targetType || 'None',
      targetId: payload.targetId,
      delaySeconds: Number(payload.delaySeconds) || 3,
      frequency: payload.frequency || 'once_per_session',
      hasCloseButton: payload.hasCloseButton !== false,
      priority: Number(payload.priority) || 1,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: payload.status || 'published',
      isActive: payload.isEnabled !== false,
      isDeleted: false,
    });

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'CREATE_CMS_POPUP',
      eventType: 'CREATE',
      description: `Created storefront promotional popup "${popup.title}"`,
      severity: 'Medium',
    });

    this.emitUpdate('popup', 'create', popup);
    return popup;
  }

  async updatePopup(id: string, payload: any, admin: any) {
    const popup = await CMSPopupModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { popupId: id }] : [{ popupId: id }],
      isDeleted: false,
    });
    if (!popup) throw new Error('Popup not found');

    if (payload.title !== undefined) popup.title = payload.title;
    if (payload.description !== undefined) popup.description = payload.description;
    if (payload.mediaType !== undefined) popup.mediaType = payload.mediaType;
    if (payload.mediaUrl !== undefined) popup.mediaUrl = payload.mediaUrl;
    if (payload.imageUrl !== undefined) popup.mediaUrl = payload.imageUrl;
    if (payload.buttonText !== undefined) popup.buttonText = payload.buttonText;
    if (payload.buttonLink !== undefined) popup.buttonLink = payload.buttonLink;
    if (payload.targetType !== undefined) popup.targetType = payload.targetType;
    if (payload.targetId !== undefined) popup.targetId = payload.targetId;
    if (payload.delaySeconds !== undefined) popup.delaySeconds = Number(payload.delaySeconds);
    if (payload.frequency !== undefined) popup.frequency = payload.frequency;
    if (payload.hasCloseButton !== undefined) popup.hasCloseButton = payload.hasCloseButton;
    if (payload.priority !== undefined) popup.priority = Number(payload.priority);
    if (payload.startDate !== undefined) popup.startDate = payload.startDate;
    if (payload.endDate !== undefined) popup.endDate = payload.endDate;
    if (payload.status !== undefined) popup.status = payload.status;
    if (payload.isEnabled !== undefined) popup.isActive = payload.isEnabled;

    await popup.save();
    this.emitUpdate('popup', 'update', popup);
    return popup;
  }

  async deletePopup(id: string, admin: any) {
    const popup = await CMSPopupModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { popupId: id }] : [{ popupId: id }],
      isDeleted: false,
    });
    if (!popup) throw new Error('Popup not found');

    popup.isDeleted = true;
    popup.isActive = false;
    await popup.save();

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'DELETE_CMS_POPUP',
      eventType: 'DELETE',
      description: `Deleted storefront popup "${popup.title}"`,
      severity: 'Low',
    });

    this.emitUpdate('popup', 'delete', { id: popup.popupId });
    return { success: true, message: 'Popup deleted' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. SEO SETTINGS (DISTINCT PER PAGE KEY)
  // ═══════════════════════════════════════════════════════════════════════════
  async getSEO(pageKey: CMSSEOPageKey = 'home') {
    const seo = await CMSSEOModel.findOne({ pageKey }).lean();
    if (!seo) {
      return {
        pageKey,
        title: `ApnaTrip — Discover, Customize & Book Verified Trips (${pageKey})`,
        description: 'Book verified holiday tours, weekend getaways, and luxury Himalayan trekking packages directly from accredited Indian travel agencies.',
        keywords: ['tour packages', 'travel india', 'kashmir tour', 'himachal trekking', 'bali packages'],
        ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
        canonicalUrl: `https://apnatrip.com/${pageKey === 'home' ? '' : pageKey}`,
        ogTitle: `ApnaTrip — Best Travel Deals (${pageKey})`,
        ogDescription: 'Verified tour packages with transparent pricing.',
        twitterCard: 'summary_large_image',
        robots: 'index, follow',
      };
    }
    return seo;
  }

  async getAllSEO() {
    const list = await CMSSEOModel.find().lean();
    return list;
  }

  async saveSEO(pageKey: CMSSEOPageKey, payload: any, admin: any) {
    const keywords = Array.isArray(payload.keywords)
      ? payload.keywords
      : typeof payload.keywords === 'string'
      ? payload.keywords.split(',').map((k: string) => k.trim())
      : [];

    const seo = await CMSSEOModel.findOneAndUpdate(
      { pageKey },
      {
        $set: {
          title: payload.title,
          description: payload.description,
          keywords,
          canonicalUrl: payload.canonicalUrl,
          ogTitle: payload.ogTitle || payload.title,
          ogDescription: payload.ogDescription || payload.description,
          ogImage: payload.ogImage,
          twitterCard: payload.twitterCard || 'summary_large_image',
          robots: payload.robots || 'index, follow',
          updatedBy: admin?.name || 'Super Admin',
        },
      },
      { upsert: true, new: true }
    );

    await AuditLoggerService.log({
      actor: {
        id: admin?._id?.toString(),
        name: admin?.name || 'Super Admin',
        email: admin?.email,
        role: 'Super Admin',
      },
      module: 'CMS',
      action: 'UPDATE_SEO_SETTINGS',
      eventType: 'UPDATE',
      description: `Updated SEO meta tags for page "${pageKey}"`,
      severity: 'Low',
    });

    this.emitUpdate('seo', 'update', { pageKey });
    return seo;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. REAL DATABASE SEARCH AUTOCOMPLETE
  // ═══════════════════════════════════════════════════════════════════════════
  async searchDatabase(query: string) {
    if (!query || query.trim().length < 2) {
      return { packages: [], agencies: [], destinations: [], coupons: [] };
    }

    const reg = new RegExp(query.trim(), 'i');

    const [packages, agencies, destinations, coupons] = await Promise.all([
      PackageModel.find({ isDeleted: false, title: reg })
        .select('_id packageId title destination price coverImage agencyName')
        .limit(6)
        .lean(),
      AgencyModel.find({ isDeleted: false, $or: [{ companyName: reg }, { name: reg }] })
        .select('_id agencyId companyName name rating profile.logoUrl logo isVerified')
        .limit(6)
        .lean(),
      PackageModel.aggregate([
        { $match: { isDeleted: false, destination: reg } },
        { $group: { _id: '$destination', sampleImage: { $first: '$coverImage' } } },
        { $limit: 6 },
      ]),
      CouponModel.find({ isDeleted: false, isActive: true, code: reg })
        .select('_id code discountType discountValue')
        .limit(6)
        .lean(),
    ]);

    return {
      packages: packages.map((p: any) => ({
        id: p._id.toString(),
        packageId: p.packageId || p._id.toString(),
        title: p.title,
        destination: p.destination,
        price: p.price,
        imageUrl: p.coverImage || '',
        agencyName: p.agencyName,
      })),
      agencies: agencies.map((a: any) => ({
        id: a._id.toString(),
        agencyId: a.agencyId || a._id.toString(),
        name: a.companyName || a.name,
        rating: a.rating || 4.8,
        logo: a.profile?.logoUrl || a.logo || '',
        isVerified: a.isVerified,
      })),
      destinations: destinations.map((d: any) => ({
        name: d._id,
        imageUrl: d.sampleImage || '',
      })),
      coupons: coupons.map((c: any) => ({
        id: c._id.toString(),
        code: c.code,
        discountText: c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`,
      })),
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. AUDIT LOGS & SCHEDULED ITEMS
  // ═══════════════════════════════════════════════════════════════════════════
  async getCMSAuditLogs() {
    const logs = await AuditLogModel.find({ module: 'CMS' })
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    return logs.map((l: any) => ({
      id: l._id.toString(),
      adminName: l.actor?.name || 'Super Admin',
      adminAvatar: l.actor?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      action: l.action,
      target: l.description,
      timestamp: l.createdAt ? new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
    }));
  }

  async getScheduledItems() {
    const today = new Date().toISOString().slice(0, 10);
    const [banners, announcements, campaigns, popups] = await Promise.all([
      CMSBannerModel.find({ isDeleted: false, startDate: { $gt: today } }).select('bannerId title startDate endDate status').lean(),
      CMSAnnouncementModel.find({ isDeleted: false, startDate: { $gt: today } }).select('announcementId title startDate endDate status').lean(),
      CMSCampaignModel.find({ isDeleted: false, startDate: { $gt: today } }).select('campaignId title startDate endDate status').lean(),
      CMSPopupModel.find({ isDeleted: false, startDate: { $gt: today } }).select('popupId title startDate endDate status').lean(),
    ]);

    const items: any[] = [];
    banners.forEach((b: any) => items.push({ id: b.bannerId, title: b.title, category: 'Hero Banner', startDate: b.startDate, endDate: b.endDate, status: 'scheduled' }));
    announcements.forEach((a: any) => items.push({ id: a.announcementId, title: a.title, category: 'Announcement', startDate: a.startDate, endDate: a.endDate, status: 'scheduled' }));
    campaigns.forEach((c: any) => items.push({ id: c.campaignId, title: c.title, category: 'Campaign', startDate: c.startDate, endDate: c.endDate, status: 'scheduled' }));
    popups.forEach((p: any) => items.push({ id: p.popupId, title: p.title, category: 'Popup', startDate: p.startDate, endDate: p.endDate, status: 'scheduled' }));

    return items;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. MEDIA LIBRARY
  // ═══════════════════════════════════════════════════════════════════════════
  async getMediaLibrary() {
    const items = await CMSMediaItemModel.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return items.map((m: any) => ({
      id: m.mediaId || m._id.toString(),
      title: m.title,
      url: m.url,
      resourceType: m.resourceType,
      format: m.format,
      sizeBytes: m.sizeBytes,
      createdAt: m.createdAt,
    }));
  }

  async addMediaLibraryItem(payload: any, admin: any) {
    const mediaId = `med-${Date.now().toString().slice(-6)}`;
    const item = await CMSMediaItemModel.create({
      mediaId,
      title: payload.title || 'Uploaded Asset',
      url: payload.url,
      publicId: payload.publicId || payload.url,
      folder: payload.folder || 'travelos/cms',
      format: payload.format,
      resourceType: payload.resourceType || 'image',
      sizeBytes: payload.sizeBytes,
      uploadedBy: admin?.name || 'Super Admin',
      tags: payload.tags || [],
      isDeleted: false,
    });
    return item;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. UNIVERSAL CMS SELECTION & BROWSE APIS
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Universal Package Selector with browse, pagination, search, filters & featured status
   */
  async selectPackages(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sortBy?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: false };

    // Status filter
    if (params.status && params.status !== 'all') {
      const st = params.status.toLowerCase();
      if (st === 'published' || st === 'approved') {
        filter.status = { $in: ['APPROVED', 'published', 'Published', 'Approved'] };
      } else if (st === 'draft') {
        filter.status = { $in: ['DRAFT', 'draft', 'Draft'] };
      } else if (st === 'pending') {
        filter.status = { $in: ['PENDING', 'pending', 'Pending'] };
      } else {
        filter.status = new RegExp(`^${params.status}$`, 'i');
      }
    }

    // Category filter
    if (params.category && params.category !== 'all') {
      filter.category = new RegExp(`^${params.category}$`, 'i');
    }

    // Search filter
    if (params.search && params.search.trim()) {
      const reg = new RegExp(params.search.trim(), 'i');
      filter.$or = [
        { title: reg },
        { destination: reg },
        { agencyName: reg },
        { packageId: reg },
        { category: reg },
      ];
    }

    // Sorting
    let sort: any = { createdAt: -1 };
    switch (params.sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'recently_updated':
        sort = { updatedAt: -1 };
        break;
      case 'most_booked':
        sort = { bookingsCount: -1, createdAt: -1 };
        break;
      case 'highest_rated':
        sort = { rating: -1, reviewCount: -1 };
        break;
      case 'alphabetical':
        sort = { title: 1 };
        break;
      case 'price_asc':
        sort = { price: 1 };
        break;
      case 'price_desc':
        sort = { price: -1 };
        break;
      default:
        sort = { createdAt: -1 };
        break;
    }

    let total = await PackageModel.countDocuments(filter);
    let packages = await PackageModel.find(filter).sort(sort).skip(skip).limit(limit).lean();

    // If zero records found with published/approved filter and search was empty, check if any package exists
    if (total === 0 && !params.search && (!params.status || params.status === 'published')) {
      const anyTotal = await PackageModel.countDocuments({ isDeleted: false });
      if (anyTotal > 0) {
        // Fallback to all non-deleted packages so admin can see their created packages
        const fallbackFilter = { isDeleted: false };
        total = anyTotal;
        packages = await PackageModel.find(fallbackFilter).sort(sort).skip(skip).limit(limit).lean();
      }
    }

    // Cross-reference active featured trips
    const activeFeatured = await CMSFeaturedTripModel.find({ isDeleted: false, isActive: true })
      .select('packageId')
      .lean();
    const featuredIdSet = new Set(activeFeatured.map((f: any) => f.packageId?.toString()));

    const items = packages.map((p: any) => {
      const pkgOid = p._id?.toString();
      const pkgCode = p.packageId || pkgOid;
      const isFeatured = featuredIdSet.has(pkgOid) || featuredIdSet.has(pkgCode);

      return {
        id: pkgOid,
        packageId: pkgCode,
        name: p.title || 'Untitled Tour Package',
        title: p.title || 'Untitled Tour Package',
        agencyName: p.agencyName || 'Independent Travel Partner',
        destination: p.destination || 'India',
        destinationCountry: p.destinationCountry || 'India',
        category: p.category || 'Adventure',
        duration: p.durationDays ? `${p.durationDays}D / ${p.durationNights || p.durationDays - 1}N` : '3D / 2N',
        price: p.price || 0,
        originalPrice: p.originalPrice || 0,
        rating: p.rating || 4.8,
        reviewCount: p.reviewCount || 0,
        bookingsCount: p.bookingsCount || 0,
        coverImage:
          p.coverImage ||
          p.featuredImage ||
          (Array.isArray(p.galleryImages) && p.galleryImages[0]) ||
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
        status: p.status === 'APPROVED' ? 'Published' : p.status || 'Published',
        isFeatured,
        updatedAt: p.updatedAt || p.createdAt || new Date().toISOString(),
        createdAt: p.createdAt || new Date().toISOString(),
        raw: {
          packageId: pkgCode,
          agencyId: p.agencyId?.toString(),
          category: p.category,
        },
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + packages.length < total,
      },
    };
  }

  /**
   * Universal Agency Selector with browse, pagination, search & featured status
   */
  async selectAgencies(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: false };

    if (params.status && params.status !== 'all') {
      const st = params.status.toLowerCase();
      if (st === 'verified' || st === 'approved' || st === 'published') {
        filter.verificationStatus = { $in: ['APPROVED', 'VERIFIED'] };
      } else if (st === 'pending') {
        filter.verificationStatus = 'PENDING';
      } else {
        filter.verificationStatus = new RegExp(`^${params.status}$`, 'i');
      }
    }

    if (params.search && params.search.trim()) {
      const reg = new RegExp(params.search.trim(), 'i');
      filter.$or = [
        { name: reg },
        { companyName: reg },
        { agencyDisplayName: reg },
        { ownerName: reg },
        { city: reg },
        { agencyId: reg },
      ];
    }

    let sort: any = { createdAt: -1 };
    switch (params.sortBy) {
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'recently_updated':
        sort = { updatedAt: -1 };
        break;
      case 'highest_rated':
        sort = { complianceScore: -1, 'profile.rating': -1 };
        break;
      case 'alphabetical':
        sort = { name: 1, companyName: 1 };
        break;
      default:
        sort = { createdAt: -1 };
        break;
    }

    let total = await AgencyModel.countDocuments(filter);
    let agencies = await AgencyModel.find(filter).sort(sort).skip(skip).limit(limit).lean();

    // If zero records found with verified filter and search was empty, fallback to all active agencies
    if (total === 0 && !params.search && (!params.status || params.status === 'verified')) {
      const anyTotal = await AgencyModel.countDocuments({ isDeleted: false });
      if (anyTotal > 0) {
        total = anyTotal;
        agencies = await AgencyModel.find({ isDeleted: false }).sort(sort).skip(skip).limit(limit).lean();
      }
    }

    // Cross-reference active featured agencies
    const activeFeatured = await CMSFeaturedAgencyModel.find({ isDeleted: false, isActive: true })
      .select('agencyId')
      .lean();
    const featuredIdSet = new Set(activeFeatured.map((f: any) => f.agencyId?.toString()));

    const items = agencies.map((a: any) => {
      const aOid = a._id?.toString();
      const aCode = a.agencyId || a.applicationId || aOid;
      const isFeatured = featuredIdSet.has(aOid) || featuredIdSet.has(aCode);
      const displayName = a.agencyDisplayName || a.companyName || a.name || 'Verified Travel Agency';

      return {
        id: aOid,
        agencyId: aCode,
        name: displayName,
        agencyName: displayName,
        ownerName: a.ownerName || a.owner?.name || 'Verified Operator',
        destination: a.city ? `${a.city}${a.state ? ', ' + a.state : ''}` : a.state || 'India',
        city: a.city || a.state || '',
        coverImage:
          a.profile?.coverUrl ||
          a.banner ||
          a.profile?.logoUrl ||
          a.logo ||
          'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600',
        logo: a.profile?.logoUrl || a.logo || '',
        status:
          a.verificationStatus === 'APPROVED' || a.verificationStatus === 'VERIFIED'
            ? 'Verified'
            : a.verificationStatus || a.status || 'Active',
        rating: a.complianceScore ? Number((a.complianceScore / 20).toFixed(1)) : 4.8,
        reviewCount: Array.isArray(a.reviewNotes) ? a.reviewNotes.length : 12,
        isFeatured,
        updatedAt: a.updatedAt || a.createdAt || new Date().toISOString(),
        createdAt: a.createdAt || new Date().toISOString(),
        raw: {
          agencyId: aCode,
          email: a.email,
          phone: a.phone,
        },
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + agencies.length < total,
      },
    };
  }

  /**
   * Universal Destination Selector with package counts & trending status
   */
  async selectDestinations(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    // 1. Aggregate from Packages
    const pkgMatch: any = { isDeleted: false, destination: { $exists: true, $ne: '' } };
    if (params.search && params.search.trim()) {
      pkgMatch.destination = new RegExp(params.search.trim(), 'i');
    }

    const pkgDests = await PackageModel.aggregate([
      { $match: pkgMatch },
      {
        $group: {
          _id: '$destination',
          packageCount: { $sum: 1 },
          country: { $first: '$destinationCountry' },
          region: { $first: '$destinationRegion' },
          sampleImage: { $first: '$coverImage' },
          lastUpdated: { $max: '$updatedAt' },
        },
      },
      { $sort: { packageCount: -1 } },
    ]);

    // 2. Fetch existing trending records
    const activeTrending = await CMSTrendingDestinationModel.find({ isDeleted: false, isActive: true }).lean();
    const trendingMap = new Map<string, any>();
    activeTrending.forEach((t: any) => {
      trendingMap.set(t.destinationName.toLowerCase().trim(), t);
    });

    // Merge and unify
    const seenNames = new Set<string>();
    const mergedList: any[] = [];

    // From packages first
    pkgDests.forEach((d: any) => {
      const rawName = (d._id || '').trim();
      if (!rawName) return;
      const key = rawName.toLowerCase();
      seenNames.add(key);

      const trendingDoc = trendingMap.get(key);

      mergedList.push({
        id: trendingDoc?._id?.toString() || `dest-${encodeURIComponent(rawName)}`,
        name: rawName,
        title: rawName,
        destination: rawName,
        country: d.country || trendingDoc?.country || 'India',
        region: d.region || trendingDoc?.region || '',
        packageCount: d.packageCount || 0,
        coverImage:
          trendingDoc?.imageUrl ||
          d.sampleImage ||
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
        status: 'Active',
        rating: 4.9,
        isFeatured: !!trendingDoc,
        updatedAt: trendingDoc?.updatedAt || d.lastUpdated || new Date().toISOString(),
      });
    });

    // From standalone trending items not in packages
    activeTrending.forEach((t: any) => {
      const key = (t.destinationName || '').toLowerCase().trim();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        if (!params.search || key.includes(params.search.toLowerCase().trim())) {
          mergedList.push({
            id: t._id.toString(),
            name: t.destinationName,
            title: t.destinationName,
            destination: t.destinationName,
            country: t.country || 'India',
            region: t.region || '',
            packageCount: 0,
            coverImage: t.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600',
            status: 'Active',
            rating: 4.9,
            isFeatured: true,
            updatedAt: t.updatedAt || new Date().toISOString(),
          });
        }
      }
    });

    // Sort merged list
    switch (params.sortBy) {
      case 'alphabetical':
        mergedList.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      case 'recently_updated':
        mergedList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'most_booked':
      default:
        mergedList.sort((a, b) => b.packageCount - a.packageCount);
        break;
    }

    const total = mergedList.length;
    const paginatedItems = mergedList.slice(skip, skip + limit);

    return {
      items: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + paginatedItems.length < total,
      },
    };
  }

  /**
   * Universal Trip Selector
   */
  async selectTrips(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: false };

    if (params.search && params.search.trim()) {
      const reg = new RegExp(params.search.trim(), 'i');
      filter.$or = [
        { packageName: reg },
        { tripId: reg },
        { destinationRoute: reg },
        { guideName: reg },
      ];
    }

    if (params.status && params.status !== 'all') {
      filter.statusCategory = new RegExp(`^${params.status}$`, 'i');
    }

    let sort: any = { departureDate: 1 };
    switch (params.sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'alphabetical':
        sort = { packageName: 1 };
        break;
      default:
        sort = { departureDate: 1 };
        break;
    }

    let total = await TripModel.countDocuments(filter);
    let trips = await TripModel.find(filter).sort(sort).skip(skip).limit(limit).lean();

    // If no records in TripModel, fallback to active Packages as selectable trips
    if (total === 0 && !params.search) {
      const pkgResult = await this.selectPackages({
        page,
        limit,
        search: params.search,
        status: params.status,
        sortBy: params.sortBy,
      });
      return pkgResult;
    }

    const items = trips.map((t: any) => ({
      id: t._id.toString(),
      tripId: t.tripId || t._id.toString(),
      name: t.packageName || `Trip #${t.tripId}`,
      title: t.packageName || `Trip #${t.tripId}`,
      agencyName: t.guideName ? `Lead Guide: ${t.guideName}` : 'ApnaTrip Host',
      destination: t.destinationRoute || 'India',
      status: t.statusCategory || 'Upcoming',
      travelerCount: t.travelerCount || 0,
      capacity: t.capacity || 20,
      departureDate: t.departureDate,
      rating: 4.9,
      coverImage: t.coverImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600',
      isFeatured: false,
      updatedAt: t.updatedAt || t.createdAt || new Date().toISOString(),
      createdAt: t.createdAt || new Date().toISOString(),
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + trips.length < total,
      },
    };
  }

  /**
   * Universal Vehicle / Car Rental Selector
   */
  async selectVehicles(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    city?: string;
    sortBy?: string;
  }) {
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
    const skip = (page - 1) * limit;

    const filter: any = { isDeleted: false };

    if (params.search && params.search.trim()) {
      const reg = new RegExp(params.search.trim(), 'i');
      filter.$or = [{ name: reg }, { brand: reg }, { type: reg }, { city: reg }];
    }

    if (params.type && params.type !== 'all') {
      filter.type = new RegExp(`^${params.type}$`, 'i');
    }

    if (params.city && params.city !== 'all') {
      filter.city = new RegExp(`^${params.city}$`, 'i');
    }

    let sort: any = { createdAt: -1 };
    switch (params.sortBy) {
      case 'highest_rated':
        sort = { averageRating: -1, reviewsCount: -1 };
        break;
      case 'price_asc':
        sort = { dailyPrice: 1 };
        break;
      case 'price_desc':
        sort = { dailyPrice: -1 };
        break;
      case 'alphabetical':
        sort = { brand: 1, name: 1 };
        break;
      default:
        sort = { createdAt: -1 };
        break;
    }

    const total = await CarModel.countDocuments(filter);
    const vehicles = await CarModel.find(filter).sort(sort).skip(skip).limit(limit).lean();

    const items = vehicles.map((v: any) => {
      const vName = `${v.brand || ''} ${v.name || ''}`.trim() || 'Rental Vehicle';
      return {
        id: v._id.toString(),
        name: vName,
        title: vName,
        agencyName: v.owner?.businessName || v.owner?.name || `${v.brand || 'Fleet'} Operator`,
        destination: v.city ? `Stationed: ${v.city}` : 'Available for rental',
        city: v.city || '',
        price: v.dailyPrice || 0,
        dailyPrice: v.dailyPrice || 0,
        rating: v.averageRating || 4.8,
        reviewCount: v.reviewsCount || 0,
        status: v.isAvailable ? 'Available' : 'Booked',
        coverImage:
          v.thumbnail ||
          (Array.isArray(v.images) && v.images[0]) ||
          'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600',
        isFeatured: !!v.isFeatured,
        updatedAt: v.updatedAt || v.createdAt || new Date().toISOString(),
        createdAt: v.createdAt || new Date().toISOString(),
      };
    });

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        hasMore: skip + vehicles.length < total,
      },
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. BULK CMS OPERATIONS (FEATURING MULTIPLE ITEMS AT ONCE)
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Bulk Feature Packages / Trips
   */
  async bulkFeatureTrips(
    packageIds: string[],
    priority: number = 1,
    customBadge: string = 'Featured Deal',
    admin: any
  ) {
    if (!Array.isArray(packageIds) || packageIds.length === 0) {
      throw new Error('No package IDs provided for bulk featuring');
    }

    const results: any[] = [];
    for (let i = 0; i < packageIds.length; i++) {
      const pkgId = packageIds[i];
      try {
        const featured = await this.featureTrip(
          {
            packageId: pkgId,
            priority: Number(priority) + i,
            customBadge,
          },
          admin
        );
        results.push(featured);
      } catch (err: any) {
        logger.warn(`Failed to feature package ${pkgId}: ${err?.message}`);
      }
    }

    return results;
  }

  /**
   * Bulk Feature Agencies
   */
  async bulkFeatureAgencies(
    agencyIds: string[],
    priority: number = 1,
    featuredBadge: string = 'Top Rated Partner',
    admin: any
  ) {
    if (!Array.isArray(agencyIds) || agencyIds.length === 0) {
      throw new Error('No agency IDs provided for bulk featuring');
    }

    const results: any[] = [];
    for (let i = 0; i < agencyIds.length; i++) {
      const agId = agencyIds[i];
      try {
        const featured = await this.featureAgency(
          {
            agencyId: agId,
            priority: Number(priority) + i,
            featuredBadge,
          },
          admin
        );
        results.push(featured);
      } catch (err: any) {
        logger.warn(`Failed to feature agency ${agId}: ${err?.message}`);
      }
    }

    return results;
  }

  /**
   * Bulk Create / Feature Trending Destinations
   */
  async bulkCreateTrendingDestinations(
    destinations: Array<{ name: string; country?: string; imageUrl?: string; priority?: number }>,
    admin: any
  ) {
    if (!Array.isArray(destinations) || destinations.length === 0) {
      throw new Error('No destinations provided for bulk featuring');
    }

    const results: any[] = [];
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      try {
        const created = await this.createTrendingDestination(
          {
            name: dest.name,
            destinationName: dest.name,
            country: dest.country || 'India',
            imageUrl:
              dest.imageUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800',
            priority: Number(dest.priority || 1) + i,
            isTrending: true,
            isEnabled: true,
          },
          admin
        );
        results.push(created);
      } catch (err: any) {
        logger.warn(`Failed to feature destination ${dest.name}: ${err?.message}`);
      }
    }

    return results;
  }
}

export const adminCMSService = new AdminCMSService();
