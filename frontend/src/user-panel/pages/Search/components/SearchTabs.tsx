import React from 'react';

export type SearchTabType = 'all' | 'destinations' | 'packages' | 'agencies';

interface SearchTabsProps {
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  counts: {
    destinations: number;
    packages: number;
    agencies: number;
  };
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const tabs: { id: SearchTabType; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'destinations', label: 'Destinations', count: counts.destinations },
    { id: 'packages', label: 'Packages', count: counts.packages },
    { id: 'agencies', label: 'Agencies', count: counts.agencies },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative py-2 px-3 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              isActive ? 'text-[#6356E5]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {tab.count}
              </span>
            )}
            {isActive && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-[#6356E5] rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
