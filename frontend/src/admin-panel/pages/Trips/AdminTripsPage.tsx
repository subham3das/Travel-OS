import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AdminTripItem,
  TripKPIStats,
  TripFilters,
  TripActivityChartPoint,
  TripStatusBreakdownItem,
  DestinationTripItem,
  TopAgencyTripItem,
  MonthlyTripSummaryData,
  TripAlertItem,
} from '../../types/tripManagement';
import {
  adminTripManagementService,
  initialTripKPIStats,
  initialTripActivityDaily,
  initialTripStatusBreakdown,
  initialDestinationTrips,
  initialTopTripAgencies,
  initialMonthlyTripSummary,
  initialTripAlerts,
} from '../../services/adminTripManagement.service';
import { AdminTripsHeader } from '../../components/super-admin/trips/AdminTripsHeader';
import { TripsKPIStats } from '../../components/super-admin/trips/TripsKPIStats';
import { TripFilterPanel } from '../../components/super-admin/trips/TripFilterPanel';
import { TripBulkActionBar } from '../../components/super-admin/trips/TripBulkActionBar';
import { TripTable } from '../../components/super-admin/trips/TripTable';
import { TripPagination } from '../../components/super-admin/trips/TripPagination';
import { TripDetailsDrawer } from '../../components/super-admin/trips/TripDetailsDrawer';
import { CreateTripModal } from '../../components/super-admin/trips/CreateTripModal';
import { TripAnalyticsWidgets } from '../../components/super-admin/trips/TripAnalyticsWidgets';

export const AdminTripsPage: React.FC = () => {
  const navigate = useNavigate();

  // ── 1. STATE MANAGEMENT ──
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<AdminTripItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showAnalyticsSection, setShowAnalyticsSection] = useState(false);

  // Filters State
  const initialFilters: TripFilters = {
    status: 'All Status',
    agency: 'All Agencies',
    destination: 'All Destinations',
    guide: 'All Guides',
    tripType: 'All Types',
    departureDate: '',
    returnDate: '',
    city: 'All Cities',
    state: 'All States',
    search: '',
  };
  const [filters, setFilters] = useState<TripFilters>(initialFilters);

  // Data States
  const [kpiStats, setKpiStats] = useState<TripKPIStats>(initialTripKPIStats);
  const [allTrips, setAllTrips] = useState<AdminTripItem[]>([]);
  const [activityData, setActivityData] = useState<TripActivityChartPoint[]>(initialTripActivityDaily);
  const [statusBreakdown, setStatusBreakdown] = useState<TripStatusBreakdownItem[]>(initialTripStatusBreakdown);
  const [destinationTrips, setDestinationTrips] = useState<DestinationTripItem[]>(initialDestinationTrips);
  const [topAgencies, setTopAgencies] = useState<TopAgencyTripItem[]>(initialTopTripAgencies);
  const [monthlySummary, setMonthlySummary] = useState<MonthlyTripSummaryData>(initialMonthlyTripSummary);
  const [tripAlerts, setTripAlerts] = useState<TripAlertItem[]>(initialTripAlerts);

  // Feedback Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── 2. DATA FETCHING ──
  const loadTripsData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        stats,
        trips,
        activity,
        breakdown,
        destinations,
        agencies,
        summary,
        alerts,
      ] = await Promise.all([
        adminTripManagementService.getKPIStats(),
        adminTripManagementService.getTrips(filters),
        adminTripManagementService.getActivityChartData(),
        adminTripManagementService.getStatusBreakdown(),
        adminTripManagementService.getDestinationTrips(),
        adminTripManagementService.getTopAgencies(),
        adminTripManagementService.getMonthlySummary(),
        adminTripManagementService.getTripAlerts(),
      ]);

      setKpiStats(stats);
      setAllTrips(trips);
      setActivityData(activity);
      setStatusBreakdown(breakdown);
      setDestinationTrips(destinations);
      setTopAgencies(agencies);
      setMonthlySummary(summary);
      setTripAlerts(alerts);
    } catch (err) {
      console.error(err);
      showToast('Failed to refresh trips data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTripsData();
  }, [loadTripsData]);

  // ── 3. FILTERING & PAGINATION ──
  const filteredTrips = useMemo(() => {
    return allTrips;
  }, [allTrips]);

  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTrips.slice(start, start + itemsPerPage);
  }, [filteredTrips, currentPage, itemsPerPage]);

  const handleFilterChange = (key: keyof TripFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
    showToast('Filters reset to default', 'info');
  };

  const handleApplyFilters = () => {
    loadTripsData();
    showToast('Filters applied successfully', 'success');
  };

  // ── 4. SELECTION & BULK ACTIONS ──
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedTrips.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedTrips.map((t) => t.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  const handleBulkAssignGuide = () => {
    showToast(`Guide assigned to ${selectedIds.length} selected trips`, 'success');
    setSelectedIds([]);
  };

  const handleBulkCancel = async () => {
    for (const id of selectedIds) {
      await adminTripManagementService.cancelTrip(id);
    }
    loadTripsData();
    showToast(`${selectedIds.length} trips have been cancelled`, 'error');
    setSelectedIds([]);
  };

  const handleBulkNotification = () => {
    showToast(`Broadcast notification sent to travelers on ${selectedIds.length} trips`, 'info');
    setSelectedIds([]);
  };

  // ── 5. EXPORT ACTIONS ──
  const handleExportTrips = () => {
    const headers = ['Trip ID', 'Package', 'Destination', 'Agency', 'Guide', 'Departure', 'Return', 'Travelers', 'Vehicle', 'Status', 'Rating'];
    const rows = filteredTrips.map((t) => [
      t.id,
      `"${t.packageName}"`,
      `"${t.destination}"`,
      `"${t.agencyName}"`,
      `"${t.guide.name}"`,
      t.departureDate,
      t.returnDate,
      t.travelersCount,
      `"${t.vehicle}"`,
      t.status,
      t.rating || 'N/A',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `travelos_trips_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Trips database exported to CSV', 'success');
  };

  // ── 6. ROW ACTIONS ──
  const handleViewDetails = (trip: AdminTripItem) => {
    setSelectedTrip(trip);
  };

  const handleCancelSingleTrip = async (trip: AdminTripItem) => {
    await adminTripManagementService.cancelTrip(trip.id);
    loadTripsData();
    showToast(`Trip ${trip.id} has been cancelled`, 'error');
    if (selectedTrip?.id === trip.id) {
      setSelectedTrip(null);
    }
  };

  const handleCreateTripSubmit = async (newTripData: Partial<AdminTripItem>) => {
    const created = await adminTripManagementService.createTrip(newTripData);
    loadTripsData();
    showToast(`New trip ${created.id} deployed successfully!`, 'success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATIONS ── */}
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
      <AdminTripsHeader
        searchQuery={filters.search}
        onSearchChange={(val) => handleFilterChange('search', val)}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen((prev) => !prev)}
        onExportTrips={handleExportTrips}
        onRefresh={loadTripsData}
        onCreateTrip={() => setIsCreateModalOpen(true)}
        isRefreshing={isRefreshing}
      />

      {/* ── 2. KPI STATS (8 CARDS) ── */}
      <TripsKPIStats
        stats={kpiStats}
        selectedFilterStatus={filters.status}
        onCardClick={(id) => {
          let targetStatus = 'All Status';
          if (id === 'activeTrips') targetStatus = 'Running';
          if (id === 'upcomingTrips') targetStatus = 'Upcoming';
          if (id === 'completedTrips') targetStatus = 'Completed';
          if (id === 'cancelledTrips') targetStatus = 'Cancelled';
          handleFilterChange('status', targetStatus);
          showToast(`Filtered by ${targetStatus}`, 'info');
        }}
      />

      {/* ── OPTIONAL DASHBOARD ANALYTICS TOGGLE ── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
          Trip Fleet Operations
        </span>
        <button
          onClick={() => setShowAnalyticsSection((prev) => !prev)}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          {showAnalyticsSection ? 'Hide Operations Analytics' : 'Show Operations Analytics'}
        </button>
      </div>

      {showAnalyticsSection && (
        <TripAnalyticsWidgets
          activityData={activityData}
          statusBreakdown={statusBreakdown}
          destinationTrips={destinationTrips}
          topAgencies={topAgencies}
          monthlySummary={monthlySummary}
          tripAlerts={tripAlerts}
        />
      )}

      {/* ── 3. MULTI-CRITERIA FILTER PANEL ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <TripFilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleResetFilters}
            onApply={handleApplyFilters}
          />
        )}
      </AnimatePresence>

      {/* ── 4. BULK ACTION TOOLBAR ── */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <TripBulkActionBar
            selectedCount={selectedIds.length}
            onClearSelection={handleClearSelection}
            onAssignGuide={handleBulkAssignGuide}
            onExportSelected={handleExportTrips}
            onCancelSelected={handleBulkCancel}
            onSendNotification={handleBulkNotification}
            onDownloadManifest={handleExportTrips}
          />
        )}
      </AnimatePresence>

      {/* ── 5. MAIN TRIP MANAGEMENT TABLE ── */}
      <TripTable
        trips={paginatedTrips}
        selectedIds={selectedIds}
        onToggleSelectAll={handleToggleSelectAll}
        onToggleSelect={handleToggleSelect}
        onViewDetails={handleViewDetails}
        onOpenTimeline={handleViewDetails}
        onViewTravelers={(trip) =>
          showToast(`Viewing passenger manifest for ${trip.id} (${trip.travelersCount} pax)`, 'info')
        }
        onContactAgency={(trip) =>
          showToast(`Opening messaging desk for ${trip.agencyName}`, 'info')
        }
        onContactGuide={(trip) =>
          showToast(`Calling guide ${trip.guide.name} (${trip.guide.phone})`, 'info')
        }
        onExportTrip={(trip) => {
          showToast(`Exporting manifest for ${trip.id}`, 'success');
        }}
        onCancelTrip={handleCancelSingleTrip}
      />

      {/* ── 6. PAGINATION FOOTER ── */}
      <TripPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredTrips.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(size) => {
          setItemsPerPage(size);
          setCurrentPage(1);
        }}
      />

      {/* ── 7. RIGHT SLIDE-OVER DRAWER (TRIP DETAILS & LIVE STATUS) ── */}
      <TripDetailsDrawer
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onTrackLive={(trip) =>
          showToast(`GPS Live Telemetry enabled for ${trip.vehicle}`, 'success')
        }
        onViewManifest={(trip) =>
          showToast(`Generating passenger manifest for ${trip.id}...`, 'info')
        }
        onNotifyTravelers={(trip) =>
          showToast(`Broadcast push sent to all ${trip.travelersCount} travelers`, 'success')
        }
        onDownloadReport={(trip) => handleExportTrips()}
        onContactGuide={(trip) =>
          showToast(`Calling guide ${trip.guide.name} (${trip.guide.phone})`, 'info')
        }
      />

      {/* ── 8. CREATE TRIP MODAL ── */}
      <CreateTripModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTripSubmit}
      />
    </motion.div>
  );
};

export default AdminTripsPage;
