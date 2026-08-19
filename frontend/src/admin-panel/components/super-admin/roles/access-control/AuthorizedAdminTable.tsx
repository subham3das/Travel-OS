import React, { useState } from 'react';
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  Ban,
  Shield,
  Send,
  Trash2,
  Edit2,
  KeyRound,
  UserCheck,
  CheckSquare,
  Square,
  Download,
  Mail,
  Phone,
} from 'lucide-react';
import { AuthorizedAdminItem, AdminAccountStatus } from '../../../../types/adminAccessControl';

interface AuthorizedAdminTableProps {
  admins: AuthorizedAdminItem[];
  selectedAdminIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  roleFilter: string;
  onRoleFilterChange: (r: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (d: string) => void;
  onEditAdmin: (admin: AuthorizedAdminItem) => void;
  onChangeStatus: (id: string, newStatus: AdminAccountStatus) => void;
  onResendInvite: (id: string) => void;
  onDeleteAdmin: (id: string) => void;
  onBulkUpdateStatus: (status: AdminAccountStatus) => void;
  onBulkDelete: () => void;
  onExportCSV: () => void;
}

export const AuthorizedAdminTable: React.FC<AuthorizedAdminTableProps> = ({
  admins,
  selectedAdminIds,
  onToggleSelect,
  onToggleSelectAll,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  departmentFilter,
  onDepartmentFilterChange,
  onEditAdmin,
  onChangeStatus,
  onResendInvite,
  onDeleteAdmin,
  onBulkUpdateStatus,
  onBulkDelete,
  onExportCSV,
}) => {
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);

  const isAllSelected = admins.length > 0 && selectedAdminIds.length === admins.length;

  const getStatusBadge = (status: AdminAccountStatus) => {
    switch (status) {
      case 'Active':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Active</span>
          </span>
        );
      case 'Pending Invitation':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Pending</span>
          </span>
        );
      case 'Suspended':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Suspended</span>
          </span>
        );
      case 'Disabled':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            <span>Disabled</span>
          </span>
        );
    }
  };

  const statusChips = ['All', 'Active', 'Pending Invitation', 'Suspended', 'Disabled'];

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. Top Controls Bar: Search & Filters ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0">
          {statusChips.map((chip) => {
            const isSelected = statusFilter.toLowerCase() === chip.toLowerCase();
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onStatusFilterChange(chip)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#6356E5] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-[#6356E5]'
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Bulk Action Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSelectAll}
            className="flex items-center gap-1.5 font-black text-slate-700 hover:text-[#6356E5] transition-colors cursor-pointer"
          >
            {isAllSelected ? (
              <CheckSquare className="w-4 h-4 text-[#6356E5]" />
            ) : (
              <Square className="w-4 h-4 text-slate-300" />
            )}
            <span>Select All</span>
          </button>

          {selectedAdminIds.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-[#6356E5] text-[10px] font-black">
              {selectedAdminIds.length} selected
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onBulkUpdateStatus('Active')}
            disabled={selectedAdminIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Activate</span>
          </button>

          <button
            type="button"
            onClick={() => onBulkUpdateStatus('Suspended')}
            disabled={selectedAdminIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Ban className="w-3.5 h-3.5 text-rose-500" />
            <span>Suspend</span>
          </button>

          <button
            type="button"
            onClick={onBulkDelete}
            disabled={selectedAdminIds.length === 0}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Delete</span>
          </button>

          <button
            type="button"
            onClick={onExportCSV}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#6356E5]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* ── 3. Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-2 w-8"></th>
              <th className="py-3 px-3">Admin User</th>
              <th className="py-3 px-3">Email Address</th>
              <th className="py-3 px-3">Assigned Role</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3">Invitation</th>
              <th className="py-3 px-3">Last Login</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {admins.map((adm) => {
              const isSelected = selectedAdminIds.includes(adm.id);
              const isMenuOpen = openActionMenuId === adm.id;

              return (
                <tr
                  key={adm.id}
                  className={`hover:bg-slate-50/70 transition-colors ${
                    isSelected ? 'bg-purple-50/40' : ''
                  }`}
                >
                  {/* Checkbox */}
                  <td className="py-3 px-2">
                    <button
                      type="button"
                      onClick={() => onToggleSelect(adm.id)}
                      className="text-slate-300 hover:text-[#6356E5] cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#6356E5]" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </td>

                  {/* Name & Avatar */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5 min-w-[150px]">
                      <img
                        src={adm.avatar}
                        alt={adm.name}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-black text-[#0F172A] truncate">{adm.name}</p>
                        {adm.twoFactorEnabled && (
                          <span className="text-[9px] font-bold text-[#6356E5] flex items-center gap-0.5">
                            <Shield className="w-2.5 h-2.5" /> 2FA Enabled
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    <span className="truncate block max-w-[180px]">{adm.email}</span>
                  </td>

                  {/* Role */}
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-[#6356E5] text-[11px] font-bold border border-purple-100 whitespace-nowrap">
                      {adm.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-3 text-slate-500 font-medium whitespace-nowrap">
                    {adm.department}
                  </td>

                  {/* Invitation Status */}
                  <td className="py-3 px-3">
                    {adm.invitationStatus === 'Accepted' ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
                      </span>
                    ) : adm.invitationStatus === 'Pending' ? (
                      <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-400">Expired</span>
                    )}
                  </td>

                  {/* Last Login */}
                  <td className="py-3 px-3 text-[11px] text-slate-400 whitespace-nowrap">
                    {adm.lastLogin}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">{getStatusBadge(adm.accountStatus)}</td>

                  {/* Actions Dropdown */}
                  <td className="py-3 px-3 text-right relative">
                    <button
                      type="button"
                      onClick={() => setOpenActionMenuId(isMenuOpen ? null : adm.id)}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {isMenuOpen && (
                      <div
                        className="absolute right-3 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-left space-y-0.5 text-xs font-bold text-slate-700"
                        onClick={() => setOpenActionMenuId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => onEditAdmin(adm)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>

                        {adm.invitationStatus === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => onResendInvite(adm.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-purple-50 hover:text-[#6356E5] transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Resend Invitation</span>
                          </button>
                        )}

                        {adm.accountStatus === 'Active' && adm.role !== 'Super Admin' && (
                          <button
                            type="button"
                            onClick={() => onChangeStatus(adm.id, 'Suspended')}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend Account</span>
                          </button>
                        )}

                        {adm.accountStatus === 'Suspended' && (
                          <button
                            type="button"
                            onClick={() => onChangeStatus(adm.id, 'Active')}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Activate Account</span>
                          </button>
                        )}

                        {adm.role !== 'Super Admin' && (
                          <button
                            type="button"
                            onClick={() => onDeleteAdmin(adm.id)}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Access</span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
