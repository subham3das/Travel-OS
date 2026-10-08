import { CMSBannerModel } from '../models/cmsBanner.model.js';
import { CMSAnnouncementModel } from '../models/cmsAnnouncement.model.js';
import { CMSPopupModel } from '../models/cmsPopup.model.js';
import { CMSSEOModel } from '../models/cmsSEO.model.js';
import { discoveryEngineService, DiscoverySectionResponse } from './discoveryEngine.service.js';

export interface HomepageFeedResponse {
  heroBanners: any[];
  announcements: any[];
  popup?: any;
  seo?: any;
  sections: DiscoverySectionResponse[];
}

export class HomepageService {
  /**
   * Fast aggregated endpoint for the Storefront Homepage
   * Hero Banner = manual CMS
   * Announcements & Popup = manual CMS
   * Everything else = automatic discovery engine with CMS overrides
   */
  public async getHomepageFeed(userId?: string): Promise<HomepageFeedResponse> {
    const today = new Date().toISOString().slice(0, 10);

    const [banners, announcements, activePopup, seo, discoverySections] = await Promise.all([
      // 1. Hero Banners (The ONLY manual layout element)
      CMSBannerModel.find({
        isDeleted: false,
        isEnabled: true,
        status: 'published',
        $or: [{ startDate: { $exists: false } }, { startDate: '' }, { startDate: { $lte: today } }],
      })
        .sort({ priority: 1, createdAt: -1 })
        .lean(),

      // 2. Announcements
      CMSAnnouncementModel.find({
        isDeleted: false,
        isEnabled: true,
        status: 'published',
        placement: { $in: ['all', 'home_only'] },
        $or: [{ endDate: { $exists: false } }, { endDate: '' }, { endDate: { $gte: today } }],
      })
        .sort({ isPinned: -1, priority: 1, createdAt: -1 })
        .lean(),

      // 3. Active Popup
      CMSPopupModel.findOne({
        isDeleted: false,
        isActive: true,
        status: 'published',
        $or: [{ startDate: { $exists: false } }, { startDate: '' }, { startDate: { $lte: today } }],
      })
        .sort({ priority: 1 })
        .lean(),

      // 4. SEO
      CMSSEOModel.findOne({ pageKey: 'home' }).lean(),

      // 5. Dynamic Discovery Sections (MongoDB -> Ranking Engine -> CMS Override)
      discoveryEngineService.getHomepageDiscoverySections(userId),
    ]);

    const formattedBanners = (banners || []).map((b) => ({
      id: String(b._id),
      _id: String(b._id),
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText || 'Explore Now',
      desktopImage: b.desktopImage,
      mobileImage: b.mobileImage || b.desktopImage,
      targetType: b.targetType,
      targetId: b.targetId,
      externalUrl: b.externalUrl,
      priority: b.priority,
    }));

    const formattedAnnouncements = (announcements || []).map((a) => ({
      id: String(a._id),
      _id: String(a._id),
      message: a.message,
      linkText: a.linkText,
      linkUrl: a.linkUrl,
      bgColor: a.bgColor || '#583BE8',
      textColor: a.textColor || '#FFFFFF',
      isPinned: a.isPinned,
    }));

    return {
      heroBanners: formattedBanners,
      announcements: formattedAnnouncements,
      popup: activePopup
        ? {
            id: String(activePopup._id),
            title: activePopup.title,
            description: activePopup.description,
            imageUrl: activePopup.imageUrl,
            ctaText: activePopup.ctaText,
            ctaUrl: activePopup.ctaUrl,
            frequency: activePopup.frequency,
            delaySeconds: activePopup.delaySeconds,
          }
        : undefined,
      seo: seo || undefined,
      sections: discoverySections,
    };
  }
}

export const homepageService = new HomepageService();
