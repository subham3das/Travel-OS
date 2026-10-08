import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { ShoppingBag, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecentBookingsPreviewProps {
  recentBookings: DetailedPackage['recentBookings'];
}

export const RecentBookingsPreview: React.FC<RecentBookingsPreviewProps> = ({ recentBookings }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
          <span className="truncate">Recent Reservations ({recentBookings.length})</span>
        </h3>

        <button
          type="button"
          onClick={() => navigate('/agency/bookings')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2.5">
        {recentBookings.map((b) => (
          <div
            key={b.id}
            onClick={() => navigate('/agency/bookings')}
            className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 flex items-center justify-between gap-3 transition-colors cursor-pointer min-w-0"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                  {b.travelerName}
                </h4>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">
                  {b.id} • {b.travelersCount} Travelers • {b.bookingDate}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] sm:text-xs font-black text-[#583BE8] bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-block">
                {b.travelersCount} {b.travelersCount === 1 ? 'Seat' : 'Seats'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBookingsPreview;
