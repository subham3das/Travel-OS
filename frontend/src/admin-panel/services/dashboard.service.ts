// ─── Admin Dashboard Service ──────────────────────────────────────────────────
// Placeholder service for Admin dashboard metrics and platform statistics.

import { DashboardStats } from '../types/admin';

export const fetchAdminDashboardStatsService = async (): Promise<DashboardStats> => {
  // TODO: Replace with real API call GET /api/admin/dashboard/stats
  return {
    totalAgencies: 0,
    pendingVerifications: 0,
    approvedAgencies: 0,
    rejectedAgencies: 0,
  };
};
