import React from 'react';
import {
  ChevronDown,
  Star,
  ArrowDownRight,
  ArrowUpRight,
  Award,
} from 'lucide-react';
import { SupportAnalyticsData } from '../../../types/supportManagement';

interface SupportAnalyticsDashboardProps {
  analytics: SupportAnalyticsData;
  onViewAllAgents?: () => void;
}

export const SupportAnalyticsDashboard: React.FC<SupportAnalyticsDashboardProps> = ({
  analytics,
  onViewAllAgents,
}) => {
  // ── 1. Volume Trend Line ──
  const maxVolume = 1500;
  const generateVolumePath = () => {
    const pts = analytics.volumeTrend.map((d, idx) => {
      const x = (idx / Math.max(analytics.volumeTrend.length - 1, 1)) * 100;
      const y = 100 - (d.tickets / maxVolume) * 85;
      return { x, y };
    });

    return pts.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  // ── 2. CSAT Trend Line ──
  const generateCsatPath = () => {
    const pts = analytics.csatTrend.map((d, idx) => {
      const x = (idx / Math.max(analytics.csatTrend.length - 1, 1)) * 100;
      const y = 100 - ((d.score - 1) / 4) * 85;
      return { x, y };
    });

    return pts.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      const prev = arr[idx - 1];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }, '');
  };

  // ── 3. Donut Math ──
  const donutSize = 100;
  const donutStroke = 14;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;

  let cumulativeCategories = 0;
  let cumulativeStatus = 0;

  // ── 4. SLA Ring Math ──
  const slaSize = 84;
  const slaStroke = 9;
  const slaRadius = (slaSize - slaStroke) / 2;
  const slaCircumference = 2 * Math.PI * slaRadius;
  const slaOffset = slaCircumference - (analytics.slaCompliance.rate / 100) * slaCircumference;

  return (
    <div className="space-y-4 select-none">
      {/* ── 1. TOP CARD: SUPPORT OVERVIEW (4 Widgets in 1 Grid) ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
        <h3 className="text-xs font-black text-[#0F172A]">Support Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* A. Ticket Volume Trend */}
          <div className="flex flex-col justify-between pr-0 md:pr-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-slate-700">Ticket Volume Trend</span>
              <button className="flex items-center gap-0.5 text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 cursor-pointer">
                <span>This Month</span>
                <ChevronDown className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="relative h-24 w-full pt-1">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                <line x1="0" y1="20" x2="100" y2="20" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="0" y1="80" x2="100" y2="80" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
                <path d={generateVolumePath()} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
                {analytics.volumeTrend.map((d, i) => {
                  const cx = (i / (analytics.volumeTrend.length - 1)) * 100;
                  const cy = 100 - (d.tickets / maxVolume) * 85;
                  return <circle key={i} cx={cx} cy={cy} r="3" fill="#6356E5" />;
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-slate-400">
              {analytics.volumeTrend.map((d) => (
                <span key={d.label}>{d.label}</span>
              ))}
            </div>
          </div>

          {/* B. Ticket Categories */}
          <div className="flex flex-col justify-between px-0 md:px-3 pt-3 md:pt-0 space-y-2">
            <span className="text-[11px] font-black text-slate-700">Ticket Categories</span>

            <div className="flex items-center gap-2">
              <div className="relative shrink-0 flex items-center justify-center">
                <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                  {analytics.categories.map((cat) => {
                    const dasharray = `${(cat.percentage / 100) * donutCircumference} ${donutCircumference}`;
                    const offset = -((cumulativeCategories / 100) * donutCircumference);
                    cumulativeCategories += cat.percentage;
                    return (
                      <circle
                        key={cat.name}
                        cx={donutSize / 2}
                        cy={donutSize / 2}
                        r={donutRadius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={donutStroke}
                        strokeDasharray={dasharray}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-xs font-black font-mono text-slate-900 leading-tight">1,248</span>
                  <span className="text-[8px] font-bold text-slate-400">Total</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] font-bold text-slate-600 min-w-0 flex-1">
                {analytics.categories.slice(0, 4).map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-1 truncate">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                      <span className="truncate">{c.name}</span>
                    </span>
                    <span className="font-mono text-slate-800 shrink-0">{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* C. Resolution Time (Overall) */}
          <div className="flex flex-col justify-between px-0 md:px-3 pt-3 md:pt-0 space-y-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-700">Resolution Time (Overall)</span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-black font-mono text-[#0F172A]">
                  {analytics.overallResolutionTime.average}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-600 inline-flex items-center gap-0.5">
                  <ArrowDownRight className="w-2.5 h-2.5" />
                  <span>{analytics.overallResolutionTime.change} vs last 30 days</span>
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              {analytics.overallResolutionTime.distribution.map((bar) => (
                <div key={bar.range} className="space-y-0.5">
                  <div className="flex justify-between text-[9px] font-bold text-slate-600">
                    <span>{bar.range}</span>
                    <span className="font-mono text-slate-800">{bar.percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${bar.percentage}%`, backgroundColor: bar.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. SLA Compliance */}
          <div className="flex flex-col justify-between pl-0 md:pl-3 pt-3 md:pt-0 space-y-2">
            <span className="text-[11px] font-black text-slate-700">SLA Compliance</span>

            <div className="flex items-center justify-center relative py-1">
              <svg width={slaSize} height={slaSize} className="transform -rotate-90">
                <circle
                  cx={slaSize / 2}
                  cy={slaSize / 2}
                  r={slaRadius}
                  fill="transparent"
                  stroke="#F1F5F9"
                  strokeWidth={slaStroke}
                />
                <circle
                  cx={slaSize / 2}
                  cy={slaSize / 2}
                  r={slaRadius}
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth={slaStroke}
                  strokeDasharray={slaCircumference}
                  strokeDashoffset={slaOffset}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-sm font-black font-mono text-[#0F172A]">
                  {analytics.slaCompliance.rate}%
                </span>
                <span className="text-[9px] font-bold text-emerald-600">
                  {analytics.slaCompliance.statusText}
                </span>
              </div>
            </div>

            <div className="flex justify-between text-[10px] font-bold pt-1 border-t border-slate-100">
              <span className="text-slate-500">Within SLA: <strong className="text-slate-800 font-mono">{analytics.slaCompliance.withinSLA}</strong></span>
              <span className="text-slate-500">Breached: <strong className="text-rose-600 font-mono">{analytics.slaCompliance.breached}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. MIDDLE CARD: AGENT PERFORMANCE TABLE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Agent Performance</h3>
          <button
            onClick={onViewAllAgents}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All Agents
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/60 border-b border-slate-100">
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3 text-center">Assigned</th>
                <th className="py-2.5 px-3 text-center">Resolved</th>
                <th className="py-2.5 px-3 text-center">Resolution Time</th>
                <th className="py-2.5 px-3 text-center">SLA Compliance</th>
                <th className="py-2.5 px-3 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold">
              {analytics.agentLeaderboard.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-6 h-6 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-bold text-slate-800 text-xs truncate">{agent.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">{agent.assigned}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-700">{agent.resolved}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-slate-600">{agent.resolutionTime}</td>
                  <td className="py-2.5 px-3 text-center font-mono text-emerald-600 font-bold">{agent.slaCompliance}%</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                    <span className="inline-flex items-center gap-1 justify-end">
                      <span>{agent.rating}</span>
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 3. BOTTOM ROW: 3 ANALYTICS WIDGETS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        {/* A. Top Issue Tags */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-black text-[#0F172A] pb-2 border-b border-slate-100/80">Top Issue Tags</h3>
          <div className="flex flex-wrap gap-1.5 py-2">
            {analytics.issueTags.map((tag) => (
              <span
                key={tag.tag}
                className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${tag.bgColor}`}
              >
                {tag.tag}
              </span>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
            Top tag: <strong>#refund</strong> with 324 queries
          </div>
        </div>

        {/* B. Ticket Status Distribution */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <h3 className="text-xs font-black text-[#0F172A] pb-2 border-b border-slate-100/80">Ticket Status Distribution</h3>
          <div className="flex items-center gap-3 py-1">
            <div className="relative shrink-0 flex items-center justify-center">
              <svg width={donutSize} height={donutSize} className="transform -rotate-90">
                {analytics.statusDistribution.map((st) => {
                  const dasharray = `${(st.percentage / 100) * donutCircumference} ${donutCircumference}`;
                  const offset = -((cumulativeStatus / 100) * donutCircumference);
                  cumulativeStatus += st.percentage;
                  return (
                    <circle
                      key={st.name}
                      cx={donutSize / 2}
                      cy={donutSize / 2}
                      r={donutRadius}
                      fill="transparent"
                      stroke={st.color}
                      strokeWidth={donutStroke}
                      strokeDasharray={dasharray}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-xs font-black font-mono text-slate-900 leading-tight">1,248</span>
                <span className="text-[8px] font-bold text-slate-400">Total</span>
              </div>
            </div>

            <div className="space-y-1 text-[10px] font-bold text-slate-600 min-w-0 flex-1">
              {analytics.statusDistribution.map((st) => (
                <div key={st.name} className="flex items-center justify-between">
                  <span className="flex items-center gap-1 truncate">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                    <span className="truncate">{st.name}</span>
                  </span>
                  <span className="font-mono text-slate-800 shrink-0">{st.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400">
            Open & Assigned = 67.6%
          </div>
        </div>

        {/* C. Customer Satisfaction Trend */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
            <h3 className="text-xs font-black text-[#0F172A]">Customer Satisfaction Trend</h3>
            <button className="flex items-center gap-0.5 text-[9px] font-bold text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded-lg border border-slate-200">
              <span>This Month</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>

          <div className="relative h-20 w-full pt-1">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <line x1="0" y1="20" x2="100" y2="20" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="#F1F5F9" strokeWidth="0.8" strokeDasharray="3 3" />
              <path d={generateCsatPath()} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
              {analytics.csatTrend.map((d, i) => {
                const cx = (i / (analytics.csatTrend.length - 1)) * 100;
                const cy = 100 - ((d.score - 1) / 4) * 85;
                return <circle key={i} cx={cx} cy={cy} r="3" fill="#6356E5" />;
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-100">
            <span>● Satisfaction (★)</span>
            <span className="font-bold text-emerald-600 font-mono">4.6 / 5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
