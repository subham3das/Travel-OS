import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Download,
  RefreshCw,
  Plus,
  ChevronDown,
} from 'lucide-react';

interface AdminCommunityHeaderProps {
  onExport: () => void;
  onRefresh: () => void;
  onCreateAnnouncement: () => void;
  isRefreshing?: boolean;
}

export const AdminCommunityHeader: React.FC<AdminCommunityHeaderProps> = ({
  onExport,
  onRefresh,
  onCreateAnnouncement,
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
            Community Management
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Monitor, moderate and grow the Travel OS community ecosystem
          </p>
        </div>
      </div>

      {/* Right Controls: Date Range Picker, Export Report, Refresh, Create Announcement */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Date Range Picker */}
        <div className="relative">
          <button className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Jun 1, 2024 - Jun 12, 2024</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Export Report */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Export Report</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>

        {/* Create Announcement (Primary Purple CTA) */}
        <button
          onClick={onCreateAnnouncement}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Announcement</span>
        </button>
      </div>
    </div>
  );
};
