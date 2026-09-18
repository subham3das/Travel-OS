import mongoose from 'mongoose';
import { CMSContentModel, ICMSContent } from '../models/cmsContent.model.js';
import { AuditLoggerService } from './auditLogger.service.js';

export class AdminCMSService {
  /**
   * 1. CMS KPI Stats
   */
  async getKPIStats() {
    const [banners, announcements] = await Promise.all([
      CMSContentModel.countDocuments({ type: 'hero_banner', isDeleted: false, isEnabled: true }),
      CMSContentModel.countDocuments({ type: 'announcement', isDeleted: false }),
    ]);

    return {
      activeBanners: {
        id: 'activeBanners',
        title: 'Active Hero Banners',
        value: banners.toString(),
        subtitle: `${banners} Visible`,
        growth: '+1',
        isPositive: true,
        comparison: 'vs last week',
        iconType: 'banners' as const,
        sparklineColor: '#6356E5',
      },
      liveAnnouncements: {
        id: 'liveAnnouncements',
        title: 'Live Announcements',
        value: announcements.toString(),
        subtitle: 'Broadcast Active',
        growth: '0%',
        isPositive: true,
        comparison: 'vs last week',
        iconType: 'announcements' as const,
        sparklineColor: '#10B981',
      },
      homepageViewsToday: {
        id: 'homepageViewsToday',
        title: 'Homepage Views Today',
        value: '42,850',
        subtitle: '18% CTR',
        growth: '+14.2%',
        isPositive: true,
        comparison: 'vs yesterday',
        iconType: 'views' as const,
        sparklineColor: '#3B82F6',
      },
      featuredDestinations: {
        id: 'featuredDestinations',
        title: 'Trending Destinations',
        value: '8 Listed',
        subtitle: 'Top Converting',
        growth: '+2',
        isPositive: true,
        comparison: 'this month',
        iconType: 'destinations' as const,
        sparklineColor: '#F59E0B',
      },
    };
  }

  /**
   * 2. Hero Banners
   */
  async getHeroBanners() {
    const banners = await CMSContentModel.find({ type: 'hero_banner', isDeleted: false })
      .sort({ priority: 1, createdAt: -1 })
      .lean();

    if (banners.length === 0) {
      return [
        {
          id: 'ban-001',
          title: 'Discover the Untouched Beauty of Kashmir',
          subtitle: 'Book customized 5-star packages with verified local guides & instant confirmation.',
          ctaText: 'Explore Packages',
          ctaLink: '/packages?destination=kashmir',
          desktopImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
          mobileImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
          startDate: '2025-05-01',
          endDate: '2025-08-31',
          priority: 1,
          isEnabled: true,
          status: 'published' as const,
        },
        {
          id: 'ban-002',
          title: 'Bali Summer Getaways — Up to 35% Off',
          subtitle: 'Experience private beach villas, scuba diving, and mount Batur sunrises.',
          ctaText: 'View Summer Deals',
          ctaLink: '/campaigns/bali-summer',
          desktopImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1200&auto=format&fit=crop',
          mobileImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600&auto=format&fit=crop',
          startDate: '2025-06-01',
          endDate: '2025-09-15',
          priority: 2,
          isEnabled: true,
          status: 'published' as const,
        },
      ];
    }

    return banners.map((b: any) => ({
      id: b.contentId || b._id.toString(),
      title: b.title,
      subtitle: b.subtitle || '',
      ctaText: b.ctaText || 'Explore Now',
      ctaLink: b.ctaLink || '/packages',
      desktopImage: b.desktopImage || '',
      mobileImage: b.mobileImage || '',
      startDate: b.startDate,
      endDate: b.endDate,
      priority: b.priority || 1,
      isEnabled: b.isEnabled !== false,
      status: (b.status || 'published') as any,
    }));
  }

  async createHeroBanner(payload: any, admin: any) {
    const contentId = `ban-${Date.now().toString().slice(-4)}`;
    const banner = await CMSContentModel.create({
      contentId,
      type: 'hero_banner',
      title: payload.title,
      subtitle: payload.subtitle,
      ctaText: payload.ctaText,
      ctaLink: payload.ctaLink,
      desktopImage: payload.desktopImage,
      mobileImage: payload.mobileImage,
      startDate: payload.startDate,
      endDate: payload.endDate,
      priority: payload.priority || 1,
      isEnabled: payload.isEnabled !== false,
      status: payload.status || 'published',
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
      description: `Created hero banner "${banner.title}"`,
      severity: 'Medium',
    });

    return banner;
  }

  async deleteHeroBanner(id: string, admin: any) {
    const banner = await CMSContentModel.findOne({
      $or: mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }, { contentId: id }] : [{ contentId: id }],
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
      description: `Deleted hero banner "${banner.contentId}"`,
      severity: 'Low',
    });

    return { success: true, message: 'Hero banner deleted' };
  }

  /**
   * 3. Platform Announcements
   */
  async getAnnouncements() {
    const ann = await CMSContentModel.find({ type: 'announcement', isDeleted: false })
      .sort({ createdAt: -1 })
      .lean();

    if (ann.length === 0) {
      return [
        {
          id: 'ann-001',
          title: 'Scheduled System Maintenance on Sunday 02:00 AM IST',
          description: 'We will be upgrading our database infrastructure for faster booking queries. The admin and customer apps will be unavailable for ~20 minutes.',
          type: 'warning' as const,
          audience: 'all' as const,
          location: 'both' as const,
          isPinned: true,
          isDismissible: true,
          requireAck: false,
          startDate: '2025-06-20',
          endDate: '2025-06-22',
          status: 'published' as const,
        },
      ];
    }

    return ann.map((a: any) => ({
      id: a.contentId || a._id.toString(),
      title: a.title,
      description: a.subtitle || a.meta?.description || '',
      type: a.meta?.type || 'warning',
      audience: a.meta?.audience || 'all',
      location: a.meta?.location || 'both',
      isPinned: a.meta?.isPinned || false,
      isDismissible: a.meta?.isDismissible !== false,
      requireAck: a.meta?.requireAck || false,
      startDate: a.startDate,
      endDate: a.endDate,
      status: (a.status || 'published') as any,
    }));
  }

  async createAnnouncement(payload: any, admin: any) {
    const contentId = `ann-${Date.now().toString().slice(-4)}`;
    const announcement = await CMSContentModel.create({
      contentId,
      type: 'announcement',
      title: payload.title,
      subtitle: payload.description,
      startDate: payload.startDate,
      endDate: payload.endDate,
      isEnabled: true,
      status: payload.status || 'published',
      meta: {
        type: payload.type || 'info',
        audience: payload.audience || 'all',
        location: payload.location || 'both',
        isPinned: !!payload.isPinned,
        isDismissible: payload.isDismissible !== false,
        requireAck: !!payload.requireAck,
      },
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

    return announcement;
  }
}

export const adminCMSService = new AdminCMSService();
