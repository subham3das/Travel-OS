import React from 'react';
import {
  Sparkles,
  Megaphone,
  Image as ImageIcon,
  MessageSquarePlus,
  Tag,
  Compass,
} from 'lucide-react';
import { CMSKPIStats as CMSKPIStatsType } from '../../../types/cmsManagement';

interface CMSKPIStatsProps {
  stats: CMSKPIStatsType;
}

export const CMSKPIStats: React.FC<CMSKPIStatsProps> = ({ stats }) => {
  const cards = [
    {
      id: 'banners',
      label: stats.publishedBanners?.label || 'Active Banners',
      value: stats.publishedBanners?.value ?? 0,
      subtitle: stats.publishedBanners?.subtitle || 'Live on Hero',
      icon: <ImageIcon className="w-5 h-5" />,
      colorClasses: 'bg-purple-50 text-[#6356E5] border-purple-100',
    },
    {
      id: 'announcements',
      label: stats.liveAnnouncements?.label || 'Live Broadcasts',
      value: stats.liveAnnouncements?.value ?? 0,
      subtitle: stats.liveAnnouncements?.subtitle || 'Platform Alert',
      icon: <Megaphone className="w-5 h-5" />,
      colorClasses: 'bg-amber-50 text-amber-600 border-amber-100',
    },
    {
      id: 'campaigns',
      label: stats.publishedCampaigns?.label || 'Active Campaigns',
      value: stats.publishedCampaigns?.value ?? 0,
      subtitle: stats.publishedCampaigns?.subtitle || 'Festival & Sales',
      icon: <Sparkles className="w-5 h-5" />,
      colorClasses: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      id: 'popups',
      label: stats.publishedPopups?.label || 'Active Popups',
      value: stats.publishedPopups?.value ?? 0,
      subtitle: stats.publishedPopups?.subtitle || 'Modal Trigger',
      icon: <MessageSquarePlus className="w-5 h-5" />,
      colorClasses: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      id: 'coupons',
      label: stats.activeCoupons?.label || 'Coupons in System',
      value: stats.activeCoupons?.value ?? 0,
      subtitle: stats.activeCoupons?.subtitle || 'Promotional',
      icon: <Tag className="w-5 h-5" />,
      colorClasses: 'bg-rose-50 text-rose-600 border-rose-100',
    },
    {
      id: 'showcases',
      label: stats.totalShowcases?.label || 'Featured Showcases',
      value: stats.totalShowcases?.value ?? 0,
      subtitle: stats.totalShowcases?.subtitle || 'Curated',
      icon: <Compass className="w-5 h-5" />,
      colorClasses: 'bg-indigo-50 text-indigo-600 border-indigo-100',
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
              Live DB
            </span>
          </div>

          <div>
            <span className="text-2xl font-black text-[#0F172A] tracking-tight block">
              {c.value}
            </span>
            <span className="text-[11px] font-bold text-slate-700 block truncate mt-0.5">
              {c.label}
            </span>
            <span className="text-[9px] font-medium text-slate-400 block truncate">
              {c.subtitle}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
