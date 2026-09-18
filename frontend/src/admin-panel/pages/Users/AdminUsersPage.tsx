import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  TravelerUser,
  UserKPIStats,
  UserFilters,
  UserSortConfig,
} from '../../types/userManagement';
import {
  adminUserManagementService,
  initialUserKPIStats,
} from '../../services/adminUserManagement.service';
import { AdminUserHeader } from '../../components/super-admin/users/AdminUserHeader';
import { UserKPISection } from '../../components/super-admin/users/UserKPISection';
import { UserFilterPanel } from '../../components/super-admin/users/UserFilterPanel';
import { UserBulkActionBar } from '../../components/super-admin/users/UserBulkActionBar';
import { UsersTable } from '../../components/super-admin/users/UsersTable';
import { UserPagination } from '../../components/super-admin/users/UserPagination';
import { UserDetailsDrawer } from '../../components/super-admin/users/UserDetailsDrawer';
import { AddUserModal } from '../../components/super-admin/users/AddUserModal';
import { EditUserModal } from '../../components/super-admin/users/EditUserModal';
import { SendNotificationModal } from '../../components/super-admin/users/SendNotificationModal';
import { UserActionConfirmModal } from '../../components/super-admin/users/UserActionConfirmModal';

export const AdminUsersPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [users, setUsers] = useState<TravelerUser[]>([]);
  const [kpiStats, setKpiStats] = useState<UserKPIStats>(initialUserKPIStats);
  const [selectedUser, setSelectedUser] = useState<TravelerUser | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState<UserSortConfig>({
    key: 'joinDate',
    direction: 'desc',
  });

  // Filters
  const [filters, setFilters] = useState<UserFilters>({
    userStatus: 'All Status',
    verification: 'All Verification',
    membership: 'All Membership',
    country: 'All Countries',
    state: 'All States',
    city: 'All Cities',
    registrationDate: '',
    search: '',
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalUser, setEditModalUser] = useState<TravelerUser | null>(null);
  const [notifModalUser, setNotifModalUser] = useState<TravelerUser | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'verify' | 'suspend' | 'activate' | 'delete' | 'reset_password' | 'bulk_verify' | 'bulk_suspend' | 'bulk_activate' | 'bulk_delete';
    user: TravelerUser | null;
    selectedCount?: number;
  }>({
    isOpen: false,
    type: 'verify',
    user: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const fetchUsersData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedResponse, fetchedStats] = await Promise.all([
        adminUserManagementService.getUsers(
          { ...filters, search: quickSearch || filters.search },
          sortConfig,
          { page: currentPage, limit: pageSize }
        ),
        adminUserManagementService.getKPIStats(),
      ]);
      setUsers(fetchedResponse.users);
      setTotalCount(fetchedResponse.pagination.total);
      setTotalPages(Math.max(1, fetchedResponse.pagination.totalPages));
      setKpiStats(fetchedStats);

      if (fetchedResponse.users.length > 0 && selectedUser) {
        const stillPresent = fetchedResponse.users.find((u) => u.id === selectedUser.id);
        if (stillPresent) {
          setSelectedUser(stillPresent);
        }
      } else if (fetchedResponse.users.length === 0) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load users data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, quickSearch, sortConfig, currentPage, pageSize]);

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // ── 3. FILTER & SEARCH HANDLERS ──
  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      userStatus: 'All Status',
      verification: 'All Verification',
      membership: 'All Membership',
      country: 'All Countries',
      state: 'All States',
      city: 'All Cities',
      registrationDate: '',
      search: '',
    });
    setQuickSearch('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchUsersData();
    showToast('Filters applied successfully', 'success');
  };

  const handleQuickSearch = (q: string) => {
    setQuickSearch(q);
    setCurrentPage(1);
  };

  // Filter KPI click
  const handleFilterByKPIStatus = (status: string) => {
    if (status === 'All Status') {
      handleFilterChange('userStatus', 'All Status');
    } else if (status === 'Active' || status === 'Suspended') {
      handleFilterChange('userStatus', status);
    } else if (status === 'Verified') {
      handleFilterChange('verification', 'Verified');
    } else if (status === 'Gold') {
      handleFilterChange('membership', 'Gold');
    }
  };

  // ── 4. SELECTION HANDLERS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === users.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map((u) => u.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectUserForDrawer = async (user: TravelerUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
    try {
      const fullDetails = await adminUserManagementService.getUserById(user.id);
      if (fullDetails) {
        setSelectedUser(fullDetails);
      }
    } catch {
      // Keep baseline row details if network fails
    }
  };

  // ── 5. SORTING ──
  const handleSort = (key: UserSortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
    setCurrentPage(1);
  };

  // ── 6. MODAL & ROW ACTIONS ──
  const handleRowAction = (actionType: string, user: TravelerUser) => {
    switch (actionType) {
      case 'view':
        handleSelectUserForDrawer(user);
        break;
      case 'edit':
        setEditModalUser(user);
        break;
      case 'verify':
        setConfirmModal({ isOpen: true, type: 'verify', user });
        break;
      case 'suspend':
        setConfirmModal({ isOpen: true, type: 'suspend', user });
        break;
      case 'activate':
        setConfirmModal({ isOpen: true, type: 'activate', user });
        break;
      case 'delete':
        setConfirmModal({ isOpen: true, type: 'delete', user });
        break;
      case 'reset_password':
        setConfirmModal({ isOpen: true, type: 'reset_password', user });
        break;
      case 'send_notification':
        setNotifModalUser(user);
        break;
      case 'view_trips':
      case 'view_bookings':
        handleSelectUserForDrawer(user);
        break;
      default:
        break;
    }
  };

  // Handle Confirmed Action
  const handleExecuteConfirmedAction = async () => {
    setIsProcessing(true);
    try {
      const { type, user } = confirmModal;

      if (type === 'verify' && user) {
        await adminUserManagementService.verifyUser(user.id);
        showToast(`${user.name} verified successfully!`, 'success');
        fetchUsersData();
      } else if (type === 'suspend' && user) {
        await adminUserManagementService.suspendUser(user.id);
        showToast(`${user.name} suspended.`, 'info');
        fetchUsersData();
      } else if (type === 'activate' && user) {
        await adminUserManagementService.activateUser(user.id);
        showToast(`${user.name} activated successfully.`, 'success');
        fetchUsersData();
      } else if (type === 'delete' && user) {
        await adminUserManagementService.deleteUser(user.id);
        setSelectedIds((prev) => prev.filter((id) => id !== user.id));
        if (selectedUser?.id === user.id) {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }
        showToast(`${user.name} removed from platform.`, 'info');
        fetchUsersData();
      } else if (type === 'reset_password' && user) {
        const res = await adminUserManagementService.resetPassword(user.id);
        showToast(res.message || `Password reset link sent to ${user.email}`, 'success');
      } else if (type === 'bulk_verify') {
        await adminUserManagementService.bulkVerify(selectedIds);
        showToast(`Verified ${selectedIds.length} users successfully!`, 'success');
        setSelectedIds([]);
        fetchUsersData();
      } else if (type === 'bulk_suspend') {
        await adminUserManagementService.bulkSuspend(selectedIds);
        showToast(`Suspended ${selectedIds.length} users.`, 'info');
        setSelectedIds([]);
        fetchUsersData();
      } else if (type === 'bulk_activate') {
        await adminUserManagementService.bulkActivate(selectedIds);
        showToast(`Activated ${selectedIds.length} users.`, 'success');
        setSelectedIds([]);
        fetchUsersData();
      } else if (type === 'bulk_delete') {
        await adminUserManagementService.bulkDelete(selectedIds);
        showToast(`Deleted ${confirmModal.selectedCount || selectedIds.length} users.`, 'info');
        setSelectedIds([]);
        if (selectedUser && selectedIds.includes(selectedUser.id)) {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }
        fetchUsersData();
      }
    } catch (err: any) {
      console.error(err);
      showToast(err?.message || 'An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setConfirmModal({ isOpen: false, type: 'verify', user: null });
    }
  };

  // Add User handler
  const handleAddNewUser = async (userData: Partial<TravelerUser>) => {
    try {
      const created = await adminUserManagementService.addUser(userData);
      showToast(`New traveler "${created.name}" created successfully!`, 'success');
      fetchUsersData();
      setSelectedUser(created);
      setIsDrawerOpen(true);
    } catch (err: any) {
      showToast(err?.message || 'Failed to create traveler user', 'error');
    }
  };

  // Update User handler
  const handleUpdateUser = async (id: string, updates: Partial<TravelerUser>) => {
    try {
      const updated = await adminUserManagementService.updateUser(id, updates);
      if (updated) {
        if (selectedUser?.id === id) setSelectedUser(updated);
        showToast('User profile updated successfully.', 'success');
        fetchUsersData();
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update user profile', 'error');
    }
  };

  // Send Notification handler
  const handleSendNotification = async (title: string, message: string) => {
    if (!notifModalUser) return;
    try {
      await adminUserManagementService.sendNotification(notifModalUser.id, title, message);
      showToast(`Notification "${title}" sent successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to send notification', 'error');
    }
  };

  // CSV Export handler
  const handleExportCSV = async () => {
    try {
      await adminUserManagementService.exportCSV({
        ...filters,
        search: quickSearch || filters.search,
      });
      showToast('Users exported to CSV successfully', 'success');
    } catch (err: any) {
      showToast(err?.message || 'Failed to export CSV', 'error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATION ── */}
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
      <AdminUserHeader
        searchQuery={quickSearch}
        onSearchChange={handleQuickSearch}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onExport={handleExportCSV}
        onAddUser={() => setIsAddModalOpen(true)}
      />

      {/* ── 2. KPI SUMMARY CARDS (6 CARDS) ── */}
      <UserKPISection
        stats={kpiStats}
        onFilterByStatus={handleFilterByKPIStatus}
      />

      {/* ── 3. FILTER PANEL (COLLAPSIBLE) ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <UserFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        )}
      </AnimatePresence>

      {/* ── 4. BULK ACTION BAR ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <UserBulkActionBar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onBulkVerify={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_verify', user: null, selectedCount: selectedIds.length })
            }
            onBulkSuspend={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_suspend', user: null, selectedCount: selectedIds.length })
            }
            onBulkActivate={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_activate', user: null, selectedCount: selectedIds.length })
            }
            onBulkExport={handleExportCSV}
            onBulkDelete={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_delete', user: null, selectedCount: selectedIds.length })
            }
          />
        )}
      </AnimatePresence>

      {/* ── 5. MAIN CONTENT AREA: TABLE ── */}
      {error ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 shadow-2xs space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#0F172A]">Failed to Load Users</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchUsersData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <UsersTable
            users={users}
            selectedIds={selectedIds}
            selectedUser={selectedUser}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelect={handleToggleSelect}
            onSelectUser={handleSelectUserForDrawer}
            onRowAction={handleRowAction}
            onRefresh={fetchUsersData}
          />

          {/* Pagination Footer */}
          {totalCount > 0 && (
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCount}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          )}
        </div>
      )}

      {/* ── 6. RIGHT DETAILS DRAWER OVERLAY (SLIDE IN FROM RIGHT) ── */}
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(u) => setEditModalUser(u)}
        onVerify={(u) => setConfirmModal({ isOpen: true, type: 'verify', user: u })}
        onSuspend={(u) => setConfirmModal({ isOpen: true, type: 'suspend', user: u })}
        onActivate={(u) => setConfirmModal({ isOpen: true, type: 'activate', user: u })}
        onSendNotification={(u) => setNotifModalUser(u)}
      />

      {/* ── 7. MODALS ── */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewUser}
      />

      <EditUserModal
        user={editModalUser}
        isOpen={!!editModalUser}
        onClose={() => setEditModalUser(null)}
        onUpdate={handleUpdateUser}
      />

      <SendNotificationModal
        user={notifModalUser}
        isOpen={!!notifModalUser}
        onClose={() => setNotifModalUser(null)}
        onSend={handleSendNotification}
      />

      <UserActionConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        user={confirmModal.user}
        selectedCount={confirmModal.selectedCount}
        isProcessing={isProcessing}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'verify', user: null })}
      />
    </motion.div>
  );
};

export default AdminUsersPage;
