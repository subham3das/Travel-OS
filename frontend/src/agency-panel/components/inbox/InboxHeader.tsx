import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, SlidersHorizontal, MessageSquare, Bell } from 'lucide-react';
import { ConversationFilter } from '../../data/inbox';

interface InboxHeaderProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;
  activeFilter: ConversationFilter;
  onFilterChange: (f: ConversationFilter) => void;
}

const FILTERS: ConversationFilter[] = [
  'All',
  'Unread',
  'Bookings',
  'Upcoming Trips',
  'Completed Trips',
  'VIP Customers',
];

export const InboxHeader: React.FC<InboxHeaderProps> = ({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-slate-100/80 sticky top-0 z-30 select-none">


      {/* Main Title Row */}
      <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/agency/dashboard')}
            className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#583BE8]" />
              Customer Inbox
            </h1>
            <p className="text-[11px] font-medium text-slate-400">Direct message center with enrolled travelers</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="px-4 sm:px-6 pb-3 space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by customer name, booking ID, trip or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/80 text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => onFilterChange(filter)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  isActive
                    ? 'bg-[#583BE8] text-white border-[#583BE8] shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#583BE8] hover:text-[#583BE8]'
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InboxHeader;
