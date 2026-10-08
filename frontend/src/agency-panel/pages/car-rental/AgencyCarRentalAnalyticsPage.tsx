import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  DollarSign,
  Car,
  Calendar,
  ShieldCheck,
  Percent,
  Sparkles,
  Activity,
  Flame,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { agencyCarRentalService } from '../../services/agencyCarRental.service';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useToast } from '../../../user-panel/context/ToastContext';

export const AgencyCarRentalAnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const data = await agencyCarRentalService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      showToast(err.message || 'Failed to load fleet analytics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const occupancyRate = analytics?.occupancyRate || 0;
  const totalRevenue = analytics?.totalRevenue || 0;
  const monthlyRevenue = analytics?.monthlyRevenue || [];
  const totalTrips = analytics?.totalTrips || 0;
  const utilization = analytics?.vehicleUtilization || {
    total: 0,
    active: 0,
    booked: 0,
    maintenance: 0,
    inactive: 0,
    rate: 0,
  };
  const peakSeason = analytics?.peakSeason || {
    peakMonth: 'Pending booking history',
    highDemandCategory: 'Fleet Analysis Active',
    weekendSurgeRate: '+15% Weekend Dynamic Tariff',
    topRoute: 'Standard City / Outstation Corridor',
  };
  const topVehicles = analytics?.topVehicles || [];

  return (
    <div className="flex h-screen bg-[#F8F9FC] overflow-hidden font-sans select-none">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📈</span>
                <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                  Rental Intelligence & Telemetry
                </h1>
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">
                Occupancy index, yield telemetry, trip volume, peak season forecasts, and vehicle utilization.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/dashboard')}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-colors shadow-2xs"
              >
                Command Center
              </button>
              <button
                type="button"
                onClick={() => navigate('/agency/car-rental/bookings')}
                className="px-4 py-2 bg-[#583BE8] hover:bg-[#492de0] text-white font-black text-xs rounded-2xl shadow-md shadow-[#583BE8]/20 transition-all"
              >
                All Bookings
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-[#583BE8]/20 border-t-[#583BE8] animate-spin" />
              <span className="text-xs font-bold text-slate-400">Aggregating telemetry & fleet metrics...</span>
            </div>
          ) : (
            <>
              {/* 5 Core Metric Cards: Occupancy, Revenue, Trips, Peak Season, Utilization */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* 1. Occupancy */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Occupancy</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-[#0F172A]">{occupancyRate}%</span>
                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">Optimal booking run-rate</span>
              </div>
            </motion.div>

            {/* 2. Revenue */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-[#0F172A]">
                  ₹{(totalRevenue / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                  ₹{totalRevenue.toLocaleString()} Lifetime
                </span>
              </div>
            </motion.div>

            {/* 3. Trips */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Trips</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-[#0F172A]">{totalTrips}</span>
                <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">Completed Manifests</span>
              </div>
            </motion.div>

            {/* 4. Peak Season */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Peak Demand</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-base font-black text-amber-600 truncate block">Festive / Winter</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{peakSeason.weekendSurgeRate}</span>
              </div>
            </motion.div>

            {/* 5. Vehicle Utilization */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Utilization</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-[#0F172A]">{utilization.rate || 0}%</span>
                <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                  {utilization.active || 0} of {utilization.total || 0} active
                </span>
              </div>
            </motion.div>
          </div>

          {/* Deep Analytics Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Revenue Chart & Telemetry */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Revenue Cadence</h3>
                  <p className="text-xs text-slate-400">Monthly gross rental earnings & collection</p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-[#583BE8] text-xs font-bold rounded-full">
                  Settled Payouts
                </span>
              </div>

              {/* Monthly Revenue Bars */}
              <div className="space-y-3 pt-2">
                {monthlyRevenue.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-bold">
                    No revenue history available yet.
                  </div>
                ) : (
                  monthlyRevenue.map((m: any, idx: number) => {
                    const maxVal = Math.max(...monthlyRevenue.map((x: any) => x.revenue || 1), 1000);
                    const pct = Math.round(((m.revenue || 0) / maxVal) * 100);

                    return (
                      <div key={m.month || idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-[#0F172A]">{m.month}</span>
                          <span className="text-slate-600">₹{(m.revenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#583BE8] to-indigo-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Peak Season & Predictive Demand */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-base font-black text-[#0F172A]">Peak Season Analytics</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Surge Window</span>
                  <span className="font-black text-[#0F172A] block mt-0.5">{peakSeason.peakMonth}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">High Demand Segment</span>
                  <span className="font-black text-[#583BE8] block mt-0.5">{peakSeason.highDemandCategory}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Corridor Telemetry</span>
                  <span className="font-bold text-slate-700 block mt-0.5">{peakSeason.topRoute}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-amber-900 space-y-1">
                  <span className="font-black block">Yield Strategy</span>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Fleet operators can raise weekend tariffs by 15-20% during long weekends to maximize margin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Utilization Matrix */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Vehicle Utilization Telemetry</h3>
                <p className="text-xs text-slate-400">Status allocation of assets across active fleet operations</p>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-black">
                Total Fleet: {utilization.total || 0}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Available for Rent</span>
                <span className="text-2xl font-black text-emerald-900 mt-1 block">{utilization.active || 0}</span>
                <span className="text-[10px] text-emerald-600 font-medium">Ready in garage / yard</span>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                <span className="text-[10px] uppercase font-bold text-indigo-700 block">On Active Trip</span>
                <span className="text-2xl font-black text-indigo-900 mt-1 block">{utilization.booked || 0}</span>
                <span className="text-[10px] text-indigo-600 font-medium">Out with customer</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Maintenance / Service</span>
                <span className="text-2xl font-black text-amber-900 mt-1 block">{utilization.maintenance || 0}</span>
                <span className="text-[10px] text-amber-600 font-medium">Under scheduled repair</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Inactive / Reserved</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">{utilization.inactive || 0}</span>
                <span className="text-[10px] text-slate-500 font-medium">Off-duty</span>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default AgencyCarRentalAnalyticsPage;
