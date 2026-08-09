// ─── Super Admin Auth Hook ───────────────────────────────────────────────────

import { useAdminAuthContext } from '../context/AdminAuthContext';

export const useAdminAuth = () => {
  return useAdminAuthContext();
};
