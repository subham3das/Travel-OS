import React, { useState, useRef, useEffect } from 'react';
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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        <div className="relative inline-block text-left" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-7 h-7 rounded-xl hover:bg-slate-200/70 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-40 text-left select-none">
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
            </div>
          )}
        </div>
      </td>
    </motion.tr>
  );
};
