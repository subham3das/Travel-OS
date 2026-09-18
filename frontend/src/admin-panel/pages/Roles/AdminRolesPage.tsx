import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, AlertCircle, Shield } from 'lucide-react';
import {
  RoleKPIStats,
  RoleItem,
  PermissionRow,
  PermissionAuditItem,
  RoleActivityItem,
  ActiveLoginSessionItem,
  AccessRequestItem,
  RoleChangeTimelineItem,
} from '../../types/rolesManagement';
import {
  adminRolesManagementService,
  initialRoleKPIStats,
  initialRoleLibraryData,
  initialPermissionsMatrix,
  initialPermissionAudit,
  initialRoleActivity,
  initialActiveSessions,
  initialAccessRequests,
  initialRecentChanges,
} from '../../services/adminRolesManagement.service';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { AdminRolesHeader } from '../../components/super-admin/roles/AdminRolesHeader';
import { RoleKPIStatsCards } from '../../components/super-admin/roles/RoleKPIStats';
import { RoleExplorer } from '../../components/super-admin/roles/RoleExplorer';
import { PermissionMatrix } from '../../components/super-admin/roles/PermissionMatrix';
import { RoleDetailsSidebar } from '../../components/super-admin/roles/RoleDetailsSidebar';
import { RolesBottomWidgets } from '../../components/super-admin/roles/RolesBottomWidgets';
import { AdminAccessControlSection } from '../../components/super-admin/roles/access-control/AdminAccessControlSection';
import { CreateRoleModal } from '../../components/super-admin/roles/CreateRoleModal';
import { AssignUsersModal } from '../../components/super-admin/roles/AssignUsersModal';

export const AdminRolesPage: React.FC = () => {
  const { admin } = useAdminAuth();

  // ── 1. STATE MANAGEMENT ──
  const [activeTab, setActiveTab] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Live Data States
  const [kpiStats, setKpiStats] = useState<RoleKPIStats>(initialRoleKPIStats);
  const [roles, setRoles] = useState<RoleItem[]>(initialRoleLibraryData);
  const [selectedRole, setSelectedRole] = useState<RoleItem | undefined>(undefined);
  const [permissions, setPermissions] = useState<PermissionRow[]>(initialPermissionsMatrix);
  const [auditSummary, setAuditSummary] = useState<PermissionAuditItem[]>(initialPermissionAudit);
  const [activity, setActivity] = useState<RoleActivityItem[]>(initialRoleActivity);
  const [sessions, setSessions] = useState<ActiveLoginSessionItem[]>(initialActiveSessions);
  const [accessRequests, setAccessRequests] = useState<AccessRequestItem[]>(initialAccessRequests);
  const [recentChanges, setRecentChanges] = useState<RoleChangeTimelineItem[]>(initialRecentChanges);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING FROM MONGODB ──
  const loadRolesData = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const [
        stats,
        rolesList,
        audit,
        acts,
        sessList,
        requests,
        changes,
      ] = await Promise.all([
        adminRolesManagementService.getKPIStats(),
        adminRolesManagementService.getRoles(activeTab, searchQuery),
        adminRolesManagementService.getAuditSummary(),
        adminRolesManagementService.getActivity(),
        adminRolesManagementService.getSessions(),
        adminRolesManagementService.getAccessRequests(),
        adminRolesManagementService.getRecentChanges(),
      ]);

      setKpiStats(stats);
      setRoles(rolesList);
      setAuditSummary(audit);
      setActivity(acts);
      setSessions(sessList);
      setAccessRequests(requests);
      setRecentChanges(changes);

      if (rolesList.length > 0) {
        if (!selectedRole || !rolesList.some((r: RoleItem) => r.id === selectedRole.id)) {
          setSelectedRole(rolesList[0]);
        }
      }
    } catch (err: any) {
      console.error('Failed to load RBAC data from MongoDB:', err);
      setFetchError(err?.message || 'Backend connection failed. Please verify your connection.');
      showToast('Failed to load roles and permissions data from MongoDB', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, selectedRole]);

  useEffect(() => {
    loadRolesData();
  }, [loadRolesData]);

  // Load Permissions for selected role
  useEffect(() => {
    if (selectedRole) {
      adminRolesManagementService
        .getPermissions(selectedRole.id)
        .then(setPermissions)
        .catch((e) => console.error(e));
    }
  }, [selectedRole]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleTogglePermission = async (moduleId: string, field: keyof PermissionRow, value: boolean) => {
    if (!selectedRole) return;
    try {
      const updated = await adminRolesManagementService.updatePermission(selectedRole.id, moduleId, field, value);
      setPermissions(updated);
      showToast(`Updated ${moduleId} ${String(field)} permission for ${selectedRole.name}`, 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update permission in MongoDB', 'error');
    }
  };

  const handleCreateRole = async (name: string, description: string) => {
    try {
      const created = await adminRolesManagementService.createRole(name, description);
      setSelectedRole(created);
      await loadRolesData();
      showToast(`Created new role: "${created.name}"`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to create role', 'error');
    }
  };

  const handleDuplicateRole = async () => {
    if (!selectedRole) return;
    try {
      const dup = await adminRolesManagementService.duplicateRole(selectedRole.id);
      setSelectedRole(dup);
      await loadRolesData();
      showToast(`Duplicated role as "${dup.name}"`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to duplicate role', 'error');
    }
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    if (selectedRole.type === 'System') {
      showToast('System roles cannot be deleted', 'error');
      return;
    }
    try {
      await adminRolesManagementService.deleteRole(selectedRole.id);
      setSelectedRole(undefined);
      await loadRolesData();
      showToast(`Role "${selectedRole.name}" deleted from MongoDB`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete role', 'error');
    }
  };

  const handleExportPermissions = () => {
    const roleName = selectedRole?.name || 'Operations_Manager';
    const csvContent =
      'data:text/csv;charset=utf-8,Module,View,Create,Edit,Delete,Approve,Export,Assign,FullAccess\n' +
      permissions
        .map(
          (p) =>
            `${p.moduleName},${p.view},${p.create},${p.edit},${p.delete},${p.approve},${p.export},${p.assign},${p.fullAccess}`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${roleName.toLowerCase().replace(/\s+/g, '_')}_permissions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${roleName} permissions to CSV`, 'success');
  };

  const handleTerminateAllSessions = async () => {
    try {
      await adminRolesManagementService.terminateAllSessions();
      setSessions([]);
      showToast('All active admin sessions terminated', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to terminate sessions', 'error');
    }
  };

  const handleApproveRequest = async (id: string) => {
    try {
      const updated = await adminRolesManagementService.updateAccessRequest(id, 'Approved');
      setAccessRequests(updated);
      showToast('Access request approved and role privilege assigned', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to approve request', 'error');
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      const updated = await adminRolesManagementService.updateAccessRequest(id, 'Rejected');
      setAccessRequests(updated);
      showToast('Access request rejected', 'info');
    } catch (err: any) {
      showToast(err?.message || 'Failed to reject request', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg ${
                toast.type === 'success'
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : toast.type === 'error'
                  ? 'bg-rose-600 text-white shadow-rose-500/20'
                  : 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
              }`}
            >
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. PAGE HEADER ── */}
      <AdminRolesHeader
        onPermissionTemplates={() => showToast('Opening enterprise RBAC templates library', 'info')}
        onAccessRequests={() => showToast('Displaying pending privilege elevation requests', 'info')}
        onCreateRole={() => setIsCreateModalOpen(true)}
        pendingRequestsCount={accessRequests.filter((r) => r.status === 'Pending').length}
      />

      {/* ── ERROR RECOVERY STATE ── */}
      {fetchError && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-black text-rose-800">Backend Connection Failed</p>
              <p className="text-[11px] font-semibold text-rose-600">{fetchError}</p>
            </div>
          </div>
          <button
            onClick={() => loadRolesData()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* ── 2. 6 TOP KPI SUMMARY CARDS ── */}
      <RoleKPIStatsCards
        stats={kpiStats}
        onCardClick={(id) => {
          if (id === 'customRoles') setActiveTab('Custom Roles');
          else if (id === 'totalRoles') setActiveTab('All Roles');
          else setActiveTab('All Roles');
        }}
      />

      {/* ── 3. MAIN 3-PANEL RBAC WORKSPACE (LIBRARY | MATRIX | DETAILS) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Panel: Role Explorer (≈24% / lg:col-span-3) */}
        <div className="lg:col-span-3">
          <RoleExplorer
            roles={roles}
            selectedRoleId={selectedRole?.id}
            onSelectRole={(r) => {
              setSelectedRole(r);
              showToast(`Loaded ${r.name} permissions from MongoDB`, 'info');
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateRole={() => setIsCreateModalOpen(true)}
            onViewAllRoles={() => showToast('Displaying all registered roles', 'info')}
          />
        </div>

        {/* Center Panel: Permission Matrix (≈50% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <PermissionMatrix
            role={selectedRole}
            permissions={permissions}
            onTogglePermission={handleTogglePermission}
            onReset={() => showToast('Reset permissions to system defaults', 'info')}
            onViewAsUser={() => showToast(`Previewing dashboard view as ${selectedRole?.name || 'Admin'}`, 'info')}
          />
        </div>

        {/* Right Panel: Role Details Sidebar (≈26% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <RoleDetailsSidebar
            role={selectedRole}
            recentChanges={recentChanges}
            onSaveChanges={() => showToast(`Permissions synchronized with MongoDB for ${selectedRole?.name}`, 'success')}
            onDuplicateRole={handleDuplicateRole}
            onExportPermissions={handleExportPermissions}
            onAssignUsers={() => setIsAssignModalOpen(true)}
            onDeleteRole={handleDeleteRole}
            onViewAllMembers={() => setIsAssignModalOpen(true)}
            onViewAllChanges={() => showToast('Displaying full role audit logs from MongoDB', 'info')}
          />
        </div>
      </div>

      {/* ── 4. BOTTOM 4 MONITORING CARDS ── */}
      <RolesBottomWidgets
        auditSummary={auditSummary}
        activity={activity}
        sessions={sessions}
        accessRequests={accessRequests}
        onTerminateAllSessions={handleTerminateAllSessions}
        onApproveRequest={handleApproveRequest}
        onRejectRequest={handleRejectRequest}
        onViewAllAudit={() => showToast('Opening complete permission audit directory', 'info')}
        onViewAllActivity={() => showToast('Displaying real-time administrator activity stream', 'info')}
        onViewAllSessions={() => showToast('Opening active IP and session monitor', 'info')}
        onViewAllRequests={() => showToast('Displaying privilege requests queue', 'info')}
      />

      {/* ── 5. ENTERPRISE ADMIN ACCESS CONTROL SECTION ── */}
      <AdminAccessControlSection
        roles={roles}
        onShowToast={showToast}
      />

      {/* ── 6. MODALS ── */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRole}
      />

      <AssignUsersModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        role={selectedRole || roles[0]}
        onAssign={(ids) => showToast(`Assigned ${ids.length} admin users to ${selectedRole?.name}`, 'success')}
      />
    </motion.div>
  );
};

export default AdminRolesPage;
