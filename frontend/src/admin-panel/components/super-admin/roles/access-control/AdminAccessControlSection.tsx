import React, { useState, useEffect, useCallback } from 'react';
import { Shield, Plus } from 'lucide-react';
import {
  AuthorizedAdminItem,
  AdminAccessKPIs,
  AdminSecurityOverview,
  AdminAccountStatus,
} from '../../../../types/adminAccessControl';
import { RoleItem } from '../../../../types/rolesManagement';
import { adminAccessControlService } from '../../../../services/adminAccessControl.service';
import { initialAdminAccessKPIs, initialAdminSecurityOverview } from '../../../../data/adminAccessControlData';

import { AdminAccessKPIsCards } from './AdminAccessKPIsCards';
import { AuthorizedAdminTable } from './AuthorizedAdminTable';
import { SecurityOverviewPanel } from './SecurityOverviewPanel';
import { AuthorizeAdminModal } from './AuthorizeAdminModal';
import { EditAuthorizedAdminModal } from './EditAuthorizedAdminModal';

interface AdminAccessControlSectionProps {
  roles: RoleItem[];
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminAccessControlSection: React.FC<AdminAccessControlSectionProps> = ({
  roles,
  onShowToast,
}) => {
  const [kpis, setKpis] = useState<AdminAccessKPIs>(initialAdminAccessKPIs);
  const [overview, setOverview] = useState<AdminSecurityOverview>(initialAdminSecurityOverview);
  const [admins, setAdmins] = useState<AuthorizedAdminItem[]>([]);
  const [selectedAdminIds, setSelectedAdminIds] = useState<string[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AuthorizedAdminItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [kpiData, overviewData, list] = await Promise.all([
        adminAccessControlService.getKPIs(),
        adminAccessControlService.getSecurityOverview(),
        adminAccessControlService.getAuthorizedAdmins(
          statusFilter,
          searchQuery,
          roleFilter,
          departmentFilter
        ),
      ]);
      setKpis(kpiData);
      setOverview(overviewData);
      setAdmins(list);
    } catch (err) {
      console.error(err);
      onShowToast('Failed to load admin access control data', 'error');
    }
  }, [statusFilter, searchQuery, roleFilter, departmentFilter, onShowToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleSelect = (id: string) => {
    setSelectedAdminIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedAdminIds.length === admins.length) {
      setSelectedAdminIds([]);
    } else {
      setSelectedAdminIds(admins.map((a) => a.id));
    }
  };

  const handleAuthorize = async (data: {
    name: string;
    email: string;
    phone?: string;
    role: string;
    roleId: string;
    department: string;
    sendInvitation: boolean;
  }) => {
    const res = await adminAccessControlService.authorizeAdmin(data);
    if (res.success) {
      onShowToast(res.message, 'success');
      loadData();
    } else {
      onShowToast(res.message, 'error');
    }
  };

  const handleChangeStatus = async (id: string, newStatus: AdminAccountStatus) => {
    try {
      await adminAccessControlService.updateAdminStatus(id, newStatus);
      onShowToast(`Administrator account status changed to ${newStatus}`, 'success');
      loadData();
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to update account status', 'error');
    }
  };

  const handleResendInvite = async (id: string) => {
    const res = await adminAccessControlService.resendInvitation(id);
    onShowToast(res.message, res.success ? 'success' : 'error');
    loadData();
  };

  const handleDeleteAdmin = async (id: string) => {
    try {
      await adminAccessControlService.deleteAuthorizedAdmin(id);
      onShowToast('Administrator authorization revoked and email removed', 'success');
      loadData();
    } catch (err: any) {
      onShowToast(err?.message || 'Failed to delete authorized admin', 'error');
    }
  };

  const handleBulkUpdateStatus = async (status: AdminAccountStatus) => {
    if (selectedAdminIds.length === 0) return;
    await adminAccessControlService.bulkUpdateStatus(selectedAdminIds, status);
    onShowToast(`Updated ${selectedAdminIds.length} accounts to ${status}`, 'success');
    setSelectedAdminIds([]);
    loadData();
  };

  const handleBulkDelete = async () => {
    if (selectedAdminIds.length === 0) return;
    await adminAccessControlService.bulkDelete(selectedAdminIds);
    onShowToast(`Deleted ${selectedAdminIds.length} authorized accounts`, 'success');
    setSelectedAdminIds([]);
    loadData();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Name,Email,Role,Department,AccountStatus,InvitationStatus,LastLogin\n' +
      admins
        .map(
          (a) =>
            `"${a.name}","${a.email}","${a.role}","${a.department}","${a.accountStatus}","${a.invitationStatus}","${a.lastLogin}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'authorized_admin_access_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Exported authorized admin list to CSV', 'success');
  };

  const handleSaveEdit = async (id: string, partial: Partial<AuthorizedAdminItem>) => {
    await adminAccessControlService.updateAdminDetails(id, partial);
    onShowToast('Administrator details updated successfully', 'success');
    loadData();
  };

  return (
    <div className="space-y-5 pt-8 border-t border-slate-200/90 select-none">
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
              <Shield className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              Admin Access Control
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Manage which users are authorized to access the Super Admin Panel. Only approved email
            addresses can sign in to the admin portal.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => setIsAuthorizeModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Authorize Admin</span>
        </button>
      </div>

      {/* ── 2. 4 SECURITY SUMMARY KPI CARDS ── */}
      <AdminAccessKPIsCards
        kpis={kpis}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
      />

      {/* ── 3. MAIN ACCESS CONTROL WORKSPACE (TABLE | SECURITY PANEL) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (lg:col-span-8) - Authorized Admin List Table */}
        <div className="lg:col-span-8">
          <AuthorizedAdminTable
            admins={admins}
            selectedAdminIds={selectedAdminIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            roleFilter={roleFilter}
            onRoleFilterChange={setRoleFilter}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={setDepartmentFilter}
            onEditAdmin={(adm) => setEditingAdmin(adm)}
            onChangeStatus={handleChangeStatus}
            onResendInvite={handleResendInvite}
            onDeleteAdmin={handleDeleteAdmin}
            onBulkUpdateStatus={handleBulkUpdateStatus}
            onBulkDelete={handleBulkDelete}
            onExportCSV={handleExportCSV}
          />
        </div>

        {/* Right Column (lg:col-span-4) - Security Overview & Activity Panel */}
        <div className="lg:col-span-4 sticky top-20">
          <SecurityOverviewPanel overview={overview} />
        </div>
      </div>

      {/* ── MODALS ── */}
      <AuthorizeAdminModal
        isOpen={isAuthorizeModalOpen}
        onClose={() => setIsAuthorizeModalOpen(false)}
        roles={roles}
        onAuthorize={handleAuthorize}
      />

      <EditAuthorizedAdminModal
        isOpen={!!editingAdmin}
        onClose={() => setEditingAdmin(null)}
        admin={editingAdmin}
        roles={roles}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
