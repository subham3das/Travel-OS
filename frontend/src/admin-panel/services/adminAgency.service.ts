import {
  Agency,
  AgencySummaryStats,
  AgencyFilters,
} from '../types/agency';
import { adminSharedStore } from './adminSharedStore';

export const adminAgencyService = {
  async getSummaryStats(): Promise<AgencySummaryStats> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(adminSharedStore.getAgencyStats()), 100);
    });
  },

  async getAgencies(filters?: Partial<AgencyFilters>): Promise<Agency[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = adminSharedStore.getAgencies();
        if (filters?.search) {
          const q = filters.search.toLowerCase();
          result = result.filter(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.owner.name.toLowerCase().includes(q) ||
              a.email.toLowerCase().includes(q) ||
              a.gstNumber.toLowerCase().includes(q) ||
              a.city.toLowerCase().includes(q)
          );
        }
        if (filters?.status && filters.status !== 'All Status') {
          result = result.filter((a) => a.status === filters.status);
        }
        if (filters?.verification && filters.verification !== 'All Verification') {
          result = result.filter((a) => a.verification === filters.verification);
        }
        if (filters?.businessType && filters.businessType !== 'All Types') {
          result = result.filter((a) => a.businessType === filters.businessType);
        }
        resolve(result);
      }, 100);
    });
  },

  async getAgencyById(id: string): Promise<Agency | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const agencies = adminSharedStore.getAgencies();
        const found = agencies.find((a) => a.id === id || a.name.toLowerCase() === id.toLowerCase());
        resolve(found || agencies[0] || null);
      }, 100);
    });
  },

  async verifyAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async activateAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async suspendAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },

  async deleteAgency(id: string): Promise<{ success: boolean }> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true }), 150);
    });
  },
};
