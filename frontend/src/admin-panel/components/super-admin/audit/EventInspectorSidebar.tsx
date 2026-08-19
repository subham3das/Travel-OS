import React from 'react';
import {
  X,
  Shield,
  Download,
  Copy,
  AlertTriangle,
  FileSearch,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { AuditLogItem } from '../../../types/auditLogsManagement';

interface EventInspectorSidebarProps {
  log: AuditLogItem;
  onClose?: () => void;
  onExportEvent: () => void;
  onCopyEventId: () => void;
  onFlagInvestigation: () => void;
  onViewRelatedLogs: () => void;
}

export const EventInspectorSidebar: React.FC<EventInspectorSidebarProps> = ({
  log,
  onClose,
  onExportEvent,
  onCopyEventId,
  onFlagInvestigation,
  onViewRelatedLogs,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-3.5 select-none">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Event Details</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Close</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ── 1. Event Information ── */}
      <div className="space-y-1.5 text-xs">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Event Information
        </h4>

        <div className="space-y-1 bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100 font-medium">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Event ID</span>
            <span className="font-mono font-black text-slate-800">{log.id}</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Module</span>
            <span className="font-bold text-slate-800">{log.module}</span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Event Type</span>
            <span className="font-bold text-slate-800">{log.eventType}</span>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono">
            <span className="text-slate-400">Timestamp</span>
            <span className="text-slate-700">{log.date} {log.timestamp}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-[11px]">
            <span className="text-slate-400">Severity</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-200">
              {log.severity}
            </span>
          </div>

          <div className="flex justify-between items-center text-[11px]">
            <span className="text-slate-400">Status</span>
            <span className="font-black text-emerald-600">{log.status}</span>
          </div>
        </div>
      </div>

      {/* ── 2. Actor Information ── */}
      <div className="space-y-1.5 text-xs">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Actor Information
        </h4>

        <div className="bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100 space-y-1.5">
          <div className="flex items-center gap-2.5">
            {log.actor.avatar ? (
              <img
                src={log.actor.avatar}
                alt={log.actor.name}
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#6356E5] text-white font-bold text-xs flex items-center justify-center">
                SYS
              </div>
            )}

            <div className="min-w-0">
              <span className="font-black text-slate-900 text-xs block truncate">
                {log.actor.name}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block truncate">
                {log.actor.role}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-500 space-y-0.5 pt-1 border-t border-slate-200/60">
            <p className="truncate">{log.actor.email}</p>
            <p className="font-bold text-slate-700">User ID: {log.actor.userId}</p>
          </div>
        </div>
      </div>

      {/* ── 3. Technical Details ── */}
      <div className="space-y-1.5 text-xs">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Technical Details
        </h4>

        <div className="bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100 space-y-1 font-mono text-[10px]">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">IP Address</span>
            <span className="font-bold text-slate-800">{log.ipAddress} {log.country}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Device</span>
            <span className="text-slate-700 font-sans text-[11px] font-bold">{log.device}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Browser</span>
            <span className="text-slate-700 truncate max-w-[150px]">{log.browser}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">OS</span>
            <span className="text-slate-700">{log.os}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Location</span>
            <span className="text-slate-700 truncate max-w-[150px]">{log.location}</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
            <span className="text-slate-400">Session ID</span>
            <span className="text-slate-600 truncate max-w-[140px]">{log.sessionId}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Changes (Before / After) ── */}
      {log.changes && log.changes.length > 0 && (
        <div className="space-y-1.5 text-xs">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            Changes (Before / After)
          </h4>

          <div className="bg-slate-50/60 p-2.5 rounded-2xl border border-slate-100 space-y-1.5 font-mono text-[10px]">
            {log.changes.map((ch, idx) => (
              <div key={idx} className="space-y-0.5">
                <span className="text-slate-500 font-bold block">{ch.field}</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {ch.before}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-black">
                    {ch.after}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 5. Quick Actions ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
          Quick Actions
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onExportEvent}
            className="py-2 px-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-black transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-3 h-3 text-slate-400" />
            <span>Export Event</span>
          </button>

          <button
            onClick={onCopyEventId}
            className="py-2 px-2.5 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-black transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <Copy className="w-3 h-3 text-slate-400" />
            <span>Copy Event ID</span>
          </button>
        </div>

        <button
          onClick={onFlagInvestigation}
          className="w-full py-2 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Flag for Investigation</span>
        </button>

        <button
          onClick={onViewRelatedLogs}
          className="w-full py-2 rounded-2xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#6356E5] text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <FileSearch className="w-3.5 h-3.5" />
          <span>View Related Logs</span>
        </button>
      </div>
    </div>
  );
};
