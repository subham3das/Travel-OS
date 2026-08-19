import React, { useState } from 'react';
import {
  CheckSquare,
  Square,
  Check,
  Archive,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Building2,
  Package,
  Headphones,
  CreditCard,
  Star,
  Compass,
  Settings,
  MessageSquare,
  Shield,
  Calendar,
} from 'lucide-react';
import {
  NotificationFeedItem,
  NotificationPriorityType,
} from '../../../types/advancedNotificationCenter';

interface NotificationFeedSectionProps {
  items: NotificationFeedItem[];
  selectedItemIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onBulkMarkRead: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onExecuteAction: (id: string, actionType: string) => void;
  onViewItem: (item: NotificationFeedItem) => void;
}

export const NotificationFeedSection: React.FC<NotificationFeedSectionProps> = ({
  items,
  selectedItemIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkMarkRead,
  onBulkArchive,
  onBulkDelete,
  onExecuteAction,
  onViewItem,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const isAllSelected = items.length > 0 && selectedItemIds.length === items.length;

  const todayItems = items.filter((i) => i.timeGroup === 'Today');
  const yesterdayItems = items.filter((i) => i.timeGroup === 'Yesterday' || i.timeGroup === 'Earlier');

  const getModuleIcon = (category: string) => {
    switch (category) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'support':
        return <Headphones className="w-4 h-4 text-rose-500" />;
      case 'payment':
      case 'finance':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'trip':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'community':
        return <MessageSquare className="w-4 h-4 text-violet-600" />;
      case 'security':
      case 'audit':
        return <Shield className="w-4 h-4 text-red-600" />;
      default:
        return <Settings className="w-4 h-4 text-slate-600" />;
    }
  };

  const getPriorityBadge = (priority: NotificationPriorityType) => {
    switch (priority) {
      case 'Critical':
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-rose-50 text-rose-600 border border-rose-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-200">
            Medium
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
            Low
          </span>
        );
    }
  };

  const renderFeedItem = (item: NotificationFeedItem) => {
    const isSelected = selectedItemIds.includes(item.id);

    return (
      <div
        key={item.id}
        onClick={() => onViewItem(item)}
        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative group ${
          !item.isRead
            ? 'bg-[#FCFCFF] hover:bg-[#F6F7FF] border-purple-200/80 shadow-2xs'
            : 'bg-white hover:bg-slate-50 border-slate-100'
        } ${isSelected ? 'ring-2 ring-[#6356E5]/40 bg-purple-50/50' : ''}`}
      >
        {/* Left: Checkbox + Icon + Content */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(item.id);
            }}
            className="mt-0.5 sm:mt-0 text-slate-400 hover:text-[#6356E5] transition-colors cursor-pointer shrink-0"
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-[#6356E5] fill-[#6356E5]/10" />
            ) : (
              <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
            )}
          </button>

          <div className="w-9 h-9 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-white transition-colors">
            {getModuleIcon(item.category)}
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-xs ${
                  !item.isRead ? 'font-black text-[#0F172A]' : 'font-bold text-slate-700'
                } truncate`}
              >
                {item.title}
              </h4>
              {getPriorityBadge(item.priority)}
            </div>

            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
              {item.description}
            </p>

            <p className="text-[10px] text-slate-400 font-mono font-medium truncate">
              {item.metadata}
            </p>
          </div>
        </div>

        {/* Right: Timestamp, In-line Action Buttons, Unread Dot */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 self-end sm:self-center">
          <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">
            {item.time}
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {item.actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onExecuteAction(item.id, act.actionType);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer shrink-0 ${
                  act.variant === 'primary'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-600 hover:text-white'
                    : act.variant === 'danger'
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white'
                    : act.variant === 'secondary'
                    ? 'bg-purple-50 text-[#6356E5] border border-purple-200 hover:bg-[#6356E5] hover:text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {act.label}
              </button>
            ))}
          </div>

          {!item.isRead && (
            <span
              className="w-2 h-2 rounded-full bg-[#6356E5] shrink-0"
              title="Unread notification"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── Top Bulk Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 text-xs font-black text-slate-700 hover:text-[#6356E5] transition-colors cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-[#6356E5]" />
            ) : (
              <Square className="w-4 h-4 text-slate-300" />
            )}
            <span>Select All</span>
          </button>

          {selectedItemIds.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[10px] font-black border border-purple-100">
              {selectedItemIds.length} selected
            </span>
          )}
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onBulkMarkRead}
            disabled={selectedItemIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mark Read</span>
          </button>

          <button
            type="button"
            onClick={onBulkArchive}
            disabled={selectedItemIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold text-slate-700 transition-all cursor-pointer"
          >
            <Archive className="w-3.5 h-3.5 text-slate-500" />
            <span>Archive</span>
          </button>

          <button
            type="button"
            onClick={onBulkDelete}
            disabled={selectedItemIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed border border-rose-200 text-[11px] font-bold text-rose-600 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 transition-all cursor-pointer"
            title="More Options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Feed Groups ── */}
      {items.length === 0 ? (
        <div className="py-14 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
            <Check className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-[#0F172A]">You're all caught up!</h4>
            <p className="text-xs text-slate-400 font-medium">No new notifications in this view.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Today Group */}
          {todayItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-black text-slate-800">Today</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[10px] font-black">
                  {todayItems.length}
                </span>
              </div>
              <div className="space-y-2">{todayItems.map(renderFeedItem)}</div>
            </div>
          )}

          {/* Yesterday Group */}
          {yesterdayItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-black text-slate-800">Yesterday</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
                  {yesterdayItems.length}
                </span>
              </div>
              <div className="space-y-2">{yesterdayItems.map(renderFeedItem)}</div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom Pagination ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 cursor-pointer"
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {[1, 2, 3, 12].map((num, idx) => (
            <React.Fragment key={num}>
              {idx === 3 && <span className="px-1 text-slate-400 text-xs">...</span>}
              <button
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  currentPage === num
                    ? 'bg-[#6356E5] text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            </React.Fragment>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(12, p + 1))}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 cursor-pointer"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>
    </div>
  );
};
