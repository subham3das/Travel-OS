import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../user-panel/context/ToastContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Import Services & Types
import { adminCarRentalApprovalService } from '../../services/adminCarRentalApproval.service';
import {
  CarRentalApprovalItem,
  CarRentalStats,
  CarRentalFilters,
} from '../../types/carRentalApproval';

// Import Sub-Components
import { CarRentalApprovalHeader } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalHeader';
import { CarRentalApprovalStatsCards } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalStatsCards';
import { CarRentalApprovalTabs, QueueTabType } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalTabs';
import { CarRentalApprovalFilterPanel } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalFilterPanel';
import { CarRentalApprovalBulkToolbar } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalBulkToolbar';
import { CarRentalApprovalTable } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalTable';
import { AgencyRequestPagination } from '../../components/super-admin/agency-requests/AgencyRequestPagination';
import { CarRentalApprovalDrawer } from '../../components/super-admin/car-rental-approvals/CarRentalApprovalDrawer';
import { CarRentalDecisionModal } from '../../components/super-admin/car-rental-approvals/CarRentalDecisionModal';
import { CarRentalRequestChangesModal } from '../../components/super-admin/car-rental-approvals/CarRentalRequestChangesModal';

/**
 * Super Admin Car Rental Approvals Master Page
 * Route: /admin/car-rental-approvals
 * 100% Backend-Driven with Live MongoDB Data (agencies + cars)
 */
export const AdminCarRentalApprovalsPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<CarRentalStats | null>(null);
  const [requests, setRequests] = useState<CarRentalApprovalItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Queue Tabs State
  const [activeTab, setActiveTab] = useState<QueueTabType>('Pending');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState<CarRentalApprovalItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Decision Modal State (Approve / Reject / Suspend / Reopen)
  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'suspend' | 'reopen';
    targetRequest: CarRentalApprovalItem | null;
  }>({
    isOpen: false,
    type: 'approve',
    targetRequest: null,
  });
  const [isProcessingDecision, setIsProcessingDecision] = useState(false);

  // Request Changes Modal State
  const [requestChangesModal, setRequestChangesModal] = useState<{
    isOpen: boolean;
    targetRequest: CarRentalApprovalItem | null;
  }>({
    isOpen: false,
    targetRequest: null,
  });
  const [isProcessingChanges, setIsProcessingChanges] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<CarRentalFilters>({
    tab: 'Pending',
    status: 'All Status',
    state: 'All States',
    city: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const activeFilters: CarRentalFilters = {
        ...filters,
        tab: activeTab,
      };

      const [statsData, requestsRes] = await Promise.all([
        adminCarRentalApprovalService.getSummaryStats(),
        adminCarRentalApprovalService.getCarRentalRequests(activeFilters, currentPage, itemsPerPage),
      ]);

      setStats(statsData);
      setRequests(requestsRes.items || []);
      setTotalPages(requestsRes.pagination?.totalPages || 1);
      setTotalItems(requestsRes.pagination?.total || 0);

      if (requestsRes.items.length > 0 && !selectedRequest) {
        setSelectedRequest(requestsRes.items[0]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load car rental requests', err);
      setError('Unable to load car rental applications. Please check your backend connection.');
      setLoading(false);
    }
  }, [filters, activeTab, currentPage, itemsPerPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Tab change handler
  const handleTabChange = (tab: QueueTabType) => {
    setActiveTab(tab);
    setFilters((prev) => ({ ...prev, tab }));
    setCurrentPage(1);
    setSelectedIds([]);
  };

  // Filter change handlers
  const handleFilterChange = (key: keyof CarRentalFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    const initial: CarRentalFilters = {
      tab: activeTab,
      status: 'All Status',
      state: 'All States',
      city: '',
      dateFrom: '',
      dateTo: '',
      search: '',
    };
    setFilters(initial);
    setCurrentPage(1);
    showToast('Filters reset to defaults', 'info');
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadData();
    showToast('Filters applied successfully', 'success');
  };

  const handleQuickSearch = (q: string) => {
    handleFilterChange('search', q);
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === requests.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(requests.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Drawer inspection
  const handleOpenDrawer = async (request: CarRentalApprovalItem) => {
    try {
      const fullDetails = await adminCarRentalApprovalService.getCarRentalRequestById(request.id);
      setSelectedRequest(fullDetails || request);
    } catch {
      setSelectedRequest(request);
    }
    setIsDrawerOpen(true);
  };

  // Trigger Action Modals
  const handleTriggerApprove = (request: CarRentalApprovalItem) => {
    setDecisionModal({ isOpen: true, type: 'approve', targetRequest: request });
  };

  const handleTriggerReject = (request: CarRentalApprovalItem) => {
    setDecisionModal({ isOpen: true, type: 'reject', targetRequest: request });
  };

  const handleTriggerRequestChanges = (request: CarRentalApprovalItem) => {
    setRequestChangesModal({ isOpen: true, targetRequest: request });
  };

  const handleRowAction = (action: string, request: CarRentalApprovalItem) => {
    if (action === 'suspend') {
      setDecisionModal({ isOpen: true, type: 'suspend', targetRequest: request });
    } else if (action === 'reopen') {
      setDecisionModal({ isOpen: true, type: 'reopen', targetRequest: request });
    }
  };

  // Confirm Decision (Approve, Reject, Suspend, Reopen)
  const handleConfirmDecision = async (reason?: string, notes?: string) => {
    if (!decisionModal.targetRequest || isProcessingDecision) return;
    const req = decisionModal.targetRequest;
    setIsProcessingDecision(true);

    try {
      if (decisionModal.type === 'approve') {
        const res = await adminCarRentalApprovalService.approveCarRental(req.id, notes);
        if (res.success) {
          showToast(`Car Rental provider "${req.businessName}" approved! 🚗`, 'success');
          loadData();
          if (selectedRequest?.id === req.id) {
            setIsDrawerOpen(false);
          }
        }
      } else if (decisionModal.type === 'reject') {
        const res = await adminCarRentalApprovalService.rejectCarRental(req.id, reason || 'Compliance criteria not met', notes);
        if (res.success) {
          showToast(`Application for "${req.businessName}" rejected.`, 'info');
          loadData();
          if (selectedRequest?.id === req.id) {
            setIsDrawerOpen(false);
          }
        }
      } else if (decisionModal.type === 'suspend') {
        const res = await adminCarRentalApprovalService.suspendCarRental(req.id, reason);
        if (res.success) {
          showToast(`Operations suspended for "${req.businessName}".`, 'info');
          loadData();
        }
      } else if (decisionModal.type === 'reopen') {
        const res = await adminCarRentalApprovalService.reopenReview(req.id);
        if (res.success) {
          showToast(`Review reopened for "${req.businessName}".`, 'info');
          loadData();
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    } finally {
      setIsProcessingDecision(false);
      setDecisionModal({ isOpen: false, type: 'approve', targetRequest: null });
    }
  };

  // Confirm Request Changes
  const handleSendRequestChanges = async (issues: string[], message?: string) => {
    if (!requestChangesModal.targetRequest || isProcessingChanges) return;
    const req = requestChangesModal.targetRequest;
    setIsProcessingChanges(true);

    try {
      const res = await adminCarRentalApprovalService.requestChanges(req.id, issues, message);
      if (res.success) {
        showToast(`Changes requested from "${req.businessName}".`, 'success');
        loadData();
        if (selectedRequest?.id === req.id && res.request) {
          setSelectedRequest(res.request);
        }
        setRequestChangesModal({ isOpen: false, targetRequest: null });
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to request changes', 'error');
    } finally {
      setIsProcessingChanges(false);
    }
  };

  // Bulk Actions
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminCarRentalApprovalService.bulkAction('approve', selectedIds);
      if (res.success) {
        showToast(`Approved ${res.successful} car rental providers!`, 'success');
        setSelectedIds([]);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk approve failed', 'error');
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    const reason = window.prompt('Enter mandatory rejection reason for selected applications:');
    if (!reason || !reason.trim()) return;

    try {
      const res = await adminCarRentalApprovalService.bulkAction('reject', selectedIds, { reason: reason.trim() });
      if (res.success) {
        showToast(`Rejected ${res.successful} applications.`, 'info');
        setSelectedIds([]);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk reject failed', 'error');
    }
  };

  const handleBulkRequestChanges = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminCarRentalApprovalService.bulkAction('request_changes', selectedIds, {
        issues: ['Commercial permit, RC, and insurance documentation require review and re-upload'],
      });
      if (res.success) {
        showToast(`Requested changes from ${res.successful} providers.`, 'info');
        setSelectedIds([]);
        loadData();
      }
    } catch (err: any) {
      showToast(err.message || 'Bulk changes request failed', 'error');
    }
  };

  const handleExportCsv = async () => {
    showToast('Exporting car rental applications to CSV...', 'info');
    try {
      await adminCarRentalApprovalService.exportCsv({ ...filters, tab: activeTab });
      showToast('CSV Export generated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    }
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-5 p-4 select-none animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-12 bg-slate-200 rounded-2xl w-1/2" />
        <div className="h-96 bg-slate-200 rounded-2xl" />
      </div>
    );
  }

  // Error State
  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] space-y-4 text-center select-none">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">Error Loading Applications</h3>
          <p className="text-xs font-semibold text-slate-400 max-w-md">{error}</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Loading</span>
        </button>
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
      <CarRentalApprovalHeader
        searchQuery={filters.search}
        onSearchChange={handleQuickSearch}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        isFilterOpen={isFilterOpen}
        onExport={handleExportCsv}
      />

      {/* ── 2. SUMMARY KPI CARDS (6 CARDS) ── */}
      <CarRentalApprovalStatsCards
        stats={stats}
        onFilterByTab={(tab) => handleTabChange(tab)}
      />

      {/* ── 3. APPROVAL QUEUE TABS (Pending, Approved, Rejected, Needs Changes, All) ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <CarRentalApprovalTabs
          activeTab={activeTab}
          onChangeTab={handleTabChange}
          stats={stats}
        />
      </div>

      {/* ── 4. DEDICATED FILTER PANEL ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <CarRentalApprovalFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        )}
      </AnimatePresence>

      {/* ── 5. BULK SELECTION TOOLBAR ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <CarRentalApprovalBulkToolbar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onApproveSelected={handleBulkApprove}
            onRejectSelected={handleBulkReject}
            onRequestChanges={handleBulkRequestChanges}
            onExportSelected={handleExportCsv}
          />
        )}
      </AnimatePresence>

      {/* ── 6. APPLICATIONS TABLE ── */}
      <CarRentalApprovalTable
        requests={requests}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelect={handleToggleSelect}
        onOpenDrawer={handleOpenDrawer}
        onApprove={handleTriggerApprove}
        onReject={handleTriggerReject}
        onRequestChanges={handleTriggerRequestChanges}
        onRowAction={handleRowAction}
      />

      {/* ── 7. PAGINATION FOOTER ── */}
      <AgencyRequestPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newLimit) => {
          setItemsPerPage(newLimit);
          setCurrentPage(1);
        }}
      />

      {/* ── 8. SLIDE-OVER REVIEW DRAWER ── */}
      <CarRentalApprovalDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleTriggerApprove}
        onReject={handleTriggerReject}
        onRequestChanges={handleTriggerRequestChanges}
        onUpdateRequest={(updated) => {
          setSelectedRequest(updated);
          setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          adminCarRentalApprovalService.getSummaryStats().then(setStats);
        }}
      />

      {/* ── 9. DECISION MODAL (Approve / Reject / Suspend / Reopen) ── */}
      <CarRentalDecisionModal
        isOpen={decisionModal.isOpen}
        type={decisionModal.type}
        businessName={decisionModal.targetRequest?.businessName || 'Provider'}
        isProcessing={isProcessingDecision}
        onConfirm={handleConfirmDecision}
        onCancel={() => setDecisionModal({ isOpen: false, type: 'approve', targetRequest: null })}
      />

      {/* ── 10. REQUEST CHANGES MODAL (Issues Checklist) ── */}
      <CarRentalRequestChangesModal
        isOpen={requestChangesModal.isOpen}
        request={requestChangesModal.targetRequest}
        isProcessing={isProcessingChanges}
        onClose={() => setRequestChangesModal({ isOpen: false, targetRequest: null })}
        onSubmit={handleSendRequestChanges}
      />
    </motion.div>
  );
};

export default AdminCarRentalApprovalsPage;
