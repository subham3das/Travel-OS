// ─── Super Admin Store Scaffold ──────────────────────────────────────────────
// Central state store for Super Admin Panel (Authentication, Dashboard, Agencies, Settings).

import { Admin, DashboardStats, AgencyApplication } from '../types/admin';

export interface AdminStoreState {
  currentAdmin: Admin | null;
  stats: DashboardStats | null;
  applications: AgencyApplication[];
  selectedApplication: AgencyApplication | null;
  isLoading: boolean;
  error: string | null;
}

export const initialAdminStoreState: AdminStoreState = {
  currentAdmin: null,
  stats: null,
  applications: [],
  selectedApplication: null,
  isLoading: false,
  error: null,
};
