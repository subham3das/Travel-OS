// ─── Agency Profile Service ──────────────────────────────────────────────────
// Boundary file — swap body with real API calls when backend is ready.

import { Agency } from '../types/agency';

// GET /api/agency/profile
export const fetchAgencyProfile = async (_agencyId: string): Promise<Agency | null> => {
  // TODO: replace with: return axios.get(`/api/agency/${agencyId}/profile`).then(r => r.data);
  return null;
};

// PATCH /api/agency/profile
export const updateAgencyProfile = async (
  _agencyId: string,
  _updates: Partial<Agency>
): Promise<Agency | null> => {
  // TODO: replace with real API call
  return null;
};
