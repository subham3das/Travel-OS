import React from 'react';
import {
  Check,
  AlertTriangle,
  HardDrive,
  CheckCircle2,
} from 'lucide-react';
import {
  IntegrationHealthItem,
  ApiUsagePoint,
  BackupTimelineItem,
  FeatureUsageItem,
} from '../../../types/settingsManagement';

interface SettingsBottomWidgetsProps {
  integrationHealth: IntegrationHealthItem[];
  apiUsage: ApiUsagePoint[];
  backupTimeline: BackupTimelineItem[];
  featureUsage: FeatureUsageItem[];
  onViewAllIntegrations?: () => void;
  onViewAllApiUsage?: () => void;
  onViewAllBackups?: () => void;
  onViewAllFeatures?: () => void;
}

export const SettingsBottomWidgets: React.FC<SettingsBottomWidgetsProps> = ({
  integrationHealth,
  apiUsage,
  backupTimeline,
  featureUsage,
  onViewAllIntegrations,
  onViewAllApiUsage,
  onViewAllBackups,
  onViewAllFeatures,
}) => {
  // Donut geometry for Integration Health
  const donutSize = 100;
  const donutStroke = 12;
  const donutRadius = (donutSize - donutStroke) / 2;
  const donutCircumference = 2 * Math.PI * donutRadius;
  const healthPercent = 87;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch select-none">
      {/* ── CARD 1: INTEGRATION HEALTH ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Integration Health</h3>
          <button
            onClick={onViewAllIntegrations}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 py-1">
          {/* Donut */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg width={donutSize} height={donutSize} className="transform -rotate-90">
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={donutRadius}
                fill="transparent"
                stroke="#F1F5F9"
                strokeWidth={donutStroke}
              />
              <circle
                cx={donutSize / 2}
                cy={donutSize / 2}
                r={donutRadius}
                fill="transparent"
                stroke="#10B981"
                strokeWidth={donutStroke}
                strokeDasharray={donutCircumference}
                strokeDashoffset={donutCircumference * (1 - healthPercent / 100)}
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-xs font-black font-mono text-slate-900 leading-tight">
                {healthPercent}%
              </span>
              <span className="text-[8px] font-bold text-emerald-600">Healthy</span>
            </div>
          </div>

          {/* List */}
          <div className="space-y-1 min-w-0 flex-1">
            {integrationHealth.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 font-bold flex items-center gap-1.5 text-[10px] truncate">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="truncate">{item.name}</span>
                </span>

                {item.status === 'warning' ? (
                  <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
                ) : (
                  <Check className="w-3 h-3 text-emerald-500 stroke-[3] shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          12 of 12 active integrations verified
        </div>
      </div>

      {/* ── CARD 2: API USAGE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">API Usage</h3>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[9px] font-bold text-[#6356E5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6356E5]" />
              <span>Requests</span>
            </span>
            <button
              onClick={onViewAllApiUsage}
              className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="py-2 space-y-1">
          <div className="relative h-18 w-full flex items-end">
            <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible" fill="none">
              <path
                d="M 0,60 Q 40,65 80,45 T 160,50 T 240,30 T 280,10"
                fill="none"
                stroke="#6356E5"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0,60 Q 40,65 80,45 T 160,50 T 240,30 T 280,10 L 280,80 L 0,80 Z"
                fill="url(#apiGradient)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="apiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6356E5" />
                  <stop offset="100%" stopColor="#6356E5" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle cx="240" cy="30" r="3.5" fill="#6356E5" />
            </svg>

            <div className="absolute top-0 right-10 px-1.5 py-0.5 rounded-md bg-[#6356E5] text-white text-[8px] font-mono font-black shadow-xs">
              24,392
            </div>
          </div>

          <div className="flex justify-between text-[8px] font-mono text-slate-400 pt-1">
            <span>May 12</span>
            <span>May 14</span>
            <span>May 16</span>
            <span>May 18</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Peak traffic handled with zero latency degradation
        </div>
      </div>

      {/* ── CARD 3: BACKUP TIMELINE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Backup Timeline</h3>
          <button
            onClick={onViewAllBackups}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1">
          {backupTimeline.map((bk) => (
            <div key={bk.id} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-lg bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0">
                  <HardDrive className="w-3 h-3" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-slate-800 text-[10px] block truncate">
                    {bk.date} - {bk.time}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block truncate">
                    {bk.type}
                  </span>
                </div>
              </div>

              <span className="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-200 flex items-center gap-0.5 shrink-0">
                <Check className="w-2 h-2 stroke-[3]" />
                <span>{bk.status}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Daily automated snapshots enabled
        </div>
      </div>

      {/* ── CARD 4: FEATURE USAGE ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
          <h3 className="text-xs font-black text-[#0F172A]">Feature Usage</h3>
          <button
            onClick={onViewAllFeatures}
            className="text-[10px] font-bold text-[#6356E5] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>

        <div className="space-y-2 py-1">
          {featureUsage.map((f) => (
            <div key={f.name} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 text-[10px]">{f.name}</span>
                <span className="font-mono font-black text-slate-700 text-[10px]">
                  {f.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#6356E5]"
                  style={{ width: `${f.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-400 text-center">
          Bookings & Payments lead user adoption
        </div>
      </div>
    </div>
  );
};
