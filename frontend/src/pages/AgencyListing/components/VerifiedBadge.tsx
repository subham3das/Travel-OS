import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface VerifiedBadgeProps {
  text?: string;
  variant?: 'green' | 'blue' | 'purple' | 'amber';
  className?: string;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  text = 'Verified Partner',
  variant = 'green',
  className = '',
}) => {
  const styles = {
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-sky-50 text-sky-600 border-sky-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${styles[variant]} ${className}`}
    >
      <CheckCircle2 className="w-3 h-3 fill-current/10" />
      <span>{text}</span>
    </span>
  );
};
