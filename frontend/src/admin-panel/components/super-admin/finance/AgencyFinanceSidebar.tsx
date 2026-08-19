import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Star,
  Download,
  ExternalLink,
  FileSpreadsheet,
  X,
  CreditCard,
  TrendingUp,
  Receipt,
  Calendar,
  Building2,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { AgencySidebarProfileData } from '../../../types/financeManagement';

interface AgencyFinanceSidebarProps {
  agency: AgencySidebarProfileData | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadReport?: () => void;
  onViewAgencyProfile?: () => void;
  onExportStatement?: () => void;
}

export const AgencyFinanceSidebar: React.FC<AgencyFinanceSidebarProps> = ({
  agency,
  isOpen,
  onClose,
  onDownloadReport,
  onViewAgencyProfile,
  onExportStatement,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Settlements' | 'Profit Breakdown' | 'Trends'>('Overview');

  if (!isOpen || !agency) return null;

  // SVG mini sparkline for Monthly Trend
  const trendPoints = agency.monthlyTrends || [];
  const maxTrend = Math.max(...trendPoints.map((t) => t.revenue), 100);
  const trendWidth = 320;
  const trendHeight = 70;
  const trendPadding = 12;

  const getTrendX = (i: number) =>
    trendPadding + (i * (trendWidth - trendPadding * 2)) / Math.max(trendPoints.length - 1, 1);
  const getTrendY = (val: number) =>
    trendHeight - trendPadding - (val / maxTrend) * (trendHeight - trendPadding * 2);

  const pathRev = trendPoints.length > 0
    ? `M ${trendPoints.map((p, i) => `${getTrendX(i)},${getTrendY(p.revenue)}`).join(' L ')}`
    : '';
  const pathProf = trendPoints.length > 0
    ? `M ${trendPoints.map((p, i) => `${getTrendX(i)},${getTrendY(p.profit * 3.5)}`).join(' L ')}`
    : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Drawer Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[480px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Top Header: Agency Identity */}
            <div className="flex items-center justify-between p-5 bg-white border-b border-slate-200/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={agency.agencyLogo}
                    alt={agency.agencyName}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                  />
                  {agency.verified && (
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border-2 border-white shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base text-[#0F172A] truncate max-w-[210px]">
                      {agency.agencyName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {agency.agencyId}
                    </span>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{agency.rating}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 4 Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0">
              {(['Overview', 'Settlements', 'Profit Breakdown', 'Trends'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {activeTab === 'Overview' && (
                <>
                  {/* Revenue Overview Grid */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                      Revenue Overview
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Total Revenue</span>
                        <span className="text-sm font-black text-[#0F172A] font-mono block mt-0.5">
                          {agency.revenueOverview.totalRevenue}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Total Bookings</span>
                        <span className="text-sm font-black text-[#0F172A] font-mono block mt-0.5">
                          {agency.revenueOverview.bookings}
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block">Avg Booking Val</span>
                        <span className="text-sm font-black text-[#0F172A] font-mono block mt-0.5">
                          {agency.revenueOverview.avgBookingValue}
                        </span>
                      </div>
                      <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-100">
                        <span className="text-[10px] font-bold text-[#6356E5] block">Commission Paid</span>
                        <span className="text-sm font-black text-[#6356E5] font-mono block mt-0.5">
                          {agency.revenueOverview.totalCommission}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Settlement History List */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Recent Settlements
                      </span>
                      <span className="text-xs font-black text-[#6356E5] cursor-pointer hover:underline">
                        View All
                      </span>
                    </div>
                    <div className="space-y-2">
                      {agency.settlementHistory.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-800">{s.id}</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                  s.status === 'Settled'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : s.status === 'Pending'
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {s.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{s.date}</span>
                          </div>
                          <span className="font-black font-mono text-[#0F172A] text-sm">{s.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Mini Trend Chart */}
                  <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Monthly Trajectory
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-extrabold">
                        <span className="text-[#6356E5]">● Revenue</span>
                        <span className="text-emerald-600">● Net Profit</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                      <svg viewBox={`0 0 ${trendWidth} ${trendHeight}`} className="w-full h-14 overflow-visible">
                        <path d={pathRev} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
                        <path d={pathProf} fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="3 3" />
                      </svg>
                      <div className="flex justify-between px-1 text-[10px] font-bold text-slate-400 font-mono mt-1">
                        {trendPoints.map((t) => (
                          <span key={t.month}>{t.month}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Settlements' && (
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Disbursement & Settlement History
                  </span>
                  <div className="space-y-2.5">
                    {agency.settlementHistory.map((s) => (
                      <div key={s.id} className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-black text-[#6356E5]">{s.id}</span>
                          <span className="font-black font-mono text-[#0F172A] text-sm">{s.amount}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 font-semibold">
                          <span>Processed on {s.date}</span>
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified RTGS / NEFT</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Profit Breakdown' && (
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Partner vs Platform Commission Split
                  </span>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-600">Agency Earnings</span>
                      <span className="font-mono text-emerald-600 font-black">85.0% (₹2.28 Cr)</span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-500 w-[85%]" />
                      <div className="h-full bg-[#6356E5] w-[15%]" />
                    </div>
                    <div className="flex justify-between text-xs font-bold pt-1">
                      <span className="text-[#6356E5]">Platform Commission</span>
                      <span className="font-mono text-[#6356E5] font-black">15.0% (₹40.20 L)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Trends' && (
                <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Performance Metrics
                  </span>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold">Quarterly Growth</span>
                      <span className="font-black text-emerald-600 font-mono">↑ 24.8%</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold">Refund Dispute Rate</span>
                      <span className="font-black text-slate-700 font-mono">1.2% (Very Low)</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-50/80 rounded-2xl border border-slate-100">
                      <span className="text-slate-500 font-semibold">Average Payout Cycle</span>
                      <span className="font-black text-slate-700 font-mono">24 Hours</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-5 bg-white border-t border-slate-200/80 space-y-2 shrink-0">
              <button
                onClick={onDownloadReport}
                className="w-full py-3 px-4 rounded-2xl bg-[#6356E5] hover:bg-[#5245cc] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Financial Statement</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={onViewAgencyProfile}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-[#0F172A] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Agency</span>
                </button>

                <button
                  onClick={onExportStatement}
                  className="py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200/80 text-[#0F172A] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
