import {
  Agency,
  AgencySummaryStats,
  AgencyFilters,
} from '../types/agency';
import { adminApiClient } from './adminApiClient';

export interface GetAgenciesResponse {
  agencies: Agency[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const adminAgencyService = {
  /**
   * Fetch Real-Time Summary Statistics from MongoDB
   */
  async getSummaryStats(): Promise<AgencySummaryStats> {
    try {
      const res = await adminApiClient.get<AgencySummaryStats>('/admin/agencies/stats');
      if (res.success && res.data) {
        return res.data;
      }
      throw new Error(res.message || 'Failed to fetch summary stats');
    } catch (err: any) {
      console.error('getSummaryStats error:', err);
      // Fallback empty stats structure
      return {
        totalAgencies: { id: 'total', title: 'Total Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'total', bgColor: 'bg-purple-50', iconColor: 'text-[#6356E5]' },
        activeAgencies: { id: 'active', title: 'Active Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'active', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        pendingApproval: { id: 'pending', title: 'Pending Approval', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'pending', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
        suspendedAgencies: { id: 'suspended', title: 'Suspended Agencies', count: 0, growth: '0%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'suspended', bgColor: 'bg-rose-50', iconColor: 'text-rose-500' },
        rejectedAgencies: { id: 'rejected', title: 'Rejected Agencies', count: 0, growth: '0%', isPositive: false, comparisonText: 'from last 30 days', iconType: 'rejected', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
        verifiedAgencies: { id: 'verified', title: 'Verified Agencies', count: 0, growth: '0%', isPositive: true, comparisonText: 'from last 30 days', iconType: 'verified', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
      };
    }
  },

  /**
   * Fetch Filtered & Paginated Approved Agencies from MongoDB
   */
  async getAgencies(
    filters?: Partial<AgencyFilters>,
    page = 1,
    limit = 10,
    sortBy = 'newest',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<GetAgenciesResponse> {
    try {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        limit,
        sortBy,
        sortOrder,
        search: filters?.search || undefined,
        status: filters?.status !== 'All Status' ? filters?.status : undefined,
        verification: filters?.verification !== 'All Verification' ? filters?.verification : undefined,
        businessType: filters?.businessType !== 'All Types' ? filters?.businessType : undefined,
        state: filters?.state !== 'All States' ? filters?.state : undefined,
        city: filters?.city !== 'All Cities' ? filters?.city : undefined,
        rating: filters?.rating !== 'All Ratings' ? filters?.rating : undefined,
        dateJoined: filters?.dateJoined || undefined,
      };

      const res = await adminApiClient.get<GetAgenciesResponse>('/admin/agencies', { params });
      if (res.success && res.data) {
        return res.data;
      }
      return {
        agencies: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    } catch (err: any) {
      console.error('getAgencies error:', err);
      return {
        agencies: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
      };
    }
  },

  /**
   * Fetch Single Agency Detailed Profile from MongoDB
   */
  async getAgencyById(id: string): Promise<Agency | null> {
    try {
      const res = await adminApiClient.get<Agency>(`/admin/agencies/${encodeURIComponent(id)}`);
      if (res.success && res.data) {
        return res.data;
      }
      return null;
    } catch (err: any) {
      console.error('getAgencyById error:', err);
      return null;
    }
  },

  /**
   * Verify Agency
   */
  async verifyAgency(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await adminApiClient.patch(`/admin/agencies/${encodeURIComponent(id)}/status`, {
        action: 'verify',
      });
      return { success: res.success, message: res.message };
    } catch (err: any) {
      console.error('verifyAgency error:', err);
      return { success: false, message: err.message || 'Failed to verify agency' };
    }
  },

  /**
   * Activate Agency
   */
  async activateAgency(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await adminApiClient.patch(`/admin/agencies/${encodeURIComponent(id)}/status`, {
        action: 'activate',
      });
      return { success: res.success, message: res.message };
    } catch (err: any) {
      console.error('activateAgency error:', err);
      return { success: false, message: err.message || 'Failed to activate agency' };
    }
  },

  /**
   * Suspend Agency
   */
  async suspendAgency(id: string, reason?: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await adminApiClient.patch(`/admin/agencies/${encodeURIComponent(id)}/status`, {
        action: 'suspend',
        reason,
      });
      return { success: res.success, message: res.message };
    } catch (err: any) {
      console.error('suspendAgency error:', err);
      return { success: false, message: err.message || 'Failed to suspend agency' };
    }
  },

  /**
   * Delete Agency
   */
  async deleteAgency(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await adminApiClient.patch(`/admin/agencies/${encodeURIComponent(id)}/status`, {
        action: 'delete',
      });
      return { success: res.success, message: res.message };
    } catch (err: any) {
      console.error('deleteAgency error:', err);
      return { success: false, message: err.message || 'Failed to delete agency' };
    }
  },

  /**
   * Execute Bulk Actions
   */
  async bulkAgencyAction(
    action: 'verify' | 'suspend' | 'activate' | 'delete',
    agencyIds: string[],
    reason?: string
  ): Promise<{ success: boolean; message?: string; modifiedCount?: number }> {
    try {
      const res = await adminApiClient.post<{ modifiedCount: number }>('/admin/agencies/bulk-action', {
        action,
        agencyIds,
        reason,
      });
      return { success: res.success, message: res.message, modifiedCount: res.data?.modifiedCount };
    } catch (err: any) {
      console.error('bulkAgencyAction error:', err);
      return { success: false, message: err.message || 'Failed to execute bulk action' };
    }
  },
};
