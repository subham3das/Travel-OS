import React from 'react';
import { AgencyStatus } from '../../../types/agency';

interface AgencyStatusBadgeProps {
  status: AgencyStatus;
}

export const AgencyStatusBadge: React.FC<AgencyStatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Suspended':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Rejected':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider shrink-0 ${getBadgeStyle()}`}
    >
      {status}
    </span>
  );
};
