import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, X } from 'lucide-react';
import { MAJOR_CITIES } from '../../../data/destinations';

interface CitySelectorProps {
  pickupCity: string;
  dropOffCity: string;
  onPickupChange: (city: string) => void;
  onDropOffChange: (city: string) => void;
}

interface SearchableCityInputProps {
  label: string;
  value: string;
  onChange: (city: string) => void;
  placeholder?: string;
}

const SearchableCityInput: React.FC<SearchableCityInputProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Type city name...',
}) => {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Filtered suggestions
  const filteredCities = query.trim()
    ? MAJOR_CITIES.filter((city) =>
        city.toLowerCase().includes(query.trim().toLowerCase())
      )
    : MAJOR_CITIES;

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        // If query was typed, commit it
        if (query.trim() && query !== value) {
          onChange(query.trim());
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query, value, onChange]);

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setHighlightedIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCities.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCities.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredCities[highlightedIndex]) {
        handleSelect(filteredCities[highlightedIndex]);
      } else if (query.trim()) {
        handleSelect(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="text-sm font-extrabold text-[#0F172A]">
        {label} <span className="text-rose-500">*</span>
      </label>
      <div className="relative pt-0.5">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          <MapPin className="w-4 h-4 text-[#583BE8]" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200/80 text-xs font-bold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:ring-2 focus:ring-[#583BE8]/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] transition-all"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              onChange('');
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown className="w-4 h-4" />
          </div>
        )}

        {/* Autocomplete Dropdown */}
        {isOpen && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden max-h-56 overflow-y-auto divide-y divide-slate-50 animate-in fade-in zoom-in-95 duration-100">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, idx) => {
                const isSelected = city.toLowerCase() === value.toLowerCase();
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={city}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelect(city)}
                    className={`px-4 py-2.5 text-xs font-bold flex items-center justify-between cursor-pointer transition-colors ${
                      isHighlighted
                        ? 'bg-[#583BE8]/10 text-[#583BE8]'
                        : isSelected
                        ? 'bg-purple-50/50 text-[#583BE8]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{city}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#583BE8]" />}
                  </div>
                );
              })
            ) : (
              <div
                onClick={() => handleSelect(query.trim())}
                className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-[#583BE8]/10 hover:text-[#583BE8] cursor-pointer flex items-center justify-between"
              >
                <span>Use "{query.trim()}" as custom city</span>
                <span className="text-[10px] font-extrabold text-[#583BE8] uppercase bg-purple-100 px-2 py-0.5 rounded-md">
                  Press Enter
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const CitySelector: React.FC<CitySelectorProps> = ({
  pickupCity,
  dropOffCity,
  onPickupChange,
  onDropOffChange,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
      {/* Pickup City */}
      <SearchableCityInput
        label="Pickup City"
        value={pickupCity}
        onChange={onPickupChange}
        placeholder="Type pickup city (e.g. Delhi)..."
      />

      {/* Drop-off City */}
      <SearchableCityInput
        label="Drop-off City"
        value={dropOffCity}
        onChange={onDropOffChange}
        placeholder="Type drop-off city (e.g. Leh)..."
      />
    </div>
  );
};

export default CitySelector;
