import React from 'react';
import {
  Search,
  SlidersHorizontal,
  MoreVertical,
  ChevronDown,
  MessageSquare,
} from 'lucide-react';
import {
  SupportTicketItem,
  SupportTicketPriority,
  SupportTicketStatus,
} from '../../../types/supportManagement';

interface SupportTicketQueueProps {
  tickets: SupportTicketItem[];
  selectedTicketId: string;
  onSelectTicket: (ticket: SupportTicketItem) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onLoadMore?: () => void;
}

export const SupportTicketQueue: React.FC<SupportTicketQueueProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onLoadMore,
}) => {
  const filterPills = [
    { id: 'All', label: 'All', count: '1,248' },
    { id: 'Open', label: 'Open', count: '532' },
    { id: 'Assigned', label: 'Assigned', count: '312' },
    { id: 'Pending', label: 'Pending', count: '184' },
    { id: 'Escalated', label: 'Escalated', count: '86' },
    { id: 'Closed', label: 'Closed', count: '134' },
  ];

  const getPriorityBadge = (priority: SupportTicketPriority) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
            Low
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Top Header ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Ticket Queue</h3>
        <div className="flex items-center gap-1">
          <button
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
            title="Filter options"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
            <span>Filters</span>
          </button>
          <button
            className="w-7 h-7 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tickets..."
          className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* ── 3. Status Filter Pills ── */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {filterPills.map((pill) => {
          const isActive = statusFilter.toLowerCase() === pill.id.toLowerCase();
          return (
            <button
              key={pill.id}
              onClick={() => onStatusFilterChange(pill.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                  : 'bg-slate-50 border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[9px] font-mono font-bold ${
                  isActive ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {pill.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Sort Dropdown ── */}
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1">
          <span>Sort by:</span>
          <button className="text-slate-700 font-black hover:text-[#6356E5] inline-flex items-center gap-0.5 cursor-pointer">
            <span>{sortBy}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
        <span className="font-mono text-[10px] text-slate-400">{tickets.length} tickets</span>
      </div>

      {/* ── 5. Ticket Cards List ── */}
      <div className="space-y-2.5 overflow-y-auto max-h-[620px] pr-1 scrollbar-thin">
        {tickets.map((ticket) => {
          const isSelected = ticket.id === selectedTicketId;

          return (
            <div
              key={ticket.id}
              onClick={() => onSelectTicket(ticket)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-purple-50/40 border-[#6356E5] shadow-xs'
                  : 'bg-white border-slate-100/90 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {/* Left Accent Bar for Selected Ticket */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6356E5]" />
              )}

              {/* Top Row: Customer Info + Priority + Time */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={ticket.customer.avatar}
                    alt={ticket.customer.name}
                    className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="text-xs font-black text-[#0F172A] truncate">
                    {ticket.customer.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {getPriorityBadge(ticket.priority)}
                  <span className="text-[10px] font-mono text-slate-400">
                    {ticket.timeAgo}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mb-1.5">
                {ticket.subject}
              </h4>

              {/* Meta Row: ID, Category, Comments Count */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>
                  ID: {ticket.id} • {ticket.category}
                </span>

                <span className="flex items-center gap-1 text-slate-500 font-bold">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span>{ticket.commentsCount}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 6. Bottom Load More ── */}
      <div className="pt-2 border-t border-slate-100">
        <button
          onClick={onLoadMore}
          className="w-full py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer text-center shadow-2xs"
        >
          Load More Tickets
        </button>
      </div>
    </div>
  );
};
