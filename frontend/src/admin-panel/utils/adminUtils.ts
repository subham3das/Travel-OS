// ─── Super Admin Utilities ───────────────────────────────────────────────────

import { AgencyVerificationStatus } from '../../agency-panel/types/agency';

export const formatVerificationStatusBadge = (status: AgencyVerificationStatus): { label: string; color: string } => {
  switch (status) {
    case AgencyVerificationStatus.APPROVED:
      return { label: 'APPROVED', color: 'bg-emerald-100 text-emerald-800' };
    case AgencyVerificationStatus.UNDER_REVIEW:
      return { label: 'UNDER REVIEW', color: 'bg-amber-100 text-amber-800' };
    case AgencyVerificationStatus.REJECTED:
      return { label: 'REJECTED', color: 'bg-rose-100 text-rose-800' };
    case AgencyVerificationStatus.PENDING:
    default:
      return { label: 'PENDING', color: 'bg-slate-100 text-slate-800' };
  }
};
