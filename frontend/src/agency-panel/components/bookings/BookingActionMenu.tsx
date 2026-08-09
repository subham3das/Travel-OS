import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, CheckCircle, XCircle, PhoneCall, Download, CreditCard, CheckCheck } from 'lucide-react';
import { AgencyBooking } from '../../data/bookings';

interface BookingActionMenuProps {
  booking: AgencyBooking;
  onView: () => void;
  onConfirm: () => void;
  onReject: () => void;
}

export const BookingActionMenu: React.FC<BookingActionMenuProps> = ({
  booking,
  onView,
  onConfirm,
  onReject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Booking Options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-30 select-none animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onView();
            }}
            className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Booking</span>
          </button>

          {booking.bookingStatus !== 'CONFIRMED' && booking.bookingStatus !== 'CANCELLED' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onConfirm();
              }}
              className="w-full px-3.5 py-2 text-left text-xs font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Confirm Booking</span>
            </button>
          )}

          {booking.bookingStatus !== 'CANCELLED' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                onReject();
              }}
              className="w-full px-3.5 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Booking</span>
            </button>
          )}

          <a
            href={`tel:${booking.traveler.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer block"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
            <span>Contact Traveler</span>
          </a>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              alert(`Downloading Invoice for ${booking.id}...`);
            }}
            className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download Invoice</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              onView();
            }}
            className="w-full px-3.5 py-2 text-left text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-[#583BE8] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            <span>View Payment</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingActionMenu;
