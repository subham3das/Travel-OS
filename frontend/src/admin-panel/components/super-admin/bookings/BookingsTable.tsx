import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminBookingItem, BookingSortConfig } from '../../../types/bookingManagement';
import { BookingTableHeader } from './BookingTableHeader';
import { BookingTableRow } from './BookingTableRow';
import { RefreshCw, BookmarkX } from 'lucide-react';

interface BookingsTableProps {
  bookings: AdminBookingItem[];
  selectedIds: string[];
  selectedBooking: AdminBookingItem | null;
  sortConfig?: BookingSortConfig;
  onSort?: (key: BookingSortConfig['key']) => void;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onSelectBooking: (booking: AdminBookingItem) => void;
  onRowAction: (actionType: string, booking: AdminBookingItem) => void;
  onRefresh?: () => void;
}

export const BookingsTable: React.FC<BookingsTableProps> = ({
  bookings,
  selectedIds,
  selectedBooking,
  sortConfig,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onSelectBooking,
  onRowAction,
  onRefresh,
}) => {
  const isAllSelected = bookings.length > 0 && selectedIds.length === bookings.length;

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
          <BookmarkX className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">No Bookings Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No travel bookings match your current filter parameters or search queries.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Bookings</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <BookingTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <tbody>
            <AnimatePresence initial={false}>
              {bookings.map((booking) => (
                <BookingTableRow
                  key={booking.id}
                  booking={booking}
                  isSelected={selectedIds.includes(booking.id)}
                  isDrawerSelected={selectedBooking?.id === booking.id}
                  onToggleSelect={onToggleSelect}
                  onSelectBooking={onSelectBooking}
                  onRowAction={onRowAction}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
