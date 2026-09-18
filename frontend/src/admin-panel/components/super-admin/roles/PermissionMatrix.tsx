import React from 'react';
import {
  Undo,
  Eye,
  Check,
  Minus,
  CheckCircle2,
  Home,
  Building2,
  UserPlus,
  Users,
  Package,
  CalendarCheck,
  CreditCard,
  Wallet,
  Compass,
  Star,
  MessageSquare,
  Headphones,
  Bell,
  BarChart3,
  Layout,
  Clock,
  Settings,
  Shield,
} from 'lucide-react';
import { PermissionRow, RoleItem } from '../../../types/rolesManagement';

interface PermissionMatrixProps {
  role?: RoleItem;
  permissions: PermissionRow[];
  onTogglePermission: (moduleId: string, field: keyof PermissionRow, value: boolean) => void;
  onReset: () => void;
  onViewAsUser: () => void;
}

export const PermissionMatrix: React.FC<PermissionMatrixProps> = ({
  role,
  permissions,
  onTogglePermission,
  onReset,
  onViewAsUser,
}) => {
  const isSuperAdmin = role?.slug === 'super_admin' || role?.name === 'Super Admin' || role?.securityLevel === 'Critical';

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'LayoutDashboard':
      case 'Home':
        return <Home className="w-3.5 h-3.5 text-purple-600" />;
      case 'Building2':
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'FileCheck':
      case 'UserPlus':
        return <UserPlus className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Users':
        return <Users className="w-3.5 h-3.5 text-cyan-600" />;
      case 'Package':
        return <Package className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Calendar':
      case 'CalendarCheck':
        return <CalendarCheck className="w-3.5 h-3.5 text-orange-600" />;
      case 'CreditCard':
        return <CreditCard className="w-3.5 h-3.5 text-rose-600" />;
      case 'DollarSign':
      case 'Wallet':
        return <Wallet className="w-3.5 h-3.5 text-amber-600" />;
      case 'Compass':
        return <Compass className="w-3.5 h-3.5 text-purple-600" />;
      case 'Star':
        return <Star className="w-3.5 h-3.5 text-amber-500" />;
      case 'MessageSquare':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
      case 'Headphones':
        return <Headphones className="w-3.5 h-3.5 text-rose-500" />;
      case 'Bell':
        return <Bell className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'BarChart3':
        return <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Layers':
      case 'Layout':
        return <Layout className="w-3.5 h-3.5 text-indigo-600" />;
      case 'History':
      case 'Clock':
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
      case 'Settings':
      default:
        return <Settings className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  const actionColumns = [
    { key: 'view', label: 'View' },
    { key: 'create', label: 'Create' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
    { key: 'approve', label: 'Approve' },
    { key: 'export', label: 'Export' },
    { key: 'assign', label: 'Assign' },
  ] as const;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. Header with Role Name & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100/80">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base font-black text-[#0F172A]">
            Editing Role: {role ? role.name : 'Select a Role'}
          </h2>
          {role && (
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${
              role.type === 'System'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
            }`}>
              {role.type} Role
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onReset}
            className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer"
            title="Reset to default"
          >
            <Undo className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onViewAsUser}
            className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#6356E5] text-xs font-black transition-all cursor-pointer border border-purple-100 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View as User</span>
          </button>
        </div>
      </div>

      {/* Super Admin Special Banner */}
      {isSuperAdmin && (
        <div className="p-3 bg-purple-50/80 border border-purple-200/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#6356E5] shrink-0" />
            <div>
              <p className="text-xs font-black text-[#0F172A]">Super Administrator Privilege (ALL)</p>
              <p className="text-[11px] font-semibold text-slate-500">Unrestricted full-system access across all modules. Cannot be restricted.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-[#6356E5] text-white text-[10px] font-black rounded-xl">Unlimited</span>
        </div>
      )}

      {/* ── 2. Permission Matrix Table ── */}
      <div className="overflow-x-auto max-h-[560px] overflow-y-auto scrollbar-thin">
        {permissions.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Shield className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-500">No permissions loaded</p>
            <p className="text-[11px] text-slate-400">Connecting to MongoDB master permissions...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3 min-w-[160px]">Module / Permission</th>
                {actionColumns.map((col) => (
                  <th key={col.key} className="py-2.5 px-2 text-center min-w-[55px]">
                    {col.label}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center min-w-[90px]">Full Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-xs">
              {permissions.map((row) => (
                <tr key={row.moduleId} className="hover:bg-slate-50/60 transition-colors">
                  {/* Module Name + Icon */}
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                        {getModuleIcon(row.icon)}
                      </div>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {row.moduleName}
                      </span>
                    </div>
                  </td>

                  {/* Action Checkboxes */}
                  {actionColumns.map((col) => {
                    const isChecked = !!row[col.key];

                    return (
                      <td key={col.key} className="py-2 px-2 text-center">
                        <button
                          disabled={isSuperAdmin}
                          onClick={() => onTogglePermission(row.moduleId, col.key, !isChecked)}
                          className={`w-4.5 h-4.5 rounded-md flex items-center justify-center mx-auto transition-all ${
                            isSuperAdmin
                              ? 'bg-[#6356E5] text-white opacity-80 cursor-default'
                              : isChecked
                              ? 'bg-[#6356E5] text-white shadow-2xs cursor-pointer'
                              : 'border border-slate-300 hover:border-slate-400 bg-white cursor-pointer'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                      </td>
                    );
                  })}

                  {/* Full Access Toggle */}
                  <td className="py-2 px-3 text-center">
                    <button
                      disabled={isSuperAdmin}
                      onClick={() => onTogglePermission(row.moduleId, 'fullAccess', !row.fullAccess)}
                      className={`w-8 h-4.5 rounded-full p-0.5 transition-colors mx-auto flex items-center ${
                        isSuperAdmin ? 'cursor-default' : 'cursor-pointer'
                      } ${
                        row.fullAccess ? 'bg-[#6356E5]' : 'bg-slate-200'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${
                          row.fullAccess ? 'translate-x-3.5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── 3. Footer Legend & Auto-Save Status ── */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-semibold text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-700">
            <span className="w-3 h-3 rounded-xs bg-[#6356E5] text-white flex items-center justify-center text-[8px]">✓</span>
            <span>Allowed</span>
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-3 h-3 rounded-xs border border-slate-300 bg-white"></span>
            <span>Not Allowed</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-emerald-600 font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Synchronized with MongoDB</span>
        </div>
      </div>
    </div>
  );
};
