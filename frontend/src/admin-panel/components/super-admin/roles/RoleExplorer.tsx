import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  ShieldCheck,
  Briefcase,
  Wallet,
  Headphones,
  Tag,
  Layout,
  Star,
  BarChart3,
  ArrowRight,
  Shield,
  Crown,
} from 'lucide-react';
import { RoleItem } from '../../../types/rolesManagement';

interface RoleExplorerProps {
  roles: RoleItem[];
  selectedRoleId: string;
  onSelectRole: (role: RoleItem) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCreateRole: () => void;
  onViewAllRoles?: () => void;
}

export const RoleExplorer: React.FC<RoleExplorerProps> = ({
  roles,
  selectedRoleId,
  onSelectRole,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onCreateRole,
  onViewAllRoles,
}) => {
  const tabs = [
    { id: 'All Roles', label: 'All Roles', count: 18 },
    { id: 'System Roles', label: 'System Roles', count: 10 },
    { id: 'Custom Roles', label: 'Custom Roles', count: 8 },
  ];

  const getRoleIcon = (name: string, type: string) => {
    switch (name) {
      case 'Super Admin':
        return {
          icon: <Crown className="w-3.5 h-3.5" />,
          bg: 'bg-purple-50 text-[#6356E5] border-purple-100',
        };
      case 'Operations Manager':
        return {
          icon: <Briefcase className="w-3.5 h-3.5" />,
          bg: 'bg-purple-50 text-[#6356E5] border-purple-100',
        };
      case 'Finance Manager':
        return {
          icon: <Wallet className="w-3.5 h-3.5" />,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
      case 'Support Manager':
        return {
          icon: <Headphones className="w-3.5 h-3.5" />,
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
        };
      case 'Marketing Admin':
        return {
          icon: <Tag className="w-3.5 h-3.5" />,
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
        };
      case 'CMS Editor':
        return {
          icon: <Layout className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'Review Moderator':
        return {
          icon: <Star className="w-3.5 h-3.5" />,
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
        };
      case 'Analyst':
      default:
        return {
          icon: <BarChart3 className="w-3.5 h-3.5" />,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Header & Create Role Button ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Role Library</h3>
        <button
          onClick={onCreateRole}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-[11px] font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3 h-3" />
          <span>Create Role</span>
        </button>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles..."
            className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>
        <button className="w-8 h-8 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer shadow-2xs">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── 3. Tabs Filter ── */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-1 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer truncate ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>{' '}
              <span className={isActive ? 'opacity-80' : 'text-slate-400'}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 4. Role Cards List ── */}
      <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
        {roles.map((role) => {
          const isSelected = role.id === selectedRoleId;
          const { icon, bg } = getRoleIcon(role.name, role.type);

          return (
            <div
              key={role.id}
              onClick={() => onSelectRole(role)}
              className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-purple-50/50 border-[#6356E5] shadow-xs'
                  : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
              }`}
            >
              {/* Left Accent Bar */}
              {isSelected && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6356E5]" />
              )}

              {/* Top Row: Icon + Name + Badge + Action */}
              <div className="flex items-start justify-between gap-1 mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-black text-[#0F172A] truncate">
                        {role.name}
                      </h4>
                      <span
                        className={`px-1.5 py-0.2 rounded-md text-[8px] font-black border ${
                          role.type === 'System'
                            ? 'bg-blue-50 text-blue-600 border-blue-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}
                      >
                        {role.type}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold truncate leading-tight">
                      {role.description}
                    </p>
                  </div>
                </div>

                <button className="w-5 h-5 rounded-md hover:bg-slate-200/80 text-slate-400 flex items-center justify-center shrink-0">
                  <MoreVertical className="w-3 h-3" />
                </button>
              </div>

              {/* Meta Row: Users + Permissions + Updated */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[9px] font-mono text-slate-400">
                <span className="font-bold text-slate-600">
                  {role.userCount} Users • {role.permissionCount} Permissions
                </span>
                <span>{role.updatedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 5. Bottom Link ── */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          onClick={onViewAllRoles}
          className="text-xs font-bold text-[#6356E5] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View All Roles</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
