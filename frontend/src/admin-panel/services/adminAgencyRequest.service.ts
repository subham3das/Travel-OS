import {
  AgencyRequestItem,
  AgencyRequestSummaryStats,
  AgencyRequestFilters,
} from '../types/agencyRequest';
import { adminApiClient } from './adminApiClient';

export interface AgencyRequestsPaginationData {
  items: AgencyRequestItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export const adminAgencyRequestService = {
  /**
   * Fetch 6 KPI Summary Statistics
   */
  async getSummaryStats(): Promise<AgencyRequestSummaryStats> {
    try {
      const response = await adminApiClient.get<AgencyRequestSummaryStats>(
        '/admin/agency-requests/stats'
      );
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch summary stats');
    } catch (err: any) {
      console.error('getSummaryStats error:', err);
      // Fallback object to prevent layout crash
      return {
        pendingRequests: { count: 0, growth: '0%', isPositive: true },
        approvedToday: { count: 0, growth: '0%', isPositive: true },
        rejectedToday: { count: 0, growth: '0%', isPositive: false },
        underReview: { count: 0, growth: '0%', isPositive: true },
        documentsMissing: { count: 0, growth: '0%', isPositive: true },
        avgApprovalTime: { value: '0h 0m', growth: '0%', isPositive: true },
      };
    }
  },

  /**
   * Fetch Paginated & Filtered Agency Requests List
   */
  async getAgencyRequests(
    filters?: Partial<AgencyRequestFilters>,
    page = 1,
    limit = 10
  ): Promise<AgencyRequestsPaginationData> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };

      if (filters?.search) params.search = filters.search;
      if (filters?.status && filters.status !== 'All Status') params.status = filters.status;
      if (filters?.businessType && filters.businessType !== 'All Types') params.businessType = filters.businessType;
      if (filters?.state && filters.state !== 'All States') params.state = filters.state;
      if (filters?.verificationStatus && filters.verificationStatus !== 'All Status') {
        params.verificationStatus = filters.verificationStatus;
      }
      if (filters?.submissionDate) params.submissionDate = filters.submissionDate;

      const response = await adminApiClient.get<AgencyRequestsPaginationData>(
        '/admin/agency-requests',
        { params }
      );

      if (response.success && response.data) {
        return response.data;
      }

      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    } catch (err: any) {
      console.error('getAgencyRequests error:', err);
      return {
        items: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrevious: false,
        },
      };
    }
  },

  /**
   * Fetch Full Agency Request Details by ID (for Drawer)
   */
  async getAgencyRequestById(id: string): Promise<AgencyRequestItem | null> {
    try {
      const response = await adminApiClient.get<AgencyRequestItem>(
        `/admin/agency-requests/${id}`
      );
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err: any) {
      console.error('getAgencyRequestById error:', err);
      return null;
    }
  },

  /**
   * Save / Append Internal Review Note
   */
  async saveReviewNotes(id: string, note: string) {
    try {
      const response = await adminApiClient.post<{
        success: boolean;
        message: string;
        reviewNotes: any[];
      }>(`/admin/agency-requests/${id}/notes`, { note });
      return response.data || { success: false, message: 'Failed to save note' };
    } catch (err: any) {
      console.error('saveReviewNotes error:', err);
      throw err;
    }
  },

  /**
   * Approve Agency Request
   */
  async approveRequest(id: string, notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
        updatedStats: AgencyRequestSummaryStats;
      }>(`/admin/agency-requests/${id}/approve`, { notes });

      return {
        success: response.success,
        agency: response.data?.agency,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Agency approved successfully.',
      };
    } catch (err: any) {
      console.error('approveRequest error:', err);
      return {
        success: false,
        message: err.message || 'Failed to approve agency request.',
      };
    }
  },

  /**
   * Approve Submitted / Re-uploaded Documents for an Agency
   */
  async approveAgencyDocuments(id: string, documentIds?: string[], notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
        approvedCount: number;
      }>(`/admin/agency-requests/${id}/approve-documents`, { documentIds, notes });

      return {
        success: response.success,
        agency: response.data?.agency,
        approvedCount: response.data?.approvedCount || 0,
        message: response.message || response.data?.message || 'Documents approved successfully.',
      };
    } catch (err: any) {
      console.error('approveAgencyDocuments error:', err);
      return {
        success: false,
        message: err.message || 'Failed to approve documents.',
      };
    }
  },

  /**
   * Approve Agency Bank Settlement Details & IFSC
   */
  async approveAgencyBankDetails(id: string, notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
      }>(`/admin/agency-requests/${id}/approve-bank`, { notes });

      return {
        success: response.success,
        agency: response.data?.agency,
        message: response.message || response.data?.message || 'Bank details approved successfully.',
      };
    } catch (err: any) {
      console.error('approveAgencyBankDetails error:', err);
      return {
        success: false,
        message: err.message || 'Failed to approve bank details.',
      };
    }
  },

  /**
   * Reject Agency Request
   */
  async rejectRequest(id: string, reason = 'Compliance criteria not met', notes?: string) {
    try {
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
        updatedStats: AgencyRequestSummaryStats;
      }>(`/admin/agency-requests/${id}/reject`, { reason, notes });

      return {
        success: response.success,
        agency: response.data?.agency,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Agency request rejected.',
      };
    } catch (err: any) {
      console.error('rejectRequest error:', err);
      return {
        success: false,
        message: err.message || 'Failed to reject agency request.',
      };
    }
  },

  /**
   * Request More / Missing Documents (Legacy or simple string array)
   */
  async requestMoreDocuments(id: string, missingDocuments?: string | string[], notes?: string) {
    try {
      const docs = missingDocuments || ['Updated KYC & Bank Details'];
      const response = await adminApiClient.put<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
      }>(`/admin/agency-requests/${id}/request-docs`, {
        missingDocuments: docs,
        notes,
      });

      return {
        success: response.success,
        agency: response.data?.agency,
        message: response.message || response.data?.message || 'Document request sent successfully.',
      };
    } catch (err: any) {
      console.error('requestMoreDocuments error:', err);
      return {
        success: false,
        message: err.message || 'Failed to request documents.',
      };
    }
  },

  /**
   * Request Specific Missing Documents (Production Document-Specific Workflow)
   */
  async requestMissingDocuments(
    id: string,
    payload: {
      requestedDocuments: Array<{
        documentId: string;
        documentName: string;
        documentType: string;
        reason: string;
        customReason?: string;
        internalNote?: string;
      }>;
      agencyMessage?: string;
    }
  ) {
    try {
      const response = await adminApiClient.post<{
        success: boolean;
        message: string;
        agency: AgencyRequestItem;
        updatedStats: AgencyRequestSummaryStats;
      }>(`/admin/agency-requests/${id}/request-documents`, payload);

      return {
        success: response.success,
        agency: response.data?.agency,
        updatedStats: response.data?.updatedStats,
        message: response.message || response.data?.message || 'Document re-upload request sent successfully.',
      };
    } catch (err: any) {
      console.error('requestMissingDocuments error:', err);
      return {
        success: false,
        message: err.message || 'Failed to request missing documents.',
      };
    }
  },

  /**
   * Get Requested Documents History
   */
  async getRequestedDocuments(id: string) {
    try {
      const response = await adminApiClient.get<{
        success: boolean;
        applicationId: string;
        agencyName: string;
        verificationStatus: string;
        documentRequestRound: number;
        documentRequestMessage: string;
        requestedDocumentsDetails: any[];
        documents: any[];
      }>(`/admin/agency-requests/${id}/requested-documents`);

      return response.data;
    } catch (err: any) {
      console.error('getRequestedDocuments error:', err);
      throw err;
    }
  },

  /**
   * Execute Bulk Action
   */
  async bulkAction(
    action: 'approve' | 'reject' | 'request_docs',
    agencyIds: string[],
    payload?: { reason?: string; notes?: string; missingDocuments?: string[] }
  ) {
    try {
      const response = await adminApiClient.post<{
        success: boolean;
        processed: number;
        successful: number;
        failed: number;
        updatedStats?: AgencyRequestSummaryStats;
      }>('/admin/agency-requests/bulk-action', {
        action,
        agencyIds,
        ...payload,
      });

      return response.data || { success: false, processed: 0, successful: 0, failed: 0 };
    } catch (err: any) {
      console.error('bulkAction error:', err);
      throw err;
    }
  },

  /**
   * Export Requests CSV
   */
  async exportCsv(filters?: Partial<AgencyRequestFilters>) {
    try {
      const params: Record<string, any> = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.status && filters.status !== 'All Status') params.status = filters.status;
      if (filters?.businessType && filters.businessType !== 'All Types') params.businessType = filters.businessType;
      if (filters?.state && filters.state !== 'All States') params.state = filters.state;
      if (filters?.verificationStatus && filters.verificationStatus !== 'All Status') {
        params.verificationStatus = filters.verificationStatus;
      }

      const queryString = new URLSearchParams(params).toString();
      const exportUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/admin/agency-requests/export${queryString ? `?${queryString}` : ''}`;

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
      link.setAttribute('download', `agency-requests-${new Date().toISOString().slice(0, 10)}.csv`);
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
};
