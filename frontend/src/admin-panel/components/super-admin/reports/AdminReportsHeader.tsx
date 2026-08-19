import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  RefreshCw,
  Plus,
  ChevronDown,
  Layers,
} from 'lucide-react';

interface AdminReportsHeaderProps {
  onRefresh: () => void;
  onCreateCustomReport: () => void;
  isRefreshing?: boolean;
}

export const AdminReportsHeader: React.FC<AdminReportsHeaderProps> = ({
  onRefresh,
  onCreateCustomReport,
  isRefreshing = false,
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
            Reports & Analytics
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Comprehensive insights and data analysis across your Travel OS platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Date Range Picker, Comparison Selector, Refresh, Create Custom Report */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Date Range Picker */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Jun 1, 2024 - Jun 12, 2024</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Compare Range Selector */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Compare: May 1 - May 31, 2024</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        {/* Create Custom Report (Primary Purple CTA) */}
        <button
          onClick={onCreateCustomReport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Report</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </div>
    </div>
  );
};
