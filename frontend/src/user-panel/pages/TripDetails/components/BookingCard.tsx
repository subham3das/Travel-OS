import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface BookingCardProps {
  trip: Trip;
}

export const BookingCard: React.FC<BookingCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(trip.bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative -mt-6 z-30 bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs flex flex-col min-[540px]:flex-row min-[540px]:items-center justify-between gap-4">
      {/* Left Confirmed Status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-6 h-6 fill-current text-emerald-500" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
            Booking Confirmed
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            Your trip is confirmed and all set to go!
          </p>
        </div>
      </div>

      {/* Right Booking ID & View Travel Documents CTA */}
      <div className="flex items-center justify-between min-[540px]:justify-end gap-3 border-t min-[540px]:border-t-0 pt-3 min-[540px]:pt-0 border-slate-100">
        <div className="text-left min-[540px]:text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking ID</p>
          <button
            onClick={handleCopyBookingId}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#0F172A] hover:text-[#6356E5] cursor-pointer"
          >
            <span>{trip.bookingId}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        </div>

        <button
          onClick={() => navigate(`/trips/${trip.id}/documents`)}
          className="px-3.5 py-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer border border-purple-100 shrink-0"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Documents</span>
        </button>
      </div>
    </div>
  );
};
