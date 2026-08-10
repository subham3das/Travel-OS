import React from 'react';
import { CloudSun, Droplets, Wind, ChevronRight } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface WeatherCardProps {
  destination: Destination;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ destination }) => {
  const { weather } = destination;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 flex-1">
      <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
        Current Weather
      </h2>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CloudSun className="w-10 h-10 text-amber-500 shrink-0" />
          <div>
            <p className="text-xl font-black text-[#0F172A] leading-none">{weather.temp}</p>
            <p className="text-xs font-semibold text-slate-500">{weather.condition}</p>
          </div>
        </div>

        <div className="space-y-1 text-right text-xs font-semibold text-slate-600">
          <p className="flex items-center justify-end gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-sky-500" />
            <span>Humidity {weather.humidity}</span>
          </p>
          <p className="flex items-center justify-end gap-1.5">
            <Wind className="w-3.5 h-3.5 text-slate-400" />
            <span>Wind {weather.wind}</span>
          </p>
        </div>
      </div>

      <button
        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(destination.name + ' weather forecast')}`, '_blank')}
        className="text-xs font-extrabold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer pt-1"
      >
        <span>View full forecast</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
