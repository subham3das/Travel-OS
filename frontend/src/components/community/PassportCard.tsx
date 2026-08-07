import React from 'react';
import { Plane, Mountain, Globe2, BookOpen, ShieldCheck } from 'lucide-react';

export const PassportCard: React.FC = () => {
  return (
    <div className="w-full rounded-3xl bg-gradient-to-r from-rose-50/80 via-pink-50/70 to-amber-50/80 p-5 sm:p-6 border border-rose-100/80 shadow-2xs">
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 items-center">
        {/* Ring Level Badge */}
        <div className="col-span-2 sm:col-span-2 flex items-center gap-3">
          <div className="relative w-16 h-16 rounded-full border-4 border-[#FF4D6D] flex items-center justify-center p-1 bg-white shadow-xs">
            <div className="text-center">
              <span className="text-[10px] font-bold text-slate-400 block leading-none">Level</span>
              <span className="text-base font-extrabold text-[#0F172A] leading-none">12</span>
            </div>
          </div>
          <div>
            <h4 className="text-base font-extrabold text-[#0F172A] tracking-tight">Explorer</h4>
            <p className="text-xs font-semibold text-[#FF4D6D]">3,450 XP Points</p>
          </div>
        </div>

        {/* Stat 1: Trips */}
        <div className="text-center space-y-1">
          <Plane className="w-5 h-5 text-slate-600 mx-auto" />
          <h5 className="text-lg font-extrabold text-[#0F172A] leading-none">24</h5>
          <p className="text-[10px] font-semibold text-slate-400">Trips</p>
        </div>

        {/* Stat 2: States */}
        <div className="text-center space-y-1">
          <Mountain className="w-5 h-5 text-slate-600 mx-auto" />
          <h5 className="text-lg font-extrabold text-[#0F172A] leading-none">15</h5>
          <p className="text-[10px] font-semibold text-slate-400">States</p>
        </div>

        {/* Stat 3: Countries */}
        <div className="text-center space-y-1">
          <Globe2 className="w-5 h-5 text-slate-600 mx-auto" />
          <h5 className="text-lg font-extrabold text-[#0F172A] leading-none">2</h5>
          <p className="text-[10px] font-semibold text-slate-400">Countries</p>
        </div>

        {/* Stat 4: Stories */}
        <div className="text-center space-y-1">
          <BookOpen className="w-5 h-5 text-slate-600 mx-auto" />
          <h5 className="text-lg font-extrabold text-[#0F172A] leading-none">128</h5>
          <p className="text-[10px] font-semibold text-slate-400">Stories</p>
        </div>
      </div>
    </div>
  );
};
