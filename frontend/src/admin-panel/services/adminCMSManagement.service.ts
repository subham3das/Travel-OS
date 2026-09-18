import {
  HeroBannerItem,
  PlatformAnnouncementItem,
  TrendingDestinationItem,
  FeaturedAgencyItem,
  FeaturedTripItem,
  PromotionalCampaignItem,
  PromoPopupItem,
  HomepageSectionItem,
  HomepageSEOData,
  CMSKPIStats,
  CMSScheduledItem,
  CMSRecentChangeItem,
} from '../types/cmsManagement';
import { adminApiClient } from './adminApiClient';

export const initialHeroBanners: HeroBannerItem[] = [
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
    status: 'published',
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
    status: 'published',
  },
];

export const initialAnnouncements: PlatformAnnouncementItem[] = [
  {
    id: 'ann-001',
    title: 'Scheduled System Maintenance on Sunday 02:00 AM IST',
    description: 'We will be upgrading our database infrastructure for faster booking queries. The admin and customer apps will be unavailable for ~20 minutes.',
    type: 'warning',
    audience: 'all',
    location: 'both',
    isPinned: true,
    isDismissible: true,
    requireAck: false,
    startDate: '2025-06-20',
    endDate: '2025-06-22',
    status: 'published',
  },
];

export const initialTrendingDestinations: TrendingDestinationItem[] = [
  {
    id: 'dest-001',
    name: 'Spiti Valley',
    country: 'Himachal Pradesh, India',
    description: 'High-altitude cold desert with Tibetan monasteries, Chandratal lake, and rugged mountain passes.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop',
    priority: 1,
    isTrending: true,
    displayOrder: 1,
    isEnabled: true,
  },
];

export const initialFeaturedAgencies: FeaturedAgencyItem[] = [
  {
    id: 'ag-001',
    agencyName: 'Himalayan Highs Ltd',
    agencyLogo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
    rating: 4.9,
    isVerified: true,
    featuredUntil: '2025-12-31',
    priority: 1,
    sortOrder: 1,
    isEnabled: true,
  },
];

export const initialFeaturedTrips: FeaturedTripItem[] = [
  {
    id: 'trip-001',
    tripTitle: '7D6N Ladakh Highlights & Nubra Valley Tour',
    agencyName: 'Himalayan Highs Ltd',
    bannerImage: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=800&auto=format&fit=crop',
    discountBadge: '15% OFF',
    isTrending: true,
    isFeatured: true,
    priority: 1,
    schedule: 'Every Saturday',
    displayOrder: 1,
    isEnabled: true,
  },
];

export const initialPromotionalCampaigns: PromotionalCampaignItem[] = [
  {
    id: 'camp-001',
    title: 'Monsoon Magic Flash Sale',
    description: 'Special discounts on luxury treehouse and plantation stays across Kerala & Coorg.',
    bannerImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    ctaText: 'Explore Monsoon Deals',
    ctaLink: '/campaigns/monsoon-magic',
    startDate: '2025-07-01',
    endDate: '2025-08-31',
    status: 'active',
    priority: 1,
    applicableTo: 'both',
  },
];

export const initialPromoPopups: PromoPopupItem[] = [
  {
    id: 'pop-001',
    title: 'Get ₹2,000 Off Your First Trip! 🎉',
    description: 'Sign up today and use code WELCOME2K on your first booking over ₹25,000.',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
    buttonText: 'Claim Voucher',
    buttonLink: '/offers/welcome',
    hasCloseButton: true,
    delaySeconds: 5,
    audience: 'first_time',
    frequency: 'once_per_session',
    isEnabled: true,
  },
];

export const initialHomepageSections: HomepageSectionItem[] = [
  { id: 'sec-hero', key: 'hero_banner', name: 'Hero Carousel', description: 'Main hero slides', isEnabled: true, order: 1 },
  { id: 'sec-ann', key: 'announcements', name: 'Top Announcement Banner', description: 'Platform broadcast notice', isEnabled: true, order: 2 },
  { id: 'sec-dest', key: 'trending_destinations', name: 'Trending Destinations', description: 'Curated popular places', isEnabled: true, order: 3 },
  { id: 'sec-trips', key: 'featured_trips', name: 'Featured Tour Packages', description: 'Handpicked itineraries', isEnabled: true, order: 4 },
  { id: 'sec-agency', key: 'featured_agencies', name: 'Verified Agency Partners', description: 'Top rated operators', isEnabled: true, order: 5 },
];

export const initialSEOData: HomepageSEOData = {
  title: 'ApnaTrip — Discover, Customize & Book Verified Group Trips in India',
  description: 'Book verified holiday tours, weekend getaways, and luxury Himalayan trekking packages directly from accredited Indian travel agencies with instant confirmation.',
  keywords: 'tour packages, travel india, kashmir tour, himachal trekking, bali packages, goa beach resort',
  ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
};

export const initialCMSKPIStats: CMSKPIStats = {
  publishedContent: { value: 18, label: 'Published Items', growth: '+14%' },
  activeCampaigns: { value: 3, label: 'Active Campaigns', growth: '+20%' },
  liveAnnouncements: { value: 1, label: 'Live Alerts', growth: '0%' },
  activeBanners: { value: 2, label: 'Active Banners', growth: '+12%' },
  scheduledItems: { value: 5, label: 'Scheduled Ahead', growth: '+8%' },
  mediaStorage: { value: '3.4 GB', label: 'Media Assets Used', growth: '42%' },
};

export const initialCMSScheduledItems: CMSScheduledItem[] = [
  { id: 'sch-1', title: 'Monsoon Flash Sale Launch', category: 'Promotional Campaign', startDate: '2025-07-01', endDate: '2025-08-31', status: 'published' },
];

export const initialCMSRecentChanges: CMSRecentChangeItem[] = [
  { id: 'chg-1', adminName: 'Super Admin', adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', action: 'Published Hero Banner', target: 'Discover Kashmir', timestamp: '10m ago' },
];

class AdminCMSManagementService {
  public async getKPIStats(): Promise<CMSKPIStats> {
    try {
      const response = await adminApiClient.get<CMSKPIStats>('/cms/stats');
      if (response.success && response.data) {
        return response.data;
      }
      return initialCMSKPIStats;
    } catch {
      return initialCMSKPIStats;
    }
  }

  public async getBanners(): Promise<HeroBannerItem[]> {
    try {
      const response = await adminApiClient.get<HeroBannerItem[]>('/cms/hero-banners');
      if (response.success && response.data) {
        return response.data;
      }
      return initialHeroBanners;
    } catch {
      return initialHeroBanners;
    }
  }

  public async saveBanner(banner: Partial<HeroBannerItem>): Promise<HeroBannerItem> {
    const response = await adminApiClient.post<HeroBannerItem>('/cms/hero-banners', banner);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to save banner');
  }

  public async deleteBanner(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/cms/hero-banners/${id}`);
    return response.success;
  }

  public async getAnnouncements(): Promise<PlatformAnnouncementItem[]> {
    try {
      const response = await adminApiClient.get<PlatformAnnouncementItem[]>('/cms/announcements');
      if (response.success && response.data) {
        return response.data;
      }
      return initialAnnouncements;
    } catch {
      return initialAnnouncements;
    }
  }

  public async saveAnnouncement(ann: Partial<PlatformAnnouncementItem>): Promise<PlatformAnnouncementItem> {
    const response = await adminApiClient.post<PlatformAnnouncementItem>('/cms/announcements', ann);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to save announcement');
  }

  public async deleteAnnouncement(id: string): Promise<boolean> {
    return true;
  }

  public async getDestinations(): Promise<TrendingDestinationItem[]> {
    return initialTrendingDestinations;
  }

  public async saveDestination(dest: Partial<TrendingDestinationItem>): Promise<TrendingDestinationItem> {
    return { ...initialTrendingDestinations[0], ...dest } as TrendingDestinationItem;
  }

  public async deleteDestination(id: string): Promise<boolean> {
    return true;
  }

  public async getFeaturedAgencies(): Promise<FeaturedAgencyItem[]> {
    return initialFeaturedAgencies;
  }

  public async saveFeaturedAgency(agency: Partial<FeaturedAgencyItem>): Promise<FeaturedAgencyItem> {
    return { ...initialFeaturedAgencies[0], ...agency } as FeaturedAgencyItem;
  }

  public async deleteFeaturedAgency(id: string): Promise<boolean> {
    return true;
  }

  public async getFeaturedTrips(): Promise<FeaturedTripItem[]> {
    return initialFeaturedTrips;
  }

  public async saveFeaturedTrip(trip: Partial<FeaturedTripItem>): Promise<FeaturedTripItem> {
    return { ...initialFeaturedTrips[0], ...trip } as FeaturedTripItem;
  }

  public async deleteFeaturedTrip(id: string): Promise<boolean> {
    return true;
  }

  public async getCampaigns(): Promise<PromotionalCampaignItem[]> {
    return initialPromotionalCampaigns;
  }

  public async saveCampaign(camp: Partial<PromotionalCampaignItem>): Promise<PromotionalCampaignItem> {
    return { ...initialPromotionalCampaigns[0], ...camp } as PromotionalCampaignItem;
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    return true;
  }

  public async getPopups(): Promise<PromoPopupItem[]> {
    return initialPromoPopups;
  }

  public async savePopup(pop: Partial<PromoPopupItem>): Promise<PromoPopupItem> {
    return { ...initialPromoPopups[0], ...pop } as PromoPopupItem;
  }

  public async deletePopup(id: string): Promise<boolean> {
    return true;
  }

  public async getSections(): Promise<HomepageSectionItem[]> {
    return initialHomepageSections;
  }

  public async updateSectionOrder(sections: HomepageSectionItem[]): Promise<HomepageSectionItem[]> {
    return sections;
  }

  public async toggleSection(id: string, isEnabled: boolean): Promise<HomepageSectionItem[]> {
    return initialHomepageSections;
  }

  public async getSEO(): Promise<HomepageSEOData> {
    return initialSEOData;
  }

  public async saveSEO(seo: HomepageSEOData): Promise<HomepageSEOData> {
    return seo;
  }

  public async getScheduledItems(): Promise<CMSScheduledItem[]> {
    return initialCMSScheduledItems;
  }

  public async getRecentChanges(): Promise<CMSRecentChangeItem[]> {
    return initialCMSRecentChanges;
  }
}

export const adminCMSManagementService = new AdminCMSManagementService();
