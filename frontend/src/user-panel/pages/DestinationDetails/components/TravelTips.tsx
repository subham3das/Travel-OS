import React from 'react';
import { ShieldCheck, Cloud, Shirt, Bus, IndianRupee, HeartPulse } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface TravelTipsProps {
  destination: Destination;
}

export const TravelTips: React.FC<TravelTipsProps> = ({ destination }) => {
  const tipIcons: { [key: string]: React.ReactNode } = {
    Weather: <Cloud className="w-4 h-4 text-sky-500" />,
    Trekking: <Shirt className="w-4 h-4 text-purple-500" />,
    Safety: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
    Transport: <Bus className="w-4 h-4 text-amber-500" />,
    Currency: <IndianRupee className="w-4 h-4 text-[#6356E5]" />,
    Medical: <HeartPulse className="w-4 h-4 text-rose-500" />,
  };

  return (
    <div className="space-y-3">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Travel Tips
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {destination.travelTips.map((t, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
              {tipIcons[t.category] || <ShieldCheck className="w-4 h-4 text-[#6356E5]" />}
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-extrabold text-[#0F172A]">{t.category}</h3>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">{t.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
