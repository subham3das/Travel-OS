import React from 'react';
import {
  Search,
  SlidersHorizontal,
  Plus,
  MoreVertical,
  FileText,
  DollarSign,
  CalendarCheck,
  Users,
  Building2,
  Compass,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ReportItem, ReportCategory } from '../../../types/reportsManagement';

interface ReportLibraryProps {
  reports: ReportItem[];
  selectedReportId: string;
  onSelectReport: (report: ReportItem) => void;
  activeCategory: ReportCategory;
  onCategoryChange: (cat: ReportCategory) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onCreateReport: () => void;
  onViewAllReports?: () => void;
}

export const ReportLibrary: React.FC<ReportLibraryProps> = ({
  reports,
  selectedReportId,
  onSelectReport,
  activeCategory,
  onCategoryChange,
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
  onCreateReport,
  onViewAllReports,
}) => {
  const tabs = ['All Reports', 'Scheduled', 'Shared with me'];
  const categories: ReportCategory[] = [
    'All',
    'Financial',
    'Bookings',
    'Users',
    'Agencies',
    'Trips',
    'Marketing',
    'Community',
  ];

  const getReportIcon = (cat: ReportCategory) => {
    switch (cat) {
      case 'Financial':
        return {
          icon: <DollarSign className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'Bookings':
        return {
          icon: <CalendarCheck className="w-3.5 h-3.5" />,
          bg: 'bg-orange-50 text-orange-600 border-orange-100',
        };
      case 'Users':
        return {
          icon: <Users className="w-3.5 h-3.5" />,
          bg: 'bg-blue-50 text-blue-600 border-blue-100',
        };
      case 'Agencies':
        return {
          icon: <Building2 className="w-3.5 h-3.5" />,
          bg: 'bg-purple-50 text-[#6356E5] border-purple-100',
        };
      case 'Trips':
        return {
          icon: <Compass className="w-3.5 h-3.5" />,
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
        };
      case 'Community':
      default:
        return {
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          bg: 'bg-amber-50 text-amber-600 border-amber-100',
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Top Header & Create Button ── */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Report Library</h3>
        <button
          onClick={onCreateReport}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-[11px] font-black shadow-xs cursor-pointer transition-all"
        >
          <Plus className="w-3 h-3" />
          <span>Create Report</span>
        </button>
      </div>

      {/* ── 2. Search Input ── */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search reports..."
          className="w-full pl-8 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all shadow-2xs"
        />
      </div>

      {/* ── 3. Tabs Filter ── */}
      <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex-1 py-1 px-1 rounded-xl text-[10px] font-black transition-all cursor-pointer truncate ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── 4. Main Body: Categories Sidebar + Report Cards ── */}
      <div className="grid grid-cols-12 gap-2.5 items-start">
        {/* Left Categories List */}
        <div className="col-span-3 space-y-1 text-[11px] font-bold text-slate-500">
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-black block px-1">
            Categories
          </span>
          {categories.map((cat) => {
            const isCatActive = activeCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`w-full text-left px-2 py-1 rounded-xl transition-all cursor-pointer block truncate ${
                  isCatActive
                    ? 'bg-purple-50 text-[#6356E5] font-black'
                    : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Right Report Cards */}
        <div className="col-span-9 space-y-2 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin">
          {reports.map((report) => {
            const isSelected = report.id === selectedReportId;
            const { icon, bg } = getReportIcon(report.category);

            return (
              <div
                key={report.id}
                onClick={() => onSelectReport(report)}
                className={`p-2.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-50/40 border-[#6356E5] shadow-xs'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'
                }`}
              >
                {/* Accent Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6356E5]" />
                )}

                {/* Top Row: Icon + Name + Actions */}
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}>
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-[#0F172A] truncate">
                        {report.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-semibold block">
                        {report.category}
                      </span>
                    </div>
                  </div>

                  <button className="w-5 h-5 rounded-md hover:bg-slate-200/80 text-slate-400 flex items-center justify-center shrink-0">
                    <MoreVertical className="w-3 h-3" />
                  </button>
                </div>

                {/* Meta Row: Date & Formats */}
                <div className="text-[9px] font-mono text-slate-400 mb-1.5 truncate">
                  Last generated: {report.lastGenerated}
                </div>

                {/* Format Badges */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-[9px] font-mono font-black">
                  <div className="flex items-center gap-1">
                    {report.availableFormats.map((fmt) => (
                      <span
                        key={fmt}
                        className={`px-1.5 py-0.2 rounded-md ${
                          fmt === 'PDF'
                            ? 'bg-rose-50 text-rose-600 border border-rose-100'
                            : fmt === 'Excel'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-blue-50 text-blue-600 border border-blue-100'
                        }`}
                      >
                        {fmt}
                      </span>
                    ))}
                  </div>

                  {report.scheduleStatus && (
                    <span className="text-slate-400 font-bold">
                      {report.scheduleStatus}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 5. Bottom Link ── */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          onClick={onViewAllReports}
          className="text-xs font-bold text-[#6356E5] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View All Reports</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
