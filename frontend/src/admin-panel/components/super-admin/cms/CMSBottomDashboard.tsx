import React from 'react';
import {
  CalendarClock,
  Sparkles,
  History,
  Clock,
  ArrowUpRight,
  User,
} from 'lucide-react';
import {
  CMSScheduledItem,
  PromotionalCampaignItem,
  CMSRecentChangeItem,
} from '../../../types/cmsManagement';

interface CMSBottomDashboardProps {
  scheduledItems: CMSScheduledItem[];
  campaigns: PromotionalCampaignItem[];
  recentChanges: CMSRecentChangeItem[];
}

export const CMSBottomDashboard: React.FC<CMSBottomDashboardProps> = ({
  scheduledItems,
  campaigns,
  recentChanges,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 select-none">
      {/* ── 1. Scheduled Content ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-black text-[#0F172A]">Scheduled Content</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-100">
            {scheduledItems.length} Upcoming
          </span>
        </div>

        <div className="space-y-2">
          {scheduledItems.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A] truncate max-w-[180px]">
                  {item.title}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                    item.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                <span>{item.category}</span>
                <span>
                  {item.startDate} → {item.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. Active Campaigns ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-black text-[#0F172A]">Active Campaigns</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-100">
            Running Live
          </span>
        </div>

        <div className="space-y-2">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A] truncate max-w-[180px]">
                  {camp.title}
                </span>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded uppercase">
                  {camp.applicableTo}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                {camp.description}
              </p>
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold pt-0.5">
                <span>Ends: {camp.endDate}</span>
                <span className="text-[#6356E5] font-bold">{camp.ctaText}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Recent CMS Changes ── */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#6356E5]" />
            <h3 className="text-xs font-black text-[#0F172A]">Recent CMS Audit</h3>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[10px] font-black border border-purple-100">
            Realtime
          </span>
        </div>

        <div className="space-y-2">
          {recentChanges.map((chg) => (
            <div
              key={chg.id}
              className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0F172A] truncate max-w-[180px]">
                  {chg.action}
                </span>
                <span className="text-[9px] text-slate-400 font-semibold">{chg.timestamp}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium truncate">{chg.target}</p>
              <p className="text-[9px] text-[#6356E5] font-bold flex items-center gap-1 pt-0.5">
                <User className="w-2.5 h-2.5" /> {chg.adminName}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
