import {
  AdminPackageItem,
  PackageKPIStats,
  PackageFilters,
  PackageSortConfig,
} from '../types/packageManagement';
import { adminApiClient } from './adminApiClient';

export const initialPackageKPIStats: PackageKPIStats = {
  totalPackages: { count: 0, growth: '0%', isPositive: true },
  activePackages: { count: 0, growth: '0%', isPositive: true },
  pendingReview: { count: 0, growth: '0%', isPositive: true },
  draftPackages: { count: 0, growth: '0%', isPositive: false },
  soldOut: { count: 0, growth: '0%', isPositive: false },
  featuredPackages: { count: 0, growth: '0%', isPositive: true },
};

class AdminPackageManagementService {
  /**
   * 1. Live KPI Telemetry from MongoDB
   */
  public async getKPIStats(): Promise<PackageKPIStats> {
    try {
      const res = await adminApiClient.get<PackageKPIStats>('/admin/packages/stats');
      return res.data || initialPackageKPIStats;
    } catch {
      return initialPackageKPIStats;
    }
  }

  /**
   * 2. Live Paginated Packages from MongoDB
   */
  public async getPackages(
    filters?: Partial<PackageFilters>,
    sort?: PackageSortConfig,
    pagination?: { page: number; limit: number }
  ): Promise<AdminPackageItem[]> {
    const params: Record<string, string | number | boolean | undefined> = {
      page: pagination?.page || 1,
      limit: pagination?.limit || 100,
      search: filters?.search || undefined,
      status: filters?.status && filters.status !== 'All Status' ? filters.status : undefined,
      approvalStatus: filters?.approvalStatus && filters.approvalStatus !== 'All Approvals' ? filters.approvalStatus : undefined,
      category: filters?.category && filters.category !== 'All Categories' ? filters.category : undefined,
      destinationCountry: filters?.destinationCountry && filters.destinationCountry !== 'All Countries' ? filters.destinationCountry : undefined,
      destinationRegion: filters?.destinationRegion && filters.destinationRegion !== 'All Regions' ? filters.destinationRegion : undefined,
      destination: filters?.destination && filters.destination !== 'All Destinations' ? filters.destination : undefined,
      agency: filters?.agency && filters.agency !== 'All Agencies' ? filters.agency : undefined,
      rating: filters?.rating && filters.rating !== 'All Ratings' ? filters.rating : undefined,
      sortBy: sort?.key || 'createdAt',
      sortOrder: sort?.direction || 'desc',
    };

    const res = await adminApiClient.get<{ packages: AdminPackageItem[]; pagination: any }>('/admin/packages', {
      params,
    });

    return res.data?.packages || [];
  }

  /**
   * 3. Single Package with Manifests & History
   */
  public async getPackageById(id: string): Promise<AdminPackageItem | null> {
    const res = await adminApiClient.get<AdminPackageItem>(`/admin/packages/${id}`);
    return res.data || null;
  }

  /**
   * 4. Create Package in MongoDB
   */
  public async createPackage(packageData: Partial<AdminPackageItem>): Promise<AdminPackageItem> {
    const res = await adminApiClient.post<AdminPackageItem>('/admin/packages', packageData);
    if (!res.data) throw new Error(res.message || 'Failed to create package');
    return res.data;
  }

  public async addPackage(packageData: Partial<AdminPackageItem>): Promise<AdminPackageItem> {
    return this.createPackage(packageData);
  }

  /**
   * 5. Update Package in MongoDB
   */
  public async updatePackage(id: string, updates: Partial<AdminPackageItem>): Promise<AdminPackageItem | null> {
    const res = await adminApiClient.patch<AdminPackageItem>(`/admin/packages/${id}`, updates);
    return res.data || null;
  }

  /**
   * 6. Approve Package
   */
  public async approvePackage(id: string): Promise<boolean> {
    const res = await adminApiClient.patch(`/admin/packages/${id}/approval`, {
      approvalStatus: 'APPROVED',
      notes: 'Approved by Super Admin via Dashboard',
    });
    return res.success;
  }

  /**
   * 7. Toggle Featured
   */
  public async featurePackage(id: string): Promise<boolean> {
    const res = await adminApiClient.patch(`/admin/packages/${id}/feature`, {
      isFeatured: true,
    });
    return res.success;
  }

  /**
   * 8. Hide Package
   */
  public async hidePackage(id: string): Promise<boolean> {
    const res = await adminApiClient.patch(`/admin/packages/${id}`, {
      isActive: false,
    });
    return res.success;
  }

  /**
   * 9. Delete Package
   */
  public async deletePackage(id: string): Promise<boolean> {
    const res = await adminApiClient.delete(`/admin/packages/${id}`);
    return res.success;
  }

  /**
   * 10. Bulk Actions
   */
  public async bulkApprove(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/packages/bulk-action', {
      packageIds: ids,
      action: 'approve',
    });
    return res.success;
  }

  public async bulkFeature(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/packages/bulk-action', {
      packageIds: ids,
      action: 'feature',
    });
    return res.success;
  }

  public async bulkHide(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/packages/bulk-action', {
      packageIds: ids,
      action: 'archive',
    });
    return res.success;
  }

  public async bulkDelete(ids: string[]): Promise<boolean> {
    const res = await adminApiClient.post('/admin/packages/bulk-action', {
      packageIds: ids,
      action: 'delete',
    });
    return res.success;
  }
}

export const adminPackageManagementService = new AdminPackageManagementService();
