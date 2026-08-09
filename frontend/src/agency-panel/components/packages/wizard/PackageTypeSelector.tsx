import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Tag,
  Compass,
  Users,
  Heart,
  Backpack,
  Landmark,
  Footprints,
  Gem,
  Sun,
  Check,
} from 'lucide-react';
import { PackageType } from '../../../types/packageWizard';

interface PackageTypeSelectorProps {
  value: PackageType | null;
  onChange: (type: PackageType) => void;
}

const PACKAGE_TYPES_CONFIG: { type: PackageType; icon: React.ReactNode }[] = [
  { type: 'Adventure', icon: <Compass className="w-4 h-4" /> },
  { type: 'Family', icon: <Users className="w-4 h-4" /> },
  { type: 'Honeymoon', icon: <Heart className="w-4 h-4" /> },
  { type: 'Backpacking', icon: <Backpack className="w-4 h-4" /> },
  { type: 'Religious', icon: <Landmark className="w-4 h-4" /> },
  { type: 'Wildlife', icon: <Footprints className="w-4 h-4" /> },
  { type: 'Luxury', icon: <Gem className="w-4 h-4" /> },
  { type: 'Weekend Getaway', icon: <Sun className="w-4 h-4" /> },
];

export const PackageTypeSelector: React.FC<PackageTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedConfig = PACKAGE_TYPES_CONFIG.find((item) => item.type === value);

  return (
    <div className="space-y-1.5 select-none" ref={dropdownRef}>
      <label className="text-sm font-extrabold text-[#0F172A]">Package Type</label>
      <p className="text-xs font-semibold text-slate-400">Select the category that best describes your package</p>

      <div className="relative pt-1">
        {/* Custom Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full px-4 py-3.5 rounded-2xl bg-white border flex items-center justify-between text-left transition-all duration-200 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.03)] ${
            isOpen
              ? 'border-[#583BE8] ring-2 ring-[#583BE8]/10'
              : 'border-slate-200/80 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
              {selectedConfig ? selectedConfig.icon : <Tag className="w-4 h-4" />}
            </div>
            <span
              className={`text-sm font-bold truncate ${
                value ? 'text-[#0F172A]' : 'text-slate-400 font-semibold'
              }`}
            >
              {value || 'Select package type...'}
            </span>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#583BE8]' : ''
            }`}
          />
        </button>

        {/* Custom Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full z-40 bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2 max-h-64 overflow-y-auto scrollbar-none"
            >
              {PACKAGE_TYPES_CONFIG.map(({ type, icon }) => {
                const isSelected = value === type;

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      onChange(type);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-purple-50/70 text-[#583BE8] font-extrabold'
                        : 'text-slate-700 font-bold hover:bg-slate-50 hover:text-[#583BE8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#583BE8] text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {icon}
                      </div>
                      <span className="text-xs">{type}</span>
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-[#583BE8] shrink-0" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PackageTypeSelector;
