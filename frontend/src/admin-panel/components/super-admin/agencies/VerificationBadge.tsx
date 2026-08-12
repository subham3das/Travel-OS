import React from 'react';
import { VerificationStatus } from '../../../types/agency';

interface VerificationBadgeProps {
  status: VerificationStatus | 'Verified' | 'Pending' | 'Rejected' | 'Under Review';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Verified':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Under Review':
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Documents Missing':
      case 'Rejected':
      default:
        return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-black border whitespace-nowrap shrink-0 ${getBadgeStyle()}`}
    >
      {status}
    </span>
  );
};
