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
import {
  initialHeroBanners,
  initialAnnouncements,
  initialTrendingDestinations,
  initialFeaturedAgencies,
  initialFeaturedTrips,
  initialPromotionalCampaigns,
  initialPromoPopups,
  initialHomepageSections,
  initialSEOData,
  initialCMSKPIStats,
  initialCMSScheduledItems,
  initialCMSRecentChanges,
} from '../data/cmsData';

const CMS_STORAGE_KEY = 'apnatrip_admin_cms_data_v2';

interface CMSStorageShape {
  banners: HeroBannerItem[];
  announcements: PlatformAnnouncementItem[];
  destinations: TrendingDestinationItem[];
  agencies: FeaturedAgencyItem[];
  trips: FeaturedTripItem[];
  campaigns: PromotionalCampaignItem[];
  popups: PromoPopupItem[];
  sections: HomepageSectionItem[];
  seo: HomepageSEOData;
  scheduled: CMSScheduledItem[];
  recentChanges: CMSRecentChangeItem[];
}

class AdminCMSManagementService {
  private data: CMSStorageShape = {
    banners: initialHeroBanners,
    announcements: initialAnnouncements,
    destinations: initialTrendingDestinations,
    agencies: initialFeaturedAgencies,
    trips: initialFeaturedTrips,
    campaigns: initialPromotionalCampaigns,
    popups: initialPromoPopups,
    sections: initialHomepageSections,
    seo: initialSEOData,
    scheduled: initialCMSScheduledItems,
    recentChanges: initialCMSRecentChanges,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(CMS_STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
        return;
      }
    } catch {
      // ignore
    }
    this.saveToStorage();
  }

  private saveToStorage() {
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // ignore
    }
  }

  private recordChange(action: string, target: string) {
    const change: CMSRecentChangeItem = {
      id: `chg-${Date.now()}`,
      adminName: 'Super Admin',
      adminAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      action,
      target,
      timestamp: 'Just now',
    };
    this.data.recentChanges = [change, ...this.data.recentChanges].slice(0, 10);
    this.saveToStorage();
  }

  public async getKPIStats(): Promise<CMSKPIStats> {
    const published =
      this.data.banners.filter((b) => b.isEnabled).length +
      this.data.announcements.filter((a) => a.status === 'published').length +
      this.data.destinations.filter((d) => d.isEnabled).length +
      this.data.agencies.filter((a) => a.isEnabled).length +
      this.data.trips.filter((t) => t.isEnabled).length +
      this.data.campaigns.filter((c) => c.status === 'active').length;

    const campaigns = this.data.campaigns.filter((c) => c.status === 'active').length;
    const announcements = this.data.announcements.filter((a) => a.status === 'published').length;
    const banners = this.data.banners.filter((b) => b.isEnabled).length;

    return {
      publishedContent: { value: published, label: 'Published Items', growth: '+14%' },
      activeCampaigns: { value: campaigns, label: 'Active Campaigns', growth: '+20%' },
      liveAnnouncements: { value: announcements, label: 'Live Alerts', growth: '+50%' },
      activeBanners: { value: banners, label: 'Active Banners', growth: '+12%' },
      scheduledItems: { value: 5, label: 'Scheduled Ahead', growth: '+8%' },
      mediaStorage: { value: '3.4 GB', label: 'Media Assets Used', growth: '42%' },
    };
  }

  // ── HERO BANNERS ──
  public async getBanners(): Promise<HeroBannerItem[]> {
    return [...this.data.banners];
  }

  public async saveBanner(banner: Partial<HeroBannerItem>): Promise<HeroBannerItem> {
    let saved: HeroBannerItem;
    if (banner.id) {
      this.data.banners = this.data.banners.map((b) =>
        b.id === banner.id ? ({ ...b, ...banner } as HeroBannerItem) : b
      );
      saved = this.data.banners.find((b) => b.id === banner.id)!;
      this.recordChange('Updated Hero Banner', saved.title);
    } else {
      saved = {
        id: `ban-${Date.now()}`,
        title: banner.title || 'New Hero Banner',
        subtitle: banner.subtitle || '',
        ctaText: banner.ctaText || 'Learn More',
        ctaLink: banner.ctaLink || '/packages',
        desktopImage:
          banner.desktopImage ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
        mobileImage:
          banner.mobileImage ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
        startDate: banner.startDate || new Date().toISOString().split('T')[0],
        endDate: banner.endDate || '2025-12-31',
        priority: banner.priority || this.data.banners.length + 1,
        isEnabled: banner.isEnabled !== undefined ? banner.isEnabled : true,
        status: banner.status || 'published',
      };
      this.data.banners = [saved, ...this.data.banners];
      this.recordChange('Created new Hero Banner', saved.title);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteBanner(id: string): Promise<boolean> {
    const item = this.data.banners.find((b) => b.id === id);
    if (!item) return false;
    this.data.banners = this.data.banners.filter((b) => b.id !== id);
    this.recordChange('Deleted Hero Banner', item.title);
    this.saveToStorage();
    return true;
  }

  // ── ANNOUNCEMENTS ──
  public async getAnnouncements(): Promise<PlatformAnnouncementItem[]> {
    return [...this.data.announcements];
  }

  public async saveAnnouncement(
    ann: Partial<PlatformAnnouncementItem>
  ): Promise<PlatformAnnouncementItem> {
    let saved: PlatformAnnouncementItem;
    if (ann.id) {
      this.data.announcements = this.data.announcements.map((a) =>
        a.id === ann.id ? ({ ...a, ...ann } as PlatformAnnouncementItem) : a
      );
      saved = this.data.announcements.find((a) => a.id === ann.id)!;
      this.recordChange('Updated Platform Announcement', saved.title);
    } else {
      saved = {
        id: `ann-${Date.now()}`,
        title: ann.title || 'New Announcement',
        description: ann.description || '',
        type: ann.type || 'info',
        audience: ann.audience || 'all',
        location: ann.location || 'both',
        isPinned: !!ann.isPinned,
        isDismissible: ann.isDismissible !== undefined ? ann.isDismissible : true,
        requireAck: !!ann.requireAck,
        startDate: ann.startDate || new Date().toISOString().split('T')[0],
        endDate: ann.endDate || '2025-12-31',
        status: ann.status || 'published',
      };
      this.data.announcements = [saved, ...this.data.announcements];
      this.recordChange('Dispatched Platform Announcement', saved.title);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteAnnouncement(id: string): Promise<boolean> {
    const item = this.data.announcements.find((a) => a.id === id);
    if (!item) return false;
    this.data.announcements = this.data.announcements.filter((a) => a.id !== id);
    this.recordChange('Deleted Announcement', item.title);
    this.saveToStorage();
    return true;
  }

  // ── TRENDING DESTINATIONS ──
  public async getDestinations(): Promise<TrendingDestinationItem[]> {
    return [...this.data.destinations];
  }

  public async saveDestination(
    dest: Partial<TrendingDestinationItem>
  ): Promise<TrendingDestinationItem> {
    let saved: TrendingDestinationItem;
    if (dest.id) {
      this.data.destinations = this.data.destinations.map((d) =>
        d.id === dest.id ? ({ ...d, ...dest } as TrendingDestinationItem) : d
      );
      saved = this.data.destinations.find((d) => d.id === dest.id)!;
      this.recordChange('Updated Trending Destination', saved.name);
    } else {
      saved = {
        id: `dest-${Date.now()}`,
        name: dest.name || 'New Destination',
        country: dest.country || 'India',
        description: dest.description || '',
        imageUrl:
          dest.imageUrl ||
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        priority: dest.priority || this.data.destinations.length + 1,
        isTrending: dest.isTrending !== undefined ? dest.isTrending : true,
        displayOrder: dest.displayOrder || this.data.destinations.length + 1,
        isEnabled: dest.isEnabled !== undefined ? dest.isEnabled : true,
      };
      this.data.destinations = [...this.data.destinations, saved];
      this.recordChange('Added Trending Destination', saved.name);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteDestination(id: string): Promise<boolean> {
    const item = this.data.destinations.find((d) => d.id === id);
    if (!item) return false;
    this.data.destinations = this.data.destinations.filter((d) => d.id !== id);
    this.recordChange('Deleted Destination', item.name);
    this.saveToStorage();
    return true;
  }

  // ── FEATURED AGENCIES ──
  public async getFeaturedAgencies(): Promise<FeaturedAgencyItem[]> {
    return [...this.data.agencies];
  }

  public async saveFeaturedAgency(agency: Partial<FeaturedAgencyItem>): Promise<FeaturedAgencyItem> {
    let saved: FeaturedAgencyItem;
    if (agency.id) {
      this.data.agencies = this.data.agencies.map((a) =>
        a.id === agency.id ? ({ ...a, ...agency } as FeaturedAgencyItem) : a
      );
      saved = this.data.agencies.find((a) => a.id === agency.id)!;
      this.recordChange('Updated Featured Agency', saved.agencyName);
    } else {
      saved = {
        id: `ag-${Date.now()}`,
        agencyName: agency.agencyName || 'New Agency',
        agencyLogo:
          agency.agencyLogo ||
          'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop',
        rating: agency.rating || 4.8,
        isVerified: agency.isVerified !== undefined ? agency.isVerified : true,
        featuredUntil: agency.featuredUntil || '2025-12-31',
        priority: agency.priority || this.data.agencies.length + 1,
        sortOrder: agency.sortOrder || this.data.agencies.length + 1,
        isEnabled: agency.isEnabled !== undefined ? agency.isEnabled : true,
      };
      this.data.agencies = [...this.data.agencies, saved];
      this.recordChange('Added Featured Agency', saved.agencyName);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteFeaturedAgency(id: string): Promise<boolean> {
    const item = this.data.agencies.find((a) => a.id === id);
    if (!item) return false;
    this.data.agencies = this.data.agencies.filter((a) => a.id !== id);
    this.recordChange('Removed Featured Agency', item.agencyName);
    this.saveToStorage();
    return true;
  }

  // ── FEATURED TRIPS ──
  public async getFeaturedTrips(): Promise<FeaturedTripItem[]> {
    return [...this.data.trips];
  }

  public async saveFeaturedTrip(trip: Partial<FeaturedTripItem>): Promise<FeaturedTripItem> {
    let saved: FeaturedTripItem;
    if (trip.id) {
      this.data.trips = this.data.trips.map((t) =>
        t.id === trip.id ? ({ ...t, ...trip } as FeaturedTripItem) : t
      );
      saved = this.data.trips.find((t) => t.id === trip.id)!;
      this.recordChange('Updated Featured Trip', saved.tripTitle);
    } else {
      saved = {
        id: `trip-${Date.now()}`,
        tripTitle: trip.tripTitle || 'New Trip Package',
        agencyName: trip.agencyName || 'Wanderlust Holidays',
        bannerImage:
          trip.bannerImage ||
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop',
        discountBadge: trip.discountBadge || 'Special Offer',
        isTrending: trip.isTrending !== undefined ? trip.isTrending : true,
        isFeatured: trip.isFeatured !== undefined ? trip.isFeatured : true,
        priority: trip.priority || this.data.trips.length + 1,
        schedule: trip.schedule || 'Flexible Dates',
        displayOrder: trip.displayOrder || this.data.trips.length + 1,
        isEnabled: trip.isEnabled !== undefined ? trip.isEnabled : true,
      };
      this.data.trips = [...this.data.trips, saved];
      this.recordChange('Added Featured Trip', saved.tripTitle);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteFeaturedTrip(id: string): Promise<boolean> {
    const item = this.data.trips.find((t) => t.id === id);
    if (!item) return false;
    this.data.trips = this.data.trips.filter((t) => t.id !== id);
    this.recordChange('Removed Featured Trip', item.tripTitle);
    this.saveToStorage();
    return true;
  }

  // ── CAMPAIGNS ──
  public async getCampaigns(): Promise<PromotionalCampaignItem[]> {
    return [...this.data.campaigns];
  }

  public async saveCampaign(
    camp: Partial<PromotionalCampaignItem>
  ): Promise<PromotionalCampaignItem> {
    let saved: PromotionalCampaignItem;
    if (camp.id) {
      this.data.campaigns = this.data.campaigns.map((c) =>
        c.id === camp.id ? ({ ...c, ...camp } as PromotionalCampaignItem) : c
      );
      saved = this.data.campaigns.find((c) => c.id === camp.id)!;
      this.recordChange('Updated Promotional Campaign', saved.title);
    } else {
      saved = {
        id: `camp-${Date.now()}`,
        title: camp.title || 'New Campaign',
        description: camp.description || '',
        bannerImage:
          camp.bannerImage ||
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
        ctaText: camp.ctaText || 'View Campaign',
        ctaLink: camp.ctaLink || '/campaigns',
        startDate: camp.startDate || new Date().toISOString().split('T')[0],
        endDate: camp.endDate || '2025-12-31',
        status: camp.status || 'active',
        priority: camp.priority || this.data.campaigns.length + 1,
        applicableTo: camp.applicableTo || 'both',
      };
      this.data.campaigns = [saved, ...this.data.campaigns];
      this.recordChange('Launched Promotional Campaign', saved.title);
    }
    this.saveToStorage();
    return saved;
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    const item = this.data.campaigns.find((c) => c.id === id);
    if (!item) return false;
    this.data.campaigns = this.data.campaigns.filter((c) => c.id !== id);
    this.recordChange('Deleted Campaign', item.title);
    this.saveToStorage();
    return true;
  }

  // ── POPUPS ──
  public async getPopups(): Promise<PromoPopupItem[]> {
    return [...this.data.popups];
  }

  public async savePopup(pop: Partial<PromoPopupItem>): Promise<PromoPopupItem> {
    let saved: PromoPopupItem;
    if (pop.id) {
      this.data.popups = this.data.popups.map((p) =>
        p.id === pop.id ? ({ ...p, ...pop } as PromoPopupItem) : p
      );
      saved = this.data.popups.find((p) => p.id === pop.id)!;
      this.recordChange('Updated Promo Popup', saved.title);
    } else {
      saved = {
        id: `pop-${Date.now()}`,
        title: pop.title || 'New Promo Popup',
        description: pop.description || '',
        imageUrl:
          pop.imageUrl ||
          'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop',
        buttonText: pop.buttonText || 'Claim Offer',
        buttonLink: pop.buttonLink || '/offers',
        hasCloseButton: pop.hasCloseButton !== undefined ? pop.hasCloseButton : true,
        delaySeconds: pop.delaySeconds || 5,
        audience: pop.audience || 'all',
        frequency: pop.frequency || 'once_per_session',
        isEnabled: pop.isEnabled !== undefined ? pop.isEnabled : true,
      };
      this.data.popups = [saved, ...this.data.popups];
      this.recordChange('Created Promo Popup', saved.title);
    }
    this.saveToStorage();
    return saved;
  }

  public async deletePopup(id: string): Promise<boolean> {
    const item = this.data.popups.find((p) => p.id === id);
    if (!item) return false;
    this.data.popups = this.data.popups.filter((p) => p.id !== id);
    this.recordChange('Deleted Promo Popup', item.title);
    this.saveToStorage();
    return true;
  }

  // ── HOMEPAGE SECTIONS ──
  public async getSections(): Promise<HomepageSectionItem[]> {
    return [...this.data.sections].sort((a, b) => a.order - b.order);
  }

  public async updateSectionOrder(sections: HomepageSectionItem[]): Promise<HomepageSectionItem[]> {
    this.data.sections = sections.map((s, idx) => ({ ...s, order: idx + 1 }));
    this.recordChange('Reordered Homepage Sections', `${sections.length} sections updated`);
    this.saveToStorage();
    return this.data.sections;
  }

  public async toggleSection(id: string, isEnabled: boolean): Promise<HomepageSectionItem[]> {
    this.data.sections = this.data.sections.map((s) => (s.id === id ? { ...s, isEnabled } : s));
    this.saveToStorage();
    return this.data.sections;
  }

  // ── SEO ──
  public async getSEO(): Promise<HomepageSEOData> {
    return { ...this.data.seo };
  }

  public async saveSEO(seo: HomepageSEOData): Promise<HomepageSEOData> {
    this.data.seo = { ...seo };
    this.recordChange('Updated Homepage SEO Tags', seo.title);
    this.saveToStorage();
    return this.data.seo;
  }

  // ── BOTTOM WIDGETS DATA ──
  public async getScheduledItems(): Promise<CMSScheduledItem[]> {
    return [...this.data.scheduled];
  }

  public async getRecentChanges(): Promise<CMSRecentChangeItem[]> {
    return [...this.data.recentChanges];
  }
}

export const adminCMSManagementService = new AdminCMSManagementService();
