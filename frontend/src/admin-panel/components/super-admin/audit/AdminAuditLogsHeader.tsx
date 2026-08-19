import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Activity,
  Download,
  Search,
  ChevronDown,
} from 'lucide-react';

interface AdminAuditLogsHeaderProps {
  onLiveLogsToggle: () => void;
  isLiveActive: boolean;
  onExportLogs: () => void;
  onAdvancedSearch: () => void;
}

export const AdminAuditLogsHeader: React.FC<AdminAuditLogsHeaderProps> = ({
  onLiveLogsToggle,
  isLiveActive,
  onExportLogs,
  onAdvancedSearch,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 select-none">
      {/* Left: Back Button + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Audit Logs
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Track and monitor all important activities across the Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Live Logs, Export Logs, Advanced Search */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Live Logs Toggle */}
        <button
          onClick={onLiveLogsToggle}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-extrabold shadow-2xs transition-all cursor-pointer ${
            isLiveActive
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isLiveActive && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveActive ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </span>
          <span>Live Logs</span>
        </button>

        {/* Export Logs */}
        <button
          onClick={onExportLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Logs</span>
        </button>

        {/* Advanced Search (Primary Purple CTA) */}
        <button
          onClick={onAdvancedSearch}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Advanced Search</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </div>
    </div>
  );
};
