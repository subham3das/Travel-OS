import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../user-panel/context/ToastContext';

// Import Services & Types
import { adminAgencyService } from '../../services/adminAgency.service';
import { Agency, AgencySummaryStats, AgencyFilters } from '../../types/agency';

// Import Reusable Super Admin Agency Components
import { AdminAgencyHeader } from '../../components/super-admin/agencies/AdminAgencyHeader';
import { AgencySummaryCards } from '../../components/super-admin/agencies/AgencySummaryCards';
import { AgencyFilterPanel } from '../../components/super-admin/agencies/AgencyFilterPanel';
import { AgencyBulkToolbar } from '../../components/super-admin/agencies/AgencyBulkToolbar';
import { AgencyTable } from '../../components/super-admin/agencies/AgencyTable';
import { PaginationFooter } from '../../components/super-admin/agencies/PaginationFooter';
import { AgencyDrawer } from '../../components/super-admin/agencies/AgencyDrawer';

/**
 * Super Admin Agency Management Page Component
 * Route: /admin/agencies
 * 100% Backend-Driven Architecture connected to MongoDB
 */
export const AdminAgenciesPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AgencySummaryStats | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Drawer State
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filters State
  const [filters, setFilters] = useState<AgencyFilters>({
    status: 'All Status',
    verification: 'All Verification',
    businessType: 'All Types',
    state: 'All States',
    city: 'All Cities',
    rating: 'All Ratings',
    dateJoined: '',
    search: '',
  });

  // Fetch Stats & Agencies from Backend
  const loadStats = useCallback(async () => {
    try {
      const statsData = await adminAgencyService.getSummaryStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to load agency stats:', err);
    }
  }, []);

  const loadAgencies = useCallback(
    async (page = currentPage, limit = itemsPerPage, activeFilters = filters) => {
      try {
        const res = await adminAgencyService.getAgencies(activeFilters, page, limit);
        setAgencies(res.agencies);
        setTotalPages(res.pagination.totalPages);
        setTotalItems(res.pagination.total);
      } catch (err) {
        console.error('Failed to load agencies list:', err);
      }
    },
    [currentPage, itemsPerPage, filters]
  );

  // Initial Load
  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadAgencies(1, itemsPerPage, filters)]);
      if (isMounted) setLoading(false);
    };
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter change handlers
  const handleFilterChange = (key: keyof AgencyFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    const initialFilters: AgencyFilters = {
      status: 'All Status',
      verification: 'All Verification',
      businessType: 'All Types',
      state: 'All States',
      city: 'All Cities',
      rating: 'All Ratings',
      dateJoined: '',
      search: '',
    };
    setFilters(initialFilters);
    setCurrentPage(1);
    loadAgencies(1, itemsPerPage, initialFilters);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadAgencies(1, itemsPerPage, filters).then(() => {
      showToast(`Filter applied`, 'success');
    });
  };

  const handleQuickSearch = (q: string) => {
    const updatedFilters = { ...filters, search: q };
    setFilters(updatedFilters);
    setCurrentPage(1);
    loadAgencies(1, itemsPerPage, updatedFilters);
  };

  // Checkbox selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === agencies.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(agencies.map((a) => a.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Row Action Handlers
  const handleViewDetails = (agency: Agency) => {
    setSelectedAgency(agency);
    setIsDrawerOpen(true);
  };

  const handleAction = async (actionType: string, agency: Agency) => {
    try {
      if (actionType === 'verify') {
        const res = await adminAgencyService.verifyAgency(agency.id);
        if (res.success) {
          showToast(`Agency "${agency.name}" has been verified successfully`, 'success');
          loadAgencies();
          loadStats();
        } else {
          showToast(res.message || 'Failed to verify agency', 'error');
        }
      } else if (actionType === 'activate') {
        const res = await adminAgencyService.activateAgency(agency.id);
        if (res.success) {
          showToast(`Agency "${agency.name}" has been activated`, 'success');
          loadAgencies();
          loadStats();
        } else {
          showToast(res.message || 'Failed to activate agency', 'error');
        }
      } else if (actionType === 'suspend') {
        const res = await adminAgencyService.suspendAgency(agency.id);
        if (res.success) {
          showToast(`Agency "${agency.name}" has been suspended`, 'info');
          loadAgencies();
          loadStats();
        } else {
          showToast(res.message || 'Failed to suspend agency', 'error');
        }
      } else if (actionType === 'delete') {
        const res = await adminAgencyService.deleteAgency(agency.id);
        if (res.success) {
          showToast(`Agency "${agency.name}" deleted`, 'info');
          setSelectedIds((prev) => prev.filter((id) => id !== agency.id));
          loadAgencies();
          loadStats();
        } else {
          showToast(res.message || 'Failed to delete agency', 'error');
        }
      } else if (actionType === 'edit') {
        showToast(`Editing agency details for "${agency.name}"`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'An error occurred', 'error');
    }
  };

  // Bulk action handlers
  const handleVerifySelected = async () => {
    const res = await adminAgencyService.bulkAgencyAction('verify', selectedIds);
    if (res.success) {
      showToast(`Verified ${res.modifiedCount ?? selectedIds.length} selected agencies`, 'success');
      setSelectedIds([]);
      loadAgencies();
      loadStats();
    } else {
      showToast(res.message || 'Bulk verify failed', 'error');
    }
  };

  const handleSuspendSelected = async () => {
    const res = await adminAgencyService.bulkAgencyAction('suspend', selectedIds);
    if (res.success) {
      showToast(`Suspended ${res.modifiedCount ?? selectedIds.length} selected agencies`, 'info');
      setSelectedIds([]);
      loadAgencies();
      loadStats();
    } else {
      showToast(res.message || 'Bulk suspend failed', 'error');
    }
  };

  const handleActivateSelected = async () => {
    const res = await adminAgencyService.bulkAgencyAction('activate', selectedIds);
    if (res.success) {
      showToast(`Activated ${res.modifiedCount ?? selectedIds.length} selected agencies`, 'success');
      setSelectedIds([]);
      loadAgencies();
      loadStats();
    } else {
      showToast(res.message || 'Bulk activate failed', 'error');
    }
  };

  const handleExportSelected = () => {
    showToast(`Exporting data for ${selectedIds.length} agencies to CSV...`, 'info');
  };

  const handleDeleteSelected = async () => {
    const res = await adminAgencyService.bulkAgencyAction('delete', selectedIds);
    if (res.success) {
      showToast(`Deleted ${res.modifiedCount ?? selectedIds.length} selected agencies`, 'info');
      setSelectedIds([]);
      loadAgencies();
      loadStats();
    } else {
      showToast(res.message || 'Bulk delete failed', 'error');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadAgencies(page, itemsPerPage, filters);
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
    loadAgencies(1, newLimit, filters);
  };

  if (loading || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4 select-none">
        <div className="w-12 h-12 rounded-full border-4 border-[#6356E5]/20 border-t-[#6356E5] animate-spin" />
        <p className="text-xs font-black text-slate-500 tracking-wider uppercase">
          Loading Agency Management Module...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5 pb-12 select-none"
    >
      {/* ── 1. PAGE HEADER ── */}
      <AdminAgencyHeader
        searchQuery={filters.search}
        onSearchChange={handleQuickSearch}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        isFilterOpen={isFilterOpen}
        onExport={() => showToast('Exporting agencies directory report...', 'info')}
        onAddAgency={() => showToast('Opening new agency onboarding wizard...', 'info')}
      />

      {/* ── 2. SUMMARY KPI CARDS (6 CARDS) ── */}
      <AgencySummaryCards
        stats={stats}
        onSelectFilterStatus={(statusKey) => {
          let statusVal = 'All Status';
          if (statusKey === 'active') statusVal = 'Active';
          if (statusKey === 'pending') statusVal = 'Pending';
          if (statusKey === 'suspended') statusVal = 'Suspended';
          if (statusKey === 'rejected') statusVal = 'Rejected';
          handleFilterChange('status', statusVal);
          const updatedFilters = { ...filters, status: statusVal };
          setCurrentPage(1);
          loadAgencies(1, itemsPerPage, updatedFilters);
        }}
      />

      {/* ── 3. DEDICATED FILTER PANEL ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <AgencyFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        )}
      </AnimatePresence>

      {/* ── 4. BULK SELECTION TOOLBAR ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <AgencyBulkToolbar
            selectedCount={selectedIds.length}
            totalCount={totalItems}
            onSelectAll={() => setSelectedIds(agencies.map((a) => a.id))}
            onVerifySelected={handleVerifySelected}
            onSuspendSelected={handleSuspendSelected}
            onActivateSelected={handleActivateSelected}
            onExportSelected={handleExportSelected}
            onDeleteSelected={handleDeleteSelected}
          />
        )}
      </AnimatePresence>

      {/* ── 5. AGENCY TABLE ── */}
      <AgencyTable
        agencies={agencies}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelect={handleToggleSelect}
        onViewDetails={handleViewDetails}
        onAction={handleAction}
      />

      {/* ── 6. PAGINATION FOOTER ── */}
      <PaginationFooter
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />

      {/* ── 7. RIGHT DETAILS DRAWER ── */}
      <AgencyDrawer
        agency={selectedAgency}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onViewFullProfile={(agency) =>
          showToast(`Opening full profile page for ${agency.name}`, 'info')
        }
        onVerifyAgency={(agency) => handleAction('verify', agency)}
        onSuspendAgency={(agency) => handleAction('suspend', agency)}
        onEditAgency={(agency) => handleAction('edit', agency)}
        onMoreActions={(agency) =>
          showToast(`More options opened for ${agency.name}`, 'info')
        }
      />
    </motion.div>
  );
};

export default AdminAgenciesPage;
