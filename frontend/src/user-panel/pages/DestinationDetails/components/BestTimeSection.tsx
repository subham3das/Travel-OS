import React from 'react';
import { Destination } from '../../../data/destinations';

interface BestTimeSectionProps {
  destination: Destination;
}

export const BestTimeSection: React.FC<BestTimeSectionProps> = ({ destination }) => {
  const { summer, winter, monsoon } = destination.bestTime;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 flex-1">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Best Time to Visit
      </h2>

      <div className="grid grid-cols-3 gap-2">
        {/* Summer */}
        <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100/80 space-y-1 text-center">
          <p className="text-[10px] font-extrabold text-emerald-600">{summer.months}</p>
          <p className="text-xs font-black text-emerald-950">Summer</p>
          <p className="text-[10px] font-semibold text-emerald-700">{summer.temp}</p>
        </div>

        {/* Winter */}
        <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-100/80 space-y-1 text-center">
          <p className="text-[10px] font-extrabold text-sky-600">{winter.months}</p>
          <p className="text-xs font-black text-sky-950">Winter</p>
          <p className="text-[10px] font-semibold text-sky-700">{winter.temp}</p>
        </div>

        {/* Monsoon */}
        <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-100/80 space-y-1 text-center">
          <p className="text-[10px] font-extrabold text-purple-600">{monsoon.months}</p>
          <p className="text-xs font-black text-purple-950">Monsoon</p>
          <p className="text-[10px] font-semibold text-purple-700">{monsoon.temp}</p>
        </div>
      </div>
    </div>
  );
};
