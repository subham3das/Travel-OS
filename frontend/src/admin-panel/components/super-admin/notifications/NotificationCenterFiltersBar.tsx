import React from 'react';
import {
  LayoutGrid,
  Bell,
  AlertTriangle,
  Building2,
  Package,
  Headphones,
  CreditCard,
  Star,
  Settings,
  Filter,
  Search,
  List,
  Grid,
} from 'lucide-react';
import { NotificationCategoryType } from '../../../types/advancedNotificationCenter';

interface NotificationCenterFiltersBarProps {
  activeCategory: NotificationCategoryType;
  onSelectCategory: (cat: NotificationCategoryType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdvancedFilters: () => void;
  viewMode: 'list' | 'grid';
  onToggleViewMode: (mode: 'list' | 'grid') => void;
}

export const NotificationCenterFiltersBar: React.FC<NotificationCenterFiltersBarProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAdvancedFilters,
  viewMode,
  onToggleViewMode,
}) => {
  const tabs: { id: NotificationCategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
    { id: 'unread', label: 'Unread', icon: <Bell className="w-3.5 h-3.5" /> },
    { id: 'critical', label: 'Critical', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
    { id: 'agency', label: 'Agencies', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'package', label: 'Packages', icon: <Package className="w-3.5 h-3.5" /> },
    { id: 'support', label: 'Support', icon: <Headphones className="w-3.5 h-3.5" /> },
    { id: 'payment', label: 'Payments', icon: <CreditCard className="w-3.5 h-3.5" /> },
    { id: 'review', label: 'Reviews', icon: <Star className="w-3.5 h-3.5" /> },
    { id: 'system', label: 'System', icon: <Settings className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3 select-none">
      {/* ── Category Filter Tabs ── */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full lg:w-auto pb-1 lg:pb-0">
        {tabs.map((tab) => {
          const isSelected = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-purple-50/70 hover:text-[#6356E5]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Right Controls: Filter Button, Search Bar, View Mode ── */}
      <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
        <button
          type="button"
          onClick={onOpenAdvancedFilters}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0"
        >
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters</span>
        </button>

        <div className="relative flex-1 sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center p-0.5 rounded-2xl bg-slate-100 border border-slate-200 shrink-0">
          <button
            type="button"
            onClick={() => onToggleViewMode('list')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-white text-[#6356E5] shadow-2xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="List View"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onToggleViewMode('grid')}
            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-[#6356E5] shadow-2xs'
                : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Grid View"
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
