import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Compass,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Building2,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  TrendingUp,
} from 'lucide-react';
import {
  AdminDepartureItem,
  DepartureKPIStats,
  DepartureFilters,
  DepartureDetailsResponse,
} from '../../types/departureManagement';
import {
  adminDepartureService,
  initialDepartureKPIStats,
} from '../../services/adminDeparture.service';

export const AdminDeparturesPage: React.FC = () => {
  const navigate = useNavigate();

  // ── State ──
  const [kpiStats, setKpiStats] = useState<DepartureKPIStats>(initialDepartureKPIStats);
  const [departures, setDepartures] = useState<AdminDepartureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [agencyFilter, setAgencyFilter] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected Departure for View Details Modal
  const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
  const [departureDetails, setDepartureDetails] = useState<DepartureDetailsResponse | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // ── Fetch KPIs ──
  const fetchKPIs = useCallback(async () => {
    try {
      const stats = await adminDepartureService.getKPIStats();
      setKpiStats(stats);
    } catch (err) {
      console.error('Failed to load departure KPI stats:', err);
    }
  }, []);

  // ── Fetch Departures ──
  const fetchDepartures = useCallback(async () => {
    setIsLoading(true);
    try {
      const filterParams: Partial<DepartureFilters> = {
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        agency: agencyFilter.trim() || undefined,
        destination: destinationFilter.trim() || undefined,
        departureDate: dateFilter || undefined,
      };

      const res = await adminDepartureService.getDepartures(filterParams);
      setDepartures(res.departures || []);
      setTotalPages(res.pagination?.totalPages || 1);
      setTotalCount(res.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to load departures list:', err);
      showToast('Error loading departures. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, limit, search, statusFilter, agencyFilter, destinationFilter, dateFilter]);

  useEffect(() => {
    fetchKPIs();
  }, [fetchKPIs]);

  useEffect(() => {
    fetchDepartures();
  }, [fetchDepartures]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchKPIs(), fetchDepartures()]);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('All');
    setAgencyFilter('');
    setDestinationFilter('');
    setDateFilter('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    search ||
      agencyFilter ||
      destinationFilter ||
      dateFilter ||
      statusFilter !== 'All'
  );

  // View Departure Details
  const handleViewDetails = async (depId: string) => {
    setSelectedDepartureId(depId);
    setIsLoadingDetails(true);
    try {
      const data = await adminDepartureService.getDepartureById(depId);
      setDepartureDetails(data);
    } catch (err) {
      console.error('Failed to load departure details:', err);
      showToast('Could not load departure details');
      setSelectedDepartureId(null);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!departures.length) {
      showToast('No departures to export');
      return;
    }
    const headers = [
      'Departure ID',
      'Package Name',
      'Agency',
      'Destination',
      'Departure Date',
      'End Date',
      'Capacity',
      'Booked Seats',
      'Remaining Seats',
      'Booking Status',
      'Trip Status',
    ];
    const rows = departures.map((d) => [
      `"${d.departureId}"`,
      `"${d.packageName.replace(/"/g, '""')}"`,
      `"${d.agencyName.replace(/"/g, '""')}"`,
      `"${d.destination}"`,
      `"${new Date(d.departureDate).toLocaleDateString()}"`,
      `"${new Date(d.endDate).toLocaleDateString()}"`,
      d.capacity,
      d.bookedSeats,
      d.remainingSeats,
      `"${d.bookingStatus}"`,
      `"${d.tripStatus}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Departures_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${departures.length} departures to CSV`);
  };

  // Status badge styling
  const getBookingStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'SOLDOUT':
      case 'SOLD OUT':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      case 'CLOSED':
      case 'BOOKING CLOSED':
      case 'BOOKING_CLOSED':
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      case 'ONGOING':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'COMPLETED':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  // ── KPI Cards Definition ──
  const kpiCards = useMemo(
    () => [
      {
        id: 'total',
        title: 'Total Departures',
        value: kpiStats.totalDepartures.value,
        subtext: 'Scheduled trips',
        textColor: 'text-[#6356E5]',
        bgColor: 'bg-purple-50 dark:bg-purple-950/50',
        icon: <Compass className="w-5 h-5 text-[#6356E5]" />,
        filterVal: 'All',
      },
      {
        id: 'upcoming',
        title: 'Upcoming',
        value: kpiStats.upcomingDepartures.value,
        subtext: 'Starting soon',
        textColor: 'text-blue-600 dark:text-blue-400',
        bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        icon: <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
        filterVal: 'OPEN',
      },
      {
        id: 'today',
        title: "Today's Departures",
        value: kpiStats.todayDepartures.value,
        subtext: 'Departs today',
        textColor: 'text-amber-600 dark:text-amber-400',
        bgColor: 'bg-amber-50 dark:bg-amber-950/50',
        icon: <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
        filterVal: 'OPEN',
      },
      {
        id: 'ongoing',
        title: 'Ongoing',
        value: kpiStats.ongoingDepartures.value,
        subtext: 'Currently traveling',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
        icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
        filterVal: 'ONGOING',
      },
      {
        id: 'completed',
        title: 'Completed',
        value: kpiStats.completedDepartures.value,
        subtext: 'Past departures',
        textColor: 'text-slate-600 dark:text-slate-400',
        bgColor: 'bg-slate-100 dark:bg-slate-800',
        icon: <CheckCircle2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />,
        filterVal: 'COMPLETED',
      },
      {
        id: 'sold_out',
        title: 'Sold Out',
        value: kpiStats.soldOutDepartures.value,
        subtext: '100% capacity',
        textColor: 'text-rose-600 dark:text-rose-400',
        bgColor: 'bg-rose-50 dark:bg-rose-950/50',
        icon: <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
        filterVal: 'SOLDOUT',
      },
      {
        id: 'occupancy',
        title: 'Occupancy Rate',
        value: kpiStats.occupancyRate.value,
        subtext: 'Avg platform load',
        textColor: 'text-indigo-600 dark:text-indigo-400',
        bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
        icon: <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
        filterVal: 'All',
      },
    ],
    [kpiStats]
  );

  const startItem = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalCount);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5 select-none"
    >
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-50 shadow-xl"
          >
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-black shadow-lg bg-[#6356E5] text-white shadow-[#6356E5]/20">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HEADER & CONTROLS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
        {/* Left: Back Button + Title + Subtitle */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/admin')}
            className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-2xs shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight">
              Departures
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Monitor all scheduled departures across partner agencies.
            </p>
          </div>
        </div>

        {/* Right Controls: Quick Search, Filter Toggle, Export, Refresh */}
        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
          {/* Quick Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search departures..."
              className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-[#0F172A] dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#6356E5] shadow-2xs transition-all"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-extrabold shadow-2xs transition-all cursor-pointer ${
              isFilterOpen || hasActiveFilters
                ? 'bg-[#EEF2FF] dark:bg-purple-950/40 border-[#6356E5] text-[#6356E5]'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#6356E5]" />
            )}
          </button>

          {/* Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Export</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ── 2. KPI SUMMARY CARDS (7 CARDS) ── */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5 w-full select-none">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100/90 dark:border-slate-800/80 shadow-2xs space-y-3 animate-pulse"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded" />
                  <div className="h-6 w-10 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
                <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="pt-2 border-t border-slate-50 dark:border-slate-800/60">
                <div className="h-2.5 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5 w-full select-none">
          {kpiCards.map((card, idx) => {
            const isSelected = statusFilter === card.filterVal;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -3 }}
                onClick={() => {
                  setStatusFilter(card.filterVal);
                  setPage(1);
                }}
                className={`bg-white dark:bg-slate-900 rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between group shadow-2xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#6356E5] ring-2 ring-[#6356E5]/15'
                    : 'border-slate-100/90 dark:border-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
                      {card.title}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white tracking-tight group-hover:text-[#6356E5] transition-colors">
                      {card.value}
                    </h3>
                  </div>
                  <div
                    className={`w-9 h-9 rounded-2xl ${card.bgColor} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    {card.icon}
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[10px] font-extrabold border-t border-slate-50 dark:border-slate-800/60">
                  <span className={`font-black ${card.textColor}`}>{card.subtext}</span>
                  <span className="text-slate-400 group-hover:text-[#6356E5] transition-colors">
                    Filter &rarr;
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── 3. FILTER PANEL (COLLAPSIBLE) ── */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-100/90 dark:border-slate-800/80 shadow-2xs space-y-4 select-none overflow-hidden"
          >
            {/* Filter Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Status Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#6356E5] pr-8 cursor-pointer"
                  >
                    <option value="All">All Statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="SOLDOUT">Sold Out</option>
                    <option value="BOOKING CLOSED">Booking Closed</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Agency Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Agency Name
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={agencyFilter}
                    onChange={(e) => {
                      setAgencyFilter(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Filter by agency..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>
              </div>

              {/* Destination Filter */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={destinationFilter}
                    onChange={(e) => {
                      setDestinationFilter(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Filter by destination..."
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Departure Date
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => {
                      setDateFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#6356E5]"
                  />
                </div>
              </div>
            </div>

            {/* Quick Status Tabs & Reset Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { label: 'All', val: 'All' },
                  { label: 'Open', val: 'OPEN' },
                  { label: 'Sold Out', val: 'SOLDOUT' },
                  { label: 'Booking Closed', val: 'BOOKING CLOSED' },
                  { label: 'Ongoing', val: 'ONGOING' },
                  { label: 'Completed', val: 'COMPLETED' },
                ].map((tab) => (
                  <button
                    key={tab.val}
                    type="button"
                    onClick={() => {
                      setStatusFilter(tab.val);
                      setPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                      statusFilter === tab.val
                        ? 'bg-[#6356E5] text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 4. DEPARTURES TABLE / SKELETON / EMPTY STATE ── */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/90 dark:border-slate-800/80 shadow-2xs overflow-hidden select-none">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <tr>
                  <th className="py-3 px-4">Departure ID</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Departure & End Date</th>
                  <th className="py-3 px-4">Capacity & Seats</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4">Trip Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {Array.from({ length: 8 }).map((_, rIdx) => (
                  <tr key={rIdx} className="animate-pulse">
                    <td className="py-3.5 px-4">
                      <div className="h-4 w-20 bg-slate-100 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
                          <div className="h-2.5 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 w-28 bg-slate-100 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="h-5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="h-7 w-16 bg-slate-100 dark:bg-slate-800 rounded-xl ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : departures.length === 0 ? (
        /* Standard Empty State matching user specification */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-100/90 dark:border-slate-800/80 shadow-2xs space-y-4 select-none">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
            <Compass className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#0F172A] dark:text-white">
              No departures scheduled
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              No agencies have scheduled departures yet. Once agencies schedule trips, they will appear here automatically.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      ) : (
        /* Main Departures Data Table */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100/90 dark:border-slate-800/80 shadow-2xs overflow-hidden select-none">
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/70 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <tr>
                  <th className="py-3 px-4">Departure ID</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Departure & End Date</th>
                  <th className="py-3 px-4">Capacity & Seats</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4">Trip Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departures.map((dep) => {
                  const occupancyPct =
                    dep.capacity > 0
                      ? Math.min(100, Math.round((dep.bookedSeats / dep.capacity) * 100))
                      : 0;
                  return (
                    <tr
                      key={dep.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100/80 dark:border-slate-800/80 text-xs group"
                    >
                      {/* Departure ID */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {dep.departureId || dep.id.slice(-6).toUpperCase()}
                      </td>

                      {/* Package */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={dep.packageImage}
                            alt=""
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                          <div className="min-w-0">
                            <p className="font-extrabold text-[#0F172A] dark:text-white truncate max-w-xs group-hover:text-[#6356E5] transition-colors">
                              {dep.packageName}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                              <span>{dep.destination}</span>
                              <span>&bull;</span>
                              <span>{dep.durationDays}D</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Agency */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]">{dep.agencyName}</span>
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold">
                            <Calendar className="w-3 h-3 text-[#6356E5] shrink-0" />
                            <span>
                              {new Date(dep.departureDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 pl-4.5">
                            to{' '}
                            {new Date(dep.endDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </td>

                      {/* Capacity & Occupancy Meter */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1.5 min-w-[130px]">
                          <div className="flex justify-between text-[11px] font-bold">
                            <span className="text-slate-700 dark:text-slate-300">
                              {dep.bookedSeats} / {dep.capacity} Seats
                            </span>
                            <span className="text-slate-400">{dep.remainingSeats} left</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                occupancyPct >= 100
                                  ? 'bg-rose-500'
                                  : occupancyPct >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-[#6356E5]'
                              }`}
                              style={{ width: `${occupancyPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Booking Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBookingStatusBadge(
                            dep.bookingStatus
                          )}`}
                        >
                          {dep.bookingStatus}
                        </span>
                      </td>

                      {/* Trip Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBookingStatusBadge(
                            dep.tripStatus
                          )}`}
                        >
                          {dep.tripStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleViewDetails(dep.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#6356E5] bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer shadow-2xs"
                          title="View Departure Telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 5. PAGINATION (SHARED ADMIN STANDARD) ── */}
      {totalCount > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 select-none text-xs font-semibold text-slate-500">
          <div>
            Showing <span className="font-extrabold text-[#0F172A] dark:text-white">{startItem}</span> to{' '}
            <span className="font-extrabold text-[#0F172A] dark:text-white">{endItem}</span> of{' '}
            <span className="font-extrabold text-[#0F172A] dark:text-white">{totalCount.toLocaleString()}</span> departures
          </div>

          <div className="flex items-center gap-3">
            {/* Page Size Selector */}
            <div className="relative">
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
              >
                <option value={10}>10 per page</option>
                <option value={15}>15 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && <span className="px-1 text-slate-400">...</span>}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-xl text-xs font-extrabold shadow-2xs transition-colors cursor-pointer ${
                          page === p
                            ? 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. MONITORING DETAILS MODAL (TRAVELOS THEME) ── */}
      <AnimatePresence>
        {selectedDepartureId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-[#6356E5] flex items-center justify-center shadow-2xs">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white">
                      Departure Telemetry & Manifest
                    </h2>
                    <p className="text-xs text-slate-400">
                      Read-only platform monitoring. Partner agency oversees operations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDepartureId(null);
                    setDepartureDetails(null);
                  }}
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {isLoadingDetails || !departureDetails ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6356E5]" />
                    <p className="text-xs font-bold text-slate-500">
                      Fetching departure telemetry & manifest...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Summary Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-[#6356E5]/10 text-[#6356E5]">
                            {departureDetails.departure.departureId}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${getBookingStatusBadge(
                              departureDetails.departure.tripStatus
                            )}`}
                          >
                            {departureDetails.departure.tripStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-black mt-1.5 text-[#0F172A] dark:text-white">
                          {departureDetails.departure.packageName}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Operated by <span className="font-bold text-slate-700 dark:text-slate-300">{departureDetails.departure.agencyName}</span>
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Departure Date</p>
                        <p className="text-sm font-black text-[#0F172A] dark:text-white mt-0.5">
                          {new Date(departureDetails.departure.departureDate).toLocaleDateString('en-IN', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
                        <p className="text-[11px] font-bold text-slate-400">Capacity</p>
                        <p className="text-lg font-black text-[#0F172A] dark:text-white mt-0.5">
                          {departureDetails.departure.capacity} Seats
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
                        <p className="text-[11px] font-bold text-slate-400">Booked Seats</p>
                        <p className="text-lg font-black text-[#6356E5] mt-0.5">
                          {departureDetails.departure.bookedSeats}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
                        <p className="text-[11px] font-bold text-slate-400">Remaining</p>
                        <p className="text-lg font-black text-emerald-600 mt-0.5">
                          {departureDetails.departure.remainingSeats} Seats
                        </p>
                      </div>
                      <div className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs">
                        <p className="text-[11px] font-bold text-slate-400">Confirmed Travelers</p>
                        <p className="text-lg font-black text-purple-600 mt-0.5">
                          {departureDetails.travelersCount}
                        </p>
                      </div>
                    </div>

                    {/* Associated Bookings */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-[#0F172A] dark:text-white flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#6356E5]" />
                          Confirmed Bookings ({departureDetails.bookings.length})
                        </h4>
                      </div>

                      {departureDetails.bookings.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                          No confirmed bookings recorded yet for this departure date.
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-50/70 dark:bg-slate-950 text-slate-400 font-black uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                              <tr>
                                <th className="p-3">Booking ID</th>
                                <th className="p-3">Traveler</th>
                                <th className="p-3">Seats</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Payment</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {departureDetails.bookings.map((bk) => (
                                <tr key={bk.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                                  <td className="p-3 font-mono font-bold text-slate-700 dark:text-slate-300">
                                    {bk.bookingId}
                                  </td>
                                  <td className="p-3">
                                    <div className="font-extrabold text-[#0F172A] dark:text-white">
                                      {bk.customerName}
                                    </div>
                                    <div className="text-[11px] text-slate-400">
                                      {bk.customerPhone}
                                    </div>
                                  </td>
                                  <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                                    {bk.travelersCount}
                                  </td>
                                  <td className="p-3 font-black text-[#0F172A] dark:text-white">
                                    ₹{bk.totalAmount.toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-3">
                                    <span
                                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                        bk.paymentStatus === 'PAID'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                                          : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
                                      }`}
                                    >
                                      {bk.paymentStatus}
                                    </span>
                                  </td>
                                  <td className="p-3">
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                      {bk.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end bg-slate-50/50 dark:bg-slate-950/40">
                <button
                  onClick={() => {
                    setSelectedDepartureId(null);
                    setDepartureDetails(null);
                  }}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDeparturesPage;
