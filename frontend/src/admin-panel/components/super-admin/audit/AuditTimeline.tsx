import React from 'react';
import {
  ShieldCheck,
  Edit,
  RotateCcw,
  ShieldAlert,
  Calendar,
  Lock,
  Package,
  Trash2,
  Key,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Clock,
} from 'lucide-react';
import { AuditLogItem } from '../../../types/auditLogsManagement';

interface AuditTimelineProps {
  logs: AuditLogItem[];
  selectedLogId?: string;
  onSelectLog: (log: AuditLogItem) => void;
  onViewMoreMenu?: (log: AuditLogItem, e: React.MouseEvent) => void;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange?: (page: number) => void;
}

export const AuditTimeline: React.FC<AuditTimelineProps> = ({
  logs,
  selectedLogId,
  onSelectLog,
  onViewMoreMenu,
  pagination,
  onPageChange,
}) => {
  const getEventIcon = (type?: string) => {
    switch (type) {
      case 'check-shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'edit':
        return <Edit className="w-3.5 h-3.5 text-blue-600" />;
      case 'refund':
        return <RotateCcw className="w-3.5 h-3.5 text-orange-600" />;
      case 'alert-shield':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-blue-600" />;
      case 'shield':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'user-lock':
        return <Lock className="w-3.5 h-3.5 text-orange-600" />;
      case 'package':
        return <Package className="w-3.5 h-3.5 text-blue-600" />;
      case 'trash':
        return <Trash2 className="w-3.5 h-3.5 text-rose-600" />;
      case 'key':
      default:
        return <Key className="w-3.5 h-3.5 text-[#6356E5]" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'High':
      case 'Critical':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Low':
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Failed':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'Success':
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || logs.length;
  const limit = pagination?.limit || 20;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      {/* ── 1. Header with Sort & View Controls ── */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-black text-[#0F172A]">Audit Timeline</h2>
          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-[#6356E5] text-[10px] font-black border border-purple-100 font-mono">
            {totalItems.toLocaleString()} events
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <span>Sort:</span>
            <span className="text-slate-800 font-black">Newest First</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          <button className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 flex items-center justify-center cursor-pointer">
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── 2. Timeline List Rows ── */}
      <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin">
        {logs.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <Clock className="w-8 h-8 text-slate-300 mx-auto" />
            <div>
              <p className="text-xs font-black text-slate-700">No Audit Events Found</p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                No real-time audit records match the selected filters.
              </p>
            </div>
          </div>
        ) : (
          logs.map((log) => {
            const isSelected = selectedLogId === log.id;

            return (
              <div
                key={log.id}
                onClick={() => onSelectLog(log)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-50/40 border-[#6356E5] shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                {/* Left Accent Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6356E5]" />
                )}

                {/* Column 1: Time + Dot */}
                <div className="w-24 shrink-0 text-left">
                  <span className="text-[10px] font-mono font-black text-slate-800 block">
                    {log.timestamp}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 block">
                    {log.date}
                  </span>
                </div>

                {/* Column 2: Event Icon + Description */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    {getEventIcon(log.iconType)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-black text-[#0F172A] truncate">
                      {log.eventType}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold truncate">
                      {log.description}
                    </p>
                  </div>
                </div>

                {/* Column 3: Actor Avatar + Info */}
                <div className="hidden sm:flex items-center gap-2 min-w-[130px] shrink-0">
                  {log.actor.avatar ? (
                    <img
                      src={log.actor.avatar}
                      alt={log.actor.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#6356E5]/10 text-[#6356E5] font-bold text-[9px] flex items-center justify-center shrink-0">
                      {log.actor.isSystem ? 'SYS' : log.actor.name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-[11px] font-black text-slate-800 block truncate">
                      {log.actor.name}
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium block truncate">
                      {log.actor.role}
                    </span>
                  </div>
                </div>

                {/* Column 4: Tech Info (IP & Device) */}
                <div className="hidden lg:block min-w-[110px] text-left shrink-0">
                  <span className="text-[10px] font-mono font-bold text-slate-700 block">
                    {log.ipAddress}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block truncate">
                    {log.browser?.split(' ')[0] || 'Web'} / {log.os?.split(' ')[0] || 'System'}
                  </span>
                </div>

                {/* Column 5: Status & Severity Badges */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="space-y-0.5 text-right">
                    <span
                      className={`px-2 py-0.2 rounded-md text-[9px] font-black border block ${getStatusBadge(
                        log.status
                      )}`}
                    >
                      {log.status}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-md text-[8px] font-mono font-bold border block ${getSeverityBadge(
                        log.severity
                      )}`}
                    >
                      {log.severity}
                    </span>
                  </div>

                  <button
                    onClick={(e) => onViewMoreMenu && onViewMoreMenu(log, e)}
                    className="w-6 h-6 rounded-lg hover:bg-slate-200/80 text-slate-400 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 3. Dynamic Pagination Bar ── */}
      {totalItems > 0 && (
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-500">
          <span className="text-[11px] font-mono">
            Showing {startItem} to {endItem} of {totalItems.toLocaleString()} events
          </span>

          <div className="flex items-center gap-1">
            <button
              disabled={currentPage <= 1}
              onClick={() => onPageChange && onPageChange(currentPage - 1)}
              className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-2.5 py-1 rounded-xl bg-[#6356E5] text-white text-[11px] font-black shadow-xs font-mono">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange && onPageChange(currentPage + 1)}
              className="w-7 h-7 rounded-xl bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 flex items-center justify-center cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
