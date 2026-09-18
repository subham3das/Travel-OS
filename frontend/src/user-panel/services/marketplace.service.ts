import { apiClient } from '../../services/apiClient';
import { TourPackage } from '../types/package';
import { Agency } from '../types/agency';
import { GroupedSearchResults, FilterState } from '../data/search';

export interface PackageFilters {
  search?: string;
  category?: string;
  destination?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface AgencyFilters {
  search?: string;
  location?: string;
  verifiedOnly?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
}

class MarketplaceService {
  /**
   * Fetch all packages with filters & pagination
   */
  public async getPackages(filters: PackageFilters = {}): Promise<{ packages: TourPackage[]; pagination: any }> {
    const res = await apiClient.get<{ packages: TourPackage[]; pagination: any }>('/packages', {
      params: filters as any,
      requiresAuth: false,
    });
    return res.data || { packages: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
  }

  /**
   * Fetch featured packages for home/landing
   */
  public async getFeaturedPackages(limit = 6): Promise<TourPackage[]> {
    const res = await apiClient.get<{ packages: TourPackage[] }>('/packages/featured', {
      params: { limit },
      requiresAuth: false,
    });
    return res.data?.packages || [];
  }

  /**
   * Fetch trending packages
   */
  public async getTrendingPackages(limit = 8): Promise<TourPackage[]> {
    const res = await apiClient.get<{ packages: TourPackage[] }>('/packages/trending', {
      params: { limit },
      requiresAuth: false,
    });
    return res.data?.packages || [];
  }

  /**
   * Fetch single package by ID
   */
  public async getPackageById(packageId: string): Promise<TourPackage | null> {
    const res = await apiClient.get<{ package: TourPackage }>(`/packages/${encodeURIComponent(packageId)}`, {
      requiresAuth: false,
    });
    return res.data?.package || null;
  }

  /**
   * Fetch similar packages
   */
  public async getSimilarPackages(packageId: string, limit = 4): Promise<TourPackage[]> {
    const res = await apiClient.get<{ packages: TourPackage[] }>(`/packages/${encodeURIComponent(packageId)}/similar`, {
      params: { limit },
      requiresAuth: false,
    });
    return res.data?.packages || [];
  }

  /**
   * Fetch public agencies list
   */
  public async getAgencies(filters: AgencyFilters = {}): Promise<{ agencies: Agency[]; pagination: any }> {
    const res = await apiClient.get<{ agencies: Agency[]; pagination: any }>('/agencies', {
      params: filters as any,
      requiresAuth: false,
    });
    return res.data || { agencies: [], pagination: { total: 0, page: 1, limit: 20, totalPages: 1 } };
  }

  /**
   * Fetch single agency by ID
   */
  public async getAgencyById(agencyId: string): Promise<Agency | null> {
    const res = await apiClient.get<{ agency: Agency }>(`/agencies/${encodeURIComponent(agencyId)}`, {
      requiresAuth: false,
    });
    return res.data?.agency || null;
  }

  /**
   * Multi-entity search across destinations, packages, agencies
   */
  public async search(query: string, filters?: Partial<FilterState>): Promise<GroupedSearchResults> {
    const params: any = { q: query };
    if (filters) {
      if (filters.minBudget) params.minPrice = filters.minBudget;
      if (filters.maxBudget && filters.maxBudget < 100000) params.maxPrice = filters.maxBudget;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.selectedTravelTypes && filters.selectedTravelTypes.length > 0) {
        params.category = filters.selectedTravelTypes.join(',');
      }
    }

    const res = await apiClient.get<GroupedSearchResults>('/search', {
      params,
      requiresAuth: false,
    });
    return res.data || {
      destinations: [],
      packages: [],
      agencies: [],
      bookings: [],
      trips: [],
      messages: [],
      totalCount: 0,
    };
  }
}

export const marketplaceService = new MarketplaceService();
