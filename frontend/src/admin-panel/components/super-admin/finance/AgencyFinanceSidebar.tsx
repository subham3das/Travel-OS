import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Star,
  Download,
  FileText,
  ExternalLink,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { AgencySidebarData } from '../../../types/financeManagement';

interface AgencyFinanceSidebarProps {
  data: AgencySidebarData;
  isOpen: boolean;
  onClose: () => void;
  onDownloadReport: () => void;
  onExportStatement: () => void;
  onViewAgency: (agencyId: string) => void;
}

export const AgencyFinanceSidebar: React.FC<AgencyFinanceSidebarProps> = ({
  data,
  isOpen,
  onClose,
  onDownloadReport,
  onExportStatement,
  onViewAgency,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Settlements' | 'Profit Breakdown' | 'Trends'>('Overview');
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full xl:w-[360px] shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-sm flex flex-col h-auto max-h-[calc(100vh-120px)] overflow-hidden sticky top-24 select-none"
      >
        {/* ── 1. SIDEBAR HEADER ── */}
        <div className="p-4 border-b border-slate-100 flex items-start justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={data.agencyLogo}
              alt={data.agencyName}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-[#0F172A] truncate">
                  {data.agencyName}
                </h3>
                {data.isVerified && (
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-[10px] font-semibold text-slate-400">
                Agency ID: <span className="font-bold text-slate-600">{data.agencyId}</span>
              </p>
              <div className="flex items-center gap-1 mt-0.5 text-[10px] font-extrabold text-slate-600">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                <span>{data.rating}</span>
                <span className="text-slate-400 font-semibold">({data.totalReviews.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── 2. SIDEBAR TABS ── */}
        <div className="flex items-center border-b border-slate-100 px-4 bg-white shrink-0 overflow-x-auto scrollbar-none">
          {(['Overview', 'Settlements', 'Profit Breakdown', 'Trends'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-2 text-xs font-black border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#6356E5] text-[#6356E5]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── 3. SIDEBAR CONTENT (SCROLLABLE) ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              {/* Section 1: Revenue Overview */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#0F172A]">Revenue Overview</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500">
                    This Month
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-semibold">Total Revenue</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[#0F172A]">{data.totalRevenue}</span>
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-600">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>{data.revenueGrowth}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-semibold">Total Bookings</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[#0F172A]">{data.totalBookings.toLocaleString()}</span>
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-600">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>{data.bookingsGrowth}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-semibold">Average Booking Value</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[#0F172A]">{data.avgBookingValue}</span>
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-600">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>{data.avgBookingGrowth}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-semibold">Total Commission</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-[#0F172A]">{data.totalCommission}</span>
                      <span className="inline-flex items-center text-[10px] font-black text-emerald-600">
                        <ArrowUpRight className="w-2.5 h-2.5" />
                        <span>{data.commissionGrowth}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Settlement History */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#0F172A]">Settlement History</h4>
                  <button
                    onClick={() => setActiveTab('Settlements')}
                    className="text-[10px] font-bold text-[#6356E5] hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs">
                  {data.settlementHistory.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-slate-600 font-semibold text-[11px]">{s.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-[#0F172A] text-[11px]">{s.amount}</span>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[9px] font-extrabold border ${
                            s.status === 'Settled'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : s.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Profit Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#0F172A]">Profit Breakdown</h4>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500">
                    This Month
                  </span>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 flex items-center gap-4">
                  {/* Donut */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#3B82F6" strokeWidth="18" strokeDasharray="100 138" strokeDashoffset="0" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#10B981" strokeWidth="18" strokeDasharray="45 193" strokeDashoffset="-100" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#F59E0B" strokeWidth="18" strokeDasharray="30 208" strokeDashoffset="-145" />
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#6356E5" strokeWidth="18" strokeDasharray="25 213" strokeDashoffset="-175" />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1 text-[11px] flex-1">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Total Revenue
                      </span>
                      <span className="font-black text-[#0F172A]">{data.profitBreakdown.totalRevenue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Commission
                      </span>
                      <span className="font-bold text-slate-700">{data.profitBreakdown.commission}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-amber-500" /> Taxes
                      </span>
                      <span className="font-bold text-slate-700">{data.profitBreakdown.taxes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1 text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Gateway Charges
                      </span>
                      <span className="font-bold text-slate-700">{data.profitBreakdown.gatewayCharges}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200/60 pt-1">
                      <span className="flex items-center gap-1 font-bold text-teal-600">
                        <span className="w-2 h-2 rounded-full bg-teal-500" /> Net Profit
                      </span>
                      <span className="font-black text-teal-600">{data.profitBreakdown.netProfit}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Monthly Trend */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-[#0F172A]">Monthly Trend</h4>
                  <div className="flex items-center gap-2 text-[10px] font-extrabold">
                    <span className="flex items-center gap-1 text-[#6356E5]">
                      <span className="w-2 h-2 rounded-full bg-[#6356E5]" /> Revenue
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Profit
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 space-y-1">
                  <div className="relative h-20 w-full">
                    {/* Y Axis lines */}
                    <div className="absolute inset-0 flex flex-col justify-between text-[8px] font-bold text-slate-300 pointer-events-none">
                      <div className="border-b border-slate-100 flex justify-between"><span>3Cr</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>2Cr</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>1Cr</span></div>
                      <div className="border-b border-slate-100 flex justify-between"><span>0</span></div>
                    </div>

                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 overflow-visible">
                      <path d="M 0 50 C 25 30, 50 35, 75 15 L 100 8" fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M 0 75 C 25 60, 50 65, 75 40 L 100 30" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
                      <circle cx="0" cy="50" r="2.5" fill="#6356E5" />
                      <circle cx="25" cy="30" r="2.5" fill="#6356E5" />
                      <circle cx="50" cy="35" r="2.5" fill="#6356E5" />
                      <circle cx="75" cy="15" r="2.5" fill="#6356E5" />
                      <circle cx="100" cy="8" r="2.5" fill="#6356E5" />
                    </svg>
                  </div>

                  <div className="flex justify-between text-[9px] font-bold text-slate-400 pt-1 border-t border-slate-100">
                    <span>Jun 1</span>
                    <span>Jun 4</span>
                    <span>Jun 7</span>
                    <span>Jun 10</span>
                    <span>Jun 12</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Quick Actions */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <h4 className="text-xs font-black text-[#0F172A]">Quick Actions</h4>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onDownloadReport}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report</span>
                  </button>

                  <button
                    onClick={() => onViewAgency(data.agencyId)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100 text-blue-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Agency</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={onExportStatement}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Export Statement</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsMoreOpen(!isMoreOpen)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
                    >
                      <span>More Actions</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {isMoreOpen && (
                      <div className="absolute right-0 bottom-full mb-1.5 w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 select-none space-y-0.5 z-40">
                        <button
                          onClick={() => {
                            setIsMoreOpen(false);
                            navigate('/admin/agencies');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                        >
                          <span>Manage Commission Rates</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsMoreOpen(false);
                            navigate('/admin/agencies');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 text-xs font-bold text-slate-700 text-left"
                        >
                          <span>Review Payout Bank Details</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: SETTLEMENTS */}
          {activeTab === 'Settlements' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">All Payout Settlements</h4>
              <div className="space-y-2">
                {data.settlementHistory.map((s, idx) => (
                  <div key={idx} className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-extrabold text-[#0F172A]">{s.amount}</p>
                      <p className="text-[10px] text-slate-400">{s.date}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      s.status === 'Settled' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PROFIT BREAKDOWN */}
          {activeTab === 'Profit Breakdown' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Fiscal Analysis</h4>
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gross Margin:</span>
                  <span className="font-black text-[#0F172A]">15.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Net Commission Inflow:</span>
                  <span className="font-bold text-emerald-600">{data.profitBreakdown.commission}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRENDS */}
          {activeTab === 'Trends' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black text-[#0F172A]">Growth Trajectory</h4>
              <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">MoM Booking Growth:</span>
                  <span className="font-black text-emerald-600">+18.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">MoM Revenue Growth:</span>
                  <span className="font-black text-emerald-600">+24.5%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
};
