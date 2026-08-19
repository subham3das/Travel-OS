import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { adminRolesManagementService } from '../../services/adminRolesManagement.service';
import {
  initialRoleKPIStats,
  initialRoleLibraryData,
  initialPermissionsMatrix,
  initialPermissionAudit,
  initialRoleActivity,
  initialActiveSessions,
  initialAccessRequests,
  initialRecentChanges,
} from '../../data/rolesData';
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
  // ── 1. STATE MANAGEMENT ──
  const [activeTab, setActiveTab] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Data States
  const [kpiStats, setKpiStats] = useState<RoleKPIStats>(initialRoleKPIStats);
  const [roles, setRoles] = useState<RoleItem[]>(initialRoleLibraryData);
  const [selectedRole, setSelectedRole] = useState<RoleItem>(
    initialRoleLibraryData.find((r) => r.id === 'role-ops-manager') || initialRoleLibraryData[0]
  );
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

  // ── 2. DATA FETCHING ──
  const loadRolesData = useCallback(async () => {
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

      if (rolesList.length > 0 && !rolesList.some((r: RoleItem) => r.id === selectedRole?.id)) {
        setSelectedRole(rolesList[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load roles and permissions data', 'error');
    }
  }, [activeTab, searchQuery, selectedRole]);

  useEffect(() => {
    loadRolesData();
  }, [loadRolesData]);

  // Load Permissions for selected role
  useEffect(() => {
    if (selectedRole) {
      adminRolesManagementService.getPermissions(selectedRole.id).then(setPermissions);
    }
  }, [selectedRole]);

  // ── 3. OPERATIONAL ACTIONS ──
  const handleTogglePermission = async (moduleId: string, field: keyof PermissionRow, value: boolean) => {
    if (!selectedRole) return;
    const updated = await adminRolesManagementService.updatePermission(selectedRole.id, moduleId, field, value);
    setPermissions(updated);
    showToast(`Updated ${moduleId} ${String(field)} permission for ${selectedRole.name}`, 'info');
  };

  const handleCreateRole = async (name: string, description: string) => {
    const created = await adminRolesManagementService.createRole(name, description);
    setSelectedRole(created);
    loadRolesData();
    showToast(`Created new role: "${created.name}"`, 'success');
  };

  const handleDuplicateRole = async () => {
    if (!selectedRole) return;
    const dup = await adminRolesManagementService.duplicateRole(selectedRole.id);
    setSelectedRole(dup);
    loadRolesData();
    showToast(`Duplicated role as "${dup.name}"`, 'success');
  };

  const handleDeleteRole = async () => {
    if (!selectedRole) return;
    if (selectedRole.type === 'System') {
      showToast('System roles cannot be deleted', 'error');
      return;
    }
    await adminRolesManagementService.deleteRole(selectedRole.id);
    setSelectedRole(initialRoleLibraryData[0]);
    loadRolesData();
    showToast(`Role "${selectedRole.name}" deleted`, 'success');
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
    await adminRolesManagementService.terminateAllSessions();
    setSessions([]);
    showToast('All active admin sessions terminated', 'success');
  };

  const handleApproveRequest = async (id: string) => {
    const updated = await adminRolesManagementService.updateAccessRequest(id, 'Approved');
    setAccessRequests(updated);
    showToast('Access request approved and role privilege assigned', 'success');
  };

  const handleRejectRequest = async (id: string) => {
    const updated = await adminRolesManagementService.updateAccessRequest(id, 'Rejected');
    setAccessRequests(updated);
    showToast('Access request rejected', 'info');
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
        onAccessRequests={() => showToast('Displaying 3 pending privilege elevation requests', 'info')}
        onCreateRole={() => setIsCreateModalOpen(true)}
        pendingRequestsCount={accessRequests.filter((r) => r.status === 'Pending').length}
      />

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
              showToast(`Loaded ${r.name} permissions`, 'info');
            }}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onCreateRole={() => setIsCreateModalOpen(true)}
            onViewAllRoles={() => showToast('Opening comprehensive role dictionary', 'info')}
          />
        </div>

        {/* Center Panel: Permission Matrix (≈50% / lg:col-span-6) */}
        <div className="lg:col-span-6">
          <PermissionMatrix
            role={selectedRole}
            permissions={permissions}
            onTogglePermission={handleTogglePermission}
            onReset={() => showToast('Reset permissions to system defaults', 'info')}
            onViewAsUser={() => showToast(`Previewing dashboard view as ${selectedRole.name}`, 'info')}
          />
        </div>

        {/* Right Panel: Role Details Sidebar (≈26% / lg:col-span-3) */}
        <div className="lg:col-span-3 sticky top-20">
          <RoleDetailsSidebar
            role={selectedRole}
            recentChanges={recentChanges}
            onSaveChanges={() => showToast(`Changes saved for ${selectedRole.name}`, 'success')}
            onDuplicateRole={handleDuplicateRole}
            onExportPermissions={handleExportPermissions}
            onAssignUsers={() => setIsAssignModalOpen(true)}
            onDeleteRole={handleDeleteRole}
            onViewAllMembers={() => setIsAssignModalOpen(true)}
            onViewAllChanges={() => showToast('Displaying full role audit logs', 'info')}
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

      {/* ── 5. MODALS ── */}
      <CreateRoleModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateRole}
      />

      <AssignUsersModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        role={selectedRole}
        onAssign={(ids) => showToast(`Assigned ${ids.length} admin users to ${selectedRole.name}`, 'success')}
      />
    </motion.div>
  );
};

export default AdminRolesPage;
