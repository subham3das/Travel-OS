import { apiClient } from '../../services/apiClient';
import { ExploreFeedResponse, HomepageFeedResponse, DiscoverySection } from '../types/discovery';

class DiscoveryService {
  /**
   * Fetch full dynamic explore discovery feed
   */
  public async getExploreFeed(params?: {
    category?: string;
    adventureType?: string;
    search?: string;
  }): Promise<ExploreFeedResponse> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All' && params.category !== 'all') {
      query.append('category', params.category);
    }
    if (params?.adventureType && params.adventureType !== 'All' && params.adventureType !== 'all') {
      query.append('adventureType', params.adventureType);
    }
    if (params?.search && params.search.trim()) {
      query.append('search', params.search.trim());
    }

    const res = await apiClient.get<ExploreFeedResponse>(
      `/explore?${query.toString()}`
    );

    return res.data || { sections: [], categories: ['All'], adventureTypes: ['All'] };
  }

  /**
   * Fetch dynamic homepage feed (Manual hero banner + auto discovery sections)
   */
  public async getHomepageFeed(): Promise<HomepageFeedResponse> {
    const res = await apiClient.get<HomepageFeedResponse>('/homepage');
    return (
      res.data || {
        heroBanners: [],
        announcements: [],
        sections: [],
      }
    );
  }

  /**
   * Fetch all configured sections metadata
   */
  public async getSectionsList(): Promise<DiscoverySection[]> {
    const res = await apiClient.get<{ sections: DiscoverySection[] }>(
      '/discovery/sections'
    );
    return res.data?.sections || [];
  }

  /**
   * Track section impression or click
   */
  public async trackEvent(data: {
    sectionId: string;
    entityType: 'section' | 'package' | 'agency' | 'car';
    eventType: 'impression' | 'click' | 'wishlist' | 'booking';
    entityId?: string;
  }): Promise<void> {
    try {
      await apiClient.post('/discovery/track', data);
    } catch {
      // Silently ignore telemetry failures
    }
  }
}

export const discoveryService = new DiscoveryService();
