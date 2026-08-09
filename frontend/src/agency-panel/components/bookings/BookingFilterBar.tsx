import React from 'react';
import { ArrowUpDown, Sparkles, AlertTriangle } from 'lucide-react';
import { BookingFilterTab, BookingSortOption } from '../../hooks/useBookings';

interface BookingFilterBarProps {
  activeTab: BookingFilterTab;
  onSelectTab: (tab: BookingFilterTab) => void;
  sortOption: BookingSortOption;
  onSelectSort: (sort: BookingSortOption) => void;
  tripReadyCount?: number;
  minNotReachedCount?: number;
}

export const BookingFilterBar: React.FC<BookingFilterBarProps> = ({
  activeTab,
  onSelectTab,
  sortOption,
  onSelectSort,
  tripReadyCount = 2,
  minNotReachedCount = 1,
}) => {
  const tabs: { id: BookingFilterTab; label: string; count?: number; variant?: 'purple' | 'amber' }[] = [
    { id: 'All', label: 'All', count: 32 },
    { id: 'Open', label: 'Open' },
    { id: 'Ready for Trip', label: 'Ready for Trip ✨', count: tripReadyCount, variant: 'purple' },
    { id: 'Minimum Not Reached', label: 'Minimum Not Reached ⚠️', count: minNotReachedCount, variant: 'amber' },
    { id: 'Moved to Trip', label: 'Moved to Trip' },
    { id: 'Cancelled', label: 'Cancelled', count: 6 },
  ];

  return (
    <div className="flex items-center justify-between gap-2.5 select-none w-full">
      {/* Horizontal Filter Chips (Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 min-w-0 flex-1">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap transition-all cursor-pointer border shrink-0 flex items-center gap-1 ${
                isSelected
                  ? 'bg-[#583BE8] text-white border-[#583BE8] shadow-xs scale-[1.02]'
                  : tab.variant === 'purple'
                  ? 'bg-purple-50 text-[#583BE8] border-purple-200 hover:bg-purple-100'
                  : tab.variant === 'amber'
                  ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  : 'bg-white text-slate-600 border-slate-200/80 hover:border-purple-200'
              }`}
            >
              {tab.variant === 'purple' && !isSelected && <Sparkles className="w-3 h-3 text-[#583BE8]" />}
              {tab.variant === 'amber' && !isSelected && <AlertTriangle className="w-3 h-3 text-amber-600" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`ml-0.5 opacity-80 ${
                    isSelected ? 'text-white' : tab.variant === 'purple' ? 'text-[#583BE8]' : 'text-slate-400'
                  }`}
                >
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Right side: Compact Sort Pill Dropdown */}
      <div className="relative shrink-0">
        <select
          value={sortOption}
          onChange={(e) => onSelectSort(e.target.value as BookingSortOption)}
          className="appearance-none bg-white border border-[#583BE8]/40 hover:border-[#583BE8] text-[#583BE8] font-extrabold text-[11px] pl-6 pr-2.5 py-1 rounded-full focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="Newest First">Newest First</option>
          <option value="Oldest First">Oldest First</option>
          <option value="Departure Date">Departure Date</option>
          <option value="Booking Amount">Booking Amount</option>
        </select>
        <ArrowUpDown className="w-3 h-3 text-[#583BE8] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default BookingFilterBar;
