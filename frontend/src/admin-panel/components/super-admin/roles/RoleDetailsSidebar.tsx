import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Clock,
  UserCheck,
  Copy,
  Download,
  Trash2,
  Save,
  CheckCircle2,
  FileText,
  UserPlus,
} from 'lucide-react';
import {
  RoleItem,
  RoleChangeTimelineItem,
} from '../../../types/rolesManagement';

interface RoleDetailsSidebarProps {
  role: RoleItem;
  recentChanges: RoleChangeTimelineItem[];
  onSaveChanges: () => void;
  onDuplicateRole: () => void;
  onExportPermissions: () => void;
  onAssignUsers: () => void;
  onDeleteRole: () => void;
  onViewAllMembers?: () => void;
  onViewAllChanges?: () => void;
}

export const RoleDetailsSidebar: React.FC<RoleDetailsSidebarProps> = ({
  role,
  recentChanges,
  onSaveChanges,
  onDuplicateRole,
  onExportPermissions,
  onAssignUsers,
  onDeleteRole,
  onViewAllMembers,
  onViewAllChanges,
}) => {
  const getSecurityBadge = (level: RoleItem['securityLevel']) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 text-[10px] font-black border border-rose-200 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>Critical</span>
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-600 text-[10px] font-black border border-amber-200 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>High</span>
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black border border-blue-200 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Medium</span>
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-black border border-slate-200 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Low</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. ROLE DETAILS ── */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-100/80">
          Role Details
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold text-[11px]">Role Name</span>
            <span className="font-black text-slate-800 text-[11px]">{role.name}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-slate-400 font-bold text-[11px]">Description</span>
            <p className="font-semibold text-slate-600 text-[11px] leading-snug">
              {role.description}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-bold text-[11px]">Created By</span>
            <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
              <div className="w-4 h-4 rounded-full bg-[#6356E5] text-white flex items-center justify-center text-[8px] font-black">
                S
              </div>
              <span>{role.createdBy}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-400 font-bold">Created On</span>
            <span className="text-slate-700 font-semibold">{role.createdOn}</span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-400 font-bold">Last Updated</span>
            <span className="text-slate-700 font-semibold">May 18, 2024 04:20 PM</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-50">
            <span className="text-slate-400 font-bold text-[11px]">Security Level</span>
            {getSecurityBadge(role.securityLevel)}
          </div>
        </div>
      </div>

      {/* ── 2. ASSIGNED MEMBERS ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A]">
            Assigned Members ({role.userCount})
          </h3>
          <button
            onClick={onViewAllMembers}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {role.members.slice(0, 5).map((m) => (
            <img
              key={m.id}
              src={m.avatar}
              alt={m.name}
              title={m.name}
              className="w-7 h-7 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
          ))}
          {role.userCount > 5 && (
            <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white text-slate-600 font-mono text-[9px] font-black flex items-center justify-center shrink-0">
              +{role.userCount - 5}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. RECENT CHANGES ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A]">Recent Changes</h3>
          <button
            onClick={onViewAllChanges}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2">
          {recentChanges.map((item) => (
            <div key={item.id} className="flex items-start gap-2 text-xs">
              <div className="w-5 h-5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3 h-3 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-800 text-[11px] truncate">{item.action}</p>
                <div className="flex items-center justify-between text-[9px] text-slate-400 font-medium pt-0.5">
                  <span className="truncate">{item.author}</span>
                  <span className="font-mono shrink-0">{item.timeAgo}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4. QUICK ACTIONS ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-[#0F172A]">Quick Actions</h3>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onSaveChanges}
            className="py-2 px-3 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black transition-all cursor-pointer shadow-md shadow-[#6356E5]/20 flex items-center justify-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>

          <button
            onClick={onDuplicateRole}
            className="py-2 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5 text-slate-400" />
            <span>Duplicate Role</span>
          </button>

          <button
            onClick={onExportPermissions}
            className="py-2 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Permissions</span>
          </button>

          <button
            onClick={onAssignUsers}
            className="py-2 px-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-black transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Assign Users</span>
          </button>
        </div>

        <button
          onClick={onDeleteRole}
          className="w-full py-2 rounded-2xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Role</span>
        </button>
      </div>
    </div>
  );
};
