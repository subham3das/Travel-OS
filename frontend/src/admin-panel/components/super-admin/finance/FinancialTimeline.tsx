import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Banknote,
  AlertTriangle,
  Target,
  Trophy,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  RotateCcw,
  Webhook,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { FinancialTimelineEvent } from '../../../types/financeManagement';

interface FinancialTimelineProps {
  events: FinancialTimelineEvent[];
  onViewAll?: () => void;
}

type TimelineFilter =
  | 'All'
  | 'Settlement'
  | 'Transfer'
  | 'GST'
  | 'Reconciliation'
  | 'Refund'
  | 'Webhook';

const TIMELINE_FILTERS: TimelineFilter[] = [
  'All',
  'Settlement',
  'Transfer',
  'GST',
  'Reconciliation',
  'Refund',
  'Webhook',
];

const EVENT_CONFIG: Record<
  string,
  { icon: React.ElementType; iconColor: string; dotColor: string }
> = {
  milestone: { icon: Trophy, iconColor: 'text-amber-600', dotColor: 'bg-amber-400' },
  payout: { icon: Banknote, iconColor: 'text-blue-600', dotColor: 'bg-blue-400' },
  refund_spike: { icon: AlertTriangle, iconColor: 'text-rose-600', dotColor: 'bg-rose-400' },
  target_achieved: { icon: Target, iconColor: 'text-emerald-600', dotColor: 'bg-emerald-400' },
  peak_revenue: { icon: TrendingUp, iconColor: 'text-[#6356E5]', dotColor: 'bg-[#6356E5]' },
  settlement: { icon: CheckCircle2, iconColor: 'text-emerald-600', dotColor: 'bg-emerald-400' },
  transfer: { icon: ArrowRight, iconColor: 'text-blue-600', dotColor: 'bg-blue-400' },
  gst: { icon: FileText, iconColor: 'text-teal-600', dotColor: 'bg-teal-400' },
  reconciliation: { icon: ShieldCheck, iconColor: 'text-purple-600', dotColor: 'bg-purple-400' },
  refund: { icon: RotateCcw, iconColor: 'text-rose-600', dotColor: 'bg-rose-400' },
  webhook: { icon: Webhook, iconColor: 'text-slate-600', dotColor: 'bg-slate-400' },
};

function getConfig(type: string) {
  return EVENT_CONFIG[type] ?? EVENT_CONFIG['peak_revenue'];
}

// Map event type → filter category
function getCategory(type: string): TimelineFilter {
  if (type === 'payout' || type === 'milestone' || type === 'target_achieved' || type === 'peak_revenue') {
    return 'Settlement';
  }
  if (type === 'transfer') return 'Transfer';
  if (type === 'gst') return 'GST';
  if (type === 'reconciliation') return 'Reconciliation';
  if (type === 'refund' || type === 'refund_spike') return 'Refund';
  if (type === 'webhook') return 'Webhook';
  return 'Settlement';
}

// Group by day label (uses event.time which may be "2h ago", "Today", "Yesterday", etc.)
function groupByDay(events: FinancialTimelineEvent[]) {
  const groups: { label: string; events: FinancialTimelineEvent[] }[] = [];
  const seen: Record<string, number> = {};

  for (const ev of events) {
    // Simple grouping: use a synthetic day label
    const label = (ev as any).day || 'Today';
    if (seen[label] === undefined) {
      seen[label] = groups.length;
      groups.push({ label, events: [] });
    }
    groups[seen[label]].events.push(ev);
  }

  // fallback: if no day field, put everything under Today
  if (groups.length === 0) {
    groups.push({ label: 'Today', events });
  }
  return groups;
}

function TimelineItem({
  event,
  isLast,
}: {
  event: FinancialTimelineEvent;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const { icon: Icon, iconColor, dotColor } = getConfig(event.type);

  return (
    <div className="relative flex gap-3.5">
      {/* Connector line */}
      {!isLast && (
        <div className="absolute left-[17px] top-8 bottom-0 w-px bg-slate-100" />
      )}

      {/* Dot + icon */}
      <div className="shrink-0 mt-0.5">
        <div
          className={`w-8 h-8 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center relative z-10`}
        >
          <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 min-w-0 pb-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[13px] font-bold text-[#0F172A] leading-snug">
                {event.title}
              </span>
              {event.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-slate-100 text-slate-600">
                  {event.badge}
                </span>
              )}
              {event.amount && (
                <span className="font-mono text-[11px] font-black text-[#6356E5] bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded">
                  {event.amount}
                </span>
              )}
            </div>
            {expanded && (
              <p className="mt-1 text-[12px] text-slate-500 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-mono text-slate-400 whitespace-nowrap">
              {event.time}
            </span>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const FinancialTimeline: React.FC<FinancialTimelineProps> = ({
  events,
  onViewAll,
}) => {
  const [filter, setFilter] = useState<TimelineFilter>('All');
  const [search, setSearch] = useState('');
  const [showAll, setShowAll] = useState(false);
  const INITIAL_COUNT = 8;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return events.filter((ev) => {
      const matchFilter = filter === 'All' || getCategory(ev.type) === filter;
      const matchSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.description.toLowerCase().includes(q) ||
        ((ev as any).utr || '').toLowerCase().includes(q) ||
        ((ev as any).settlementId || '').toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [events, filter, search]);

  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT);
  const grouped = groupByDay(visible);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm select-none overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-black text-[#0F172A]">Financial Timeline</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-600">
                Live Feed
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">
              Real-time audit log of financial milestones & disbursements
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="text-[12px] font-extrabold text-[#6356E5] hover:text-[#5245cc] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-slate-100/70 p-1 rounded-xl gap-0.5 flex-wrap">
            {TIMELINE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  filter === f
                    ? 'bg-white text-[#0F172A] shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search UTR, booking, settlement…"
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 border border-slate-200 focus:border-[#6356E5] focus:outline-none text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Timeline content */}
      <div className="px-5 py-4">
        {grouped.length === 0 ? (
          <div className="py-10 text-center text-slate-400 font-semibold text-sm">
            No timeline events match the filter.
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    {group.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300">
                    {group.events.length} event{group.events.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-0">
                  {group.events.map((ev, i) => (
                    <TimelineItem
                      key={ev.id}
                      event={ev}
                      isLast={i === group.events.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Show more footer */}
      {filtered.length > INITIAL_COUNT && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-medium">
            Showing {visible.length} of {filtered.length} events
          </span>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="text-[12px] font-extrabold text-[#6356E5] hover:text-[#5245cc] flex items-center gap-1 transition-colors cursor-pointer"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Show {filtered.length - INITIAL_COUNT} More <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
