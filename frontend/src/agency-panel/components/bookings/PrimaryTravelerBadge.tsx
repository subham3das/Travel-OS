import React from 'react';
import { UserCheck } from 'lucide-react';

interface PrimaryTravelerBadgeProps {
  size?: 'sm' | 'md';
}

export const PrimaryTravelerBadge: React.FC<PrimaryTravelerBadgeProps> = ({ size = 'md' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-purple-100/90 text-[#583BE8] border border-purple-300/80 font-black shadow-2xs ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <UserCheck className="w-3.5 h-3.5 text-[#583BE8]" />
      <span>Primary Traveler</span>
    </span>
  );
};

export default PrimaryTravelerBadge;
