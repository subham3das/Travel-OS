import React, { useState, useEffect } from 'react';
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
 * Single Source of Truth matching super-agencies.png
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

  // Load initial summary stats and agencies list
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [statsData, agenciesData] = await Promise.all([
          adminAgencyService.getSummaryStats(),
          adminAgencyService.getAgencies(filters),
        ]);

        if (isMounted) {
          setStats(statsData);
          setAgencies(agenciesData);
          // Set initial drawer selection to Wanderlust Holidays if available
          if (agenciesData.length > 0 && !selectedAgency) {
            setSelectedAgency(agenciesData[0]);
            setIsDrawerOpen(true);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Failed to load agency management data', err);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

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
    adminAgencyService.getAgencies(initialFilters).then(setAgencies);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    adminAgencyService.getAgencies(filters).then((data) => {
      setAgencies(data);
      showToast(`Found ${data.length} matching agencies`, 'success');
    });
  };

  const handleQuickSearch = (q: string) => {
    handleFilterChange('search', q);
    adminAgencyService.getAgencies({ ...filters, search: q }).then(setAgencies);
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
    switch (actionType) {
      case 'verify':
        await adminAgencyService.verifyAgency(agency.id);
        setAgencies((prev) =>
          prev.map((a) => (a.id === agency.id ? { ...a, verification: 'Verified' } : a))
        );
        showToast(`Agency "${agency.name}" has been verified successfully`, 'success');
        break;
      case 'activate':
        await adminAgencyService.activateAgency(agency.id);
        setAgencies((prev) =>
          prev.map((a) => (a.id === agency.id ? { ...a, status: 'Active' } : a))
        );
        showToast(`Agency "${agency.name}" has been activated`, 'success');
        break;
      case 'suspend':
        await adminAgencyService.suspendAgency(agency.id);
        setAgencies((prev) =>
          prev.map((a) => (a.id === agency.id ? { ...a, status: 'Suspended' } : a))
        );
        showToast(`Agency "${agency.name}" has been suspended`, 'info');
        break;
      case 'reject':
        setAgencies((prev) =>
          prev.map((a) => (a.id === agency.id ? { ...a, status: 'Rejected' } : a))
        );
        showToast(`Agency "${agency.name}" application rejected`, 'error');
        break;
      case 'delete':
        await adminAgencyService.deleteAgency(agency.id);
        setAgencies((prev) => prev.filter((a) => a.id !== agency.id));
        setSelectedIds((prev) => prev.filter((id) => id !== agency.id));
        showToast(`Agency "${agency.name}" deleted`, 'info');
        break;
      case 'edit':
        showToast(`Editing agency details for "${agency.name}"`, 'info');
        break;
      default:
        break;
    }
  };

  // Bulk action handlers
  const handleVerifySelected = () => {
    setAgencies((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, verification: 'Verified' } : a))
    );
    showToast(`Verified ${selectedIds.length} selected agencies`, 'success');
  };

  const handleSuspendSelected = () => {
    setAgencies((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: 'Suspended' } : a))
    );
    showToast(`Suspended ${selectedIds.length} selected agencies`, 'info');
  };

  const handleActivateSelected = () => {
    setAgencies((prev) =>
      prev.map((a) => (selectedIds.includes(a.id) ? { ...a, status: 'Active' } : a))
    );
    showToast(`Activated ${selectedIds.length} selected agencies`, 'success');
  };

  const handleExportSelected = () => {
    showToast(`Exporting data for ${selectedIds.length} agencies to CSV...`, 'info');
  };

  const handleDeleteSelected = () => {
    setAgencies((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    showToast(`Deleted ${selectedIds.length} selected agencies`, 'info');
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
          adminAgencyService
            .getAgencies({ ...filters, status: statusVal })
            .then(setAgencies);
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
            totalCount={1248}
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
        totalPages={125}
        totalItems={1248}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
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
