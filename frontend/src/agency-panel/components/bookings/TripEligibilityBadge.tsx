import React from 'react';
import { TripEligibility } from '../../data/bookings';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface TripEligibilityBadgeProps {
  eligibility: TripEligibility;
  remainingAmount?: number;
  size?: 'sm' | 'md';
}

export const TripEligibilityBadge: React.FC<TripEligibilityBadgeProps> = ({
  eligibility,
  remainingAmount = 0,
  size = 'md',
}) => {
  if (eligibility === 'ELIGIBLE') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300/80 font-black shadow-2xs ${
          size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        }`}
      >
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>Eligible for Trip</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300/80 font-black shadow-2xs ${
        size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
      }`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
      <span>
        Not Eligible {remainingAmount > 0 ? `(₹${remainingAmount.toLocaleString('en-IN')} Due)` : ''}
      </span>
    </span>
  );
};

export default TripEligibilityBadge;
