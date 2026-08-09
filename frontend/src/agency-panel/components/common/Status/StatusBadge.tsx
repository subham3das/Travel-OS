import React from 'react';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'neutral';

export interface StatusBadgeProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  className = '',
}) => {
  const getAutoVariant = (s: string): StatusVariant => {
    const lower = s.toLowerCase();
    if (lower.includes('active') || lower.includes('confirmed') || lower.includes('verified') || lower.includes('completed') || lower.includes('published')) {
      return 'success';
    }
    if (lower.includes('pending') || lower.includes('upcoming') || lower.includes('draft') || lower.includes('waitlist')) {
      return 'warning';
    }
    if (lower.includes('cancel') || lower.includes('reject') || lower.includes('expired') || lower.includes('overdue')) {
      return 'danger';
    }
    if (lower.includes('vip') || lower.includes('premium')) {
      return 'purple';
    }
    if (lower.includes('ongoing') || lower.includes('in-transit')) {
      return 'info';
    }
    return 'neutral';
  };

  const finalVariant = variant || getAutoVariant(status);

  const variantStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border-rose-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    purple: 'bg-purple-100 text-[#583BE8] border-purple-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border select-none ${variantStyles[finalVariant]} ${className}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
