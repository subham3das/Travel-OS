import React from 'react';
import { Footprints, Tent, Ship, Mountain, Waves } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface ThingsToDoProps {
  destination: Destination;
}

export const ThingsToDo: React.FC<ThingsToDoProps> = ({ destination }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-4 h-4 text-[#6356E5]" />;
      case 'Tent': return <Tent className="w-4 h-4 text-amber-500" />;
      case 'Ship': return <Ship className="w-4 h-4 text-sky-500" />;
      case 'Mountain': return <Mountain className="w-4 h-4 text-purple-500" />;
      default: return <Waves className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Things to Do
        </h2>
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name + ' things to do activities')}`, '_blank')}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {destination.thingsToDo.map((act) => (
          <div
            key={act.id}
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.title + ' ' + destination.name)}`, '_blank')}
            className="relative w-36 sm:w-44 h-24 sm:h-28 rounded-2xl overflow-hidden shadow-2xs group cursor-pointer shrink-0 border border-slate-100"
          >
            <img
              src={act.image}
              alt={act.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-white">
              <div className="p-1 rounded-lg bg-white/20 backdrop-blur-md">
                {getIcon(act.iconName)}
              </div>
              <span className="text-xs font-extrabold text-white truncate">{act.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
