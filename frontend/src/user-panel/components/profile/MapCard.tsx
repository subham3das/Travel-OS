import React from 'react';
import { MapPin } from 'lucide-react';

export const MapCard: React.FC = () => {
  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-5 sm:p-6 shadow-2xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: Progress Bars */}
        <div className="md:col-span-5 space-y-5">
          {/* India Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-[#0F172A]">India</span>
              <span className="text-slate-500">
                <span className="text-[#0F172A] font-extrabold">12</span> / 28 States
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-[42%]" />
            </div>
          </div>

          {/* World Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-[#0F172A]">World</span>
              <span className="text-slate-500">
                <span className="text-[#0F172A] font-extrabold">2</span> / 195 Countries
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-sky-500 rounded-full w-[10%]" />
            </div>
          </div>
        </div>

        {/* Right Column: Visual Map Graphic with Pin Markers */}
        <div className="md:col-span-7 relative h-36 sm:h-44 rounded-2xl bg-gradient-to-r from-emerald-50/40 via-sky-50/30 to-slate-50 flex items-center justify-center border border-slate-100/80 overflow-hidden">
          {/* World & India map SVG silhouette overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20 text-slate-400 fill-current" viewBox="0 0 1000 500">
            <path d="M150 150 Q 200 100 250 160 T 350 200 T 450 150 T 600 220 T 750 180 T 900 250 T 800 400 T 650 350 T 400 420 T 200 380 Z" />
          </svg>

          {/* Map Pin 1 */}
          <div className="absolute top-1/3 left-1/3 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-xs text-[10px] font-bold text-slate-700 animate-bounce">
            <MapPin className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            <span>India (12)</span>
          </div>

          {/* Map Pin 2 */}
          <div className="absolute bottom-1/3 right-1/4 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-xs text-[10px] font-bold text-slate-700">
            <MapPin className="w-3 h-3 text-sky-500 fill-sky-500" />
            <span>Bali, IN</span>
          </div>
        </div>
      </div>
    </div>
  );
};
