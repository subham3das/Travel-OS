import React from 'react';
import { TripStatusCategory } from '../../data/trips';

interface TripTabsProps {
  activeTab: TripStatusCategory;
  onSelectTab: (tab: TripStatusCategory) => void;
  counts: Record<TripStatusCategory, number>;
}

const TAB_STYLES: Record<
  TripStatusCategory,
  { active: string; badge: string }
> = {
  'Pending Setup': {
    active: 'bg-amber-50 text-amber-900 border border-amber-200/80 shadow-2xs',
    badge: 'bg-amber-600 text-white',
  },
  Upcoming: {
    active: 'bg-purple-50 text-[#583BE8] border border-purple-200/80 shadow-2xs',
    badge: 'bg-[#583BE8] text-white',
  },
  Ongoing: {
    active: 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 shadow-2xs',
    badge: 'bg-emerald-600 text-white',
  },
  Completed: {
    active: 'bg-slate-100 text-slate-700 border border-slate-200/80 shadow-2xs',
    badge: 'bg-slate-500 text-white',
  },
  Cancelled: {
    active: 'bg-rose-50 text-rose-800 border border-rose-200/80 shadow-2xs',
    badge: 'bg-rose-600 text-white',
  },
};

export const TripTabs: React.FC<TripTabsProps> = ({ activeTab, onSelectTab, counts }) => {
  const tabs: { id: TripStatusCategory; label: string }[] = [
    { id: 'Pending Setup', label: 'Pending Setup' },
    { id: 'Upcoming', label: 'Upcoming' },
    { id: 'Ongoing', label: 'Ongoing' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none select-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = counts[tab.id] || 0;
        const styles = TAB_STYLES[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              isActive ? styles.active : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                isActive ? styles.badge : 'bg-slate-100 text-slate-500'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TripTabs;
