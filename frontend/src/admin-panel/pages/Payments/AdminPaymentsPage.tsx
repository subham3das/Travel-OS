import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  AdminPaymentItem,
  PaymentKPIStats,
  PaymentFilters,
  PaymentSortConfig,
} from '../../types/paymentManagement';
import {
  adminPaymentManagementService,
  initialPaymentKPIStats,
} from '../../services/adminPaymentManagement.service';
import { AdminPaymentHeader } from '../../components/super-admin/payments/AdminPaymentHeader';
import { PaymentKPISection } from '../../components/super-admin/payments/PaymentKPISection';
import { PaymentFilterBar } from '../../components/super-admin/payments/PaymentFilterBar';
import { PaymentBulkActionBar } from '../../components/super-admin/payments/PaymentBulkActionBar';
import { PaymentTable } from '../../components/super-admin/payments/PaymentTable';
import { PaymentPagination } from '../../components/super-admin/payments/PaymentPagination';
import { PaymentDrawer } from '../../components/super-admin/payments/PaymentDrawer';
import { PaymentActionConfirmModal } from '../../components/super-admin/payments/PaymentActionConfirmModal';
import { PaymentInvoiceModal } from '../../components/super-admin/payments/PaymentInvoiceModal';

export const AdminPaymentsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [payments, setPayments] = useState<AdminPaymentItem[]>([]);
  const [kpiStats, setKpiStats] = useState<PaymentKPIStats>(initialPaymentKPIStats);
  const [selectedPayment, setSelectedPayment] = useState<AdminPaymentItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<PaymentSortConfig>({
    key: 'date',
    direction: 'desc',
  });

  // Filters
  const [filters, setFilters] = useState<PaymentFilters>({
    paymentStatus: 'All Status',
    settlementStatus: 'All Status',
    gateway: 'All Gateways',
    paymentMethod: 'All Methods',
    agency: 'All Agencies',
    destination: 'All Destinations',
    dateRange: '',
    amountRange: 'All Amounts',
    search: '',
  });

  // Modals state
  const [invoiceModalPayment, setInvoiceModalPayment] = useState<AdminPaymentItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'approve_settlement' | 'reject_settlement' | 'refund' | 'bulk_approve' | 'bulk_reject' | 'bulk_refund';
    payment: AdminPaymentItem | null;
    selectedCount?: number;
  }>({
    isOpen: false,
    type: 'approve_settlement',
    payment: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const fetchPaymentsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedPayments, fetchedStats] = await Promise.all([
        adminPaymentManagementService.getPayments(
          { ...filters, search: quickSearch || filters.search },
          sortConfig
        ),
        adminPaymentManagementService.getKPIStats(),
      ]);
      setPayments(fetchedPayments);
      setKpiStats(fetchedStats);

      // Default select first payment in drawer if none selected
      if (fetchedPayments.length > 0 && !selectedPayment) {
        setSelectedPayment(fetchedPayments[0]);
      } else if (fetchedPayments.length > 0 && selectedPayment) {
        const stillPresent = fetchedPayments.find((p) => p.id === selectedPayment.id);
        setSelectedPayment(stillPresent || fetchedPayments[0]);
      } else if (fetchedPayments.length === 0) {
        setSelectedPayment(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load payments data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, quickSearch, sortConfig]);

  useEffect(() => {
    fetchPaymentsData();
  }, [fetchPaymentsData]);

  // ── 3. FILTER & SEARCH HANDLERS ──
  const handleFilterChange = (key: keyof PaymentFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      paymentStatus: 'All Status',
      settlementStatus: 'All Status',
      gateway: 'All Gateways',
      paymentMethod: 'All Methods',
      agency: 'All Agencies',
      destination: 'All Destinations',
      dateRange: '',
      amountRange: 'All Amounts',
      search: '',
    });
    setQuickSearch('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    fetchPaymentsData();
    showToast('Filters applied successfully', 'success');
  };

  const handleQuickSearch = (q: string) => {
    setQuickSearch(q);
    setCurrentPage(1);
  };

  // Filter KPI click
  const handleFilterByKPIStatus = (status: string) => {
    if (status === 'All Status') {
      handleFilterChange('paymentStatus', 'All Status');
    } else {
      handleFilterChange('paymentStatus', status);
    }
  };

  // ── 4. SELECTION HANDLERS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === payments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(payments.map((p) => p.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectPaymentForDrawer = (payment: AdminPaymentItem) => {
    setSelectedPayment(payment);
    setIsDrawerOpen(true);
  };

  // ── 5. SORTING ──
  const handleSort = (key: PaymentSortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── 6. PAGINATION DATA ──
  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return payments.slice(start, start + pageSize);
  }, [payments, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(payments.length / pageSize));

  // ── 7. MODAL & ROW ACTIONS ──
  const handleRowAction = (actionType: string, payment: AdminPaymentItem) => {
    switch (actionType) {
      case 'view':
        setSelectedPayment(payment);
        setIsDrawerOpen(true);
        break;
      case 'invoice':
        setInvoiceModalPayment(payment);
        break;
      case 'approve_settlement':
        setConfirmModal({ isOpen: true, type: 'approve_settlement', payment });
        break;
      case 'reject_settlement':
        setConfirmModal({ isOpen: true, type: 'reject_settlement', payment });
        break;
      case 'refund':
        setConfirmModal({ isOpen: true, type: 'refund', payment });
        break;
      default:
        break;
    }
  };

  // Handle Confirmed Action
  const handleExecuteConfirmedAction = async () => {
    setIsProcessing(true);
    try {
      const { type, payment } = confirmModal;

      if (type === 'approve_settlement' && payment) {
        await adminPaymentManagementService.approveSettlement(payment.id);
        setPayments((prev) =>
          prev.map((p) => (p.id === payment.id ? { ...p, settlementStatus: 'Settled' } : p))
        );
        if (selectedPayment?.id === payment.id) {
          setSelectedPayment((prev) => (prev ? { ...prev, settlementStatus: 'Settled' } : null));
        }
        showToast(`Settlement approved for ${payment.transactionId}!`, 'success');
      } else if (type === 'reject_settlement' && payment) {
        await adminPaymentManagementService.rejectSettlement(payment.id);
        setPayments((prev) =>
          prev.map((p) => (p.id === payment.id ? { ...p, settlementStatus: 'Failed' } : p))
        );
        if (selectedPayment?.id === payment.id) {
          setSelectedPayment((prev) => (prev ? { ...prev, settlementStatus: 'Failed' } : null));
        }
        showToast(`Settlement put on hold for ${payment.transactionId}.`, 'info');
      } else if (type === 'refund' && payment) {
        await adminPaymentManagementService.processRefund(payment.id);
        setPayments((prev) =>
          prev.map((p) => (p.id === payment.id ? { ...p, paymentStatus: 'Refunded' } : p))
        );
        if (selectedPayment?.id === payment.id) {
          setSelectedPayment((prev) => (prev ? { ...prev, paymentStatus: 'Refunded' } : null));
        }
        showToast(`Refund processed for ${payment.transactionId}`, 'success');
      } else if (type === 'bulk_approve') {
        await adminPaymentManagementService.bulkApproveSettlement(selectedIds);
        setPayments((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, settlementStatus: 'Settled' } : p))
        );
        showToast(`Approved settlements for ${selectedIds.length} payments!`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_reject') {
        await adminPaymentManagementService.bulkRejectSettlement(selectedIds);
        setPayments((prev) =>
          prev.map((p) => (selectedIds.includes(p.id) ? { ...p, settlementStatus: 'Failed' } : p))
        );
        showToast(`Held settlements for ${selectedIds.length} payments.`, 'info');
        setSelectedIds([]);
      } else if (type === 'bulk_refund') {
        await adminPaymentManagementService.bulkRefund(selectedIds);
        setPayments((prev) =>
          prev.map((p) =>
            selectedIds.includes(p.id) ? { ...p, paymentStatus: 'Refunded' } : p
          )
        );
        showToast(`Processed refund for ${selectedIds.length} payments.`, 'success');
        setSelectedIds([]);
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setConfirmModal({ isOpen: false, type: 'approve_settlement', payment: null });
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (payments.length === 0) {
      showToast('No payment transactions available to export', 'info');
      return;
    }

    const headers = [
      'Transaction ID',
      'Booking ID',
      'Traveler',
      'Email',
      'Agency',
      'Package',
      'Amount',
      'Platform Fee',
      'Gateway',
      'Method',
      'Status',
      'Settlement',
      'Payment Date',
    ];
    const rows = payments.map((p) => [
      p.transactionId,
      p.bookingId,
      `"${p.travelerName}"`,
      `"${p.travelerEmail}"`,
      `"${p.agencyName}"`,
      `"${p.packageName}"`,
      `"${p.totalAmount}"`,
      `"${p.platformFee}"`,
      p.gateway,
      `"${p.paymentMethod}"`,
      p.paymentStatus,
      p.settlementStatus,
      `"${p.paymentDate} ${p.paymentTime}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apnatrip_payments_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${payments.length} payment records to CSV`, 'success');
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
      <AdminPaymentHeader
        searchQuery={quickSearch}
        onSearchChange={handleQuickSearch}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onExport={handleExportCSV}
        onExportReport={handleExportCSV}
      />

      {/* ── 2. KPI SUMMARY CARDS (7 CARDS) ── */}
      <PaymentKPISection
        stats={kpiStats}
        onFilterByStatus={handleFilterByKPIStatus}
      />

      {/* ── 3. FILTER PANEL (COLLAPSIBLE) ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <PaymentFilterBar
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
          <PaymentBulkActionBar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onBulkApproveSettlement={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_approve', payment: null, selectedCount: selectedIds.length })
            }
            onBulkRejectSettlement={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_reject', payment: null, selectedCount: selectedIds.length })
            }
            onBulkRefund={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_refund', payment: null, selectedCount: selectedIds.length })
            }
            onBulkExport={handleExportCSV}
            onBulkDownloadInvoice={handleExportCSV}
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
            <h3 className="text-base font-black text-[#0F172A]">Failed to Load Payments</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchPaymentsData}
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
            <PaymentTable
              payments={paginatedPayments}
              selectedIds={selectedIds}
              selectedPayment={selectedPayment}
              sortConfig={sortConfig}
              onSort={handleSort}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelect={handleToggleSelect}
              onSelectPayment={handleSelectPaymentForDrawer}
              onRowAction={handleRowAction}
              onRefresh={fetchPaymentsData}
            />

            {/* Pagination Footer */}
            {payments.length > 0 && (
              <PaymentPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={payments.length}
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
          {selectedPayment && (
            <PaymentDrawer
              payment={selectedPayment}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onViewInvoice={(p) => setInvoiceModalPayment(p)}
              onApproveSettlement={(p) => setConfirmModal({ isOpen: true, type: 'approve_settlement', payment: p })}
              onRejectSettlement={(p) => setConfirmModal({ isOpen: true, type: 'reject_settlement', payment: p })}
              onRefund={(p) => setConfirmModal({ isOpen: true, type: 'refund', payment: p })}
            />
          )}
        </div>
      )}

      {/* ── 6. MODALS ── */}
      <PaymentInvoiceModal
        payment={invoiceModalPayment}
        isOpen={!!invoiceModalPayment}
        onClose={() => setInvoiceModalPayment(null)}
      />

      <PaymentActionConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        payment={confirmModal.payment}
        selectedCount={confirmModal.selectedCount}
        isProcessing={isProcessing}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'approve_settlement', payment: null })}
      />
    </motion.div>
  );
};

export default AdminPaymentsPage;
