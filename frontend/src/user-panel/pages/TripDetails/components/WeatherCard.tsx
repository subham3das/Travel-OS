import React from 'react';
import { CloudSun, Cloud, ChevronRight } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface WeatherCardProps {
  trip: Trip;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ trip }) => {
  const { weather } = trip;

  return (
    <div
      onClick={() => alert(`Weather forecast for ${weather.location}: Pleasant 22°C with light mountain mist`)}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <CloudSun className="w-5 h-5" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <h3 className="text-sm font-extrabold text-[#0F172A] truncate">Weather Forecast</h3>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {weather.location}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-base font-black text-[#0F172A] leading-none">{weather.temp}</p>
          <p className="text-[11px] font-semibold text-slate-400 pt-0.5">{weather.condition}</p>
        </div>
        <Cloud className="w-5 h-5 text-slate-300 shrink-0" />
        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0" />
      </div>
    </div>
  );
};
