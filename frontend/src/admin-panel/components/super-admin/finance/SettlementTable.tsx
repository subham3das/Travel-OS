import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Eye,
  Download,
  Check,
  X,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Calendar,
  RefreshCw,
  FileDown,
  ShieldCheck,
} from 'lucide-react';
import { SettlementRecord } from '../../../types/financeManagement';

interface SettlementTableProps {
  settlements: SettlementRecord[];
  onViewDetails: (settlement: SettlementRecord) => void;
  onDownloadStatement: (settlement: SettlementRecord) => void;
  onApprove: (settlement: SettlementRecord) => void;
  onReject: (settlement: SettlementRecord) => void;
}

type FilterTab = 'All' | 'Pending' | 'Processing' | 'Settled' | 'Failed' | 'Held' | 'Refunded';
type StatusType = SettlementRecord['status'];

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  Settled: {
    label: 'Settled',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  Pending: {
    label: 'Pending',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  Processing: {
    label: 'Processing',
    dot: 'bg-blue-500',
    text: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  Failed: {
    label: 'Failed',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
  Held: {
    label: 'Held',
    dot: 'bg-purple-500',
    text: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  Refunded: {
    label: 'Refunded',
    dot: 'bg-slate-400',
    text: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
  },
};

const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'Processing', 'Settled', 'Failed', 'Held', 'Refunded'];

const SUMMARY_CARDS = [
  { key: 'total', label: 'Total Settlements', icon: '₹', color: 'text-[#6356E5]', bg: 'bg-purple-50' },
  { key: 'pending', label: 'Pending', icon: '⏳', color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'today', label: "Today's Payout", icon: '📤', color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'processing', label: 'Processing', icon: '🔄', color: 'text-blue-500', bg: 'bg-blue-50' },
  { key: 'failed', label: 'Failed', icon: '⚠️', color: 'text-rose-600', bg: 'bg-rose-50' },
  { key: 'month', label: 'This Month', icon: '📅', color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['Pending'];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// Memoized row for perf
const SettlementRow = React.memo(function SettlementRow({
  item,
  onViewDetails,
  onDownloadStatement,
  onApprove,
  onReject,
}: {
  item: SettlementRecord;
  onViewDetails: (s: SettlementRecord) => void;
  onDownloadStatement: (s: SettlementRecord) => void;
  onApprove: (s: SettlementRecord) => void;
  onReject: (s: SettlementRecord) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  return (
    <tr
      className="group hover:bg-blue-50/40 transition-colors cursor-pointer border-b border-slate-100/80 last:border-0"
      onClick={() => onViewDetails(item)}
    >
      {/* Settlement ID — sticky */}
      <td className="py-3.5 px-4 sticky left-0 bg-white group-hover:bg-blue-50/40 z-10 transition-colors">
        <span className="font-mono text-[11px] font-bold text-[#6356E5] whitespace-nowrap">{item.id}</span>
      </td>

      {/* Agency — rich cell */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3 min-w-[200px]">
          {item.agencyLogo ? (
            <img
              src={item.agencyLogo}
              alt={item.agencyName}
              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[#6356E5]/10 text-[#6356E5] font-black text-sm flex items-center justify-center shrink-0">
              {item.agencyName.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[13px] text-[#0F172A] truncate max-w-[130px]">{item.agencyName}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-slate-400">{item.agencyId}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Gross Amount */}
      <td className="py-3.5 px-4 text-right">
        <span className="font-mono font-black text-[13px] text-[#0F172A] whitespace-nowrap">{item.settlementAmount}</span>
      </td>

      {/* Platform Commission */}
      <td className="py-3.5 px-4 text-right">
        <span className="font-mono font-bold text-[12px] text-[#6356E5] whitespace-nowrap">{item.commission}</span>
      </td>

      {/* GST */}
      <td className="py-3.5 px-4 text-right">
        <span className="font-mono text-[12px] text-slate-500 whitespace-nowrap">{item.tax}</span>
      </td>

      {/* Net Payout */}
      <td className="py-3.5 px-4 text-right">
        <span className="font-mono font-black text-[13px] text-emerald-600 whitespace-nowrap">{item.netAmount}</span>
      </td>

      {/* Settlement Date */}
      <td className="py-3.5 px-4">
        <span className="text-[12px] text-slate-500 whitespace-nowrap">{item.settlementDate}</span>
      </td>

      {/* Status */}
      <td className="py-3.5 px-4">
        <StatusBadge status={item.status} />
      </td>

      {/* UTR */}
      <td className="py-3.5 px-4">
        <span className="font-mono text-[11px] text-slate-400 whitespace-nowrap">
          {(item as any).utr || '—'}
        </span>
      </td>

      {/* Actions */}
      <td
        className="py-3.5 px-4 text-right sticky right-0 bg-white group-hover:bg-blue-50/40 z-10 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onViewDetails(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={() => onDownloadStatement(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            Invoice
          </button>
          {item.status === 'Pending' && (
            <>
              <button
                onClick={() => onApprove(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                Approve
              </button>
              <button
                onClick={() => onReject(item)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
                Reject
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

export const SettlementTable: React.FC<SettlementTableProps> = ({
  settlements,
  onViewDetails,
  onDownloadStatement,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return settlements.filter((s) => {
      const matchTab = activeTab === 'All' || s.status === activeTab;
      const matchSearch =
        !q ||
        s.id.toLowerCase().includes(q) ||
        s.agencyName.toLowerCase().includes(q) ||
        (s.agencyId || '').toLowerCase().includes(q) ||
        ((s as any).utr || '').toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [settlements, activeTab, searchQuery]);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Summary counts
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: settlements.length };
    for (const s of settlements) {
      c[s.status] = (c[s.status] || 0) + 1;
    }
    return c;
  }, [settlements]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm select-none overflow-hidden">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-slate-100 border-b border-slate-100">
        {SUMMARY_CARDS.map((card) => (
          <div key={card.key} className="bg-white p-4 flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-slate-400">{card.label}</span>
            <span className={`text-lg font-black ${card.color}`}>
              {card.key === 'total'
                ? `${settlements.length}`
                : card.key === 'pending'
                ? counts['Pending'] || 0
                : card.key === 'processing'
                ? counts['Processing'] || 0
                : card.key === 'failed'
                ? counts['Failed'] || 0
                : card.key === 'today'
                ? counts['Settled'] || 0
                : `${settlements.length}`}
            </span>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col gap-3">
        {/* Title row */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[15px] font-black text-[#0F172A]">Agency Settlement Overview</h3>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Approve payouts, generate tax invoices, and track bank disbursements
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <Calendar className="w-3.5 h-3.5" />
              Date Range
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
              <FileDown className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filter + Search row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter tabs */}
          <div className="flex items-center bg-slate-100/70 p-1 rounded-xl gap-0.5">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
                {counts[tab] !== undefined && tab !== 'All' && (
                  <span className={`ml-1 text-[9px] font-black ${activeTab === tab ? 'text-[#6356E5]' : 'text-slate-400'}`}>
                    {counts[tab] || 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search ID, agency, UTR…"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 focus:border-[#6356E5] focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <span className="ml-auto text-[11px] text-slate-400 font-medium whitespace-nowrap">
            {filtered.length} results
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <th className="py-3 px-4 sticky left-0 bg-slate-50/95 z-20 whitespace-nowrap">Settlement ID</th>
              <th className="py-3 px-4 whitespace-nowrap">Agency</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Gross Amount</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Platform Commission</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">GST</th>
              <th className="py-3 px-4 text-right whitespace-nowrap">Net Payout</th>
              <th className="py-3 px-4 whitespace-nowrap">Settlement Date</th>
              <th className="py-3 px-4 whitespace-nowrap">Status</th>
              <th className="py-3 px-4 whitespace-nowrap">UTR</th>
              <th className="py-3 px-4 text-right sticky right-0 bg-slate-50/95 z-20 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-400 font-semibold text-sm">
                  No settlements match the selected filters.
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <SettlementRow
                  key={item.id}
                  item={item}
                  onViewDetails={onViewDetails}
                  onDownloadStatement={onDownloadStatement}
                  onApprove={onApprove}
                  onReject={onReject}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50/50">
          <span>
            Page {page} of {totalPages} · {filtered.length} records
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 cursor-pointer transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = i + 1;
              return (
                <button
                  key={pg}
                  onClick={() => setPage(pg)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    page === pg ? 'bg-[#6356E5] text-white' : 'border border-slate-200 hover:bg-white text-slate-600'
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-30 cursor-pointer transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
