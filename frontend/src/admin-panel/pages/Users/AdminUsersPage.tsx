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
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
      const [fetchedUsers, fetchedStats] = await Promise.all([
        adminUserManagementService.getUsers(
          { ...filters, search: quickSearch || filters.search },
          sortConfig
        ),
        adminUserManagementService.getKPIStats(),
      ]);
      setUsers(fetchedUsers);
      setKpiStats(fetchedStats);

      // Default select the first user in drawer if none selected
      if (fetchedUsers.length > 0 && !selectedUser) {
        setSelectedUser(fetchedUsers[0]);
      } else if (fetchedUsers.length > 0 && selectedUser) {
        const stillPresent = fetchedUsers.find((u) => u.id === selectedUser.id);
        setSelectedUser(stillPresent || fetchedUsers[0]);
      } else if (fetchedUsers.length === 0) {
        setSelectedUser(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load users data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, quickSearch, sortConfig]);

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

  const handleSelectUserForDrawer = (user: TravelerUser) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  // ── 5. SORTING ──
  const handleSort = (key: UserSortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── 6. PAGINATION DATA ──
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));

  // ── 7. MODAL & ROW ACTIONS ──
  const handleRowAction = (actionType: string, user: TravelerUser) => {
    switch (actionType) {
      case 'view':
        setSelectedUser(user);
        setIsDrawerOpen(true);
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
        setSelectedUser(user);
        setIsDrawerOpen(true);
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
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, verificationStatus: 'Verified' } : u))
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => (prev ? { ...prev, verificationStatus: 'Verified' } : null));
        }
        showToast(`${user.name} verified successfully!`, 'success');
      } else if (type === 'suspend' && user) {
        await adminUserManagementService.suspendUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'Suspended' } : u))
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => (prev ? { ...prev, status: 'Suspended' } : null));
        }
        showToast(`${user.name} suspended.`, 'info');
      } else if (type === 'activate' && user) {
        await adminUserManagementService.activateUser(user.id);
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: 'Active' } : u))
        );
        if (selectedUser?.id === user.id) {
          setSelectedUser((prev) => (prev ? { ...prev, status: 'Active' } : null));
        }
        showToast(`${user.name} activated successfully.`, 'success');
      } else if (type === 'delete' && user) {
        await adminUserManagementService.deleteUser(user.id);
        const remaining = users.filter((u) => u.id !== user.id);
        setUsers(remaining);
        setSelectedIds((prev) => prev.filter((id) => id !== user.id));
        if (selectedUser?.id === user.id) {
          setSelectedUser(remaining[0] || null);
        }
        showToast(`${user.name} removed from platform.`, 'info');
      } else if (type === 'reset_password' && user) {
        showToast(`Password reset link sent to ${user.email}`, 'success');
      } else if (type === 'bulk_verify') {
        await adminUserManagementService.bulkVerify(selectedIds);
        setUsers((prev) =>
          prev.map((u) => (selectedIds.includes(u.id) ? { ...u, verificationStatus: 'Verified' } : u))
        );
        showToast(`Verified ${selectedIds.length} users successfully!`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_suspend') {
        await adminUserManagementService.bulkSuspend(selectedIds);
        setUsers((prev) =>
          prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: 'Suspended' } : u))
        );
        showToast(`Suspended ${selectedIds.length} users.`, 'info');
        setSelectedIds([]);
      } else if (type === 'bulk_activate') {
        await adminUserManagementService.bulkActivate(selectedIds);
        setUsers((prev) =>
          prev.map((u) => (selectedIds.includes(u.id) ? { ...u, status: 'Active' } : u))
        );
        showToast(`Activated ${selectedIds.length} users.`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_delete') {
        await adminUserManagementService.bulkDelete(selectedIds);
        const remaining = users.filter((u) => !selectedIds.includes(u.id));
        setUsers(remaining);
        setSelectedIds([]);
        if (selectedUser && selectedIds.includes(selectedUser.id)) {
          setSelectedUser(remaining[0] || null);
        }
        showToast(`Deleted ${confirmModal.selectedCount} users.`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setConfirmModal({ isOpen: false, type: 'verify', user: null });
    }
  };

  // Add User handler
  const handleAddNewUser = async (userData: Partial<TravelerUser>) => {
    const created = await adminUserManagementService.addUser(userData);
    setUsers((prev) => [created, ...prev]);
    setSelectedUser(created);
    setIsDrawerOpen(true);
    showToast(`New traveler "${created.name}" created successfully!`, 'success');
  };

  // Update User handler
  const handleUpdateUser = async (id: string, updates: Partial<TravelerUser>) => {
    const updated = await adminUserManagementService.updateUser(id, updates);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      if (selectedUser?.id === id) setSelectedUser(updated);
      showToast('User profile updated successfully.', 'success');
    }
  };

  // Send Notification handler
  const handleSendNotification = (title: string, message: string) => {
    showToast(`Notification "${title}" sent successfully!`, 'success');
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (users.length === 0) {
      showToast('No users available to export', 'info');
      return;
    }

    const headers = ['User ID', 'Name', 'Email', 'Phone', 'City', 'Country', 'Membership', 'Verification', 'Status', 'Trips', 'Bookings', 'Total Spend', 'Join Date'];
    const rows = users.map((u) => [
      u.userId,
      `"${u.name}"`,
      u.email,
      u.phone,
      u.city,
      u.country,
      u.membership,
      u.verificationStatus,
      u.status,
      u.tripsCompleted,
      u.totalBookings,
      `"${u.totalSpend}"`,
      `"${u.joinDate}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apnatrip_users_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${users.length} users to CSV`, 'success');
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

      {/* ── 5. MAIN CONTENT AREA: TABLE + STICKY RIGHT DRAWER ── */}
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
        <div className="flex flex-col xl:flex-row gap-5 items-start">
          {/* Table Container */}
          <div className="flex-1 min-w-0 w-full space-y-3">
            <UsersTable
              users={paginatedUsers}
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
            {users.length > 0 && (
              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={users.length}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            )}
          </div>

          {/* Sticky Right Details Drawer */}
          {selectedUser && (
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
          )}
        </div>
      )}

      {/* ── 6. MODALS ── */}
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
