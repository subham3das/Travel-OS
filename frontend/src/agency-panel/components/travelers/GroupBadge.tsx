import React from 'react';
import { User, Users, Heart, Sparkles } from 'lucide-react';

interface GroupBadgeProps {
  category: 'Family' | 'Friends' | 'Solo' | 'Group';
  size?: 'sm' | 'md';
}

export const GroupBadge: React.FC<GroupBadgeProps> = ({ category, size = 'md' }) => {
  switch (category) {
    case 'Solo':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-extrabold ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <User className="w-3 h-3 text-blue-600" />
          <span>Solo Traveler</span>
        </span>
      );

    case 'Family':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-purple-50 text-[#583BE8] border border-purple-200 font-extrabold ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Heart className="w-3 h-3 text-[#583BE8]" />
          <span>Family Group</span>
        </span>
      );

    case 'Friends':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Users className="w-3 h-3 text-emerald-600" />
          <span>Friends Group</span>
        </span>
      );

    case 'Group':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold ${
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Tour Group</span>
        </span>
      );
  }
};

export default GroupBadge;
