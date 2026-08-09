// ─── Super Admin Mock Data ───────────────────────────────────────────────────

import { Admin, DashboardStats, AgencyApplication } from '../types/admin';
import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export const MOCK_SUPER_ADMIN: Admin = {
  id: 'adm-001',
  name: 'Super Admin',
  email: 'admin@apnatrip.com',
  role: 'SUPER_ADMIN',
  isActive: true,
  lastLogin: new Date().toISOString(),
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  totalAgencies: 12,
  pendingVerifications: 3,
  approvedAgencies: 8,
  rejectedAgencies: 1,
};

export const MOCK_AGENCY_APPLICATIONS: AgencyApplication[] = [
  {
    id: 'app-001',
    agencyId: 'ag-001',
    agencyName: 'Himalayan Adventures',
    email: 'contact@himalayan.com',
    phone: '+91 98765 43210',
    status: AgencyVerificationStatus.UNDER_REVIEW,
    submittedAt: new Date().toISOString(),
    documents: [
      {
        id: 'doc-1',
        type: 'Business Registration',
        name: 'reg_cert.pdf',
        url: '#',
        uploadedAt: new Date().toISOString(),
        status: 'PENDING',
      },
    ],
  },
];
