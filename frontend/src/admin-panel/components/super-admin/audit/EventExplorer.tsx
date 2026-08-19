import React from 'react';
import {
  Search,
  Calendar,
  ChevronDown,
  RotateCcw,
  Shield,
  Building2,
  Users,
  CalendarCheck,
  CreditCard,
  Wallet,
  Compass,
  Layout,
  Bell,
  ShieldCheck,
  Settings,
  Code,
  Server,
} from 'lucide-react';
import { EventCategoryCount } from '../../../types/auditLogsManagement';
import { AuditLogFilters } from '../../../services/adminAuditLogsManagement.service';

interface EventExplorerProps {
  categories: EventCategoryCount[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  filters: AuditLogFilters;
  onFilterChange: (updated: Partial<AuditLogFilters>) => void;
  onResetFilters: () => void;
}

export const EventExplorer: React.FC<EventExplorerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Authentication':
        return <Shield className="w-3.5 h-3.5 text-purple-600" />;
      case 'Agencies':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'Users':
        return <Users className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Bookings':
        return <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Payments':
        return <CreditCard className="w-3.5 h-3.5 text-rose-600" />;
      case 'Finance':
        return <Wallet className="w-3.5 h-3.5 text-amber-600" />;
      case 'Trips':
        return <Compass className="w-3.5 h-3.5 text-purple-600" />;
      case 'CMS':
        return <Layout className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Notifications':
        return <Bell className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'Roles & Permissions':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Settings':
        return <Settings className="w-3.5 h-3.5 text-slate-600" />;
      case 'APIs':
        return <Code className="w-3.5 h-3.5 text-blue-500" />;
      case 'System':
      default:
        return <Server className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      {/* ── 1. Header & Reset Button ── */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
        <h3 className="text-sm font-black text-[#0F172A]">Event Explorer</h3>
        <button
          onClick={onResetFilters}
          className="text-[10px] font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={filters.search || ''}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Search events, users, IP..."
          className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
        />
      </div>

      {/* ── 3. Date Range ── */}
      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400">Date Range</label>
        <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-extrabold shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>May 12, 2024 - May 19, 2024</span>
          </div>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* ── 4. Filter Selectors (Severity, Module, Event Type, User, Status) ── */}
      <div className="space-y-2">
        {/* Severity */}
        <div className="space-y-0.5">
          <label className="text-[10px] font-bold text-slate-400">Severity</label>
          <select
            value={filters.severity || 'All Severities'}
            onChange={(e) => onFilterChange({ severity: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5]"
          >
            <option value="All Severities">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        {/* Module */}
        <div className="space-y-0.5">
          <label className="text-[10px] font-bold text-slate-400">Module</label>
          <select
            value={filters.module || 'All Modules'}
            onChange={(e) => onFilterChange({ module: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5]"
          >
            <option value="All Modules">All Modules</option>
            <option value="Authentication">Authentication</option>
            <option value="Agencies">Agencies</option>
            <option value="Users">Users</option>
            <option value="Packages">Packages</option>
            <option value="Bookings">Bookings</option>
            <option value="Payments">Payments</option>
            <option value="Finance">Finance</option>
            <option value="CMS">CMS</option>
            <option value="Roles & Permissions">Roles & Permissions</option>
          </select>
        </div>

        {/* Status */}
        <div className="space-y-0.5">
          <label className="text-[10px] font-bold text-slate-400">Status</label>
          <select
            value={filters.status || 'All Statuses'}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5]"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Warning">Warning</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* ── 5. Event Categories List ── */}
      <div className="space-y-1 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block px-1">
          Event Categories
        </span>

        <div className="space-y-0.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(isSelected ? 'All' : cat.name)}
                className={`flex items-center justify-between p-2 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-50 text-[#6356E5] font-black shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700 font-bold'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="shrink-0">{getCategoryIcon(cat.name)}</div>
                  <span className="text-xs truncate">{cat.name}</span>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <span>{cat.count.toLocaleString()}</span>
                  <ChevronDown className="w-2.5 h-2.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
