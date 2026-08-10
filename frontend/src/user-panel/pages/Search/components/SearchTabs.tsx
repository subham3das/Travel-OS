import React from 'react';

export type SearchTabType = 'all' | 'destinations' | 'packages' | 'agencies' | 'travelers' | 'bookings' | 'trips' | 'messages';

interface SearchTabsProps {
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  counts: {
    destinations: number;
    packages: number;
    agencies: number;
    travelers?: number;
    bookings?: number;
    trips?: number;
    messages?: number;
  };
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: SearchTabType; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'packages', label: 'Packages', count: counts.packages },
    { id: 'destinations', label: 'Destinations', count: counts.destinations },
    { id: 'agencies', label: 'Agencies', count: counts.agencies },
    { id: 'travelers', label: 'Travelers', count: counts.travelers },
    { id: 'bookings', label: 'Bookings', count: counts.bookings },
    { id: 'trips', label: 'Trips', count: counts.trips },
    { id: 'messages', label: 'Messages', count: counts.messages },
  ];

  return (
    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative py-2 px-3 text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
              isActive ? 'text-[#583BE8]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#583BE8] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SearchTabs;
