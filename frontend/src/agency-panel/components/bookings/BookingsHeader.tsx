import React from 'react';
import { Filter, Menu } from 'lucide-react';

interface BookingsHeaderProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onOpenFilterModal: () => void;
}

export const BookingsHeader: React.FC<BookingsHeaderProps> = ({
  onOpenFilterModal,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 select-none">
      <div className="flex items-center gap-3">
        <div className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700">
          <Menu className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            Bookings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Manage all bookings for your packages
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilterModal}
          className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          aria-label="Filter Bookings"
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default BookingsHeader;
