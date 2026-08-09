import React from 'react';
import { Search, X } from 'lucide-react';

interface NotificationSearchProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const NotificationSearch: React.FC<NotificationSearchProps> = ({
  value,
  onChange,
  onClear,
}) => {
  return (
    <div className="relative w-full select-none">
      <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by booking ID, package, traveler, trip ID, or keyword..."
        className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] shadow-2xs"
        autoFocus
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default NotificationSearch;
