import React from 'react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import { KycStatusType } from '../../../../types/userKyc';

interface KycStatusBadgeProps {
  status: KycStatusType | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const KycStatusBadge: React.FC<KycStatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const norm = (status || 'None').toUpperCase();

  const isSmall = size === 'sm';
  const sizeClasses = isSmall
    ? 'px-2 py-0.5 text-[9px]'
    : 'px-2.5 py-1 text-[10px]';
  const iconSize = isSmall ? 'w-2.5 h-2.5' : 'w-3 h-3';

  if (norm === 'VERIFIED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 ${sizeClasses} ${className}`}
      >
        <CheckCircle2 className={`${iconSize} text-emerald-500`} />
        <span>Verified</span>
      </span>
    );
  }

  if (norm === 'PENDING' || norm === 'UNDER REVIEW') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full border bg-amber-50 text-amber-700 border-amber-200 ${sizeClasses} ${className}`}
      >
        <Clock className={`${iconSize} text-amber-500`} />
        <span>Pending Review</span>
      </span>
    );
  }

  if (norm === 'REJECTED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full border bg-rose-50 text-rose-700 border-rose-200 ${sizeClasses} ${className}`}
      >
        <XCircle className={`${iconSize} text-rose-500`} />
        <span>Rejected</span>
      </span>
    );
  }

  if (norm === 'EXPIRED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full border bg-slate-100 text-slate-700 border-slate-200 ${sizeClasses} ${className}`}
      >
        <AlertCircle className={`${iconSize} text-slate-500`} />
        <span>Expired</span>
      </span>
    );
  }

  if (norm === 'SUSPENDED') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-black rounded-full border bg-purple-50 text-purple-700 border-purple-200 ${sizeClasses} ${className}`}
      >
        <AlertTriangle className={`${iconSize} text-purple-500`} />
        <span>Suspended</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border bg-slate-100 text-slate-500 border-slate-200 ${sizeClasses} ${className}`}
    >
      <ShieldAlert className={`${iconSize} text-slate-400`} />
      <span>Not Provided</span>
    </span>
  );
};
