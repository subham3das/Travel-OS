import { apiClient } from '../../services/apiClient';

export interface CMSHomeResponse {
  banners: Array<{
    id: string;
    title: string;
    subtitle?: string;
    desktopImage: string;
    mobileImage?: string;
    targetType: 'Package' | 'Agency' | 'Destination' | 'Car Rental' | 'External';
    targetId?: string;
    externalUrl?: string;
    ctaText: string;
    priority: number;
  }>;
  announcements: Array<{
    id: string;
    title: string;
    description?: string;
    type: 'info' | 'warning' | 'alert' | 'success';
    bgColor?: string;
    textColor?: string;
    targetType?: string;
    targetId?: string;
    linkUrl?: string;
    ctaText?: string;
    isPinned: boolean;
    isDismissible: boolean;
  }>;
  destinations: Array<{
    id: string;
    name: string;
    country: string;
    region?: string;
    description?: string;
    imageUrl: string;
    isTrending: boolean;
  }>;
  featuredAgencies: Array<{
    id: string;
    agencyId: string;
    name: string;
    rating: number;
    reviewsCount: number;
    isVerified: boolean;
    featuredBadge: string;
    logoUrl: string;
    coverImageUrl: string;
    priority: number;
  }>;
  featuredTrips: Array<{
    id: string;
    packageId: string;
    title: string;
    destination: string;
    price: number;
    originalPrice?: number;
    badge: string;
    rating: number;
    reviewsCount: number;
    duration: string;
    imageUrl: string;
    agencyName: string;
    priority: number;
  }>;
  popup: {
    id: string;
    title: string;
    description?: string;
    mediaType: 'image' | 'video';
    mediaUrl: string;
    buttonText?: string;
    buttonLink?: string;
    targetType?: string;
    targetId?: string;
    delaySeconds: number;
    frequency: 'once_per_user' | 'always_show' | 'once_per_session';
    hasCloseButton: boolean;
  } | null;
  seo: {
    title: string;
    description: string;
    keywords?: string[] | string;
    ogImage?: string;
  };
}

class CMSService {
  public async getHomeData(): Promise<CMSHomeResponse | null> {
    try {
      const response = await apiClient.get<CMSHomeResponse>('/cms/home');
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Failed to fetch CMS home data:', err);
      return null;
    }
  }

  public async getPageSEO(pageKey: string): Promise<any> {
    try {
      const response = await apiClient.get(`/cms/seo/${pageKey}`);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch {
      return null;
    }
  }
}

export const cmsService = new CMSService();
