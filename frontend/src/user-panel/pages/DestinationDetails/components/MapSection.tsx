import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Building2, Utensils, Award } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface MapSectionProps {
  destination: Destination;
}

export const MapSection: React.FC<MapSectionProps> = ({ destination }) => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { label: 'All', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Attractions', icon: <MapPin className="w-3.5 h-3.5 text-purple-600" /> },
    { label: 'Hotels', icon: <Building2 className="w-3.5 h-3.5 text-sky-600" /> },
    { label: 'Restaurants', icon: <Utensils className="w-3.5 h-3.5 text-amber-600" /> },
    { label: 'Agencies', icon: <Award className="w-3.5 h-3.5 text-emerald-600" /> },
  ];

  const handleOpenGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name)}`,
      '_blank'
    );
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          Explore {destination.name} on Map
        </h2>
        <button
          onClick={handleOpenGoogleMaps}
          className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Open Google Maps</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {filters.map((f) => {
          const isActive = activeFilter === f.label;
          return (
            <button
              key={f.label}
              onClick={() => setActiveFilter(f.label)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#6356E5] text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100'
              }`}
            >
              {f.icon}
              <span>{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Illustrated Map Canvas Card */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-emerald-50/60 border border-emerald-100 flex items-center justify-center group cursor-pointer" onClick={handleOpenGoogleMaps}>
        {/* Map Background Pattern / Image */}
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
          alt="Map graphic"
          className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-emerald-900/10" />

        {/* Floating Custom Map Pins */}
        <div className="absolute top-1/3 left-1/4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-purple-100 flex items-center gap-1.5 animate-bounce">
          <MapPin className="w-4 h-4 fill-purple-600 text-white" />
          <span className="text-xs font-extrabold text-[#0F172A]">Cherrapunji</span>
        </div>

        <div className="absolute bottom-1/3 right-1/4 bg-white px-3 py-1.5 rounded-full shadow-lg border border-emerald-100 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 fill-emerald-600 text-white" />
          <span className="text-xs font-extrabold text-[#0F172A]">Mawsynram</span>
        </div>

        {/* Current Location Compass Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenGoogleMaps();
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-[#6356E5] flex items-center justify-center shadow-lg border border-slate-100 hover:bg-slate-50 cursor-pointer"
          title="Recenter map"
        >
          <Navigation className="w-5 h-5 fill-current" />
        </button>
      </div>
    </div>
  );
};
