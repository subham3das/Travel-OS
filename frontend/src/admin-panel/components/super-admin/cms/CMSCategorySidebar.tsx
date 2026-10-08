import React from 'react';
import {
  Image as ImageIcon,
  Megaphone,
  MapPin,
  Building2,
  Compass,
  Sparkles,
  MessageSquarePlus,
  Search,
  ChevronRight,
} from 'lucide-react';
import { CMSCategoryTab } from '../../../types/cmsManagement';

interface CMSCategorySidebarProps {
  activeTab: CMSCategoryTab;
  onTabChange: (tab: CMSCategoryTab) => void;
  counts: {
    banners: number;
    announcements: number;
    destinations: number;
    agencies: number;
    trips: number;
    campaigns: number;
    popups: number;
  };
}

export const CMSCategorySidebar: React.FC<CMSCategorySidebarProps> = ({
  activeTab,
  onTabChange,
  counts,
}) => {
  const items = [
    {
      id: 'banners' as CMSCategoryTab,
      label: 'Hero Banners',
      description: 'Desktop & mobile carousel banners',
      icon: <ImageIcon className="w-4 h-4" />,
      badge: `${counts.banners}`,
      badgeColor: 'bg-purple-100 text-[#6356E5]',
    },
    {
      id: 'announcements' as CMSCategoryTab,
      label: 'Platform Announcements',
      description: 'Global notification ticker & banners',
      icon: <Megaphone className="w-4 h-4" />,
      badge: `${counts.announcements} Live`,
      badgeColor: 'bg-amber-100 text-amber-800 font-black',
    },
    {
      id: 'discovery' as CMSCategoryTab,
      label: 'Discovery Control',
      description: 'Pin overrides & section visibility',
      icon: <Compass className="w-4 h-4" />,
      badge: 'Engine',
      badgeColor: 'bg-purple-100 text-[#583BE8] font-black',
    },
    {
      id: 'destinations' as CMSCategoryTab,
      label: 'Trending Destinations',
      description: 'Homepage featured holiday spots',
      icon: <MapPin className="w-4 h-4" />,
      badge: `${counts.destinations}`,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'agencies' as CMSCategoryTab,
      label: 'Featured Agencies',
      description: 'Promote top verified agency partners',
      icon: <Building2 className="w-4 h-4" />,
      badge: `${counts.agencies}`,
      badgeColor: 'bg-emerald-100 text-emerald-800 font-black',
    },
    {
      id: 'trips' as CMSCategoryTab,
      label: 'Featured Trips',
      description: 'Curated holiday packages & tours',
      icon: <Compass className="w-4 h-4" />,
      badge: `${counts.trips}`,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'campaigns' as CMSCategoryTab,
      label: 'Promotional Campaigns',
      description: 'Seasonal sales & coupon events',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${counts.campaigns}`,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
    },
    {
      id: 'popups' as CMSCategoryTab,
      label: 'Popup Manager',
      description: 'App download & promo modals',
      icon: <MessageSquarePlus className="w-4 h-4" />,
      badge: `${counts.popups}`,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'seo' as CMSCategoryTab,
      label: 'SEO & Meta Tags',
      description: 'Per-page search engine indexing',
      icon: <Search className="w-4 h-4" />,
      badge: 'Active',
      badgeColor: 'bg-emerald-100 text-emerald-700',
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-2xs space-y-1.5 select-none">
      <div className="px-3 py-2 border-b border-slate-100">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
          Content Categories
        </span>
      </div>

      <div className="space-y-1">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between p-2.5 rounded-2xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/20 font-black'
                  : 'hover:bg-slate-50 text-slate-700 font-bold'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs truncate">{item.label}</p>
                  <p
                    className={`text-[9px] truncate font-medium ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 pl-1">
                <span
                  className={`px-1.5 py-0.5 rounded-lg text-[9px] font-bold ${
                    isActive ? 'bg-white/25 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
                <ChevronRight
                  className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-300'}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
