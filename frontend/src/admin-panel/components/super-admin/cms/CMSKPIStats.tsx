import React from 'react';
import {
  FileCheck2,
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  CalendarClock,
  HardDrive,
} from 'lucide-react';
import { CMSKPIStats as CMSKPIStatsType } from '../../../types/cmsManagement';

interface CMSKPIStatsProps {
  stats: CMSKPIStatsType;
}

export const CMSKPIStats: React.FC<CMSKPIStatsProps> = ({ stats }) => {
  const cards = [
    {
      id: 'published',
      label: stats.publishedContent.label,
      value: stats.publishedContent.value,
      growth: stats.publishedContent.growth,
      icon: <FileCheck2 className="w-5 h-5" />,
      colorClasses: 'bg-purple-50 text-[#6356E5] border-purple-100',
    },
    {
      id: 'campaigns',
      label: stats.activeCampaigns.label,
      value: stats.activeCampaigns.value,
      growth: stats.activeCampaigns.growth,
      icon: <Sparkles className="w-5 h-5" />,
      colorClasses: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'announcements',
      label: stats.liveAnnouncements.label,
      value: stats.liveAnnouncements.value,
      growth: stats.liveAnnouncements.growth,
      icon: <Megaphone className="w-5 h-5" />,
      colorClasses: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 'banners',
      label: stats.activeBanners.label,
      value: stats.activeBanners.value,
      growth: stats.activeBanners.growth,
      icon: <ImageIcon className="w-5 h-5" />,
      colorClasses: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'scheduled',
      label: stats.scheduledItems.label,
      value: stats.scheduledItems.value,
      growth: stats.scheduledItems.growth,
      icon: <CalendarClock className="w-5 h-5" />,
      colorClasses: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    },
    {
      id: 'storage',
      label: stats.mediaStorage.label,
      value: stats.mediaStorage.value,
      growth: stats.mediaStorage.growth,
      icon: <HardDrive className="w-5 h-5" />,
      colorClasses: 'bg-slate-100 text-slate-700 border-slate-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 select-none">
      {cards.map((c) => (
        <div
          key={c.id}
          className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between gap-3 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-2xs ${c.colorClasses}`}
            >
              {c.icon}
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100">
              {c.growth}
            </span>
          </div>

          <div>
            <span className="text-2xl font-black text-[#0F172A] tracking-tight block">
              {c.value}
            </span>
            <span className="text-[11px] font-bold text-slate-400 block truncate mt-0.5">
              {c.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
