import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check, ChevronDown } from 'lucide-react';

interface ModernTimePickerProps {
  value: string; // Supports "HH:mm" (24h) or "hh:mm AM/PM" (12h)
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const ModernTimePicker: React.FC<ModernTimePickerProps> = ({
  value,
  onChange,
  label,
  required = false,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  // Parse any time format ("07:30 AM", "19:30", "7:30", "23:59") into 12h pieces
  const parseTimeTo12 = (val: string) => {
    if (!val || typeof val !== 'string') {
      return { hour: 7, minute: 30, period: 'AM' as 'AM' | 'PM', is12hFormat: true };
    }
    const trimmed = val.trim();
    const hasAmPm = /am|pm/i.test(trimmed);

    if (hasAmPm) {
      const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10) || 0;
        const p = ((match[3] || 'AM').toUpperCase() as 'AM' | 'PM');
        if (h === 0) h = 12;
        if (h > 12) h = h % 12 || 12;
        return { hour: h, minute: m, period: p, is12hFormat: true };
      }
    }

    if (trimmed.includes(':')) {
      const [hStr, mStr] = trimmed.split(':');
      let h = parseInt(hStr, 10);
      const m = parseInt(mStr, 10) || 0;
      if (isNaN(h)) h = 9;

      const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
      let hour12 = h % 12;
      if (hour12 === 0) hour12 = 12;

      return { hour: hour12, minute: m, period, is12hFormat: false };
    }

    return { hour: 7, minute: 30, period: 'AM' as 'AM' | 'PM', is12hFormat: true };
  };

  const parsed = parseTimeTo12(value);
  const [selectedHour, setSelectedHour] = useState(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState(parsed.minute);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(parsed.period);

  // Keep internal state in sync with external value
  useEffect(() => {
    const p = parseTimeTo12(value);
    setSelectedHour(p.hour);
    setSelectedMinute(p.minute);
    setSelectedPeriod(p.period);
  }, [value]);

  // Format 12h hour/min/period into the appropriate return string
  const formatTime = (h: number, m: number, p: 'AM' | 'PM'): string => {
    const isOriginal12h = /am|pm/i.test(value || '');
    if (isOriginal12h) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`;
    }
    // 24-hour format
    let h24 = h;
    if (p === 'PM' && h < 12) h24 = h + 12;
    if (p === 'AM' && h === 12) h24 = 0;
    return `${String(h24).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll columns to selected position when popover opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const hourEl = hourListRef.current?.querySelector(`[data-hour="${selectedHour}"]`);
        if (hourEl) {
          hourEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
        const minEl = minuteListRef.current?.querySelector(`[data-min="${selectedMinute}"]`);
        if (minEl) {
          minEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 50);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleApply = (h = selectedHour, m = selectedMinute, p = selectedPeriod) => {
    setSelectedHour(h);
    setSelectedMinute(m);
    setSelectedPeriod(p);
    const formatted = formatTime(h, m, p);
    onChange(formatted);
  };

  const handleApplyAndClose = () => {
    const formatted = formatTime(selectedHour, selectedMinute, selectedPeriod);
    onChange(formatted);
    setIsOpen(false);
  };

  const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  const PRESETS = [
    { label: '06:00 AM', h: 6, m: 0, p: 'AM' as const },
    { label: '07:30 AM', h: 7, m: 30, p: 'AM' as const },
    { label: '09:00 AM', h: 9, m: 0, p: 'AM' as const },
    { label: '11:00 AM', h: 11, m: 0, p: 'AM' as const },
    { label: '02:00 PM', h: 2, m: 0, p: 'PM' as const },
    { label: '06:00 PM', h: 6, m: 0, p: 'PM' as const },
    { label: '11:59 PM', h: 11, m: 59, p: 'PM' as const },
  ];

  return (
    <div className={`space-y-1 relative select-none ${className}`} ref={containerRef}>
      {label && (
        <label className="text-slate-700 block text-xs font-bold">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Button Input */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 border text-slate-800 font-extrabold text-xs transition-all cursor-pointer ${
          isOpen
            ? 'border-[#583BE8] ring-2 ring-[#583BE8]/10 bg-white shadow-xs'
            : 'border-slate-200 hover:border-slate-300'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#583BE8] shrink-0" />
          <span className="tracking-tight">
            {String(selectedHour).padStart(2, '0')}:{String(selectedMinute).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase text-[#583BE8] bg-[#583BE8]/10 px-2 py-0.5 rounded-md">
            {selectedPeriod}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Popover Clock Modal */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          {/* Header Time Display & AM/PM Toggle */}
          <div className="flex items-center justify-between bg-slate-50/90 p-2.5 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-xl font-black text-[#583BE8] tracking-tight">
                {String(selectedHour).padStart(2, '0')}
              </span>
              <span className="text-lg font-black text-slate-300">:</span>
              <span className="text-xl font-black text-[#583BE8] tracking-tight">
                {String(selectedMinute).padStart(2, '0')}
              </span>
            </div>

            {/* AM / PM Segmented Control */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-xl">
              <button
                type="button"
                onClick={() => handleApply(selectedHour, selectedMinute, 'AM')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  selectedPeriod === 'AM'
                    ? 'bg-white text-[#583BE8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AM
              </button>
              <button
                type="button"
                onClick={() => handleApply(selectedHour, selectedMinute, 'PM')}
                className={`px-3 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                  selectedPeriod === 'PM'
                    ? 'bg-white text-[#583BE8] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Dual Column Picker: Hours & Minutes */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/80 rounded-2xl border border-slate-100">
            {/* Hours Column */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 text-center tracking-wider">
                Hour
              </span>
              <div
                ref={hourListRef}
                className="h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-200"
              >
                {HOURS.map((h) => {
                  const isSelected = selectedHour === h;
                  return (
                    <button
                      key={h}
                      data-hour={h}
                      type="button"
                      onClick={() => handleApply(h, selectedMinute, selectedPeriod)}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#583BE8] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/70'
                      }`}
                    >
                      {String(h).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Minutes Column */}
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block mb-1 text-center tracking-wider">
                Minute
              </span>
              <div
                ref={minuteListRef}
                className="h-36 overflow-y-auto space-y-1 pr-1 scrollbar-thin scrollbar-thumb-slate-200"
              >
                {MINUTES.map((m) => {
                  const isSelected = selectedMinute === m;
                  return (
                    <button
                      key={m}
                      data-min={m}
                      type="button"
                      onClick={() => handleApply(selectedHour, m, selectedPeriod)}
                      className={`w-full py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#583BE8] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-200/70'
                      }`}
                    >
                      {String(m).padStart(2, '0')}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Presets Bar */}
          <div className="space-y-1 pt-0.5">
            <span className="text-[10px] font-bold text-slate-400 block px-0.5">Quick Presets</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleApply(item.h, item.m, item.p)}
                  className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-[#583BE8]/10 hover:text-[#583BE8] text-[10px] font-bold text-slate-600 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Confirmation Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                let h = now.getHours();
                const m = Math.round(now.getMinutes() / 5) * 5 % 60;
                const p: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
                h = h % 12 || 12;
                handleApply(h, m, p);
              }}
              className="text-[11px] font-bold text-[#583BE8] hover:underline cursor-pointer"
            >
              Current Time
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyAndClose}
                className="px-4 py-1.5 rounded-xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black shadow-xs transition-all cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Done</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTimePicker;
