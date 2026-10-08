import {
  CarRentalApprovalItem,
  CarRentalStats,
  CarRentalFilters,
} from '../types/carRentalApproval';
import { adminApiClient } from './adminApiClient';

export interface CarRentalRequestsPaginationData {
  items: CarRentalApprovalItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const adminCarRentalApprovalService = {
  /**
   * Fetch 6 KPI Summary Statistics
   */
  async getSummaryStats(): Promise<CarRentalStats> {
    try {
      const response = await adminApiClient.get<CarRentalStats>(
        '/admin/car-rental-requests/stats'
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch summary stats');
    } catch (err: any) {
      console.error('getSummaryStats error:', err);
      return {
        pendingRequests: { count: 0, growth: '0%', isPositive: true },
        approvedToday: { count: 0, growth: '0%', isPositive: true },
        rejectedToday: { count: 0, growth: '0%', isPositive: false },
        needsChanges: { count: 0, growth: '0%', isPositive: true },
        totalVehicles: { count: 0, growth: '0%', isPositive: true },
        avgApprovalTime: { value: '0h 0m', growth: '0%', isPositive: true },
      };
    }
  },

  /**
   * Fetch Paginated & Filtered Car Rental Requests List
   */
  async getCarRentalRequests(
    filters?: Partial<CarRentalFilters>,
    page = 1,
    limit = 10
  ): Promise<CarRentalRequestsPaginationData> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (filters) {
        if (filters.tab && filters.tab !== 'All') params.tab = filters.tab;
        if (filters.status && filters.status !== 'All Status') params.status = filters.status;
        if (filters.state && filters.state !== 'All States') params.state = filters.state;
        if (filters.city && filters.city.trim()) params.city = filters.city.trim();
        if (filters.dateFrom) params.dateFrom = filters.dateFrom;
        if (filters.dateTo) params.dateTo = filters.dateTo;
        if (filters.search && filters.search.trim()) params.search = filters.search.trim();
        if (filters.sortBy) params.sortBy = filters.sortBy;
        if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      }

      const response = await adminApiClient.get<{
        items: CarRentalApprovalItem[];
        pagination: any;
      }>('/admin/car-rental-requests', { params });

      if (response.success && response.data) {
        return {
          items: response.data.items || [],
          pagination: response.data.pagination || {
            total: 0,
            page,
            limit,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          },
        };
      }
      throw new Error(response.message || 'Failed to fetch car rental requests');
    } catch (err: any) {
      console.error('getCarRentalRequests error:', err);
      return {
        items: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
  },

  /**
   * Fetch Single Car Rental Request Details with Vehicles & Activities
   */
  async getCarRentalRequestById(id: string): Promise<CarRentalApprovalItem | null> {
    try {
      const response = await adminApiClient.get<CarRentalApprovalItem>(
        `/admin/car-rental-requests/${id}`
      );
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('getCarRentalRequestById error:', err);
      return null;
    }
  },

  /**
   * Save Review Note
   */
  async saveReviewNotes(id: string, note: string) {
    try {
      const response = await adminApiClient.post<{
        success: boolean;
        message: string;
        reviewNotes: any[];
      }>(`/admin/car-rental-requests/${id}/notes`, { note });
      return {
        success: response.success,
        message: response.message || response.data?.message || 'Note saved',
        reviewNotes: response.data?.reviewNotes || [],
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to save note' };
    }
  },

  /**
   * Approve Car Rental Provider
   */
  async approveCarRental(id: string, notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
        updatedStats?: CarRentalStats;
      }>(`/admin/car-rental-requests/${id}/approve`, { notes });

      return {
        success: response.success,
        request: response.data?.request,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Approved successfully',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Approval failed' };
    }
  },

  /**
   * Reject Car Rental Provider
   */
  async rejectCarRental(id: string, reason: string, notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
        updatedStats?: CarRentalStats;
      }>(`/admin/car-rental-requests/${id}/reject`, { reason, notes });

      return {
        success: response.success,
        request: response.data?.request,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Rejected successfully',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Rejection failed' };
    }
  },

  /**
   * Request Changes
   */
  async requestChanges(id: string, issues: string[], message?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
        updatedStats?: CarRentalStats;
      }>(`/admin/car-rental-requests/${id}/request-changes`, { issues, message });

      return {
        success: response.success,
        request: response.data?.request,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Changes requested',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to request changes' };
    }
  },

  /**
   * Suspend Car Rental Provider
   */
  async suspendCarRental(id: string, reason?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
        updatedStats?: CarRentalStats;
      }>(`/admin/car-rental-requests/${id}/suspend`, { reason });

      return {
        success: response.success,
        request: response.data?.request,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Suspended successfully',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Suspension failed' };
    }
  },

  /**
   * Reopen Application Review
   */
  async reopenReview(id: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
        updatedStats?: CarRentalStats;
      }>(`/admin/car-rental-requests/${id}/reopen`, {});

      return {
        success: response.success,
        request: response.data?.request,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Reopened review',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to reopen review' };
    }
  },

  /**
   * Approve Fleet Documents
   */
  async approveDocuments(id: string, documentIds?: string[]) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        request: CarRentalApprovalItem;
      }>(`/admin/car-rental-requests/${id}/approve-documents`, { documentIds });

      return {
        success: response.success,
        request: response.data?.request,
        message: response.message || response.data?.message || 'Documents approved',
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to approve documents' };
    }
  },

  /**
   * Bulk Action
   */
  async bulkAction(action: 'approve' | 'reject' | 'request_changes', ids: string[], data?: any) {
    try {
      const response = await adminApiClient.post<{
        success: boolean;
        total: number;
        successful: number;
        failed: number;
        updatedStats?: CarRentalStats;
      }>('/admin/car-rental-requests/bulk-action', { action, ids, data });

      return {
        success: response.success,
        successful: response.data?.successful || 0,
        failed: response.data?.failed || 0,
        total: response.data?.total || ids.length,
        updatedStats: response.data?.updatedStats,
      };
    } catch (err: any) {
      return { success: false, successful: 0, failed: ids.length, total: ids.length };
    }
  },

  /**
   * Export CSV
   */
  async exportCsv(filters?: Partial<CarRentalFilters>) {
    try {
      const params: Record<string, any> = {};
      if (filters?.tab && filters.tab !== 'All') params.tab = filters.tab;
      if (filters?.status && filters.status !== 'All Status') params.status = filters.status;
      if (filters?.state && filters.state !== 'All States') params.state = filters.state;
      if (filters?.city) params.city = filters.city;
      if (filters?.search) params.search = filters.search;

      const queryString = new URLSearchParams(params).toString();
      const exportUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/car-rental-requests/export${queryString ? `?${queryString}` : ''}`;

      const token = adminApiClient.getAccessToken();
      const res = await fetch(exportUrl, {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      });

      if (!res.ok) throw new Error('Failed to export CSV');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `car-rental-approvals-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      return { success: true };
    } catch (err: any) {
      console.error('exportCsv error:', err);
      throw err;
    }
  },

  /**
   * Self-Drive Rental Management (Cars & Bikes)
   */
  async getRentalVehicles(params?: any) {
    const res = await adminApiClient.get<any>('/admin/car-rental-admin/vehicles', { params });
    return res.data?.data || res.data || { vehicles: [], pagination: {} };
  },

  async setRentalVehicleStatus(carId: string, action: 'approve' | 'suspend' | 'activate' | 'deactivate') {
    const res = await adminApiClient.patch<any>(`/admin/car-rental-admin/vehicles/${carId}/status`, { action });
    return res.data?.data || res.data;
  },

  async getRentalBookings(params?: any) {
    const res = await adminApiClient.get<any>('/admin/car-rental-admin/bookings', { params });
    return res.data?.data || res.data || { bookings: [], pagination: {} };
  },

  async getRentalAnalytics() {
    const res = await adminApiClient.get<any>('/admin/car-rental-admin/analytics');
    return res.data?.data || res.data;
  },
};
