import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { NotificationTab } from '../../hooks/useNotifications';

interface NotificationTabsProps {
  activeTab: NotificationTab;
  onSelectTab: (tab: NotificationTab) => void;
  tabCounts: Record<string, number>;
  onOpenFilters: () => void;
}

export const NotificationTabs: React.FC<NotificationTabsProps> = ({
  activeTab,
  onSelectTab,
  tabCounts,
  onOpenFilters,
}) => {
  const tabs: NotificationTab[] = [
    'All',
    'Unread',
    'Bookings',
    'Payments',
    'Trips',
    'Announcements',
    'Admin',
    'Reviews',
    'Team',
  ];

  return (
    <div className="flex items-center justify-between gap-2.5 select-none w-full">
      {/* Horizontal Scrollable Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab;
          const count = tabCounts[tab];
          const isUnreadTab = tab === 'Unread';

          return (
            <button
              key={tab}
              type="button"
              onClick={() => onSelectTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#583BE8] text-white border-[#583BE8] shadow-xs scale-[1.02]'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-purple-200'
              }`}
            >
              <span>{tab}</span>

              {count !== undefined && count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isUnreadTab
                      ? 'bg-rose-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Sliders Button */}
      <button
        type="button"
        onClick={onOpenFilters}
        className="p-2 rounded-full bg-white border border-slate-200/80 hover:border-[#583BE8] text-slate-600 hover:text-[#583BE8] transition-colors shadow-2xs cursor-pointer shrink-0"
        title="Filter Notifications"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
};

export default NotificationTabs;
