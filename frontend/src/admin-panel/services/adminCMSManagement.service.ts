import {
  HeroBannerItem,
  PlatformAnnouncementItem,
  TrendingDestinationItem,
  FeaturedAgencyItem,
  FeaturedTripItem,
  PromotionalCampaignItem,
  PromoPopupItem,
  HomepageSEOData,
  CMSKPIStats,
  CMSScheduledItem,
  CMSRecentChangeItem,
  CMSSEOPageKey,
  SearchDatabaseResult,
  CMSSelectItem,
  CMSSelectResponse,
  CMSSelectionType,
} from '../types/cmsManagement';
import { adminApiClient } from './adminApiClient';

class AdminCMSManagementService {
  // ── 1. KPI STATS ──
  public async getKPIStats(): Promise<CMSKPIStats> {
    const response = await adminApiClient.get<CMSKPIStats>('/admin/cms/stats');
    if (response.success && response.data) {
      return response.data;
    }
    return {
      publishedBanners: { value: 0, label: 'Active Banners', growth: '0%', subtitle: '0 Live' },
      liveAnnouncements: { value: 0, label: 'Live Broadcasts', growth: '0%', subtitle: '0 Active' },
      publishedCampaigns: { value: 0, label: 'Active Campaigns', growth: '0%', subtitle: '0 Linked' },
      publishedPopups: { value: 0, label: 'Active Popups', growth: '0%', subtitle: '0 Modals' },
      activeCoupons: { value: 0, label: 'Coupons in System', growth: '0%', subtitle: '0 Available' },
      totalShowcases: { value: 0, label: 'Featured Showcases', growth: '0%', subtitle: '0 Items' },
    };
  }

  // ── 2. HERO BANNERS ──
  public async getBanners(): Promise<HeroBannerItem[]> {
    const response = await adminApiClient.get<HeroBannerItem[]>('/admin/cms/hero-banners');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async saveBanner(banner: Partial<HeroBannerItem>): Promise<HeroBannerItem> {
    if (banner.id && !banner.id.startsWith('temp-')) {
      const response = await adminApiClient.patch<HeroBannerItem>(`/admin/cms/hero-banners/${banner.id}`, banner);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to update banner');
    } else {
      const response = await adminApiClient.post<HeroBannerItem>('/admin/cms/hero-banners', banner);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to create banner');
    }
  }

  public async toggleBanner(id: string, isEnabled: boolean): Promise<HeroBannerItem> {
    const response = await adminApiClient.patch<HeroBannerItem>(`/admin/cms/hero-banners/${id}/toggle`, { isEnabled });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to toggle banner');
  }

  public async restoreBannerVersion(id: string, version: number): Promise<HeroBannerItem> {
    const response = await adminApiClient.post<HeroBannerItem>(`/admin/cms/hero-banners/${id}/restore`, { version });
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to restore banner version');
  }

  public async deleteBanner(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/hero-banners/${id}`);
    return !!response.success;
  }

  // ── 3. ANNOUNCEMENTS ──
  public async getAnnouncements(): Promise<PlatformAnnouncementItem[]> {
    const response = await adminApiClient.get<PlatformAnnouncementItem[]>('/admin/cms/announcements');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async saveAnnouncement(ann: Partial<PlatformAnnouncementItem>): Promise<PlatformAnnouncementItem> {
    if (ann.id && !ann.id.startsWith('temp-')) {
      const response = await adminApiClient.patch<PlatformAnnouncementItem>(`/admin/cms/announcements/${ann.id}`, ann);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to update announcement');
    } else {
      const response = await adminApiClient.post<PlatformAnnouncementItem>('/admin/cms/announcements', ann);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to create announcement');
    }
  }

  public async deleteAnnouncement(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/announcements/${id}`);
    return !!response.success;
  }

  // ── 4. FEATURED AGENCIES ──
  public async getFeaturedAgencies(): Promise<FeaturedAgencyItem[]> {
    const response = await adminApiClient.get<FeaturedAgencyItem[]>('/admin/cms/featured-agencies');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async featureAgency(payload: { agencyId: string; priority?: number; featuredBadge?: string; featuredUntil?: string }): Promise<any> {
    const response = await adminApiClient.post('/admin/cms/featured-agencies', payload);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to feature agency');
  }

  public async updateFeaturedAgency(id: string, payload: Partial<FeaturedAgencyItem>): Promise<any> {
    const response = await adminApiClient.patch(`/admin/cms/featured-agencies/${id}`, payload);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update featured agency');
  }

  public async unfeatureAgency(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/featured-agencies/${id}`);
    return !!response.success;
  }

  // ── 5. FEATURED TRIPS / PACKAGES ──
  public async getFeaturedTrips(): Promise<FeaturedTripItem[]> {
    const response = await adminApiClient.get<FeaturedTripItem[]>('/admin/cms/featured-trips');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async featureTrip(payload: { packageId: string; priority?: number; customBadge?: string; featuredUntil?: string }): Promise<any> {
    const response = await adminApiClient.post('/admin/cms/featured-trips', payload);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to feature package');
  }

  public async updateFeaturedTrip(id: string, payload: Partial<FeaturedTripItem>): Promise<any> {
    const response = await adminApiClient.patch(`/admin/cms/featured-trips/${id}`, payload);
    if (response.success && response.data) return response.data;
    throw new Error(response.message || 'Failed to update featured package');
  }

  public async unfeatureTrip(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/featured-trips/${id}`);
    return !!response.success;
  }

  // ── 6. TRENDING DESTINATIONS ──
  public async getDestinations(): Promise<TrendingDestinationItem[]> {
    const response = await adminApiClient.get<TrendingDestinationItem[]>('/admin/cms/trending-destinations');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async getDestinationSuggestions(): Promise<Array<{ name: string; country: string; packageCount: number; imageUrl: string }>> {
    const response = await adminApiClient.get<any[]>('/admin/cms/trending-destinations/suggestions');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async saveDestination(dest: Partial<TrendingDestinationItem>): Promise<TrendingDestinationItem> {
    if (dest.id && !dest.id.startsWith('temp-')) {
      const response = await adminApiClient.patch<TrendingDestinationItem>(`/admin/cms/trending-destinations/${dest.id}`, dest);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to update trending destination');
    } else {
      const response = await adminApiClient.post<TrendingDestinationItem>('/admin/cms/trending-destinations', dest);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to create trending destination');
    }
  }

  public async deleteDestination(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/trending-destinations/${id}`);
    return !!response.success;
  }

  // ── 7. PROMOTIONAL CAMPAIGNS ──
  public async getCampaigns(): Promise<PromotionalCampaignItem[]> {
    const response = await adminApiClient.get<PromotionalCampaignItem[]>('/admin/cms/campaigns');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async saveCampaign(camp: Partial<PromotionalCampaignItem>): Promise<PromotionalCampaignItem> {
    if (camp.id && !camp.id.startsWith('temp-')) {
      const response = await adminApiClient.patch<PromotionalCampaignItem>(`/admin/cms/campaigns/${camp.id}`, camp);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to update campaign');
    } else {
      const response = await adminApiClient.post<PromotionalCampaignItem>('/admin/cms/campaigns', camp);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to create campaign');
    }
  }

  public async deleteCampaign(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/campaigns/${id}`);
    return !!response.success;
  }

  // ── 8. STOREFRONT POPUPS ──
  public async getPopups(): Promise<PromoPopupItem[]> {
    const response = await adminApiClient.get<PromoPopupItem[]>('/admin/cms/popups');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async savePopup(pop: Partial<PromoPopupItem>): Promise<PromoPopupItem> {
    if (pop.id && !pop.id.startsWith('temp-')) {
      const response = await adminApiClient.patch<PromoPopupItem>(`/admin/cms/popups/${pop.id}`, pop);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to update popup');
    } else {
      const response = await adminApiClient.post<PromoPopupItem>('/admin/cms/popups', pop);
      if (response.success && response.data) return response.data;
      throw new Error(response.message || 'Failed to create popup');
    }
  }

  public async deletePopup(id: string): Promise<boolean> {
    const response = await adminApiClient.delete(`/admin/cms/popups/${id}`);
    return !!response.success;
  }

  // ── 9. SEO & SOCIAL META ──
  public async getSEO(pageKey: CMSSEOPageKey = 'home'): Promise<HomepageSEOData> {
    const response = await adminApiClient.get<HomepageSEOData>(`/admin/cms/seo/${pageKey}`);
    if (response.success && response.data) {
      return response.data;
    }
    return {
      pageKey,
      title: 'ApnaTrip — Discover, Customize & Book Verified Trips',
      description: 'Book verified holiday tours directly from accredited travel operators.',
      keywords: 'tour packages, travel india, kashmir tour, himachal trekking',
      ogImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    };
  }

  public async saveSEO(pageKey: CMSSEOPageKey, seo: HomepageSEOData): Promise<HomepageSEOData> {
    const response = await adminApiClient.put<HomepageSEOData>(`/cms/seo/${pageKey}`, seo);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to save SEO settings');
  }

  // ── 10. REAL DATABASE SEARCH AUTOCOMPLETE ──
  public async searchDatabase(query: string): Promise<SearchDatabaseResult> {
    if (!query || query.trim().length < 2) {
      return { packages: [], agencies: [], destinations: [], coupons: [] };
    }
    const response = await adminApiClient.get<SearchDatabaseResult>(`/cms/search?q=${encodeURIComponent(query)}`);
    if (response.success && response.data) {
      return response.data;
    }
    return { packages: [], agencies: [], destinations: [], coupons: [] };
  }

  // ── 11. AUDIT LOGS & SCHEDULED ITEMS ──
  public async getScheduledItems(): Promise<CMSScheduledItem[]> {
    const response = await adminApiClient.get<CMSScheduledItem[]>('/cms/scheduled');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  public async getRecentChanges(): Promise<CMSRecentChangeItem[]> {
    const response = await adminApiClient.get<CMSRecentChangeItem[]>('/cms/audit-logs');
    if (response.success && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }

  // ── 12. MEDIA LIBRARY & DIRECT CLOUDINARY UPLOAD ──
  public async uploadMedia(file: File, folder = 'travelos/cms'): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);

    // Call Cloudinary upload endpoint
    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json();
    if (result.success && result.data?.url) {
      // Also register into CMS media library
      try {
        await adminApiClient.post('/cms/media', {
          title: file.name,
          url: result.data.url,
          publicId: result.data.publicId || result.data.url,
          sizeBytes: file.size,
          folder,
        });
      } catch (err) {
        // Non-blocking
      }
      return { url: result.data.url, publicId: result.data.publicId };
    }
    throw new Error(result.message || 'Image upload to Cloudinary failed');
  }

  // ── 13. UNIVERSAL CMS SELECTION & BROWSE ──
  public async selectItems(
    type: CMSSelectionType,
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      category?: string;
      sortBy?: string;
      city?: string;
    } = {}
  ): Promise<CMSSelectResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {
      page: params.page || 1,
      limit: params.limit || 20,
      search: params.search,
      q: params.search,
      status: params.status,
      category: params.category,
      sortBy: params.sortBy,
      city: params.city,
    };

    Object.keys(queryParams).forEach((k) => queryParams[k] === undefined && delete queryParams[k]);

    try {
      const response = await adminApiClient.get<CMSSelectResponse>(`/cms/select/${type}`, {
        params: queryParams,
      });

      if (response.success && response.data) {
        return response.data;
      }
    } catch (err) {
      console.warn(`selectItems fallback for ${type}:`, err);
    }

    return {
      items: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  public async bulkFeatureTrips(
    packageIds: string[],
    priority: number = 1,
    customBadge: string = 'Featured Deal'
  ): Promise<any> {
    const response = await adminApiClient.post('/cms/featured-trips/bulk', {
      packageIds,
      priority,
      customBadge,
    });
    if (response.success) return response.data;
    throw new Error(response.message || 'Failed to bulk feature packages');
  }

  public async bulkFeatureAgencies(
    agencyIds: string[],
    priority: number = 1,
    featuredBadge: string = 'Top Rated Partner'
  ): Promise<any> {
    const response = await adminApiClient.post('/cms/featured-agencies/bulk', {
      agencyIds,
      priority,
      featuredBadge,
    });
    if (response.success) return response.data;
    throw new Error(response.message || 'Failed to bulk feature agencies');
  }

  public async bulkCreateTrendingDestinations(
    destinations: Array<{ name: string; country?: string; imageUrl?: string; priority?: number }>
  ): Promise<any> {
    const response = await adminApiClient.post('/cms/trending-destinations/bulk', { destinations });
    if (response.success) return response.data;
    throw new Error(response.message || 'Failed to bulk feature destinations');
  }
}

export const adminCMSManagementService = new AdminCMSManagementService();
