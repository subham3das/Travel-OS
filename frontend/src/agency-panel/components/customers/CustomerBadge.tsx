import React from 'react';
import { CustomerLoyaltyBadge, CustomerTravelerType } from '../../data/customers';

interface LoyaltyBadgeProps {
  badge: CustomerLoyaltyBadge;
}

export const LoyaltyBadge: React.FC<LoyaltyBadgeProps> = ({ badge }) => {
  switch (badge) {
    case 'VIP Traveler':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-extrabold shrink-0">
          VIP Traveler
        </span>
      );
    case 'Frequent Traveler':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 text-[11px] font-extrabold shrink-0">
          Frequent Traveler
        </span>
      );
    case 'Returning Traveler':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-extrabold shrink-0">
          Returning Traveler
        </span>
      );
    case 'New Traveler':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-200 text-purple-800 text-[11px] font-extrabold shrink-0">
          New Traveler
        </span>
      );
    case 'Inactive':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-extrabold shrink-0">
          Inactive
        </span>
      );
  }
};

interface TravelerTypeBadgeProps {
  type: CustomerTravelerType;
}

export const TravelerTypeBadge: React.FC<TravelerTypeBadgeProps> = ({ type }) => {
  if (type === 'Solo Traveler') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-extrabold shrink-0">
        Solo Traveler
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-[#583BE8] text-[10px] font-extrabold shrink-0">
      Group Traveler
    </span>
  );
};

export default LoyaltyBadge;
