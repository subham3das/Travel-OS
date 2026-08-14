import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  AdminBookingItem,
  BookingKPIStats,
  BookingFilters,
  BookingSortConfig,
} from '../../types/bookingManagement';
import {
  adminBookingManagementService,
  initialBookingKPIStats,
} from '../../services/adminBookingManagement.service';
import { AdminBookingHeader } from '../../components/super-admin/bookings/AdminBookingHeader';
import { BookingKPISection } from '../../components/super-admin/bookings/BookingKPISection';
import { BookingFilterPanel } from '../../components/super-admin/bookings/BookingFilterPanel';
import { BookingBulkActionBar } from '../../components/super-admin/bookings/BookingBulkActionBar';
import { BookingsTable } from '../../components/super-admin/bookings/BookingsTable';
import { BookingPagination } from '../../components/super-admin/bookings/BookingPagination';
import { BookingDetailsDrawer } from '../../components/super-admin/bookings/BookingDetailsDrawer';
import { ModifyBookingModal } from '../../components/super-admin/bookings/ModifyBookingModal';
import { BookingActionConfirmModal } from '../../components/super-admin/bookings/BookingActionConfirmModal';
import { InvoiceViewModal } from '../../components/super-admin/bookings/InvoiceViewModal';

export const AdminBookingsPage: React.FC = () => {
  // ── 1. STATE MANAGEMENT ──
  const [bookings, setBookings] = useState<AdminBookingItem[]>([]);
  const [kpiStats, setKpiStats] = useState<BookingKPIStats>(initialBookingKPIStats);
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [quickSearch, setQuickSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<BookingSortConfig>({
    key: 'bookingDate',
    direction: 'desc',
  });

  // Filters
  const [filters, setFilters] = useState<BookingFilters>({
    bookingStatus: 'All Status',
    paymentStatus: 'All Payment Status',
    package: 'All Packages',
    agency: 'All Agencies',
    destination: 'All Destinations',
    travelDate: '',
    bookingDate: '',
    user: '',
    amountRange: 'All Amounts',
    search: '',
  });

  // Modals state
  const [modifyModalBooking, setModifyModalBooking] = useState<AdminBookingItem | null>(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState<AdminBookingItem | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'confirm' | 'cancel' | 'refund' | 'bulk_confirm' | 'bulk_cancel' | 'bulk_refund';
    booking: AdminBookingItem | null;
    selectedCount?: number;
  }>({
    isOpen: false,
    type: 'confirm',
    booking: null,
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const fetchBookingsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [fetchedBookings, fetchedStats] = await Promise.all([
        adminBookingManagementService.getBookings(
          { ...filters, search: quickSearch || filters.search },
          sortConfig
        ),
        adminBookingManagementService.getKPIStats(),
      ]);
      setBookings(fetchedBookings);
      setKpiStats(fetchedStats);

      // Default select first booking in drawer if none selected
      if (fetchedBookings.length > 0 && !selectedBooking) {
        setSelectedBooking(fetchedBookings[0]);
      } else if (fetchedBookings.length > 0 && selectedBooking) {
        const stillPresent = fetchedBookings.find((b) => b.id === selectedBooking.id);
        setSelectedBooking(stillPresent || fetchedBookings[0]);
      } else if (fetchedBookings.length === 0) {
        setSelectedBooking(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load bookings data.');
    } finally {
      setIsLoading(false);
    }
  }, [filters, quickSearch, sortConfig]);

  useEffect(() => {
    fetchBookingsData();
  }, [fetchBookingsData]);

  // ── 3. FILTER & SEARCH HANDLERS ──
  const handleFilterChange = (key: keyof BookingFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      bookingStatus: 'All Status',
      paymentStatus: 'All Payment Status',
      package: 'All Packages',
      agency: 'All Agencies',
      destination: 'All Destinations',
      travelDate: '',
      bookingDate: '',
      user: '',
      amountRange: 'All Amounts',
      search: '',
    });
    setQuickSearch('');
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    fetchBookingsData();
    showToast('Filters applied successfully', 'success');
  };

  const handleQuickSearch = (q: string) => {
    setQuickSearch(q);
    setCurrentPage(1);
  };

  // Filter KPI click
  const handleFilterByKPIStatus = (status: string) => {
    if (status === 'All Status') {
      handleFilterChange('bookingStatus', 'All Status');
    } else {
      handleFilterChange('bookingStatus', status);
    }
  };

  // ── 4. SELECTION HANDLERS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === bookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(bookings.map((b) => b.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectBookingForDrawer = (booking: AdminBookingItem) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  // ── 5. SORTING ──
  const handleSort = (key: BookingSortConfig['key']) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // ── 6. PAGINATION DATA ──
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return bookings.slice(start, start + pageSize);
  }, [bookings, currentPage, pageSize]);

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));

  // ── 7. MODAL & ROW ACTIONS ──
  const handleRowAction = (actionType: string, booking: AdminBookingItem) => {
    switch (actionType) {
      case 'view':
        setSelectedBooking(booking);
        setIsDrawerOpen(true);
        break;
      case 'invoice':
        setInvoiceModalBooking(booking);
        break;
      case 'modify':
        setModifyModalBooking(booking);
        break;
      case 'confirm':
        setConfirmModal({ isOpen: true, type: 'confirm', booking });
        break;
      case 'cancel':
        setConfirmModal({ isOpen: true, type: 'cancel', booking });
        break;
      case 'refund':
        setConfirmModal({ isOpen: true, type: 'refund', booking });
        break;
      default:
        break;
    }
  };

  // Handle Confirmed Action
  const handleExecuteConfirmedAction = async () => {
    setIsProcessing(true);
    try {
      const { type, booking } = confirmModal;

      if (type === 'confirm' && booking) {
        await adminBookingManagementService.confirmBooking(booking.id);
        setBookings((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: 'Confirmed', paymentStatus: 'Paid' } : b))
        );
        if (selectedBooking?.id === booking.id) {
          setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: 'Confirmed', paymentStatus: 'Paid' } : null));
        }
        showToast(`Booking ${booking.bookingId} confirmed!`, 'success');
      } else if (type === 'cancel' && booking) {
        await adminBookingManagementService.cancelBooking(booking.id);
        setBookings((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: 'Cancelled' } : b))
        );
        if (selectedBooking?.id === booking.id) {
          setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: 'Cancelled' } : null));
        }
        showToast(`Booking ${booking.bookingId} cancelled.`, 'info');
      } else if (type === 'refund' && booking) {
        await adminBookingManagementService.refundBooking(booking.id);
        setBookings((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, bookingStatus: 'Refunded', paymentStatus: 'Refunded' } : b))
        );
        if (selectedBooking?.id === booking.id) {
          setSelectedBooking((prev) => (prev ? { ...prev, bookingStatus: 'Refunded', paymentStatus: 'Refunded' } : null));
        }
        showToast(`Refund of ${booking.totalAmount} processed for ${booking.bookingId}`, 'success');
      } else if (type === 'bulk_confirm') {
        await adminBookingManagementService.bulkConfirm(selectedIds);
        setBookings((prev) =>
          prev.map((b) => (selectedIds.includes(b.id) ? { ...b, bookingStatus: 'Confirmed', paymentStatus: 'Paid' } : b))
        );
        showToast(`Confirmed ${selectedIds.length} bookings successfully!`, 'success');
        setSelectedIds([]);
      } else if (type === 'bulk_cancel') {
        await adminBookingManagementService.bulkCancel(selectedIds);
        setBookings((prev) =>
          prev.map((b) => (selectedIds.includes(b.id) ? { ...b, bookingStatus: 'Cancelled' } : b))
        );
        showToast(`Cancelled ${selectedIds.length} bookings.`, 'info');
        setSelectedIds([]);
      } else if (type === 'bulk_refund') {
        await adminBookingManagementService.bulkRefund(selectedIds);
        setBookings((prev) =>
          prev.map((b) =>
            selectedIds.includes(b.id)
              ? { ...b, bookingStatus: 'Refunded', paymentStatus: 'Refunded' }
              : b
          )
        );
        showToast(`Processed refund for ${selectedIds.length} bookings.`, 'success');
        setSelectedIds([]);
      }
    } catch (err) {
      console.error(err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
      setConfirmModal({ isOpen: false, type: 'confirm', booking: null });
    }
  };

  // Update Booking handler
  const handleUpdateBooking = async (id: string, updates: Partial<AdminBookingItem>) => {
    const updated = await adminBookingManagementService.modifyBooking(id, updates);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
      if (selectedBooking?.id === id) setSelectedBooking(updated);
      showToast('Booking details updated successfully.', 'success');
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      showToast('No bookings available to export', 'info');
      return;
    }

    const headers = ['Booking ID', 'Traveler', 'Email', 'Package', 'Agency', 'Travel Dates', 'Travelers', 'Amount', 'Payment Status', 'Booking Status', 'Booking Date'];
    const rows = bookings.map((b) => [
      b.bookingId,
      `"${b.travelerName}"`,
      `"${b.travelerEmail}"`,
      `"${b.packageName}"`,
      `"${b.agencyName}"`,
      `"${b.travelDatesText}"`,
      1 + b.additionalTravelersCount,
      `"${b.totalAmount}"`,
      b.paymentStatus,
      b.bookingStatus,
      `"${b.bookedAtDate} ${b.bookedAtTime}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apnatrip_bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${bookings.length} bookings to CSV`, 'success');
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
      <AdminBookingHeader
        searchQuery={quickSearch}
        onSearchChange={handleQuickSearch}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onExport={handleExportCSV}
        onExportReport={handleExportCSV}
      />

      {/* ── 2. KPI SUMMARY CARDS (6 CARDS) ── */}
      <BookingKPISection
        stats={kpiStats}
        onFilterByStatus={handleFilterByKPIStatus}
      />

      {/* ── 3. FILTER PANEL (COLLAPSIBLE) ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <BookingFilterPanel
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
          <BookingBulkActionBar
            selectedCount={selectedIds.length}
            onClearSelection={() => setSelectedIds([])}
            onBulkConfirm={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_confirm', booking: null, selectedCount: selectedIds.length })
            }
            onBulkCancel={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_cancel', booking: null, selectedCount: selectedIds.length })
            }
            onBulkRefund={() =>
              setConfirmModal({ isOpen: true, type: 'bulk_refund', booking: null, selectedCount: selectedIds.length })
            }
            onBulkExport={handleExportCSV}
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
            <h3 className="text-base font-black text-[#0F172A]">Failed to Load Bookings</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">{error}</p>
          </div>
          <button
            onClick={fetchBookingsData}
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
            <BookingsTable
              bookings={paginatedBookings}
              selectedIds={selectedIds}
              selectedBooking={selectedBooking}
              sortConfig={sortConfig}
              onSort={handleSort}
              onToggleSelectAll={handleToggleSelectAll}
              onToggleSelect={handleToggleSelect}
              onSelectBooking={handleSelectBookingForDrawer}
              onRowAction={handleRowAction}
              onRefresh={fetchBookingsData}
            />

            {/* Pagination Footer */}
            {bookings.length > 0 && (
              <BookingPagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={bookings.length}
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
          {selectedBooking && (
            <BookingDetailsDrawer
              booking={selectedBooking}
              isOpen={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              onViewInvoice={(b) => setInvoiceModalBooking(b)}
              onModify={(b) => setModifyModalBooking(b)}
              onConfirm={(b) => setConfirmModal({ isOpen: true, type: 'confirm', booking: b })}
              onCancel={(b) => setConfirmModal({ isOpen: true, type: 'cancel', booking: b })}
              onRefund={(b) => setConfirmModal({ isOpen: true, type: 'refund', booking: b })}
            />
          )}
        </div>
      )}

      {/* ── 6. MODALS ── */}
      <ModifyBookingModal
        booking={modifyModalBooking}
        isOpen={!!modifyModalBooking}
        onClose={() => setModifyModalBooking(null)}
        onUpdate={handleUpdateBooking}
      />

      <InvoiceViewModal
        booking={invoiceModalBooking}
        isOpen={!!invoiceModalBooking}
        onClose={() => setInvoiceModalBooking(null)}
      />

      <BookingActionConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        booking={confirmModal.booking}
        selectedCount={confirmModal.selectedCount}
        isProcessing={isProcessing}
        onConfirm={handleExecuteConfirmedAction}
        onCancel={() => setConfirmModal({ isOpen: false, type: 'confirm', booking: null })}
      />
    </motion.div>
  );
};

export default AdminBookingsPage;
