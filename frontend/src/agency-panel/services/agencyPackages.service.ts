import { agencyApiClient } from './agencyApiClient';

export type PackageStatus = 'Active' | 'Draft' | 'Hidden' | 'Archived';
export type PackageCategory = 'Domestic' | 'International';

export interface AgencyPackage {
  id: string;
  packageId: string;
  packageName: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  bookings: number;
  status: PackageStatus;
  lastUpdated: string;
  packageType: PackageCategory;
  coverImage: string;
  raw?: any;
}

export interface AgencyPackageStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export interface AgencyPackageFilters {
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAgencyPackagesResponse {
  items: AgencyPackage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class AgencyPackagesService {
  /**
   * 1. Get Live KPI Statistics for Agency Packages
   */
  public async getPackageStats(): Promise<AgencyPackageStats> {
    const res = await agencyApiClient.get<AgencyPackageStats>('/agency/packages/stats', {
      requiresAuth: true,
    });
    return res.data || { total: 0, published: 0, draft: 0, archived: 0 };
  }

  /**
   * 2. Get Paginated & Filtered Agency Packages from MongoDB
   */
  public async getPackages(filters?: AgencyPackageFilters): Promise<PaginatedAgencyPackagesResponse> {
    const res = await agencyApiClient.get<PaginatedAgencyPackagesResponse>('/agency/packages', {
      requiresAuth: true,
      params: {
        search: filters?.search || undefined,
        status: filters?.status && filters.status !== 'All' ? filters.status : undefined,
        category: filters?.category && filters.category !== 'All' ? filters.category : undefined,
        page: filters?.page || 1,
        limit: filters?.limit || 50,
      },
    });

    return (
      res.data || {
        items: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 1,
      }
    );
  }

  /**
   * 3. Get Single Deep Package Details
   */
  public async getPackageById(packageId: string): Promise<any> {
    const res = await agencyApiClient.get<any>(`/agency/packages/${packageId}`, {
      requiresAuth: true,
    });
    return res.data;
  }

  /**
   * 4. Create New Package from 9-Step Wizard
   */
  public async createPackage(data: any): Promise<any> {
    const res = await agencyApiClient.post<any>('/agency/packages', data, {
      requiresAuth: true,
    });
    return res.data;
  }

  /**
   * 5. Update Existing Package Details
   */
  public async updatePackage(packageId: string, data: any): Promise<any> {
    const res = await agencyApiClient.patch<any>(`/agency/packages/${packageId}`, data, {
      requiresAuth: true,
    });
    return res.data;
  }

  /**
   * 6. Quick Toggle Package Status (Active / Draft / Hidden / Archived)
   */
  public async updatePackageStatus(packageId: string, status: PackageStatus): Promise<AgencyPackage> {
    const res = await agencyApiClient.patch<AgencyPackage>(
      `/agency/packages/${packageId}/status`,
      { status },
      { requiresAuth: true }
    );
    return res.data!;
  }

  /**
   * 7. Duplicate / Clone Existing Package
   */
  public async duplicatePackage(packageId: string): Promise<AgencyPackage> {
    const res = await agencyApiClient.post<AgencyPackage>(
      `/agency/packages/${packageId}/duplicate`,
      {},
      { requiresAuth: true }
    );
    return res.data!;
  }

  /**
   * 8. Soft Delete Package
   */
  public async deletePackage(packageId: string): Promise<boolean> {
    await agencyApiClient.delete(`/agency/packages/${packageId}`, {
      requiresAuth: true,
    });
    return true;
  }
}

export const agencyPackagesService = new AgencyPackagesService();
