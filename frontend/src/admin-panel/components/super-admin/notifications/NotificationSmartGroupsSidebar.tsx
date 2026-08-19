import React from 'react';
import {
  Building2,
  Package,
  Headphones,
  CreditCard,
  Star,
  Settings,
  MessageSquare,
  Plus,
  AlertTriangle,
  Flame,
  Wallet,
  User,
} from 'lucide-react';
import { SmartGroupItem, SavedFilterItem } from '../../../types/advancedNotificationCenter';

interface NotificationSmartGroupsSidebarProps {
  smartGroups: SmartGroupItem[];
  savedFilters: SavedFilterItem[];
  selectedGroupId?: string;
  selectedFilterId?: string;
  onSelectGroup: (groupId: string) => void;
  onSelectFilter: (filterId: string) => void;
  onManageFilters: () => void;
}

export const NotificationSmartGroupsSidebar: React.FC<NotificationSmartGroupsSidebarProps> = ({
  smartGroups,
  savedFilters,
  selectedGroupId,
  selectedFilterId,
  onSelectGroup,
  onSelectFilter,
  onManageFilters,
}) => {
  const getGroupIcon = (type: SmartGroupItem['iconType']) => {
    switch (type) {
      case 'agency':
        return <Building2 className="w-4 h-4 text-[#6356E5]" />;
      case 'package':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'support':
        return <Headphones className="w-4 h-4 text-rose-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'review':
        return <Star className="w-4 h-4 text-amber-500" />;
      case 'system':
        return <Settings className="w-4 h-4 text-slate-600" />;
      case 'community':
      default:
        return <MessageSquare className="w-4 h-4 text-violet-600" />;
    }
  };

  const getSavedFilterIcon = (type: SavedFilterItem['iconType']) => {
    switch (type) {
      case 'high':
        return <Flame className="w-3.5 h-3.5 text-rose-500" />;
      case 'tickets':
        return <Headphones className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'payments':
        return <Wallet className="w-3.5 h-3.5 text-emerald-600" />;
      case 'alerts':
      default:
        return <User className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* ── 1. Smart Groups Card ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Smart Groups</h3>
          <button
            type="button"
            className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Create Smart Group"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-1">
          {smartGroups.map((grp) => {
            const isSelected = selectedGroupId === grp.id;
            return (
              <button
                key={grp.id}
                type="button"
                onClick={() => onSelectGroup(grp.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[#EEF2FF] text-[#6356E5] font-black shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-white border-purple-200 shadow-2xs'
                        : 'bg-slate-50 border-slate-100 group-hover:bg-white'
                    }`}
                  >
                    {getGroupIcon(grp.iconType)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate group-hover:text-[#6356E5] transition-colors">
                      {grp.title}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium truncate">
                      {grp.subtitle}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    isSelected
                      ? 'bg-[#6356E5] text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-[#6356E5]'
                  }`}
                >
                  {grp.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Saved Filters Card ── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Saved Filters</h3>
          <button
            type="button"
            onClick={onManageFilters}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            Manage
          </button>
        </div>

        <div className="space-y-1">
          {savedFilters.map((flt) => {
            const isSelected = selectedFilterId === flt.id;
            return (
              <button
                key={flt.id}
                type="button"
                onClick={() => onSelectFilter(flt.id)}
                className={`w-full flex items-center justify-between p-2 rounded-2xl text-left transition-all cursor-pointer group ${
                  isSelected
                    ? 'bg-[#EEF2FF] text-[#6356E5] font-black shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isSelected
                        ? 'bg-white border-purple-200'
                        : 'bg-slate-50 border-slate-100 group-hover:bg-white'
                    }`}
                  >
                    {getSavedFilterIcon(flt.iconType)}
                  </div>
                  <span className="text-xs font-bold truncate group-hover:text-[#6356E5] transition-colors">
                    {flt.title}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    isSelected
                      ? 'bg-[#6356E5] text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {flt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
