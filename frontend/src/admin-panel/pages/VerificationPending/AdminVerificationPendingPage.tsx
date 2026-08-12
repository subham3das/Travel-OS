import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../../user-panel/context/ToastContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Import Services & Types
import { adminAgencyRequestService } from '../../services/adminAgencyRequest.service';
import {
  AgencyRequestItem,
  AgencyRequestSummaryStats,
  AgencyRequestFilters,
} from '../../types/agencyRequest';

// Import Super Admin Components
import { AdminAgencyRequestHeader } from '../../components/super-admin/agency-requests/AdminAgencyRequestHeader';
import { AgencyRequestStatsCards } from '../../components/super-admin/agency-requests/AgencyRequestStatsCards';
import { AgencyRequestFilterPanel } from '../../components/super-admin/agency-requests/AgencyRequestFilterPanel';
import { AgencyRequestBulkToolbar } from '../../components/super-admin/agency-requests/AgencyRequestBulkToolbar';
import { AgencyRequestsTable } from '../../components/super-admin/agency-requests/AgencyRequestsTable';
import { AgencyRequestPagination } from '../../components/super-admin/agency-requests/AgencyRequestPagination';
import { AgencyRequestDrawer } from '../../components/super-admin/agency-requests/AgencyRequestDrawer';
import { ConfirmationModal } from '../../components/super-admin/agency-requests/ConfirmationModal';

/**
 * Super Admin Agency Requests Page Component
 * Routes: /admin/verification-pending & /super-admin/agency-requests
 * Single Source of Truth matching super-agency-requests.png
 */
export const AdminVerificationPendingPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AgencyRequestSummaryStats | null>(null);
  const [requests, setRequests] = useState<AgencyRequestItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequestItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Confirmation Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject' | 'request_docs';
    targetRequest: AgencyRequestItem | null;
  }>({
    isOpen: false,
    type: 'approve',
    targetRequest: null,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filters State
  const [filters, setFilters] = useState<AgencyRequestFilters>({
    status: 'All Status',
    businessType: 'All Types',
    state: 'All States',
    submissionDate: '',
    verificationStatus: 'All Status',
    search: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, requestsData] = await Promise.all([
        adminAgencyRequestService.getSummaryStats(),
        adminAgencyRequestService.getAgencyRequests(filters),
      ]);

      setStats(statsData);
      setRequests(requestsData);

      // Default select first item for drawer if available
      if (requestsData.length > 0 && !selectedRequest) {
        setSelectedRequest(requestsData[0]);
        setIsDrawerOpen(true);
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load agency requests', err);
      setError('Unable to load agency registration requests. Please check your network connection.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter change handlers
  const handleFilterChange = (key: keyof AgencyRequestFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    const initialFilters: AgencyRequestFilters = {
      status: 'All Status',
      businessType: 'All Types',
      state: 'All States',
      submissionDate: '',
      verificationStatus: 'All Status',
      search: '',
    };
    setFilters(initialFilters);
    adminAgencyRequestService.getAgencyRequests(initialFilters).then(setRequests);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    adminAgencyRequestService.getAgencyRequests(filters).then((data) => {
      setRequests(data);
      showToast(`Found ${data.length} matching agency requests`, 'success');
    });
  };

  const handleQuickSearch = (q: string) => {
    handleFilterChange('search', q);
    adminAgencyRequestService.getAgencyRequests({ ...filters, search: q }).then(setRequests);
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

  // Drawer / Action Handlers
  const handleOpenDrawer = (request: AgencyRequestItem) => {
    setSelectedRequest(request);
    setIsDrawerOpen(true);
  };

  const handleTriggerApprove = (request: AgencyRequestItem) => {
    setModalConfig({ isOpen: true, type: 'approve', targetRequest: request });
  };

  const handleTriggerReject = (request: AgencyRequestItem) => {
    setModalConfig({ isOpen: true, type: 'reject', targetRequest: request });
  };

  const handleTriggerRequestDocs = (request: AgencyRequestItem) => {
    setModalConfig({ isOpen: true, type: 'request_docs', targetRequest: request });
  };

  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmDecision = async () => {
    if (!modalConfig.targetRequest || isProcessing) return;
    const req = modalConfig.targetRequest;
    setIsProcessing(true);

    try {
      if (modalConfig.type === 'approve') {
        const res = await adminAgencyRequestService.approveRequest(req.id);
        if (res.success) {
          const remaining = requests.filter((r) => r.id !== req.id);
          setRequests(remaining);
          if (res.updatedStats) setStats(res.updatedStats);

          // Update selection in drawer: select next request or close drawer
          if (selectedRequest?.id === req.id) {
            if (remaining.length > 0) {
              setSelectedRequest(remaining[0]);
            } else {
              setSelectedRequest(null);
              setIsDrawerOpen(false);
            }
          }

          setSelectedIds((prev) => prev.filter((id) => id !== req.id));
          showToast('Agency approved successfully.', 'success');
        } else {
          showToast(res.message || 'Failed to approve agency', 'error');
        }
      } else if (modalConfig.type === 'reject') {
        const res = await adminAgencyRequestService.rejectRequest(req.id);
        if (res.success) {
          if (res.updatedRequests) setRequests(res.updatedRequests);
          if (res.updatedStats) setStats(res.updatedStats);
          showToast(`Agency "${req.agencyName}" request rejected`, 'info');
        }
      } else if (modalConfig.type === 'request_docs') {
        const res = await adminAgencyRequestService.requestMoreDocuments(req.id);
        if (res.success && res.updatedRequests) {
          setRequests(res.updatedRequests);
        }
        showToast(`Document request sent to "${req.agencyName}"`, 'info');
      }
    } catch (err) {
      console.error('Error in decision workflow', err);
      showToast('An error occurred while processing the decision. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setModalConfig({ isOpen: false, type: 'approve', targetRequest: null });
    }
  };

  // Row Action Menu handler
  const handleRowAction = (actionType: string, request: AgencyRequestItem) => {
    switch (actionType) {
      case 'assign_reviewer':
        showToast(`Reviewer assigned to ${request.agencyName}`, 'info');
        break;
      case 'download_docs':
        showToast(`Downloading document bundle for ${request.agencyName}...`, 'info');
        break;
      case 'suspend_review':
        showToast(`Review suspended for ${request.agencyName}`, 'info');
        break;
      case 'delete':
        setRequests((prev) => prev.filter((r) => r.id !== request.id));
        setSelectedIds((prev) => prev.filter((id) => id !== request.id));
        showToast(`Agency request ${request.applicationId} deleted`, 'info');
        break;
      default:
        break;
    }
  };

  // Bulk actions
  const handleBulkApprove = () => {
    setRequests((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, reviewStatus: 'Approved' } : r))
    );
    showToast(`Approved ${selectedIds.length} selected agency requests`, 'success');
  };

  const handleBulkReject = () => {
    setRequests((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, reviewStatus: 'Rejected' } : r))
    );
    showToast(`Rejected ${selectedIds.length} selected agency requests`, 'info');
  };

  const handleBulkRequestDocs = () => {
    setRequests((prev) =>
      prev.map((r) => (selectedIds.includes(r.id) ? { ...r, verificationStatus: 'Missing Docs' } : r))
    );
    showToast(`Requested documents for ${selectedIds.length} agencies`, 'info');
  };

  // Loading Skeletons State
  if (loading) {
    return (
      <div className="space-y-5 p-4 select-none animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/3" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-16 bg-slate-200 rounded-2xl" />
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
          <h3 className="text-base font-extrabold text-[#0F172A]">Error Loading Requests</h3>
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
      <AdminAgencyRequestHeader
        searchQuery={filters.search}
        onSearchChange={handleQuickSearch}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        isFilterOpen={isFilterOpen}
        onExport={() => showToast('Exporting agency registration requests to CSV...', 'info')}
      />

      {/* ── 2. SUMMARY KPI CARDS (6 CARDS) ── */}
      <AgencyRequestStatsCards
        stats={stats}
        onFilterByStatus={(statusVal) => {
          handleFilterChange('status', statusVal);
          adminAgencyRequestService
            .getAgencyRequests({ ...filters, status: statusVal })
            .then(setRequests);
        }}
      />

      {/* ── 3. DEDICATED FILTER PANEL ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <AgencyRequestFilterPanel
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
          <AgencyRequestBulkToolbar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onApproveSelected={handleBulkApprove}
            onRejectSelected={handleBulkReject}
            onRequestDocuments={handleBulkRequestDocs}
            onExportSelected={() =>
              showToast(`Exported ${selectedIds.length} requests to CSV`, 'info')
            }
            onMoreActions={() =>
              showToast(`Bulk options opened for ${selectedIds.length} requests`, 'info')
            }
          />
        )}
      </AnimatePresence>

      {/* ── 5. REQUESTS TABLE ── */}
      <AgencyRequestsTable
        requests={requests}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelect={handleToggleSelect}
        onOpenDrawer={handleOpenDrawer}
        onRowAction={handleRowAction}
        onRefresh={loadData}
      />

      {/* ── 6. PAGINATION FOOTER ── */}
      <AgencyRequestPagination
        currentPage={currentPage}
        totalPages={4}
        totalItems={34}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* ── 7. RIGHT DETAILS DRAWER ── */}
      <AgencyRequestDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleTriggerApprove}
        onReject={handleTriggerReject}
        onRequestDocs={handleTriggerRequestDocs}
      />

      {/* ── 8. CONFIRMATION MODAL ── */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        agencyName={modalConfig.targetRequest?.agencyName || 'Agency'}
        isProcessing={isProcessing}
        onConfirm={handleConfirmDecision}
        onCancel={() => setModalConfig({ isOpen: false, type: 'approve', targetRequest: null })}
      />
    </motion.div>
  );
};

export default AdminVerificationPendingPage;
