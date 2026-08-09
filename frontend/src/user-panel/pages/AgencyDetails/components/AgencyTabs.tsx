import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AgencyTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const AgencyTabs: React.FC<AgencyTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'about', label: 'About' },
    { id: 'packages', label: 'Packages' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'team', label: 'Team' },
    { id: 'more', label: 'More', hasArrow: true },
  ];

  return (
    <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100/90 -mx-4 px-4 sm:mx-0 sm:px-0 shadow-2xs">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-1 max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all whitespace-nowrap focus:outline-none flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'border-[#6356E5] text-[#6356E5]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.hasArrow && <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
