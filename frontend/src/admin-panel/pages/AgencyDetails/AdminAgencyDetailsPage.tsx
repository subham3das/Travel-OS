import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Package,
  Compass,
  CalendarCheck,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Star,
  Flame,
  DollarSign,
  Users,
  Eye,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import { adminApiClient } from '../../services/adminApiClient';

interface AgencyStatistics {
  totalPackages: number;
  activePackages: number;
  scheduledDepartures: number;
  todayDepartures: number;
  completedDepartures: number;
  totalBookings: number;
  monthlyRevenue: number;
  cancellationRate: string;
  averageRating: number;
}

export const AdminAgencyDetailsPage: React.FC = () => {
  const { agencyId } = useParams<{ agencyId: string }>();
  const navigate = useNavigate();

  const [agencyData, setAgencyData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'packages' | 'departures' | 'bookings' | 'overview'>('packages');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchAgencyDetails = useCallback(async () => {
    if (!agencyId) return;
    try {
      const res = await adminApiClient.get<any>(`/admin/agencies/${agencyId}`);
      if (res.data) {
        setAgencyData(res.data);
      }
    } catch (err) {
      console.error('Failed to load agency details:', err);
      showToast('Error loading agency details');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [agencyId]);

  useEffect(() => {
    fetchAgencyDetails();
  }, [fetchAgencyDetails]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAgencyDetails();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">Loading agency records...</p>
        </div>
      </div>
    );
  }

  if (!agencyData || !agencyData.agency) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-md mx-auto text-center space-y-4 py-16">
          <BadgeAlert className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold">Agency Not Found</h2>
          <p className="text-sm text-slate-500">The requested agency ID does not exist or has been removed.</p>
          <button
            onClick={() => navigate('/admin/agencies')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
          >
            Return to Agencies Directory
          </button>
        </div>
      </div>
    );
  }

  const { agency, statistics, packages = [], departures = [], bookings = [] } = agencyData;
  const stats: AgencyStatistics = statistics || {
    totalPackages: 0,
    activePackages: 0,
    scheduledDepartures: 0,
    todayDepartures: 0,
    completedDepartures: 0,
    totalBookings: 0,
    monthlyRevenue: 0,
    cancellationRate: '0%',
    averageRating: 5.0,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 space-y-6 text-slate-900 dark:text-slate-100">
      {/* Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xl text-sm font-medium flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/agencies')}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-600 dark:text-slate-300 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Directory
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── AGENCY PROFILE BANNER ── */}
      <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center overflow-hidden flex-shrink-0">
            {agency.logo ? (
              <img src={agency.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                {agency.agencyDisplayName || agency.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {agency.status || 'ACTIVE'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 border border-indigo-500/20">
                {agency.verificationStatus || 'VERIFIED'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {agency.email}
              </span>
              {agency.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {agency.phone}
                </span>
              )}
              {agency.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {agency.city}, {agency.state || 'India'}
                </span>
              )}
              <span className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                {stats.averageRating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Discovery Tags Overview */}
        <div className="flex flex-wrap gap-1.5 self-start md:self-center">
          {agency.isFeatured && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 border border-purple-200 dark:border-purple-800">
              Featured
            </span>
          )}
          {agency.isTrending && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-800">
              Trending
            </span>
          )}
          {agency.isPopular && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800">
              Popular
            </span>
          )}
        </div>
      </div>

      {/* ── 9 METRIC CARDS (SPEC REQUIREMENT) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Packages</p>
          <p className="text-xl font-bold mt-1 text-indigo-600 dark:text-indigo-400">{stats.totalPackages}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active Packages</p>
          <p className="text-xl font-bold mt-1 text-emerald-600">{stats.activePackages}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Scheduled Departures</p>
          <p className="text-xl font-bold mt-1 text-blue-600">{stats.scheduledDepartures}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Today's Departures</p>
          <p className="text-xl font-bold mt-1 text-amber-600">{stats.todayDepartures}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Completed Departures</p>
          <p className="text-xl font-bold mt-1 text-slate-600 dark:text-slate-400">{stats.completedDepartures}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Bookings</p>
          <p className="text-xl font-bold mt-1 text-purple-600">{stats.totalBookings}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Monthly Revenue</p>
          <p className="text-xl font-bold mt-1 text-emerald-600">
            ₹{stats.monthlyRevenue.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Cancellation Rate</p>
          <p className="text-xl font-bold mt-1 text-rose-600">{stats.cancellationRate}</p>
        </div>

        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-slate-500">Average Rating</p>
          <p className="text-xl font-bold mt-1 text-amber-500">{stats.averageRating.toFixed(1)} ★</p>
        </div>
      </div>

      {/* ── HIERARCHY TABS (Agency → Packages → Departures → Bookings) ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800">
        {[
          { key: 'packages', label: 'Packages', count: packages.length, icon: Package },
          { key: 'departures', label: 'Departures', count: departures.length, icon: Compass },
          { key: 'bookings', label: 'Bookings', count: bookings.length, icon: CalendarCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-semibold transition ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        {/* TAB 1: PACKAGES */}
        {activeTab === 'packages' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No packages created by this agency yet.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg: any) => (
                    <tr key={pkg._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={pkg.coverImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=100'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                          />
                          <span className="truncate max-w-xs">{pkg.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{pkg.destination}</td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">{pkg.durationDays} Days</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        ₹{(pkg.price || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
                          {pkg.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600">
                          {pkg.approvalStatus || 'APPROVED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/admin/packages')}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          View in Packages
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: DEPARTURES */}
        {activeTab === 'departures' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Departure ID</th>
                  <th className="py-3 px-4">Package</th>
                  <th className="py-3 px-4">Departure Date</th>
                  <th className="py-3 px-4">End Date</th>
                  <th className="py-3 px-4">Seats (Booked / Cap)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {departures.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No departures scheduled for this agency.
                    </td>
                  </tr>
                ) : (
                  departures.map((dep: any) => (
                    <tr key={dep._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {dep.departureId || dep._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {dep.packageId?.title || 'Tour Package'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {new Date(dep.departureDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {new Date(dep.endDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        {dep.bookedSeats || 0} / {dep.capacity || 20} Seats
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600">
                          {dep.status || 'OPEN'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/admin/departures')}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          View in Departures
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 dark:bg-slate-950/60 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Traveler</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No bookings recorded for this agency yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((bk: any) => (
                    <tr key={bk._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                        {bk.bookingId || bk._id.toString().slice(-6).toUpperCase()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <div>{bk.customerName || 'Traveler'}</div>
                        <div className="text-xs text-slate-400">{bk.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        ₹{(bk.totalAmount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            bk.paymentStatus === 'PAID'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {bk.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {bk.status || 'CONFIRMED'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {new Date(bk.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => navigate('/admin/bookings')}
                          className="px-2.5 py-1 text-xs font-medium rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                        >
                          View in Bookings
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAgencyDetailsPage;
