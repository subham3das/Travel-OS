import React from 'react';
import {
  Image as ImageIcon,
  Megaphone,
  MapPin,
  Building2,
  Compass,
  Sparkles,
  MessageSquarePlus,
  Layers,
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
    sections: number;
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
      badge: '⭐ Live',
      badgeColor: 'bg-amber-100 text-amber-800 font-black',
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
      description: 'Promote top certified agency partners',
      icon: <Building2 className="w-4 h-4" />,
      badge: '⭐ Top 8',
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
      description: 'Seasonal sales & promotional events',
      icon: <Sparkles className="w-4 h-4" />,
      badge: `${counts.campaigns} Active`,
      badgeColor: 'bg-rose-100 text-rose-700 font-bold',
    },
    {
      id: 'popups' as CMSCategoryTab,
      label: 'Popup Manager',
      description: 'App download & lead capture modals',
      icon: <MessageSquarePlus className="w-4 h-4" />,
      badge: `${counts.popups}`,
      badgeColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'sections' as CMSCategoryTab,
      label: 'Homepage Sections',
      description: 'Reorder & enable/disable sections',
      icon: <Layers className="w-4 h-4" />,
      badge: `${counts.sections} Total`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'seo' as CMSCategoryTab,
      label: 'SEO & Meta Tags',
      description: 'Social graph cards & search indexing',
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
                  className={`px-1.5 py-0.5 rounded-lg text-[9px] ${
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
