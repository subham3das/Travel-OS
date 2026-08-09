import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { MOCK_CITIES } from '../../../data/destinations';

interface CitySelectorProps {
  pickupCity: string;
  dropOffCity: string;
  onPickupChange: (city: string) => void;
  onDropOffChange: (city: string) => void;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  pickupCity,
  dropOffCity,
  onPickupChange,
  onDropOffChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
      {/* Pickup City */}
      <div className="space-y-1.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Pickup City <span className="text-rose-500">*</span>
        </label>
        <div className="relative pt-0.5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <MapPin className="w-4 h-4 text-[#583BE8]" />
          </div>

          <select
            value={pickupCity}
            onChange={(e) => onPickupChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-[#0F172A] appearance-none focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer"
          >
            <option value="" disabled>
              Select pickup city...
            </option>
            {MOCK_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Drop-off City */}
      <div className="space-y-1.5">
        <label className="text-sm font-extrabold text-[#0F172A]">
          Drop-off City <span className="text-rose-500">*</span>
        </label>
        <div className="relative pt-0.5">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <MapPin className="w-4 h-4 text-[#583BE8]" />
          </div>

          <select
            value={dropOffCity}
            onChange={(e) => onDropOffChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-[#0F172A] appearance-none focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] cursor-pointer"
          >
            <option value="" disabled>
              Select drop-off city...
            </option>
            {MOCK_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitySelector;
