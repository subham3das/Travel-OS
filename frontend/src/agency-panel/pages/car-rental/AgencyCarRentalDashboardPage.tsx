import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Calendar,
  DollarSign,
  Clock,
  TrendingUp,
  Plus,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Sparkles,
  Compass,
  Star,
  Activity,
  Layers,
  ChevronRight,
  UserCheck,
  Loader2,
} from 'lucide-react';
import { agencyCarRentalService, CarRentalDashboardStats } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { BusinessSegmentedToggle } from '../../components/dashboard/BusinessSegmentedToggle';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { agency } = useAgencyAuth();

  const isAgencyApproved =
    agency?.verificationStatus === 'APPROVED' ||
    (agency?.verificationStatus as any) === 'VERIFIED' ||
    agency?.status === 'ACTIVE';

  const hasAgencyApproved =
    agency?.businessTypes?.includes('agency') && isAgencyApproved;

  const [isExpansionDismissed, setIsExpansionDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('apnatrip_car_rental_dismiss_agency_expansion') === 'true';
    } catch {
      return false;
    }
  });

  const handleDismissExpansion = () => {
    setIsExpansionDismissed(true);
    try {
      localStorage.setItem('apnatrip_car_rental_dismiss_agency_expansion', 'true');
    } catch {}
  };

  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<CarRentalDashboardStats | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Failed to load car rental stats:', err);
      showToast(err.message || 'Failed to load telemetry', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (bookingId: string, status: string) => {
    setActionInProgress(bookingId);
    try {
      await agencyCarRentalService.updateBookingStatus(bookingId, status);
      setStats((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recentBookings: prev.recentBookings.map((b) =>
            b._id === bookingId ? { ...b, bookingStatus: status } : b
          ),
        };
      });
      showToast(`Booking ${status.toLowerCase()} successfully`, 'success');
      await fetchDashboardData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking status', 'error');
    } finally {
      setActionInProgress(null);
    }
  };

  const currentDateFormatted = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Bar with Business Segmented Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🚗</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Car Rental Command Center
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Real-time fleet operations, bookings dispatch, driver manifests, and rental telemetry.
              </p>
            </div>

            {/* Date & Segmented Switch Column */}
            <div className="flex flex-col sm:items-end gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <div className="px-3.5 py-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
                  <span>{currentDateFormatted}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/cars')}
                  className="flex items-center gap-1 px-3.5 py-1.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-black transition-all shadow-md shadow-[#583BE8]/25 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Car</span>
                </button>
              </div>
              <BusinessSegmentedToggle />
            </div>
          </div>

          {/* Expand Your Business Card (Soft & Optional with Dismissal) */}
          {!hasAgencyApproved && !isExpansionDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-4 sm:p-5 rounded-3xl bg-white text-[#0F172A] border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
            >
              <div className="space-y-1 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-[#583BE8] text-[11px] font-black uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#583BE8]" />
                  <span>Expand Your Business (Optional)</span>
                </div>
                <h3 className="text-sm sm:text-base font-black tracking-tight text-[#0F172A]">
                  {agency?.verificationStatus === 'PENDING' || agency?.verificationStatus === 'UNDER_REVIEW'
                    ? 'Travel Agency Application in Review'
                    : 'Reach more travelers by offering travel packages alongside car rentals.'}
                </h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {agency?.verificationStatus === 'PENDING' || agency?.verificationStatus === 'UNDER_REVIEW'
                    ? 'Your travel agency application is being reviewed by our compliance team. You can check status anytime.'
                    : 'Curate tour packages, group trips, and itineraries. You can always configure this later from Settings.'}
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 z-10">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      agency?.verificationStatus === 'PENDING' || agency?.verificationStatus === 'UNDER_REVIEW'
                        ? '/agency/verification-pending'
                        : '/agency/onboarding/business'
                    )
                  }
                  className="px-4 py-2.5 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-bold transition-all shadow-sm shadow-[#583BE8]/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>
                    {agency?.verificationStatus === 'PENDING' || agency?.verificationStatus === 'UNDER_REVIEW'
                      ? 'View Status'
                      : 'Start Now'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleDismissExpansion}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          )}

          {/* 6 Real-time Telemetry KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {/* 1. Total Vehicles */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Total Fleet</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {stats?.fleetStats.totalCars ?? 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Vehicles</span>
              </div>
            </motion.div>

            {/* 2. Available */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.03 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Available</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-emerald-600">
                  {stats?.fleetStats.activeCars ?? 0}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 block mt-0.5">Ready for Rent</span>
              </div>
            </motion.div>

            {/* 3. Booked Today */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Booked Today</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {stats?.bookingStats.todayBookings ?? stats?.bookingStats.activeRentals ?? 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Active on road</span>
              </div>
            </motion.div>

            {/* 4. Fleet Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.09 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0F172A] truncate block">
                  ₹{((stats?.financialStats.totalRevenue ?? 0) / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] font-bold text-emerald-600 block mt-0.5 truncate">
                  ₹{(stats?.financialStats.totalRevenue ?? 0).toLocaleString()} Total
                </span>
              </div>
            </motion.div>

            {/* 5. Pending Requests */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Pending</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-amber-600">
                  {stats?.bookingStats.pendingRequests ?? 0}
                </span>
                <span className="text-[10px] font-bold text-amber-600 block mt-0.5">Needs Action</span>
              </div>
            </motion.div>

            {/* 6. Drivers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">Drivers</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  {stats?.driverStats?.totalDrivers ?? 0}
                </span>
                <span className="text-[10px] font-bold text-slate-400 block mt-0.5">
                  {stats?.driverStats?.activeDrivers ?? 0} On Duty
                </span>
              </div>
            </motion.div>
          </div>

          {/* Telemetry & Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Utilization Matrix */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-[#583BE8]" />
                    <span>Fleet Utilization</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Status telemetry across all vehicles</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#583BE8] text-xs font-black">
                  {stats?.fleetStats.utilizationRate ?? 0}%
                </span>
              </div>

              {/* Progress visual */}
              <div className="space-y-2 pt-2">
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${stats?.fleetStats.utilizationRate || 0}%` }}
                    className="bg-gradient-to-r from-[#583BE8] to-indigo-500 h-full rounded-full transition-all duration-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Available</span>
                    <span className="text-base font-black text-emerald-600">{stats?.fleetStats.activeCars ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Booked / On Trip</span>
                    <span className="text-base font-black text-indigo-600">{stats?.fleetStats.bookedCars ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Maintenance</span>
                    <span className="text-base font-black text-amber-600">{stats?.fleetStats.maintenanceCars ?? 0}</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Inactive</span>
                    <span className="text-base font-black text-slate-500">{stats?.fleetStats.inactiveCars ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Vehicles */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Top Vehicles</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Ranked by trips & demand</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/cars')}
                  className="text-xs font-bold text-[#583BE8] hover:underline"
                >
                  View All
                </button>
              </div>

              {!stats?.topVehicles || stats.topVehicles.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-medium">
                  Add vehicles to see performance rankings.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {stats.topVehicles.map((car: any, idx: number) => (
                    <div
                      key={car._id || idx}
                      className="p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0">
                          {car.thumbnail ? (
                            <img src={car.thumbnail} alt="Car" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">🚗</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-[#0F172A] truncate">
                            {car.brand} {car.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-bold">
                            ₹{car.pricePerDay}/day • {car.fuelType}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-[#583BE8] block">{car.totalTrips || 0} Trips</span>
                        <span className="text-[10px] text-slate-400 font-medium">Completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Dispatch Operations & Today's Schedule */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Operations & Dispatch</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">Quick dispatch telemetry</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/calendar')}
                  className="w-full p-3 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-between hover:border-purple-200 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#583BE8] text-white flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0F172A] block">Fleet Calendar</span>
                      <span className="text-[10px] text-slate-500 font-medium">Manage daily vehicle assignments</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/drivers')}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0F172A] block">Driver Manifest</span>
                      <span className="text-[10px] text-slate-500 font-medium">Assign drivers & track duty</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/agency/car-rental/customers')}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-black text-[#0F172A] block">Rental Customers</span>
                      <span className="text-[10px] text-slate-500 font-medium">Customer CRM & rental history</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Recent Rental Bookings Queue */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F172A] tracking-tight">
                  Recent Rental Reservations
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  Incoming traveler bookings and active rentals from MongoDB.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/bookings')}
                className="text-xs font-extrabold text-[#583BE8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({stats?.bookingStats.totalBookings ?? 0})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
                <span className="text-xs font-bold text-slate-400">Loading reservations...</span>
              </div>
            ) : !stats?.recentBookings || stats.recentBookings.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Car className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-500">No rental reservations found yet.</p>
                <p className="text-[11px] text-slate-400">When travelers book your fleet vehicles, reservations will appear here in real-time.</p>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-3 px-3">Vehicle</th>
                      <th className="py-3 px-3">Traveler</th>
                      <th className="py-3 px-3">Pickup Location</th>
                      <th className="py-3 px-3">Rental Dates</th>
                      <th className="py-3 px-3">Total / Advance</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {stats.recentBookings.map((b: any) => (
                      <tr key={b._id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                              {b.carId?.thumbnail || b.carId?.images?.[0] ? (
                                <img
                                  src={b.carId.thumbnail || b.carId.images[0]}
                                  alt="Car"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
                                  🚗
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="font-extrabold text-[#0F172A] block leading-tight">
                                {b.carId?.brand} {b.carId?.name || 'Rental Vehicle'}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 block mt-0.5 font-mono">
                                {b.bookingId}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-[#0F172A] block">{b.customerName}</span>
                          <span className="text-[10px] text-slate-400 block">{b.customerPhone}</span>
                        </td>

                        <td className="py-3.5 px-3 text-slate-600 font-semibold truncate max-w-[140px]">
                          {b.pickupLocation}
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-bold text-[#0F172A] block">
                            {new Date(b.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {b.totalDays} Day{b.totalDays > 1 ? 's' : ''}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="font-black text-[#0F172A] block">₹{b.totalAmount?.toLocaleString()}</span>
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            Adv: ₹{b.depositPaid?.toLocaleString()} ({b.paymentStatus})
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                              b.bookingStatus === 'ACCEPTED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : b.bookingStatus === 'REQUESTED'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : b.bookingStatus === 'COMPLETED'
                                ? 'bg-purple-50 text-[#583BE8] border-purple-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.bookingStatus === 'REQUESTED' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(b._id, 'ACCEPTED')}
                                  disabled={actionInProgress === b._id}
                                  className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                >
                                  {actionInProgress === b._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                  <span>Accept</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateStatus(b._id, 'REJECTED')}
                                  disabled={actionInProgress === b._id}
                                  className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                >
                                  {actionInProgress === b._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                  <span>Decline</span>
                                </button>
                              </>
                            )}
                            {b.bookingStatus === 'ACCEPTED' && (
                              <button
                                type="button"
                                onClick={() => handleUpdateStatus(b._id, 'COMPLETED')}
                                disabled={actionInProgress === b._id}
                                className="px-2.5 py-1 rounded-xl bg-[#583BE8] hover:bg-[#492de0] text-white text-[11px] font-black transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                              >
                                {actionInProgress === b._id && <Loader2 className="w-3 h-3 animate-spin" />}
                                <span>Mark Complete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalDashboardPage;
