import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Eye,
  FileText,
  Edit,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { AdminBookingItem } from '../../../types/bookingManagement';

interface BookingTableRowProps {
  booking: AdminBookingItem;
  isSelected: boolean;
  isDrawerSelected: boolean;
  onToggleSelect: (id: string) => void;
  onSelectBooking: (booking: AdminBookingItem) => void;
  onRowAction: (actionType: string, booking: AdminBookingItem) => void;
}

export const BookingTableRow: React.FC<BookingTableRowProps> = ({
  booking,
  isSelected,
  isDrawerSelected,
  onToggleSelect,
  onSelectBooking,
  onRowAction,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuCoords, setMenuCoords] = useState<{ top: number; left: number; openUpwards: boolean }>({
    top: 0,
    left: 0,
    openUpwards: false,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpwards = spaceBelow < 280 && rect.top > 280;
      const menuWidth = 192; // w-48 = 192px
      const left = Math.max(10, rect.right - menuWidth);
      const top = openUpwards ? rect.top - 6 : rect.bottom + 6;
      setMenuCoords({ top, left, openUpwards });
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    const handleScrollOrResize = () => {
      setIsMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const getStatusBadgeStyle = () => {
    switch (booking.bookingStatus) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-black';
      case 'Refunded':
        return 'bg-purple-50 text-[#6356E5] border-purple-100 font-extrabold';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-bold';
    }
  };

  const getPaymentBadgeStyle = () => {
    switch (booking.paymentStatus) {
      case 'Paid':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100 font-extrabold';
      case 'Pending':
        return 'bg-amber-50 text-amber-600 border-amber-100 font-extrabold';
      case 'Refunded':
        return 'bg-purple-50 text-[#6356E5] border-purple-100 font-extrabold';
      case 'Failed':
        return 'bg-rose-50 text-rose-600 border-rose-100 font-black';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 font-bold';
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, height: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelectBooking(booking)}
      className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs font-semibold text-[#0F172A] cursor-pointer group select-none ${
        isDrawerSelected ? 'bg-[#EEF2FF]/60 hover:bg-[#EEF2FF]/80' : isSelected ? 'bg-[#EEF2FF]/40' : ''
      }`}
    >
      {/* Checkbox */}
      <td
        className="py-3 pl-4 pr-2 w-10"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSelect(booking.id);
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(booking.id)}
          className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
        />
      </td>

      {/* Booking ID */}
      <td className="py-3 px-3 font-mono text-[11px] font-bold text-[#6356E5] group-hover:underline whitespace-nowrap">
        {booking.bookingId}
      </td>

      {/* User (Avatar + Name + Email) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5 min-w-[160px]">
          <img
            src={booking.travelerAvatar}
            alt={booking.travelerName}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate block">
              {booking.travelerName}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 truncate block">
              {booking.travelerEmail}
            </span>
          </div>
        </div>
      </td>

      {/* Package (Thumbnail + Name + Region) */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5 min-w-[180px]">
          <img
            src={booking.packageThumbnail}
            alt={booking.packageName}
            className="w-9 h-7 rounded-lg object-cover border border-slate-200 shadow-2xs shrink-0"
          />
          <div className="min-w-0">
            <span className="font-extrabold text-[#0F172A] truncate block">
              {booking.packageName}
            </span>
            <span className="text-[10px] font-semibold text-slate-400 truncate block">
              {booking.destinationRegion || booking.destinationCountry}
            </span>
          </div>
        </div>
      </td>

      {/* Agency */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5 min-w-[130px]">
          <img
            src={booking.agencyLogo}
            alt={booking.agencyName}
            className="w-4 h-4 rounded-full object-cover border border-slate-200 shrink-0"
          />
          <span className="font-bold text-slate-700 truncate">{booking.agencyName}</span>
        </div>
      </td>

      {/* Travel Dates */}
      <td className="py-3 px-3 text-slate-600 whitespace-nowrap text-[11px] font-medium">
        {booking.travelDatesText}
      </td>

      {/* Travelers */}
      <td className="py-3 px-3 font-bold text-[#0F172A] text-center">
        {1 + booking.additionalTravelersCount}
      </td>

      {/* Amount */}
      <td className="py-3 px-3 whitespace-nowrap font-black text-[#0F172A]">
        {booking.totalAmount}
      </td>

      {/* Payment Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getPaymentBadgeStyle()}`}
        >
          {booking.paymentStatus}
        </span>
      </td>

      {/* Booking Status */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] border shadow-2xs ${getStatusBadgeStyle()}`}
        >
          {booking.bookingStatus}
        </span>
      </td>

      {/* Booking Date */}
      <td className="py-3 px-3 whitespace-nowrap">
        <span className="text-slate-700 font-bold block text-[11px]">{booking.bookedAtDate}</span>
        <span className="text-[10px] font-semibold text-slate-400">{booking.bookedAtTime}</span>
      </td>

      {/* Actions */}
      <td
        className="py-3 pr-4 pl-2 text-right relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={buttonRef}
          onClick={handleToggleMenu}
          className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="More Options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isMenuOpen &&
          createPortal(
            <div
              ref={menuRef}
              style={{
                position: 'fixed',
                left: `${menuCoords.left}px`,
                ...(menuCoords.openUpwards
                  ? { bottom: `${window.innerHeight - menuCoords.top}px` }
                  : { top: `${menuCoords.top}px` }),
                zIndex: 9999,
              }}
              className="w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 p-1.5 text-left select-none space-y-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('view', booking);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>View Details</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('invoice', booking);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>View Invoice</span>
              </button>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onRowAction('modify', booking);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5 text-slate-400" />
                <span>Modify Booking</span>
              </button>

              {booking.bookingStatus !== 'Confirmed' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('confirm', booking);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-emerald-50 text-emerald-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Confirm Booking</span>
                </button>
              )}

              {booking.bookingStatus !== 'Cancelled' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('cancel', booking);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cancel Booking</span>
                </button>
              )}

              {booking.bookingStatus !== 'Refunded' && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onRowAction('refund', booking);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-amber-50 text-amber-600 text-xs font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                  <span>Refund Booking</span>
                </button>
              )}
            </div>,
            document.body
          )}
      </td>
    </motion.tr>
  );
};
