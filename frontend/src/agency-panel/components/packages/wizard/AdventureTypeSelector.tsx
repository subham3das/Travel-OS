import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Compass,
  Check,
  Search,
} from 'lucide-react';
import { ADVENTURE_TYPES, AdventureType } from '../../../types/packageWizard';

interface AdventureTypeSelectorProps {
  value?: string | null;
  onChange: (type: string) => void;
}

const ADVENTURE_CONFIG: { type: AdventureType; emoji: string; desc: string }[] = [
  { type: 'Trekking', emoji: '🥾', desc: 'Mountain trails, high passes & guided alpine hikes' },
  { type: 'Camping', emoji: '🏕️', desc: 'Wilderness retreats, riverside camps & stargazing' },
  { type: 'Backpacking', emoji: '🎒', desc: 'Budget-friendly trails & authentic cultural immersion' },
  { type: 'Expedition', emoji: '🏔️', desc: 'High-altitude circuits & remote wilderness conquests' },
  { type: 'Road Trip', emoji: '🚙', desc: 'Scenic highways, mountain passes & convoy drives' },
  { type: 'Wildlife Safari', emoji: '🦁', desc: 'National parks, tiger reserves & jungle safaris' },
  { type: 'Desert Safari', emoji: '🐪', desc: 'Sand dunes, camel treks & desert night camps' },
  { type: 'Cycling', emoji: '🚴', desc: 'Countryside trails, valleys & coastal road pedaling' },
  { type: 'River Rafting', emoji: '🚣', desc: 'Grade 3-4 white water rapids & river expeditions' },
  { type: 'Skiing', emoji: '⛷️', desc: 'Powder snow slopes, snowboarding & alpine ski resorts' },
  { type: 'Snow Adventure', emoji: '❄️', desc: 'Glacial walks, frozen lake treks & snowshoeing' },
  { type: 'Scuba Diving', emoji: '🤿', desc: 'PADI dives, coral reefs & marine life exploration' },
  { type: 'Paragliding', emoji: '🪂', desc: 'Tandem flights over scenic valleys & mountain thermals' },
  { type: 'General Adventure', emoji: '🧗', desc: 'Versatile outdoor thrill & multi-activity tours' },
];

export const AdventureTypeSelector: React.FC<AdventureTypeSelectorProps> = ({
  value = 'General Adventure',
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const selectedValue = value || 'General Adventure';
  const selectedConfig = ADVENTURE_CONFIG.find((item) => item.type === selectedValue) || {
    type: selectedValue,
    emoji: '🧭',
    desc: 'Outdoor adventure experience',
  };

  const filteredOptions = ADVENTURE_CONFIG.filter((item) =>
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-1.5 select-none" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
          <span>Adventure Type</span>
          <span className="text-[#FF4D6D] text-xs">*</span>
        </label>
        <span className="text-[11px] font-bold text-[#583BE8] bg-purple-50 px-2 py-0.5 rounded-full">
          Required
        </span>
      </div>
      <p className="text-xs font-semibold text-slate-400">
        Classify by specific adventure activity so travelers discover your experience easily
      </p>

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
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0 text-base">
              {selectedConfig.emoji}
            </div>
            <div className="min-w-0">
              <span className="text-sm font-bold text-[#0F172A] block truncate">
                {selectedConfig.type}
              </span>
              <span className="text-[11px] font-medium text-slate-400 block truncate">
                {selectedConfig.desc}
              </span>
            </div>
          </div>

          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ml-2 ${
              isOpen ? 'rotate-180 text-[#583BE8]' : ''
            }`}
          />
        </button>

        {/* Custom Dropdown Menu with Search */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 4, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute left-0 right-0 top-full z-40 bg-white rounded-2xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] py-2 max-h-72 overflow-hidden flex flex-col"
            >
              {/* Search Bar inside Dropdown */}
              <div className="px-3 pb-2 pt-1 border-b border-slate-100 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search adventure types..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8]"
                  />
                </div>
              </div>

              {/* Scrollable list */}
              <div className="overflow-y-auto max-h-56 scrollbar-thin scrollbar-thumb-slate-200 px-1 py-1">
                {filteredOptions.length === 0 ? (
                  <div className="py-4 text-center text-xs font-semibold text-slate-400">
                    No adventure types matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  filteredOptions.map(({ type, emoji, desc }) => {
                    const isSelected = selectedValue.toLowerCase() === type.toLowerCase();
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          onChange(type);
                          setIsOpen(false);
                        }}
                        className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-50/80 text-[#583BE8]'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-base shrink-0">{emoji}</span>
                          <div className="min-w-0">
                            <span
                              className={`text-xs block truncate ${
                                isSelected ? 'font-black text-[#583BE8]' : 'font-bold text-[#0F172A]'
                              }`}
                            >
                              {type}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium block truncate">
                              {desc}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#583BE8] text-white flex items-center justify-center shrink-0 ml-2">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdventureTypeSelector;
