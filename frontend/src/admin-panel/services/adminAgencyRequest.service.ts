import {
  AgencyRequestItem,
  AgencyRequestSummaryStats,
  AgencyRequestFilters,
} from '../types/agencyRequest';
import { adminSharedStore } from './adminSharedStore';

export const adminAgencyRequestService = {
  async getSummaryStats(): Promise<AgencyRequestSummaryStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(adminSharedStore.getRequestStats()), 100);
    });
  },

  async getAgencyRequests(filters?: Partial<AgencyRequestFilters>): Promise<AgencyRequestItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = adminSharedStore.getRequests();
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (r) =>
              r.agencyName.toLowerCase().includes(q) ||
              r.ownerName.toLowerCase().includes(q) ||
              r.ownerEmail.toLowerCase().includes(q) ||
              r.applicationId.toLowerCase().includes(q) ||
              r.gstNumber.toLowerCase().includes(q)
          );
        }
        if (filters?.status && filters.status !== 'All Status') {
          result = result.filter((r) => r.reviewStatus === filters.status);
        }
        if (filters?.businessType && filters.businessType !== 'All Types') {
          result = result.filter((r) => r.businessType === filters.businessType);
        }
        if (filters?.verificationStatus && filters.verificationStatus !== 'All Status') {
          result = result.filter((r) => r.verificationStatus === filters.verificationStatus);
        }
        resolve(result);
      }, 100);
    });
  },

  async approveRequest(id: string, notes?: string) {
    return new Promise<{
      success: boolean;
      updatedRequests?: AgencyRequestItem[];
      updatedStats?: AgencyRequestSummaryStats;
      message?: string;
    }>((resolve) => {
      setTimeout(() => {
        const res = adminSharedStore.approveAgencyRequest(id, notes);
        resolve(res);
      }, 300);
    });
  },

  async rejectRequest(id: string, reason?: string) {
    return new Promise<{ success: boolean; updatedRequests?: AgencyRequestItem[]; updatedStats?: AgencyRequestSummaryStats }>((resolve) => {
      setTimeout(() => {
        const res = adminSharedStore.rejectAgencyRequest(id, reason);
        resolve(res);
      }, 300);
    });
  },

  async requestMoreDocuments(id: string) {
    return new Promise<{ success: boolean; updatedRequests?: AgencyRequestItem[] }>((resolve) => {
      setTimeout(() => {
        const res = adminSharedStore.requestMoreDocuments(id);
        resolve(res);
      }, 300);
    });
  },
};
