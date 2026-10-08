import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CarRentalTimePickerProps {
  value: string;
  onChange: (time: string) => void;
  label?: string;
  className?: string;
}

// 12-hour clock sequence starting with 12
const BASE_HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
// Repeated for seamless infinite wheel effect
const HOURS = [...BASE_HOURS, ...BASE_HOURS, ...BASE_HOURS];

const BASE_MINUTES = Array.from({ length: 60 }, (_, i) => i);
const MINUTES = [...BASE_MINUTES, ...BASE_MINUTES, ...BASE_MINUTES];

const PERIODS: ('AM' | 'PM')[] = ['AM', 'PM'];

const ITEM_HEIGHT = 34; // px per row (7 visible rows = 238px total)
const VISIBLE_ROWS = 7;
const PADDING_TOP = Math.floor(VISIBLE_ROWS / 2) * ITEM_HEIGHT; // 3 * 34 = 102px

function parseTimeString(timeStr: string): { hour: number; minute: number; period: 'AM' | 'PM' } {
  if (!timeStr) return { hour: 4, minute: 0, period: 'PM' };
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{1,2})\s*(AM|PM)?$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = Math.min(59, Math.max(0, parseInt(match[2], 10)));
    let p: 'AM' | 'PM' = 'PM';
    if (match[3]) {
      p = match[3].toUpperCase() === 'PM' ? 'PM' : 'AM';
    } else if (h >= 12) {
      p = 'PM';
    }
    if (h > 12) h = h % 12 || 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m, period: p };
  }
  return { hour: 4, minute: 0, period: 'PM' };
}

function formatTimeString(hour: number, minute: number, period: 'AM' | 'PM'): string {
  const hStr = String(hour).padStart(2, '0');
  const mStr = String(minute).padStart(2, '0');
  return `${hStr}:${mStr} ${period}`;
}

export const CarRentalTimePicker: React.FC<CarRentalTimePickerProps> = ({
  value,
  onChange,
  label = 'Time',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseTimeString(value);
  const [hour, setHour] = useState<number>(parsed.hour);
  const [minute, setMinute] = useState<number>(parsed.minute);
  const [period, setPeriod] = useState<'AM' | 'PM'>(parsed.period);

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);
  const periodScrollRef = useRef<HTMLDivElement>(null);

  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state when external value changes
  useEffect(() => {
    const p = parseTimeString(value);
    setHour(p.hour);
    setMinute(p.minute);
    setPeriod(p.period);
  }, [value]);

  // Center wheels to selected values in middle cycle
  const scrollToPositions = useCallback((h: number, m: number, p: 'AM' | 'PM', smooth = true) => {
    const behavior = smooth ? 'smooth' : 'auto';

    // In middle cycle of hours (offset 12)
    const hBaseIndex = BASE_HOURS.indexOf(h);
    const hIndex = 12 + (hBaseIndex !== -1 ? hBaseIndex : 0);
    if (hourScrollRef.current) {
      hourScrollRef.current.scrollTo({
        top: hIndex * ITEM_HEIGHT,
        behavior,
      });
    }

    // In middle cycle of minutes (offset 60)
    const mIndex = 60 + m;
    if (minuteScrollRef.current) {
      minuteScrollRef.current.scrollTo({
        top: mIndex * ITEM_HEIGHT,
        behavior,
      });
    }

    const pIndex = PERIODS.indexOf(p);
    if (pIndex !== -1 && periodScrollRef.current) {
      periodScrollRef.current.scrollTo({
        top: pIndex * ITEM_HEIGHT,
        behavior,
      });
    }
  }, []);

  // When popover opens, align scroll wheels to active time
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        scrollToPositions(hour, minute, period, false);
      }, 30);
      return () => clearTimeout(timer);
    }
  }, [isOpen, scrollToPositions, hour, minute, period]);

  // Outside click listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const updateTime = (h: number, m: number, p: 'AM' | 'PM', triggerScroll = true) => {
    setHour(h);
    setMinute(m);
    setPeriod(p);
    onChange(formatTimeString(h, m, p));
    if (triggerScroll) {
      scrollToPositions(h, m, p, true);
    }
  };

  const handleHourScroll = () => {
    if (!hourScrollRef.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!hourScrollRef.current) return;
      const index = Math.round(hourScrollRef.current.scrollTop / ITEM_HEIGHT);
      const boundedIndex = Math.max(0, Math.min(HOURS.length - 1, index));
      const newHour = HOURS[boundedIndex];
      hourScrollRef.current.scrollTo({
        top: boundedIndex * ITEM_HEIGHT,
        behavior: 'smooth',
      });
      if (newHour !== hour) {
        updateTime(newHour, minute, period, false);
      }
    }, 90);
  };

  const handleMinuteScroll = () => {
    if (!minuteScrollRef.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!minuteScrollRef.current) return;
      const index = Math.round(minuteScrollRef.current.scrollTop / ITEM_HEIGHT);
      const boundedIndex = Math.max(0, Math.min(MINUTES.length - 1, index));
      const newMinute = MINUTES[boundedIndex];
      minuteScrollRef.current.scrollTo({
        top: boundedIndex * ITEM_HEIGHT,
        behavior: 'smooth',
      });
      if (newMinute !== minute) {
        updateTime(hour, newMinute, period, false);
      }
    }, 90);
  };

  const handlePeriodScroll = () => {
    if (!periodScrollRef.current) return;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (!periodScrollRef.current) return;
      const index = Math.round(periodScrollRef.current.scrollTop / ITEM_HEIGHT);
      const boundedIndex = Math.max(0, Math.min(PERIODS.length - 1, index));
      const newPeriod = PERIODS[boundedIndex];
      periodScrollRef.current.scrollTo({
        top: boundedIndex * ITEM_HEIGHT,
        behavior: 'smooth',
      });
      if (newPeriod !== period) {
        updateTime(hour, minute, newPeriod, false);
      }
    }, 90);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-slate-50/90 rounded-2xl px-3.5 py-2.5 border border-slate-100 focus-within:bg-white focus-within:border-[#FF4D6D]/30 hover:bg-slate-100/90 transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
          <div className="min-w-0 flex-1 text-left">
            <span className="block text-[10px] font-bold text-slate-400 leading-tight">
              {label}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#0F172A] block tracking-tight truncate">
              {value || '04:00 PM'}
            </span>
          </div>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#FF4D6D]' : ''
          }`}
        />
      </div>

      {/* Pure iOS-Style Wheel Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-[240px] bg-white rounded-3xl shadow-xl border border-black/5 p-2 select-none overflow-hidden"
          >
            {/* Wheel Container (238px = 7 rows * 34px) */}
            <div className="relative h-[238px] overflow-hidden">
              {/* iOS Center Selection Lens */}
              <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 h-[34px] rounded-xl bg-[#EFEFF0] pointer-events-none z-0" />

              {/* Smooth Top & Bottom Vignettes (fading to white) */}
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-20" />
              <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-20" />

              {/* 3 Drum Columns: Hour, Minute, AM/PM */}
              <div className="grid grid-cols-[1fr_1fr_1.1fr] h-full relative z-10">
                {/* 1. Hour Column (Right-aligned, single digit without leading zero) */}
                <div
                  ref={hourScrollRef}
                  onScroll={handleHourScroll}
                  className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                  style={{
                    paddingTop: `${PADDING_TOP}px`,
                    paddingBottom: `${PADDING_TOP}px`,
                    scrollbarWidth: 'none',
                  }}
                >
                  {HOURS.map((h, index) => {
                    const isSelected = h === hour;
                    return (
                      <div
                        key={index}
                        onClick={() => updateTime(h, minute, period, true)}
                        className={`h-[34px] flex items-center justify-end pr-4 snap-center cursor-pointer transition-colors duration-150 tabular-nums ${
                          isSelected
                            ? 'text-xl font-normal text-[#1C1C1E]'
                            : 'text-base font-normal text-[#8E8E93]'
                        }`}
                      >
                        {h}
                      </div>
                    );
                  })}
                </div>

                {/* 2. Minute Column (Centered, 2 digits with leading zero) */}
                <div
                  ref={minuteScrollRef}
                  onScroll={handleMinuteScroll}
                  className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                  style={{
                    paddingTop: `${PADDING_TOP}px`,
                    paddingBottom: `${PADDING_TOP}px`,
                    scrollbarWidth: 'none',
                  }}
                >
                  {MINUTES.map((m, index) => {
                    const isSelected = m === minute;
                    return (
                      <div
                        key={index}
                        onClick={() => updateTime(hour, m, period, true)}
                        className={`h-[34px] flex items-center justify-center snap-center cursor-pointer transition-colors duration-150 tabular-nums ${
                          isSelected
                            ? 'text-xl font-normal text-[#1C1C1E]'
                            : 'text-base font-normal text-[#8E8E93]'
                        }`}
                      >
                        {String(m).padStart(2, '0')}
                      </div>
                    );
                  })}
                </div>

                {/* 3. AM / PM Column (Left-aligned) */}
                <div
                  ref={periodScrollRef}
                  onScroll={handlePeriodScroll}
                  className="h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar"
                  style={{
                    paddingTop: `${PADDING_TOP}px`,
                    paddingBottom: `${PADDING_TOP}px`,
                    scrollbarWidth: 'none',
                  }}
                >
                  {PERIODS.map((p, index) => {
                    const isSelected = p === period;
                    return (
                      <div
                        key={index}
                        onClick={() => updateTime(hour, minute, p, true)}
                        className={`h-[34px] flex items-center justify-start pl-4 snap-center cursor-pointer transition-colors duration-150 ${
                          isSelected
                            ? 'text-xl font-normal text-[#1C1C1E]'
                            : 'text-base font-normal text-[#8E8E93]'
                        }`}
                      >
                        {p}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
