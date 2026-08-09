import React, { useState } from 'react';
import { X, Filter, Check } from 'lucide-react';
import { NotificationFiltersState } from '../../hooks/useNotifications';

interface NotificationFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: NotificationFiltersState;
  onApply: (filters: NotificationFiltersState) => void;
  onClear: () => void;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  onClear,
}) => {
  const [localCategory, setLocalCategory] = useState(filters.category);
  const [localReadStatus, setLocalReadStatus] = useState(filters.readStatus);
  const [localSortBy, setLocalSortBy] = useState(filters.sortBy);

  if (!isOpen) return null;

  const categories = [
    'ALL',
    'Bookings',
    'Payments',
    'Trips',
    'Announcements',
    'Traveler',
    'Reviews',
    'Refunds',
    'Admin',
    'Team',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-6 border border-slate-100 animate-in slide-in-from-bottom sm:zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#583BE8]" />
            <h3 className="text-base font-black text-[#0F172A]">Filter Notifications</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Section 1: Category */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = localCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setLocalCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#583BE8] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'All Categories' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Section 2: Read / Unread Status */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Read Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'UNREAD', label: 'Unread Only' },
              { id: 'READ', label: 'Read Only' },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setLocalReadStatus(st.id)}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  localReadStatus === st.id
                    ? 'bg-[#583BE8] text-white border-[#583BE8]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section 3: Sort Order */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-400">
            Sort Order
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'newest', label: 'Newest First' },
              { id: 'oldest', label: 'Oldest First' },
            ].map((srt) => (
              <button
                key={srt.id}
                type="button"
                onClick={() => setLocalSortBy(srt.id as 'newest' | 'oldest')}
                className={`py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                  localSortBy === srt.id
                    ? 'bg-[#583BE8] text-white border-[#583BE8]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {srt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onClear();
              setLocalCategory('ALL');
              setLocalReadStatus('ALL');
              setLocalSortBy('newest');
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={() => {
              onApply({
                category: localCategory,
                readStatus: localReadStatus,
                sortBy: localSortBy,
              });
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Filters</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
