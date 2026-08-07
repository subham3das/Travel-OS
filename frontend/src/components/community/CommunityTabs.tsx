import React from 'react';
import { motion } from 'framer-motion';

export interface CommunityTabOption {
  id: string;
  label: string;
  icon: string | React.ReactNode;
}

interface CommunityTabsProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const defaultCommunityTabs: CommunityTabOption[] = [
  { id: 'for-you', label: 'For You', icon: '🏠' },
  { id: 'following', label: 'Following', icon: '👥' },
  { id: 'nearby', label: 'Nearby', icon: '📍' },
  { id: 'solo', label: 'Solo', icon: '👤' },
  { id: 'backpackers', label: 'Backpackers', icon: '🎒' },
  { id: 'all-circles', label: 'All Circles', icon: '🔲' },
];

export const CommunityTabs: React.FC<CommunityTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
      {defaultCommunityTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 min-w-[64px] focus:outline-none cursor-pointer group`}
          >
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-lg sm:text-xl transition-all ${
                isActive
                  ? 'bg-rose-50 border-2 border-[#FF4D6D] shadow-2xs text-[#FF4D6D]'
                  : 'bg-white border border-slate-100 hover:border-slate-200 text-slate-600 shadow-2xs'
              }`}
            >
              {tab.icon}
            </div>

            <span
              className={`text-[11px] sm:text-xs font-semibold leading-tight text-center ${
                isActive ? 'text-[#FF4D6D] font-bold' : 'text-slate-500 group-hover:text-slate-700'
              }`}
            >
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};
