import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Users,
  Search,
  Plus,
  CheckCircle2,
  Play,
  Check,
  Flame,
  Ban,
  RotateCw,
  Download,
  ChevronDown,
  FileSpreadsheet,
  FileText,
  FileCode,
  MapPin,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import {
  DepartureItem,
  DepartureStatus,
  DepartureTravelerItem,
  agencyDepartureService,
} from '../../services/agencyDeparture.service';
import { ViewTravelersModal } from '../../components/bookings/ViewTravelersModal';
import { ScheduleDepartureModal } from '../../components/bookings/ScheduleDepartureModal';
import { RescheduleDepartureModal } from '../../components/bookings/RescheduleDepartureModal';
import { agencySocketService } from '../../services/agencySocket.service';

type FilterType = 'ALL' | 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'SOLDOUT' | 'OPEN';

// ── Departure Card Memoized Component ─────────────────────────────────────────
interface DepartureCardProps {
  dep: DepartureItem;
  onOpenTravelers: (dep: DepartureItem) => void;
  onStartTrip: (dep: DepartureItem) => void;
  onEndTrip: (dep: DepartureItem) => void;
  onOpenReschedule: (dep: DepartureItem) => void;
  onCancelDeparture: (dep: DepartureItem) => void;
}

const DepartureCard = memo<DepartureCardProps>(({
  dep,
  onOpenTravelers,
  onStartTrip,
  onEndTrip,
  onOpenReschedule,
  onCancelDeparture,
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  const depDateFormatted = useMemo(() => {
    return new Date(dep.departureDate).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [dep.departureDate]);

  const isCompleted = dep.status === 'COMPLETED';
  const isOngoing = dep.status === 'ONGOING';
  const isSoldOut = dep.status === 'SOLDOUT';
  const isBookingClosed = dep.status === 'BOOKING_CLOSED';
  const canModify = !isCompleted && !isOngoing && !isSoldOut && !isBookingClosed;

  // Semantic Status Badge
  const renderStatusBadge = (status: DepartureStatus) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Bookings Open
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600" />
            Upcoming
          </span>
        );
      case 'ONGOING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
            Trip Started
          </span>
        );
      case 'SOLDOUT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200">
            <Flame className="w-3 h-3 text-amber-600" />
            Sold Out
          </span>
        );
      case 'BOOKING_CLOSED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200">
            <Ban className="w-3 h-3 text-rose-500" />
            Cancelled / Closed
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-700 border border-slate-200">
            <Check className="w-3 h-3 text-slate-500" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Departure Progress Timeline Step
  const getProgressStep = (status: DepartureStatus, booked: number, cap: number) => {
    if (status === 'COMPLETED') return 5;
    if (status === 'ONGOING') return 4;
    if (booked >= cap && cap > 0) return 3;
    if (booked > 0) return 2;
    if (status === 'OPEN') return 1;
    return 0;
  };

  const currentStep = getProgressStep(dep.status, dep.bookedSeats, dep.capacity);
  const steps = ['Created', 'Bookings Open', 'Seats Filled', 'Ready', 'Started', 'Completed'];

  // Total Estimated Revenue
  const totalRevenue = (dep.bookedSeats * (dep.price || 4999)).toLocaleString('en-IN');

  return (
    <div className="group relative p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* 1. LEFT SECTION (Image + Details) */}
        <div className="lg:col-span-5 flex items-start gap-3.5 min-w-0">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-100">
            <img
              src={dep.coverImage}
              alt={dep.packageName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200';
              }}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold font-mono text-slate-400">
                #{dep.departureId ? dep.departureId.slice(-7).toUpperCase() : dep.id.slice(-7).toUpperCase()}
              </span>
              {renderStatusBadge(dep.status)}
            </div>

            <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
              {dep.packageName}
            </h3>

            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
                {depDateFormatted}
              </span>
              {dep.destination && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {dep.destination}
                </span>
              )}
            </div>

            {/* Departure Progress Step Timeline */}
            <div className="pt-1.5 hidden sm:block">
              <div className="flex items-center gap-1">
                {steps.map((st, sIdx) => (
                  <div key={st} className="flex-1 flex flex-col items-center">
                    <div
                      className={`h-1 w-full rounded-full transition-colors ${
                        sIdx <= currentStep ? 'bg-[#583BE8]' : 'bg-slate-200'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                <span>{steps[Math.min(currentStep, steps.length - 1)]}</span>
                <span>Step {Math.min(currentStep + 1, 6)}/6</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. CENTER SECTION (Compact Metric Grid) */}
        <div className="lg:col-span-4 grid grid-cols-3 gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 text-center">
          <div className="p-1.5 rounded-lg bg-white border border-slate-100/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Seats Filled
            </span>
            <span className="text-xs sm:text-sm font-black text-[#0F172A]">
              {dep.bookedSeats} / {dep.capacity}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-white border border-slate-100/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Remaining
            </span>
            <span className="text-xs sm:text-sm font-black text-[#583BE8]">
              {dep.availableSeats}
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-white border border-slate-100/80">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Est. Revenue
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-600">
              ₹{totalRevenue}
            </span>
          </div>
        </div>

        {/* 3. RIGHT SECTION (Grouped Action Buttons + Dropdown) */}
        <div className="lg:col-span-3 flex items-center justify-end gap-1.5 flex-wrap">
          {/* Travelers Drawer Button */}
          <button
            onClick={() => onOpenTravelers(dep)}
            className="px-3 py-2 rounded-xl bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#583BE8] text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{dep.bookedSeats} Travelers</span>
          </button>

          {/* Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setExportOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setExportOpen(false)}
                />
                <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 text-xs">
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      agencyDepartureService.downloadExcel(dep.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    Excel (.xlsx)
                  </button>
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      agencyDepartureService.downloadPdf(dep.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                    PDF (.pdf)
                  </button>
                  <button
                    onClick={() => {
                      setExportOpen(false);
                      agencyDepartureService.downloadExcel(dep.id);
                    }}
                    className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer font-bold"
                  >
                    <FileCode className="w-3.5 h-3.5 text-blue-600" />
                    CSV (.csv)
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Ongoing: End Trip button */}
          {isOngoing && (
            <button
              onClick={() => onEndTrip(dep)}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>End Trip</span>
            </button>
          )}

          {/* Open / Upcoming Action Buttons */}
          {canModify && (
            <>
              <button
                onClick={() => onStartTrip(dep)}
                className="px-3 py-2 rounded-xl bg-[#583BE8] hover:bg-[#472ec4] text-white text-xs font-black transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Start Trip</span>
              </button>

              <button
                onClick={() => onOpenReschedule(dep)}
                title="Reschedule Departure"
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onCancelDeparture(dep)}
                title="Cancel Departure"
                className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors shadow-2xs cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5 text-rose-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

// ── Main Page Component ───────────────────────────────────────────────────────
export const AgencyBookingsPage: React.FC = () => {
  const [departures, setDepartures] = useState<DepartureItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterType>('ALL');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [departureToReschedule, setDepartureToReschedule] = useState<DepartureItem | null>(null);

  const [selectedDeparture, setSelectedDeparture] = useState<DepartureItem | null>(null);
  const [travelers, setTravelers] = useState<DepartureTravelerItem[]>([]);
  const [isTravelersLoading, setIsTravelersLoading] = useState(false);
  const [isViewTravelersOpen, setIsViewTravelersOpen] = useState(false);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchDepartures = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await agencyDepartureService.getDepartures();
      setDepartures(data);
    } catch (err) {
      console.error('Failed to load departures:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartures();

    const socket = agencySocketService.connect();

    const handleCapacityUpdate = (data: {
      departureId: string;
      bookedSeats: number;
      capacity: number;
      status: DepartureStatus;
    }) => {
      setDepartures((prev) =>
        prev.map((d) => {
          if (d.id === data.departureId || d.departureId === data.departureId) {
            return {
              ...d,
              bookedSeats: data.bookedSeats,
              capacity: data.capacity,
              availableSeats: Math.max(0, data.capacity - data.bookedSeats),
              status: data.status,
            };
          }
          return d;
        })
      );
    };

    const handleRefresh = () => {
      fetchDepartures();
    };

    socket.on('departure:capacity-updated', handleCapacityUpdate);
    socket.on('departure:created', handleRefresh);
    socket.on('departure:rescheduled', handleRefresh);
    socket.on('trip:started', handleRefresh);
    socket.on('trip:ended', handleRefresh);

    return () => {
      socket.off('departure:capacity-updated', handleCapacityUpdate);
      socket.off('departure:created', handleRefresh);
      socket.off('departure:rescheduled', handleRefresh);
      socket.off('trip:started', handleRefresh);
      socket.off('trip:ended', handleRefresh);
    };
  }, [fetchDepartures]);

  const handleOpenTravelers = async (dep: DepartureItem) => {
    setSelectedDeparture(dep);
    setIsViewTravelersOpen(true);
    setIsTravelersLoading(true);
    try {
      const res = await agencyDepartureService.getDepartureTravelers(dep.id);
      setTravelers(res.travelers);
    } catch (err) {
      console.error('Failed to fetch travelers:', err);
      showToast('Could not load traveler manifest');
    } finally {
      setIsTravelersLoading(false);
    }
  };

  const handleStartTrip = async (dep: DepartureItem) => {
    if (!window.confirm(`Start trip for "${dep.packageName}"? This will make the trip live for booked travelers.`)) {
      return;
    }
    try {
      const res = await agencyDepartureService.startTrip(dep.id);
      setDepartures((prev) =>
        prev.map((d) => (d.id === dep.id ? { ...d, status: res.status } : d))
      );
      showToast('Trip started! Departure is now Ongoing.');
    } catch (err) {
      console.error('Failed to start trip:', err);
      showToast('Failed to start trip');
    }
  };

  const handleEndTrip = async (dep: DepartureItem) => {
    if (!window.confirm(`End trip for "${dep.packageName}"? This will mark the departure as completed.`)) {
      return;
    }
    try {
      const newStatus = await agencyDepartureService.endTrip(dep.id);
      setDepartures((prev) =>
        prev.map((d) => (d.id === dep.id ? { ...d, status: newStatus } : d))
      );
      showToast('Trip ended and marked as completed.');
    } catch (err) {
      console.error('Failed to end trip:', err);
      showToast('Failed to end trip');
    }
  };

  const handleOpenReschedule = (dep: DepartureItem) => {
    if (dep.status === 'ONGOING' || dep.status === 'COMPLETED') {
      showToast('This departure can no longer be modified because the trip has already started or completed.');
      return;
    }
    setDepartureToReschedule(dep);
    setIsRescheduleOpen(true);
  };

  const handleCancelDeparture = async (dep: DepartureItem) => {
    if (
      !window.confirm(
        `Are you sure you want to cancel the departure for "${dep.packageName}"? This will close bookings.`
      )
    ) {
      return;
    }
    try {
      await agencyDepartureService.cancelDeparture(dep.id);
      showToast('Departure cancelled successfully.');
      fetchDepartures();
    } catch (err: any) {
      console.error('Failed to cancel departure:', err);
      showToast(err?.response?.data?.message || err?.message || 'Failed to cancel departure');
    }
  };

  // Filtered Departures
  const filteredDepartures = useMemo(() => {
    const now = new Date();
    const seen = new Set<string>();

    return departures.filter((dep) => {
      const depKey = dep.id || dep.departureId;
      if (!depKey || seen.has(depKey)) return false;
      seen.add(depKey);

      const matchesSearch =
        dep.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dep.destination.toLowerCase().includes(searchTerm.toLowerCase());

      let matchesStatus = true;
      if (statusFilter === 'UPCOMING') {
        matchesStatus = (new Date(dep.departureDate) >= now && dep.status !== 'COMPLETED') || dep.status === 'UPCOMING';
      } else if (statusFilter === 'ONGOING') {
        matchesStatus = dep.status === 'ONGOING';
      } else if (statusFilter === 'COMPLETED') {
        matchesStatus = dep.status === 'COMPLETED';
      } else if (statusFilter === 'SOLDOUT') {
        matchesStatus = dep.status === 'SOLDOUT';
      } else if (statusFilter === 'OPEN') {
        matchesStatus = dep.status === 'OPEN';
      }

      return matchesSearch && matchesStatus;
    });
  }, [departures, searchTerm, statusFilter]);

  // Quick Summary Statistics
  const summaryStats = useMemo(() => {
    const total = departures.length;
    let upcoming = 0;
    let ongoing = 0;
    let completed = 0;
    let cancelled = 0;
    let totalCap = 0;
    let totalBooked = 0;

    departures.forEach((d) => {
      if (d.status === 'UPCOMING' || d.status === 'OPEN') upcoming++;
      if (d.status === 'ONGOING') ongoing++;
      if (d.status === 'COMPLETED') completed++;
      if (d.status === 'BOOKING_CLOSED') cancelled++;
      totalCap += d.capacity || 0;
      totalBooked += d.bookedSeats || 0;
    });

    const occupancy = totalCap > 0 ? Math.round((totalBooked / totalCap) * 100) : 0;

    return { total, upcoming, ongoing, completed, cancelled, occupancy };
  }, [departures]);

  const filterTabs: { id: FilterType; label: string }[] = [
    { id: 'ALL', label: 'All' },
    { id: 'UPCOMING', label: 'Upcoming' },
    { id: 'ONGOING', label: 'Ongoing' },
    { id: 'COMPLETED', label: 'Completed' },
    { id: 'SOLDOUT', label: 'Sold Out' },
    { id: 'OPEN', label: 'Open' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-20 md:pb-8">
        <DashboardHeader />

        <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-[1500px] mx-auto w-full space-y-6">
          {/* Page Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Package Departures
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Departure-based bookings, real-time manifests, and fleet operations.
              </p>
            </div>

            <button
              onClick={() => setIsScheduleOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#583BE8] text-white text-xs sm:text-sm font-black shadow-md shadow-[#583BE8]/20 hover:bg-[#472ec4] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Schedule New Departure
            </button>
          </div>

          {/* Quick Summary Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                Total Departures
              </span>
              <span className="text-xl font-black text-[#0F172A] mt-0.5 block">
                {summaryStats.total}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 block">
                Upcoming
              </span>
              <span className="text-xl font-black text-blue-700 mt-0.5 block">
                {summaryStats.upcoming}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 block">
                Ongoing
              </span>
              <span className="text-xl font-black text-purple-700 mt-0.5 block">
                {summaryStats.ongoing}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">
                Completed
              </span>
              <span className="text-xl font-black text-emerald-700 mt-0.5 block">
                {summaryStats.completed}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 block">
                Cancelled
              </span>
              <span className="text-xl font-black text-rose-700 mt-0.5 block">
                {summaryStats.cancelled}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 block">
                Avg. Occupancy
              </span>
              <span className="text-xl font-black text-[#0F172A] mt-0.5 block">
                {summaryStats.occupancy}%
              </span>
            </div>
          </div>

          {/* Unified Search & Filters Toolbar */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search departures by title, destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:bg-white focus:border-[#583BE8] transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab.id
                      ? 'bg-[#0F172A] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toast Notification */}
          <AnimatePresence>
            {toastMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-3.5 rounded-2xl bg-[#0F172A] text-white text-xs font-bold shadow-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Departures List with Skeletons and Empty State */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((sk) => (
                <div
                  key={sk}
                  className="p-5 bg-white rounded-2xl border border-slate-200/80 animate-pulse flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-20 h-20 bg-slate-200 rounded-xl" />
                    <div className="space-y-2 flex-1 max-w-sm">
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-48 h-12 bg-slate-100 rounded-xl hidden md:block" />
                  <div className="w-36 h-9 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredDepartures.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-2xs max-w-xl mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] text-[#583BE8] flex items-center justify-center mx-auto">
                <Calendar className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-[#0F172A]">No departures scheduled</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Schedule your first departure date to publish packages and open bookings for travelers.
              </p>
              <button
                onClick={() => setIsScheduleOpen(true)}
                className="mt-2 px-4 py-2 rounded-xl bg-[#583BE8] text-white text-xs font-black hover:bg-[#472ec4] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Departure
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDepartures.map((dep) => (
                <DepartureCard
                  key={dep.id || dep.departureId}
                  dep={dep}
                  onOpenTravelers={handleOpenTravelers}
                  onStartTrip={handleStartTrip}
                  onEndTrip={handleEndTrip}
                  onOpenReschedule={handleOpenReschedule}
                  onCancelDeparture={handleCancelDeparture}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <BottomNavigation />

      {/* Side Drawer for Travelers Manifest */}
      <ViewTravelersModal
        isOpen={isViewTravelersOpen}
        onClose={() => setIsViewTravelersOpen(false)}
        departure={selectedDeparture}
        travelers={travelers}
        isLoading={isTravelersLoading}
      />

      <ScheduleDepartureModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSuccess={() => {
          fetchDepartures();
          showToast('New departure scheduled successfully!');
        }}
      />

      <RescheduleDepartureModal
        isOpen={isRescheduleOpen}
        onClose={() => {
          setIsRescheduleOpen(false);
          setDepartureToReschedule(null);
        }}
        onSuccess={() => {
          fetchDepartures();
          showToast('Departure rescheduled successfully!');
        }}
        departure={departureToReschedule}
      />
    </div>
  );
};

export default AgencyBookingsPage;
