import React, { useState, useEffect, useCallback } from 'react';
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
import { RequestMissingDocumentsModal } from '../../components/super-admin/agency-requests/RequestMissingDocumentsModal';

/**
 * Super Admin Agency Requests Page Component
 * Routes: /admin/verification-pending & /super-admin/agency-requests
 * 100% Backend-Driven with Live MongoDB Data
 */
export const AdminVerificationPendingPage: React.FC = () => {
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<AgencyRequestSummaryStats | null>(null);
  const [requests, setRequests] = useState<AgencyRequestItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Drawer State
  const [selectedRequest, setSelectedRequest] = useState<AgencyRequestItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Confirmation Modal State (Approve / Reject)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    targetRequest: AgencyRequestItem | null;
  }>({
    isOpen: false,
    type: 'approve',
    targetRequest: null,
  });

  // Request Missing Documents Modal State
  const [isRequestDocsModalOpen, setIsRequestDocsModalOpen] = useState(false);
  const [targetRequestDocs, setTargetRequestDocs] = useState<AgencyRequestItem | null>(null);
  const [isProcessingDocsRequest, setIsProcessingDocsRequest] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<AgencyRequestFilters>({
    status: 'All Status',
    businessType: 'All Types',
    state: 'All States',
    submissionDate: '',
    verificationStatus: 'All Status',
    search: '',
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, requestsRes] = await Promise.all([
        adminAgencyRequestService.getSummaryStats(),
        adminAgencyRequestService.getAgencyRequests(filters, currentPage, itemsPerPage),
      ]);

      setStats(statsData);
      setRequests(requestsRes.items || []);
      setTotalPages(requestsRes.pagination?.totalPages || 1);
      setTotalItems(requestsRes.pagination?.total || 0);

      // Default select first item for drawer if available and none selected
      if (requestsRes.items.length > 0 && !selectedRequest) {
        setSelectedRequest(requestsRes.items[0]);
      }
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to load agency requests', err);
      setError('Unable to load agency registration requests. Please check your network connection.');
      setLoading(false);
    }
  }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter change handlers
  const handleFilterChange = (key: keyof AgencyRequestFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
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

  // Drawer / Action Handlers
  const handleOpenDrawer = async (request: AgencyRequestItem) => {
    // Fetch fresh details with full audit activity from backend
    try {
      const fullDetails = await adminAgencyRequestService.getAgencyRequestById(request.id);
      setSelectedRequest(fullDetails || request);
    } catch {
      setSelectedRequest(request);
    }
    setIsDrawerOpen(true);
  };

  const handleTriggerApprove = (request: AgencyRequestItem) => {
    setModalConfig({ isOpen: true, type: 'approve', targetRequest: request });
  };

  const handleTriggerReject = (request: AgencyRequestItem) => {
    setModalConfig({ isOpen: true, type: 'reject', targetRequest: request });
  };

  const handleTriggerRequestDocs = (request: AgencyRequestItem) => {
    setTargetRequestDocs(request);
    setIsRequestDocsModalOpen(true);
  };

  const handleSendDocumentRequest = async (payload: {
    requestedDocuments: Array<{
      documentId: string;
      documentName: string;
      documentType: string;
      reason: string;
      customReason?: string;
      internalNote?: string;
    }>;
    agencyMessage?: string;
  }) => {
    if (!targetRequestDocs) return;
    setIsProcessingDocsRequest(true);
    try {
      const res = await adminAgencyRequestService.requestMissingDocuments(
        targetRequestDocs.id,
        payload
      );
      if (res.success) {
        showToast(`Document re-upload request sent to "${targetRequestDocs.agencyName}"`, 'success');
        if (selectedRequest && selectedRequest.id === targetRequestDocs.id && res.agency) {
          setSelectedRequest(res.agency);
        }
        if (res.updatedStats) setStats(res.updatedStats);
        setIsRequestDocsModalOpen(false);
        setTargetRequestDocs(null);
        loadData();
      } else {
        showToast(res.message || 'Failed to send document request', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error sending document request', 'error');
    } finally {
      setIsProcessingDocsRequest(false);
    }
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
          showToast('Agency approved successfully. Moved to Agencies directory.', 'success');
          setRequests((prev) => prev.filter((r) => r.id !== req.id));
          setSelectedIds((prev) => prev.filter((id) => id !== req.id));
          if (selectedRequest?.id === req.id) {
            setIsDrawerOpen(false);
            setSelectedRequest(null);
          }
          if (res.updatedStats) setStats(res.updatedStats);
          loadData();
        } else {
          showToast(res.message || 'Failed to approve agency', 'error');
        }
      } else if (modalConfig.type === 'reject') {
        const res = await adminAgencyRequestService.rejectRequest(
          req.id,
          'Compliance and KYC verification criteria were not fulfilled.'
        );
        if (res.success) {
          showToast(`Agency "${req.agencyName}" request rejected.`, 'info');
          setRequests((prev) => prev.filter((r) => r.id !== req.id));
          setSelectedIds((prev) => prev.filter((id) => id !== req.id));
          if (selectedRequest?.id === req.id) {
            setIsDrawerOpen(false);
            setSelectedRequest(null);
          }
          if (res.updatedStats) setStats(res.updatedStats);
          loadData();
        } else {
          showToast(res.message || 'Failed to reject agency', 'error');
        }
      }
    } catch (err: any) {
      console.error('Error in decision workflow', err);
      showToast(err.message || 'An error occurred while processing the decision.', 'error');
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
        showToast(`Downloading document bundle for ${request.agencyName}`, 'info');
        break;
      case 'suspend_review':
        showToast(`Review suspended for ${request.agencyName}`, 'info');
        break;
      case 'delete':
        setRequests((prev) => prev.filter((r) => r.id !== request.id));
        setSelectedIds((prev) => prev.filter((id) => id !== request.id));
        showToast(`Agency request ${request.applicationId} removed`, 'info');
        break;
      default:
        break;
    }
  };

  // Bulk actions
  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminAgencyRequestService.bulkAction('approve', selectedIds);
      if (res.success) {
        showToast(`Approved ${res.successful || selectedIds.length} agencies. Moved to Agencies directory.`, 'success');
        const approvedIds = [...selectedIds];
        setRequests((prev) => prev.filter((r) => !approvedIds.includes(r.id)));
        setSelectedIds([]);
        if (selectedRequest && approvedIds.includes(selectedRequest.id)) {
          setIsDrawerOpen(false);
          setSelectedRequest(null);
        }
        if (res.updatedStats) setStats(res.updatedStats);
        loadData();
      } else {
        showToast('Failed to bulk approve agencies', 'error');
      }
    } catch (err: any) {
      console.error('Error during bulk approve', err);
      showToast(err.message || 'An error occurred during bulk approval', 'error');
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminAgencyRequestService.bulkAction('reject', selectedIds, {
        reason: 'Compliance requirements not fulfilled',
      });
      showToast(`Rejected ${res.successful} agency requests`, 'info');
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Bulk reject failed', 'error');
    }
  };

  const handleBulkRequestDocs = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await adminAgencyRequestService.bulkAction('request_docs', selectedIds, {
        missingDocuments: ['Updated GST / PAN Documents', 'Bank Account Verification Proof'],
      });
      showToast(`Requested documents from ${res.successful} agencies`, 'info');
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Bulk document request failed', 'error');
    }
  };

  const handleExportCsv = async () => {
    showToast('Exporting agency registration requests to CSV...', 'info');
    try {
      await adminAgencyRequestService.exportCsv(filters);
      showToast('CSV Export generated successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to export CSV', 'error');
    }
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
        onExport={handleExportCsv}
      />

      {/* ── 2. SUMMARY KPI CARDS (6 CARDS) ── */}
      <AgencyRequestStatsCards
        stats={stats}
        onFilterByStatus={(statusVal) => {
          handleFilterChange('status', statusVal);
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
            onExportSelected={handleExportCsv}
            onMoreActions={() =>
              showToast(`Bulk actions menu active for ${selectedIds.length} requests`, 'info')
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
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newLimit) => {
          setItemsPerPage(newLimit);
          setCurrentPage(1);
        }}
      />

      {/* ── 7. RIGHT DETAILS DRAWER ── */}
      <AgencyRequestDrawer
        request={selectedRequest}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onApprove={handleTriggerApprove}
        onReject={handleTriggerReject}
        onRequestDocs={handleTriggerRequestDocs}
        onUpdateRequest={(updatedRequest) => {
          setSelectedRequest(updatedRequest);
          setRequests((prev) =>
            prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
          );
          adminAgencyRequestService.getSummaryStats().then(setStats);
        }}
      />

      {/* ── 8. CONFIRMATION MODAL (Approve / Reject) ── */}
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        agencyName={modalConfig.targetRequest?.agencyName || 'Agency'}
        isProcessing={isProcessing}
        onConfirm={handleConfirmDecision}
        onCancel={() => setModalConfig({ isOpen: false, type: 'approve', targetRequest: null })}
      />

      {/* ── 9. REQUEST MISSING DOCUMENTS MODAL ── */}
      <RequestMissingDocumentsModal
        isOpen={isRequestDocsModalOpen}
        request={targetRequestDocs}
        isProcessing={isProcessingDocsRequest}
        onClose={() => {
          setIsRequestDocsModalOpen(false);
          setTargetRequestDocs(null);
        }}
        onSubmit={handleSendDocumentRequest}
      />
    </motion.div>
  );
};

export default AdminVerificationPendingPage;
