import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Download,
  Landmark,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { agencyFinanceService } from '../../services/agencyFinance.service';
import { SettlementTimelineModal } from './SettlementTimelineModal';

const FILTER_TABS = [
  { id: 'all', label: 'All Settlements' },
  { id: 'pending', label: 'Pending' },
  { id: 'processing', label: 'Processing' },
  { id: 'transferred', label: 'Transferred' },
  { id: 'failed', label: 'Failed' },
  { id: 'reversed', label: 'Reversed' },
];

export const MarketplaceSettlementsView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<any | null>(null);

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);
      const data = await agencyFinanceService.getSettlementDashboard({
        status: activeFilter === 'all' ? undefined : activeFilter,
        search: searchTerm.trim() || undefined,
        page,
        limit: 15,
      });
      setDashboardData(data);
    } catch (err: any) {
      console.warn('Failed to load settlements:', err.message);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, searchTerm, page]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  // CSV Export helper
  const handleExportCSV = () => {
    const list = dashboardData?.settlements || [];
    if (list.length === 0) {
      alert('No settlement records to export.');
      return;
    }

    const headers = [
      'Settlement ID',
      'Booking ID',
      'Traveler',
      'Package',
      'Booking Amount',
      'Commission',
      'Receivable',
      'Transfer Status',
      'Settlement Status',
      'UTR',
      'Expected Date',
      'Processed Date',
    ];

    const rows = list.map((item: any) => [
      item.settlementId,
      item.bookingId,
      `"${item.travelerName || 'Traveler'}"`,
      `"${item.packageName || 'Package'}"`,
      item.bookingAmount || 0,
      item.commissionAmount || 0,
      item.agencyReceivable || 0,
      item.transferStatus,
      item.settlementStatus,
      item.utr || '—',
      item.expectedSettlement || '—',
      `"${item.processedDate || '—'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ApnaTrip_Settlements_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = () => {
    handleExportCSV(); // Standard browser CSV format seamlessly opens in Excel
  };

  const handleExportPDF = () => {
    window.print();
  };

  // Status Badge Renderer
  const renderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s === 'SETTLED' || s === 'PROCESSED' || s === 'COMPLETED' || s === 'TRANSFERRED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>Settled</span>
        </span>
      );
    }
    if (s === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3 h-3 text-blue-500" />
          <span>Processing</span>
        </span>
      );
    }
    if (s === 'FAILED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3 text-rose-500" />
          <span>Failed</span>
        </span>
      );
    }
    if (s === 'REVERSED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700 border border-slate-200">
          <span>Reversed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-500" />
        <span>Pending</span>
      </span>
    );
  };

  const renderStageBadge = (stage: string, isDelayed?: boolean, delayHours?: number) => {
    if (isDelayed) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>Delayed SLA (+{delayHours || 2}h)</span>
        </span>
      );
    }
    const st = String(stage || '').toUpperCase();
    if (st === 'SETTLED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Credited to Bank</span>
        </span>
      );
    }
    if (st === 'IN_TRANSIT' || st === 'TRANSFER_INITIATED') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-700">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          <span>In Transit (Cutoff Window)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-600">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
        <span>Queued (T+2 SLA)</span>
      </span>
    );
  };

  const summaryCards = dashboardData?.summaryCards || [
    { id: 'available', title: 'Available Balance', formattedAmount: '₹0', subtitle: 'Ready for payout', badge: 'Live', color: 'emerald' },
    { id: 'pending', title: 'Pending Settlements', formattedAmount: '₹0', subtitle: 'Awaiting Route cycle', badge: 'Pending', color: 'amber' },
    { id: 'processing', title: 'Processing', formattedAmount: '₹0', subtitle: 'Bank clearing', badge: 'Processing', color: 'blue' },
    { id: 'transferred', title: 'Transferred', formattedAmount: '₹0', subtitle: 'Processed to bank', badge: 'Transferred', color: 'indigo' },
    { id: 'failed', title: 'Failed Transfers', formattedAmount: '₹0', subtitle: 'Requires bank update', badge: 'Failed', color: 'rose' },
    { id: 'lifetime', title: 'Lifetime Earnings', formattedAmount: '₹0', subtitle: 'Net settled total', badge: 'All Time', color: 'purple' },
  ];

  const settlementsList = dashboardData?.settlements || [];

  return (
    <div className="space-y-6">
      {/* Phase 11: Summary Cards Grid (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {summaryCards.map((card: any) => {
          let colorClasses = 'border-slate-100 bg-white text-[#0F172A]';
          let badgeClasses = 'bg-slate-100 text-slate-700';

          if (card.color === 'emerald') {
            badgeClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
          } else if (card.color === 'amber') {
            badgeClasses = 'bg-amber-50 text-amber-700 border-amber-200/60';
          } else if (card.color === 'blue') {
            badgeClasses = 'bg-blue-50 text-blue-700 border-blue-200/60';
          } else if (card.color === 'indigo') {
            badgeClasses = 'bg-indigo-50 text-[#583BE8] border-indigo-200/60';
          } else if (card.color === 'rose') {
            badgeClasses = 'bg-rose-50 text-rose-700 border-rose-200/60';
          } else if (card.color === 'purple') {
            badgeClasses = 'bg-purple-50 text-purple-700 border-purple-200/60';
          }

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-3xl border shadow-2xs transition-all hover:shadow-xs flex flex-col justify-between ${colorClasses}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-500 tracking-tight truncate">
                  {card.title}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black border ${badgeClasses}`}>
                  {card.badge}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-[#0F172A] tracking-tight">
                  {card.formattedAmount}
                </h3>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Control Bar: Filters, Search, and Exports */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveFilter(tab.id);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#583BE8] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Export Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-600" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print / PDF"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by Booking ID, Traveler Name, Transfer ID, or Bank UTR..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#583BE8] transition-colors"
          />
        </div>
      </div>

      {/* Phase 11: Settlement Table */}
      <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] uppercase font-black tracking-wider text-slate-400 select-none">
                <th className="py-3 px-4">Booking</th>
                <th className="py-3 px-4">Traveler</th>
                <th className="py-3 px-4">Package</th>
                <th className="py-3 px-4 text-right">Booking Amount</th>
                <th className="py-3 px-4 text-right">Commission</th>
                <th className="py-3 px-4 text-right">Agency Receivable</th>
                <th className="py-3 px-4 text-center">Status & Stage</th>
                <th className="py-3 px-4">Transfer ID</th>
                <th className="py-3 px-4">UTR Reference</th>
                <th className="py-3 px-4">Settlement SLA / ETA</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80 font-bold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    <div className="w-6 h-6 border-2 border-[#583BE8] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Loading settlement ledger...
                  </td>
                </tr>
              ) : settlementsList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-bold">
                    No settlement records found matching your filters.
                  </td>
                </tr>
              ) : (
                settlementsList.map((item: any) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedSettlement(item)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      #{item.bookingId}
                    </td>
                    <td className="py-3.5 px-4 text-slate-900 font-extrabold truncate max-w-[130px]">
                      {item.travelerName || 'Traveler'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">
                      {item.packageName || 'Holiday Package'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-slate-900">
                      {item.formattedBookingAmount || `₹${(item.bookingAmount || 0).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-400">
                      {item.formattedCommission || `₹${(item.commissionAmount || 0).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3.5 px-4 text-right font-black text-[#583BE8]">
                      {item.formattedReceivable || `₹${(item.agencyReceivable || 0).toLocaleString('en-IN')}`}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        {renderStatusBadge(item.settlementStatus)}
                        {renderStageBadge(item.currentStage, item.isDelayed, item.delayDurationHours)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 truncate max-w-[110px]">
                      {item.transferId || '—'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-[110px]">
                      {item.utr || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] font-bold text-slate-700">
                        {item.expectedSettlement || 'T+2'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {item.expectedSettlementDateTime ? item.expectedSettlementDateTime.split(',')[1] : '11:30 AM'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedSettlement(item)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 group-hover:bg-[#583BE8] group-hover:text-white text-slate-600 font-extrabold text-[10px] transition-colors cursor-pointer"
                      >
                        Timeline
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {dashboardData && dashboardData.totalPages > 1 && (
          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50/50">
            <span>
              Page {dashboardData.page} of {dashboardData.totalPages} ({dashboardData.total} records)
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= dashboardData.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Phase 12: Settlement Details Timeline Modal */}
      {selectedSettlement && (
        <SettlementTimelineModal
          settlement={selectedSettlement}
          onClose={() => setSelectedSettlement(null)}
        />
      )}
    </div>
  );
};
