import React from 'react';
import {
  Sparkles,
  TrendingUp,
  MapPin,
  Smartphone,
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  Mail,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AIInsightItem,
  ScheduledReportItem,
  RecentExportItem,
} from '../../../types/reportsManagement';

interface ExecutiveInsightsSidebarProps {
  insights: AIInsightItem[];
  quickStats: {
    cancellationRate: { value: string; change: string; isPositive: boolean };
    refundsProcessed: { value: string; change: string; isPositive: boolean };
    successfulPayments: { value: string; change: string; isPositive: boolean };
    chargebackRate: { value: string; change: string; isPositive: boolean };
  };
  scheduledReports: ScheduledReportItem[];
  recentExports: RecentExportItem[];
  onExportPDF: () => void;
  onExportExcel: () => void;
  onExportCSV: () => void;
  onScheduleReport: () => void;
  onEmailReport: () => void;
  onViewDetailedInsights?: () => void;
  onViewAllScheduled?: () => void;
  onViewAllExports?: () => void;
}

export const ExecutiveInsightsSidebar: React.FC<ExecutiveInsightsSidebarProps> = ({
  insights,
  quickStats,
  scheduledReports,
  recentExports,
  onExportPDF,
  onExportExcel,
  onExportCSV,
  onScheduleReport,
  onEmailReport,
  onViewDetailedInsights,
  onViewAllScheduled,
  onViewAllExports,
}) => {
  const getInsightIcon = (type: AIInsightItem['iconType']) => {
    switch (type) {
      case 'revenue':
        return <TrendingUp className="w-3.5 h-3.5 text-[#6356E5]" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-blue-500" />;
      case 'mobile':
        return <Smartphone className="w-3.5 h-3.5 text-emerald-500" />;
      case 'cancellation':
      default:
        return <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs space-y-4 select-none">
      {/* ── 1. AI INSIGHTS ── */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100/80">
          <div className="w-5 h-5 rounded-lg bg-purple-50 text-[#6356E5] flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </div>
          <h3 className="text-xs font-black text-[#0F172A]">AI Insights</h3>
        </div>

        <div className="space-y-1.5">
          {insights.map((item) => (
            <div
              key={item.id}
              className="p-2 rounded-xl bg-purple-50/40 border border-purple-100/80 flex items-start gap-2 text-xs"
            >
              <div className="shrink-0 mt-0.5">{getInsightIcon(item.iconType)}</div>
              <p className="text-[11px] font-bold text-slate-800 leading-snug">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <button
            onClick={onViewDetailedInsights}
            className="text-[11px] font-bold text-[#6356E5] hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View Detailed Insights</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ── 2. QUICK STATISTICS ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-[#0F172A]">Quick Statistics</h3>

        <div className="space-y-1.5 text-xs font-bold">
          {/* Cancellation */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50">
            <span className="text-slate-600 text-[11px]">Cancellation Rate</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-900 font-black">{quickStats.cancellationRate.value}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">
                <ArrowDownRight className="w-2.5 h-2.5" />
                {quickStats.cancellationRate.change}
              </span>
            </div>
          </div>

          {/* Refunds */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50">
            <span className="text-slate-600 text-[11px]">Refunds Processed</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-900 font-black">{quickStats.refundsProcessed.value}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">
                <ArrowDownRight className="w-2.5 h-2.5" />
                {quickStats.refundsProcessed.change}
              </span>
            </div>
          </div>

          {/* Successful Payments */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50">
            <span className="text-slate-600 text-[11px]">Successful Payments</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-900 font-black">{quickStats.successfulPayments.value}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">
                <ArrowUpRight className="w-2.5 h-2.5" />
                {quickStats.successfulPayments.change}
              </span>
            </div>
          </div>

          {/* Chargeback */}
          <div className="flex items-center justify-between p-1.5 rounded-xl bg-slate-50">
            <span className="text-slate-600 text-[11px]">Chargeback Rate</span>
            <div className="flex items-center gap-1 font-mono">
              <span className="text-slate-900 font-black">{quickStats.chargebackRate.value}</span>
              <span className="text-[10px] text-emerald-600 font-extrabold flex items-center">
                <ArrowDownRight className="w-2.5 h-2.5" />
                {quickStats.chargebackRate.change}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. EXPORT & SHARE ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h3 className="text-xs font-black text-[#0F172A]">Export & Share</h3>

        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={onExportPDF}
            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-[10px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>

          <button
            onClick={onExportExcel}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-[10px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          <button
            onClick={onExportCSV}
            className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-[10px] font-black flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onScheduleReport}
            className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Schedule Report</span>
          </button>

          <button
            onClick={onEmailReport}
            className="py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <Mail className="w-3 h-3 text-slate-400" />
            <span>Email Report</span>
          </button>
        </div>
      </div>

      {/* ── 4. REPORT SCHEDULE ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A]">Report Schedule</h3>
          <button
            onClick={onViewAllScheduled}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-1.5">
          {scheduledReports.map((sch) => (
            <div key={sch.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] truncate">{sch.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">{sch.schedule}</p>
                </div>
              </div>

              <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[9px] font-black border border-emerald-100 shrink-0">
                {sch.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. RECENT EXPORTS ── */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#0F172A]">Recent Exports</h3>
          <button
            onClick={onViewAllExports}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-1.5">
          {recentExports.map((exp) => (
            <div key={exp.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[11px] truncate">{exp.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">{exp.date}</p>
                </div>
              </div>

              <span
                className={`px-1.5 py-0.2 rounded-md text-[9px] font-mono font-black shrink-0 ${
                  exp.format === 'PDF'
                    ? 'bg-rose-50 text-rose-600 border border-rose-100'
                    : exp.format === 'Excel'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                }`}
              >
                {exp.format}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
