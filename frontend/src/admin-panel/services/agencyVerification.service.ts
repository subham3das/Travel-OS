// ─── Agency Verification Service ─────────────────────────────────────────────
// Placeholder service for Admin agency verification, application reviews, and approvals.

import { AgencyApplication, AgencySummary } from '../types/admin';
import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export const fetchPendingApplicationsService = async (): Promise<AgencyApplication[]> => {
  // TODO: Replace with real API call GET /api/admin/agencies/pending
  return [];
};

export const fetchAgencyApplicationByIdService = async (
  _agencyId: string
): Promise<AgencyApplication | null> => {
  // TODO: Replace with real API call GET /api/admin/agencies/:id
  return null;
};

export const approveAgencyApplicationService = async (
  _agencyId: string
): Promise<{ success: boolean; status: AgencyVerificationStatus }> => {
  // TODO: Replace with real API call POST /api/admin/agencies/:id/approve
  return { success: true, status: AgencyVerificationStatus.APPROVED };
};

export const rejectAgencyApplicationService = async (
  _agencyId: string,
  _reason: string
): Promise<{ success: boolean; status: AgencyVerificationStatus }> => {
  // TODO: Replace with real API call POST /api/admin/agencies/:id/reject
  return { success: true, status: AgencyVerificationStatus.REJECTED };
};
