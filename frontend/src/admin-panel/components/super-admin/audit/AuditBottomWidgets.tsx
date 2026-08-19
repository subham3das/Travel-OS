import React from 'react';
import {
  ShieldAlert,
  Flame,
  ArrowUpRight,
  MapPin,
  Code,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  EventDistributionItem,
  TopActiveAdminItem,
  SecurityAlertItem,
} from '../../../types/auditLogsManagement';

interface AuditBottomWidgetsProps {
  distribution: EventDistributionItem[];
  heatmapMatrix: number[][];
  topAdmins: TopActiveAdminItem[];
  securityAlerts: SecurityAlertItem[];
  onViewAllDistribution?: () => void;
  onViewFullHeatmap?: () => void;
  onViewAllAdmins?: () => void;
  onViewAllAlerts?: () => void;
  onInvestigateAlert?: (alert: SecurityAlertItem) => void;
}

export const AuditBottomWidgets: React.FC<AuditBottomWidgetsProps> = ({
  distribution,
  heatmapMatrix,
  topAdmins,
  securityAlerts,
  onViewAllDistribution,
  onViewFullHeatmap,
  onViewAllAdmins,
  onViewAllAlerts,
  onInvestigateAlert,
}) => {
  // Donut geometry for Event Distribution
  const donutSize = 110;
  const donutStroke = 15;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  let cumulativePercent = 0;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const heatmapHours = ['12 AM', '4 AM', '8 AM', '12 PM', '4 PM', '8 PM', '12 AM'];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'shield':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />;
      case 'alert':
        return <Flame className="w-3.5 h-3.5 text-orange-500" />;
      case 'escalation':
        return <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />;
      case 'location':
        return <MapPin className="w-3.5 h-3.5 text-amber-500" />;
      case 'api':
      default:
        return <Code className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  const getAlertSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'Critical':
        return 'bg-rose-50 text-rose-600 border border-rose-200';
      case 'High':
        return 'bg-orange-50 text-orange-600 border border-orange-200';
      case 'Medium':
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: EVENT DISTRIBUTION ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Event Distribution</h3>
          <button
            onClick={onViewAllDistribution}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 py-1">
          {/* Donut Chart */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              {distribution.map((item) => {
                const strokeDasharray = `${(item.percentage / 100) * donutCircumference} ${donutCircumference}`;
                const strokeDashoffset = -((cumulativePercent / 100) * donutCircumference);
                cumulativePercent += item.percentage;

                return (
                  <circle
                    key={item.name}
                    cx={donutSize / 2}
                    cy={donutSize / 2}
                    r={donutRadius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={donutStroke}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-black font-mono text-slate-900 leading-tight">18,742</span>
              <span className="text-[8px] font-bold text-slate-400">Total Events</span>
            </div>
          </div>

          {/* Breakdown Legend */}
          <div className="space-y-1 min-w-0 flex-1">
            {distribution.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1 text-[10px] truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="truncate">{d.name}</span>
                </span>
                <span className="font-mono font-black text-slate-800 text-[10px] shrink-0">
                  {d.count.toLocaleString()} ({d.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Bookings & Payments generate 35.5% of events
        </div>
      </div>

      {/* ── CARD 2: LOGIN ACTIVITY HEATMAP ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Login Activity Heatmap</h3>
          <button
            onClick={onViewFullHeatmap}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View Full Report
          </button>
        </div>

        <div className="space-y-1 py-1">
          {days.map((day, dIdx) => (
            <div key={day} className="flex items-center gap-1">
              <span className="w-5 text-[8px] font-mono font-bold text-slate-400">{day}</span>
              <div className="grid grid-cols-7 gap-1 flex-1">
                {heatmapMatrix[dIdx].map((val, hIdx) => (
                  <div
                    key={hIdx}
                    className="h-2.5 rounded-sm"
                    style={{
                      backgroundColor: `rgba(99, 86, 229, ${val})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="flex justify-between pl-6 text-[8px] font-mono text-slate-400 pt-0.5">
            <span>12 AM</span>
            <span>8 AM</span>
            <span>4 PM</span>
            <span>12 AM</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[9px] font-semibold text-slate-400">
          <span>Low Activity</span>
          <div className="w-20 h-1.5 rounded-full bg-gradient-to-r from-purple-100 to-[#6356E5]" />
          <span>High Activity</span>
        </div>
      </div>

      {/* ── CARD 3: TOP ACTIVE ADMINISTRATORS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Top Active Administrators</h3>
          <button
            onClick={onViewAllAdmins}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1">
          {topAdmins.map((adm, idx) => (
            <div key={adm.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono font-bold text-slate-400 text-[10px] w-3">
                    {idx + 1}
                  </span>
                  <img
                    src={adm.avatar}
                    alt={adm.name}
                    className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <span className="font-bold text-slate-800 text-[11px] truncate">
                    {adm.name}
                  </span>
                </div>
                <span className="font-mono font-black text-slate-700 text-[10px] shrink-0">
                  {adm.actionCount.toLocaleString()} actions
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden pl-4">
                <div
                  className="h-full rounded-full bg-[#6356E5]"
                  style={{ width: `${adm.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Top 5 admins account for 62.4% of total actions
        </div>
      </div>

      {/* ── CARD 4: SECURITY ALERTS ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Security Alerts</h3>
          <button
            onClick={onViewAllAlerts}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-1.5 py-1">
          {securityAlerts.map((alt) => (
            <div
              key={alt.id}
              onClick={() => onInvestigateAlert && onInvestigateAlert(alt)}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="shrink-0">{getAlertIcon(alt.iconType)}</div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 text-[10px] truncate">{alt.title}</p>
                  <p className="text-[8px] font-mono text-slate-400">{alt.timeAgo}</p>
                </div>
              </div>

              <span
                className={`px-1.5 py-0.2 rounded-md text-[8px] font-black shrink-0 ${getAlertSeverityBadge(
                  alt.severity
                )}`}
              >
                {alt.severity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Real-time threat detection active
        </div>
      </div>
    </div>
  );
};
