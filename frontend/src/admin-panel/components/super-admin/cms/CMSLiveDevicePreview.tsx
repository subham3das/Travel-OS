import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Globe,
  Menu,
  Bell,
  Home,
  Package,
  CalendarCheck,
  Compass,
  User,
} from 'lucide-react';
import { CMSHeroBannerData } from '../../../types/cmsManagement';

interface CMSLiveDevicePreviewProps {
  heroBanner: CMSHeroBannerData;
}

export const CMSLiveDevicePreview: React.FC<CMSLiveDevicePreviewProps> = ({
  heroBanner,
}) => {
  const [device, setDevice] = useState<'Mobile' | 'Tablet' | 'Desktop' | 'Web'>('Mobile');

  return (
    <div className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs flex flex-col justify-between h-full select-none space-y-3.5">
      {/* ── 1. Header & Device Tabs ── */}
      <div className="space-y-2 pb-2 border-b border-slate-100/80">
        <h3 className="text-xs font-black text-[#0F172A]">Live Preview</h3>

        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
          {(['Mobile', 'Tablet', 'Desktop', 'Web'] as const).map((d) => {
            const isSelected = device === d;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex-1 py-1 px-1.5 rounded-xl text-[10px] font-black transition-all cursor-pointer truncate flex items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#6356E5] text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {d === 'Mobile' && <Smartphone className="w-3 h-3" />}
                {d === 'Tablet' && <Tablet className="w-3 h-3" />}
                {d === 'Desktop' && <Laptop className="w-3 h-3" />}
                {d === 'Web' && <Globe className="w-3 h-3" />}
                <span>{d}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Smartphone Mockup Frame ── */}
      <div className="flex-1 flex flex-col items-center justify-center py-1">
        <div className="w-[260px] sm:w-[275px] rounded-[38px] bg-slate-900 p-3 border-4 border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[500px]">
          {/* Status Bar */}
          <div className="flex justify-between items-center text-[10px] text-white font-mono px-3 pt-0.5 pb-1">
            <span>9:41</span>
            <div className="w-12 h-3.5 bg-black rounded-full mx-auto" />
            <span>100%</span>
          </div>

          {/* Screen Content Container */}
          <div className="bg-white rounded-[28px] overflow-hidden flex-1 flex flex-col justify-between text-slate-900">
            {/* Mobile App Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
              <Menu className="w-4 h-4 text-slate-700" />
              <span className="text-xs font-black tracking-tight text-[#0F172A]">Travel OS</span>
              <Bell className="w-3.5 h-3.5 text-slate-700" />
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto space-y-2.5 p-2 scrollbar-none">
              {/* Hero Banner Card */}
              <div className="relative rounded-2xl overflow-hidden h-36 bg-slate-900 text-white p-3 flex flex-col justify-end">
                <img
                  src={heroBanner.imageUrl}
                  alt="Banner preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 space-y-1">
                  <h4 className="text-xs font-black leading-tight line-clamp-2">
                    {heroBanner.title || 'Explore the World with Travel OS 🌍'}
                  </h4>
                  <p className="text-[9px] text-slate-200 line-clamp-1">
                    {heroBanner.subtitle || 'Discover amazing destinations at unbeatable prices'}
                  </p>
                  <button
                    className="mt-1 px-2.5 py-1 rounded-lg text-[9px] font-black text-white shadow-xs cursor-pointer inline-block"
                    style={{ backgroundColor: heroBanner.buttonColor || '#6356E5' }}
                  >
                    {heroBanner.ctaText || 'Explore Packages'}
                  </button>
                </div>
              </div>

              {/* Top Destinations Section */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-900">Top Destinations</span>
                  <span className="text-[8px] font-bold text-[#6356E5]">View All</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <div className="space-y-0.5">
                    <div className="h-14 rounded-xl overflow-hidden bg-slate-100">
                      <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=120" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-black text-slate-800 block truncate">Manali</span>
                    <span className="text-[7px] text-slate-400 block truncate">Himachal</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="h-14 rounded-xl overflow-hidden bg-slate-100">
                      <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=120" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-black text-slate-800 block truncate">Bali</span>
                    <span className="text-[7px] text-slate-400 block truncate">Indonesia</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="h-14 rounded-xl overflow-hidden bg-slate-100">
                      <img src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=120" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[8px] font-black text-slate-800 block truncate">Ladakh</span>
                    <span className="text-[7px] text-slate-400 block truncate">Kashmir</span>
                  </div>
                </div>
              </div>

              {/* Popular Packages Row */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-black text-slate-900">Popular Packages</span>
                <span className="text-[8px] font-bold text-[#6356E5]">View All</span>
              </div>
            </div>

            {/* Bottom Mobile Navigation Bar */}
            <div className="flex items-center justify-around py-1.5 border-t border-slate-100 bg-white text-[7px] font-bold text-slate-400">
              <span className="text-[#6356E5] flex flex-col items-center"><Home className="w-3 h-3" />Home</span>
              <span className="flex flex-col items-center"><Package className="w-3 h-3" />Packages</span>
              <span className="flex flex-col items-center"><CalendarCheck className="w-3 h-3" />Bookings</span>
              <span className="flex flex-col items-center"><Compass className="w-3 h-3" />Trips</span>
              <span className="flex flex-col items-center"><User className="w-3 h-3" />Profile</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
