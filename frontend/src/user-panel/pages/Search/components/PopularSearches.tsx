import React from 'react';
import { Gem, Calendar, CloudRain, Snowflake, Users, Compass } from 'lucide-react';

interface PopularSearchesProps {
  onSelect: (term: string) => void;
}

export const PopularSearches: React.FC<PopularSearchesProps> = ({ onSelect }) => {
  const items = [
    { label: 'Hidden Gems', icon: <Gem className="w-4 h-4 text-purple-600" /> },
    { label: 'Weekend Trips', icon: <Calendar className="w-4 h-4 text-emerald-600" /> },
    { label: 'Monsoon Destinations', icon: <CloudRain className="w-4 h-4 text-sky-600" /> },
    { label: 'Snow Destinations', icon: <Snowflake className="w-4 h-4 text-[#6356E5]" /> },
    { label: 'Family Trips', icon: <Users className="w-4 h-4 text-amber-600" /> },
    { label: 'Adventure Trips', icon: <Compass className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
        Popular Searches
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            onClick={() => onSelect(item.label)}
            className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-[#6356E5]/40 transition-all cursor-pointer group"
          >
            <div className="p-1.5 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
              {item.icon}
            </div>
            <span className="text-xs font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
