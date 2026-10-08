import { CMSBannerModel } from '../models/cmsBanner.model.js';
import { CMSAnnouncementModel } from '../models/cmsAnnouncement.model.js';
import {
  CMSFeaturedAgencyModel,
  CMSFeaturedTripModel,
  CMSTrendingDestinationModel,
} from '../models/cmsFeature.model.js';
import { CMSCampaignModel } from '../models/cmsCampaign.model.js';
import { CMSPopupModel } from '../models/cmsPopup.model.js';
import { CMSSEOModel, CMSSEOPageKey } from '../models/cmsSEO.model.js';

export class PublicCMSService {
  /**
   * Fast aggregated endpoint for the Storefront Homepage
   */
  async getHomeCMSData() {
    const today = new Date().toISOString().slice(0, 10);

    const [
      banners,
      announcements,
      destinations,
      featuredAgenciesRaw,
      featuredTripsRaw,
      activePopup,
      seo,
    ] = await Promise.all([
      // 1. Hero Banners
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

      // 3. Trending Destinations
      CMSTrendingDestinationModel.find({
        isDeleted: false,
        isActive: true,
      })
        .sort({ priority: 1 })
        .lean(),

      // 4. Featured Agencies (Live Populated)
      CMSFeaturedAgencyModel.find({
        isDeleted: false,
        isActive: true,
      })
        .populate({
          path: 'agencyId',
          match: { isDeleted: false, status: { $ne: 'SUSPENDED' } },
          select: '_id agencyId companyName name rating isVerified profile logo coverImage reviewsCount',
        })
        .sort({ priority: 1 })
        .lean(),

      // 5. Featured Trips / Packages (Live Populated)
      CMSFeaturedTripModel.find({
        isDeleted: false,
        isActive: true,
      })
        .populate({
          path: 'packageId',
          match: { isDeleted: false, isPublished: { $ne: false } },
          select: '_id packageId title destination destinationCountry price originalPrice discountPercent coverImage images durationDays durationNights rating reviewCount agencyName agencyId badge',
        })
        .sort({ priority: 1 })
        .lean(),

      // 6. Active Popup
      CMSPopupModel.findOne({
        isDeleted: false,
        isActive: true,
        status: 'published',
        $or: [{ startDate: { $exists: false } }, { startDate: '' }, { startDate: { $lte: today } }],
      })
        .sort({ priority: 1 })
        .lean(),

      // 7. Homepage SEO
      CMSSEOModel.findOne({ pageKey: 'home' }).lean(),
    ]);

    // Format agencies
    const featuredAgencies = (featuredAgenciesRaw || [])
      .filter((fa: any) => fa.agencyId)
      .map((fa: any) => {
        const a = fa.agencyId;
        return {
          id: a._id.toString(),
          agencyId: a.agencyId || a._id.toString(),
          name: a.companyName || a.name || 'Verified Partner',
          rating: a.rating || 4.8,
          reviewsCount: a.reviewsCount || 120,
          isVerified: a.isVerified !== false,
          featuredBadge: fa.featuredBadge || 'Featured Partner',
          logoUrl: a.profile?.logoUrl || a.logo || '',
          coverImageUrl: a.profile?.coverUrl || a.coverImage || '',
          priority: fa.priority || 1,
        };
      });

    // Format packages
    const featuredTrips = (featuredTripsRaw || [])
      .filter((ft: any) => ft.packageId)
      .map((ft: any) => {
        const p = ft.packageId;
        return {
          id: p._id.toString(),
          packageId: p.packageId || p._id.toString(),
          title: p.title,
          destination: p.destination,
          price: p.price,
          originalPrice: p.originalPrice,
          badge: ft.customBadge || p.badge || 'Featured',
          rating: p.rating || 4.8,
          reviewsCount: p.reviewCount || 95,
          duration: `${p.durationDays || 3} Days`,
          imageUrl: p.coverImage || p.images?.[0] || '',
          agencyName: p.agencyName || 'Verified Agency',
          priority: ft.priority || 1,
        };
      });

    return {
      banners: banners.map((b: any) => ({
        id: b.bannerId || b._id.toString(),
        title: b.title,
        subtitle: b.subtitle,
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage || b.desktopImage,
        targetType: b.targetType || 'Package',
        targetId: b.targetId || '',
        externalUrl: b.externalUrl || '',
        ctaText: b.ctaText || 'Explore Now',
        priority: b.priority,
      })),
      announcements: announcements.map((a: any) => ({
        id: a.announcementId || a._id.toString(),
        title: a.title,
        description: a.description,
        type: a.type,
        bgColor: a.bgColor,
        textColor: a.textColor,
        targetType: a.targetType,
        targetId: a.targetId,
        linkUrl: a.linkUrl,
        ctaText: a.ctaText,
        isPinned: a.isPinned,
        isDismissible: a.isDismissible,
      })),
      destinations: destinations.map((d: any) => ({
        id: d._id.toString(),
        name: d.destinationName,
        country: d.country,
        region: d.region,
        description: d.description,
        imageUrl: d.imageUrl,
        isTrending: d.isTrending,
      })),
      featuredAgencies,
      featuredTrips,
      popup: activePopup
        ? {
            id: activePopup.popupId || activePopup._id.toString(),
            title: activePopup.title,
            description: activePopup.description,
            mediaType: activePopup.mediaType,
            mediaUrl: activePopup.mediaUrl,
            buttonText: activePopup.buttonText,
            buttonLink: activePopup.buttonLink,
            targetType: activePopup.targetType,
            targetId: activePopup.targetId,
            delaySeconds: activePopup.delaySeconds,
            frequency: activePopup.frequency,
            hasCloseButton: activePopup.hasCloseButton,
          }
        : null,
      seo: seo || {
        title: 'ApnaTrip — Discover, Customize & Book Verified Trips in India',
        description: 'Book verified holiday tours, weekend getaways, and luxury Himalayan trekking packages directly from accredited Indian travel agencies.',
        keywords: ['tour packages', 'travel india', 'kashmir tour', 'himachal trekking', 'bali packages'],
        ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
      },
    };
  }

  async getSEO(pageKey: CMSSEOPageKey = 'home') {
    const seo = await CMSSEOModel.findOne({ pageKey }).lean();
    return (
      seo || {
        pageKey,
        title: `ApnaTrip — Discover & Book Trips (${pageKey})`,
        description: 'Verified holiday tours with accredited local operators.',
        keywords: ['travel', 'india', 'tours'],
        ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
      }
    );
  }
}

export const publicCMSService = new PublicCMSService();
