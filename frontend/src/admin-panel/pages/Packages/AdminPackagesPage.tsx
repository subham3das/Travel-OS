import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  AdminPackageItem,
  PackageKPIStats,
  PackageFilters,
  PackageSortConfig,
} from '../../types/packageManagement';
import {
  adminPackageManagementService,
  initialPackageKPIStats,
} from '../../services/adminPackageManagement.service';
import { AdminPackageHeader } from '../../components/super-admin/packages/AdminPackageHeader';
import { PackageKPISection } from '../../components/super-admin/packages/PackageKPISection';
import { PackageFilterPanel } from '../../components/super-admin/packages/PackageFilterPanel';
import { PackageBulkActionBar } from '../../components/super-admin/packages/PackageBulkActionBar';
import { PackagesTable } from '../../components/super-admin/packages/PackagesTable';
import { PackagePagination } from '../../components/super-admin/packages/PackagePagination';
import { PackageDetailsDrawer } from '../../components/super-admin/packages/PackageDetailsDrawer';
import { AddPackageModal } from '../../components/super-admin/packages/AddPackageModal';
import { EditPackageModal } from '../../components/super-admin/packages/EditPackageModal';
import { PackageActionConfirmModal } from '../../components/super-admin/packages/PackageActionConfirmModal';

export const AdminPackagesPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [packages, setPackages] = useState<AdminPackageItem[]>([]);
  const [kpiStats, setKpiStats] = useState<PackageKPIStats>(initialPackageKPIStats);
  const [selectedPackage, setSelectedPackage] = useState<AdminPackageItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<PackageSortConfig>({
    key: 'createdAt',
    direction: 'desc',
  });

  // Filters
  const [filters, setFilters] = useState<PackageFilters>({
    agency: 'All Agencies',
    destinationRegion: 'All Regions',
    destinationCountry: 'All Countries',
    status: 'All Status',
    approvalStatus: 'All Approvals',
    priceRange: 'All Prices',
    duration: 'All Durations',
    search: '',
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModalPackage, setEditModalPackage] = useState<AdminPackageItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'feature' | 'hide' | 'delete' | 'bulk_approve' | 'bulk_feature' | 'bulk_hide' | 'bulk_delete';
    pkg: AdminPackageItem | null;
    selectedCount?: number;
  }>({
    isOpen: false,
    type: 'approve',
    pkg: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const fetchPackagesData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedPkgs, fetchedStats] = await Promise.all([
        adminPackageManagementService.getPackages(
          { ...filters, search: quickSearch || filters.search },
          sortConfig
        ),
        adminPackageManagementService.getKPIStats(),
      ]);
      setPackages(fetchedPkgs);
      setKpiStats(fetchedStats);

      if (fetchedPkgs.length > 0 && selectedPackage) {
        const stillPresent = fetchedPkgs.find((p) => p.id === selectedPackage.id);
        setSelectedPackage(stillPresent || fetchedPkgs[0]);
      } else if (fetchedPkgs.length === 0) {
        setSelectedPackage(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load packages data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, quickSearch, sortConfig]);

  useEffect(() => {
    fetchPackagesData();
  }, [fetchPackagesData]);

  // ── 3. FILTER & SEARCH HANDLERS ──
  const handleFilterChange = (key: keyof PackageFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      agency: 'All Agencies',
      destinationRegion: 'All Regions',
      destinationCountry: 'All Countries',
      status: 'All Status',
      approvalStatus: 'All Approvals',
      priceRange: 'All Prices',
      duration: 'All Durations',
      search: '',
    });
    setQuickSearch('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    fetchPackagesData();
    showToast('Filters applied successfully', 'success');
  };

  const handleQuickSearch = (q: string) => {
    setQuickSearch(q);
    setCurrentPage(1);
  };

  // Filter KPI click
  const handleFilterByKPIStatus = (status: string) => {
    if (status === 'All Status') {
      handleFilterChange('status', 'All Status');
      handleFilterChange('approvalStatus', 'All Approvals');
    } else if (status === 'Active' || status === 'Sold Out' || status === 'Draft') {
      handleFilterChange('status', status);
    } else if (status === 'Pending') {
      handleFilterChange('approvalStatus', 'Pending');
    } else if (status === 'Featured') {
      handleFilterChange('status', 'All Status');
      handleFilterChange('approvalStatus', 'Approved');
    }
  };

  // ── 4. SELECTION HANDLERS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === packages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(packages.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectPackageForDrawer = (pkg: AdminPackageItem) => {
    setSelectedPackage(pkg);
    setIsDrawerOpen(true);
  };

  // ── 5. SORTING ──
  const handleSort = (key: PackageSortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── 6. PAGINATION DATA ──
  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return packages.slice(start, start + pageSize);
  }, [packages, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(packages.length / pageSize));

  // ── 7. MODAL & ROW ACTIONS ──
  const handleRowAction = (actionType: string, pkg: AdminPackageItem) => {
    switch (actionType) {
      case 'view':
        setSelectedPackage(pkg);
        setIsDrawerOpen(true);
        break;
      case 'edit':
        setEditModalPackage(pkg);
        break;
      case 'approve':
        setConfirmModal({ isOpen: true, type: 'approve', pkg });
        break;
      case 'feature':
        setConfirmModal({ isOpen: true, type: 'feature', pkg });
        break;
      case 'hide':
        setConfirmModal({ isOpen: true, type: 'hide', pkg });
        break;
      case 'delete':
        setConfirmModal({ isOpen: true, type: 'delete', pkg });
        break;
      default:
        break;
    }
  };

  // Handle Confirmed Action
  const handleExecuteConfirmedAction = async () => {
    setIsProcessing(true);
    try {
      const { type, pkg } = confirmModal;

      if (type === 'approve' && pkg) {
        await adminPackageManagementService.approvePackage(pkg.id);
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, approvalStatus: 'Approved', status: 'Active' } : p))
        );
        if (selectedPackage?.id === pkg.id) {
          setSelectedPackage((prev) => (prev ? { ...prev, approvalStatus: 'Approved', status: 'Active' } : null));
        }
        showToast(`"${pkg.title}" has been approved and published!`, 'success');
      } else if (type === 'feature' && pkg) {
        await adminPackageManagementService.featurePackage(pkg.id);
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, isFeatured: !p.isFeatured } : p))
        );
        if (selectedPackage?.id === pkg.id) {
          setSelectedPackage((prev) => (prev ? { ...prev, isFeatured: !prev.isFeatured } : null));
        }
        showToast(`Feature status updated for "${pkg.title}"`, 'success');
      } else if (type === 'hide' && pkg) {
        await adminPackageManagementService.hidePackage(pkg.id);
        setPackages((prev) =>
          prev.map((p) => (p.id === pkg.id ? { ...p, status: p.status === 'Draft' ? 'Active' : 'Draft' } : p))
        );
        if (selectedPackage?.id === pkg.id) {
          setSelectedPackage((prev) => (prev ? { ...prev, status: prev.status === 'Draft' ? 'Active' : 'Draft' } : null));
        }
        showToast(`Visibility updated for "${pkg.title}"`, 'info');
      } else if (type === 'delete' && pkg) {
        await adminPackageManagementService.deletePackage(pkg.id);
        const remaining = packages.filter((p) => p.id !== pkg.id);
        setPackages(remaining);
        setSelectedIds((prev) => prev.filter((id) => id !== pkg.id));
        if (selectedPackage?.id === pkg.id) {
          setSelectedPackage(remaining[0] || null);
        }
        showToast(`"${pkg.title}" deleted from platform.`, 'info');
      } else if (type === 'bulk_approve') {
        await adminPackageManagementService.bulkApprove(selectedIds);
        setPackages((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, approvalStatus: 'Approved', status: 'Active' } : p))
        );
        showToast(`Approved ${selectedIds.length} packages successfully!`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_feature') {
        await adminPackageManagementService.bulkFeature(selectedIds);
        setPackages((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, isFeatured: true } : p))
        );
        showToast(`Featured ${selectedIds.length} packages!`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_hide') {
        await adminPackageManagementService.bulkHide(selectedIds);
        setPackages((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, status: 'Draft' } : p))
        );
        showToast(`Moved ${selectedIds.length} packages to Draft.`, 'info');
        setSelectedIds([]);
      } else if (type === 'bulk_delete') {
        await adminPackageManagementService.bulkDelete(selectedIds);
        const remaining = packages.filter((p) => !selectedIds.includes(p.id));
        setPackages(remaining);
        setSelectedIds([]);
        if (selectedPackage && selectedIds.includes(selectedPackage.id)) {
          setSelectedPackage(remaining[0] || null);
        }
        showToast(`Deleted ${confirmModal.selectedCount} packages.`, 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setConfirmModal({ isOpen: false, type: 'approve', pkg: null });
    }
  };

  // Add Package handler
  const handleAddNewPackage = async (packageData: Partial<AdminPackageItem>) => {
    const created = await adminPackageManagementService.addPackage(packageData);
    setPackages((prev) => [created, ...prev]);
    setSelectedPackage(created);
    setIsDrawerOpen(true);
    showToast(`New package "${created.title}" created successfully!`, 'success');
  };

  // Update Package handler
  const handleUpdatePackage = async (id: string, updates: Partial<AdminPackageItem>) => {
    const updated = await adminPackageManagementService.updatePackage(id, updates);
    if (updated) {
      setPackages((prev) => prev.map((p) => (p.id === id ? updated : p)));
      if (selectedPackage?.id === id) setSelectedPackage(updated);
      showToast('Package updated successfully.', 'success');
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (packages.length === 0) {
      showToast('No packages available to export', 'info');
      return;
    }

    const headers = ['Package ID', 'Title', 'Agency', 'Destination', 'Duration', 'Price', 'Status', 'Approval', 'Bookings', 'Revenue', 'Rating'];
    const rows = packages.map((p) => [
      p.packageId,
      `"${p.title}"`,
      `"${p.agencyName}"`,
      `"${p.destinationRegion}, ${p.destinationCountry}"`,
      `"${p.durationText}"`,
      `"${p.currentPrice}"`,
      p.status,
      p.approvalStatus,
      p.bookingsCount,
      `"${p.totalRevenue}"`,
      p.rating,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apnatrip_packages_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${packages.length} packages to CSV`, 'success');
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
      <AdminPackageHeader
        searchQuery={quickSearch}
        onSearchChange={handleQuickSearch}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onExport={handleExportCSV}
        onAddPackage={() => setIsAddModalOpen(true)}
      />

      {/* ── 2. KPI SUMMARY CARDS (6 CARDS) ── */}
      <PackageKPISection
        stats={kpiStats}
        onFilterByStatus={handleFilterByKPIStatus}
      />

      {/* ── 3. FILTER PANEL (COLLAPSIBLE) ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <PackageFilterPanel
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
          <PackageBulkActionBar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onBulkApprove={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_approve', pkg: null, selectedCount: selectedIds.length })
            }
            onBulkFeature={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_feature', pkg: null, selectedCount: selectedIds.length })
            }
            onBulkHide={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_hide', pkg: null, selectedCount: selectedIds.length })
            }
            onBulkDelete={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_delete', pkg: null, selectedCount: selectedIds.length })
            }
            onBulkExport={handleExportCSV}
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
            <h3 className="text-base font-black text-[#0F172A]">Failed to Load Packages</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchPackagesData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <PackagesTable
            packages={paginatedPackages}
            selectedIds={selectedIds}
            selectedPackage={selectedPackage}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelect={handleToggleSelect}
            onSelectPackage={handleSelectPackageForDrawer}
            onRowAction={handleRowAction}
            onRefresh={fetchPackagesData}
          />

          {/* Pagination Footer */}
          {packages.length > 0 && (
            <PackagePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={packages.length}
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

      {/* ── 6. SLIDE-IN RIGHT DETAILS DRAWER OVERLAY ── */}
      <PackageDetailsDrawer
        pkg={selectedPackage}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(p) => setEditModalPackage(p)}
        onApprove={(p) => setConfirmModal({ isOpen: true, type: 'approve', pkg: p })}
        onFeature={(p) => setConfirmModal({ isOpen: true, type: 'feature', pkg: p })}
        onHide={(p) => setConfirmModal({ isOpen: true, type: 'hide', pkg: p })}
        onDelete={(p) => setConfirmModal({ isOpen: true, type: 'delete', pkg: p })}
      />

      {/* ── 7. MODALS ── */}
      <AddPackageModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNewPackage}
      />

      <EditPackageModal
        pkg={editModalPackage}
        isOpen={!!editModalPackage}
        onClose={() => setEditModalPackage(null)}
        onUpdate={handleUpdatePackage}
      />

      <PackageActionConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        pkg={confirmModal.pkg}
        selectedCount={confirmModal.selectedCount}
        isProcessing={isProcessing}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'approve', pkg: null })}
      />
    </motion.div>
  );
};

export default AdminPackagesPage;
