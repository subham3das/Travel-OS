import React, { useState, useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../../../data/destinations';

interface DestinationSelectorProps {
  value: string;
  onChange: (val: string) => void;
}

export const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = POPULAR_DESTINATIONS.filter((d) =>
    d.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="space-y-1.5 select-none relative" ref={containerRef}>
      <label className="text-sm font-extrabold text-[#0F172A]">
        Primary Destination <span className="text-rose-500">*</span>
      </label>
      <p className="text-xs font-semibold text-slate-400">Select the main destination of your package</p>

      <div className="relative pt-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#583BE8] pointer-events-none">
          <MapPin className="w-4 h-4" />
        </div>

        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search destination... e.g. Leh, Ladakh"
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-slate-200/80 text-sm font-bold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8] shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-colors"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Dropdown Suggestions */}
        {isOpen && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-40 bg-white rounded-2xl border border-slate-100 shadow-xl py-2 mt-1 max-h-48 overflow-y-auto">
            {filtered.map((dest) => (
              <button
                key={dest}
                type="button"
                onClick={() => {
                  onChange(dest);
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{dest}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationSelector;
