import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnalyticsPreviewProps {
  analytics: DetailedPackage['analytics'];
}

export const AnalyticsPreview: React.FC<AnalyticsPreviewProps> = ({ analytics }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#583BE8] shrink-0" />
          <span className="truncate">Performance & Analytics Summary</span>
        </h3>

        <button
          type="button"
          onClick={() => navigate('/agency/analytics')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>Full Analytics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Revenue */}
        <div className="p-3 sm:p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase text-purple-700 block truncate">Total Revenue</span>
          <span className="text-sm sm:text-xl font-black text-[#583BE8] truncate block">
            ₹{analytics.totalRevenue.toLocaleString('en-IN')}
          </span>
          <p className="text-[10px] font-bold text-slate-400 truncate">Gross Sales</p>
        </div>

        {/* Bookings */}
        <div className="p-3 sm:p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase text-emerald-800 block truncate">Total Bookings</span>
          <span className="text-sm sm:text-xl font-black text-emerald-700 truncate block">
            {analytics.totalBookings}
          </span>
          <p className="text-[10px] font-bold text-slate-400 truncate">Confirmed Travelers</p>
        </div>

        {/* Occupancy Rate */}
        <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase text-blue-800 block truncate">Occupancy Rate</span>
          <span className="text-sm sm:text-xl font-black text-blue-700 truncate block">
            {analytics.occupancyRate}%
          </span>
          <p className="text-[10px] font-bold text-slate-400 truncate">Seat Utilization</p>
        </div>

        {/* Conversion Rate */}
        <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1 min-w-0">
          <span className="text-[10px] font-extrabold uppercase text-amber-800 block truncate">Conversion</span>
          <span className="text-sm sm:text-xl font-black text-amber-700 truncate block">
            {analytics.conversionRate}%
          </span>
          <p className="text-[10px] font-bold text-slate-400 truncate">Inquiry to Booking</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPreview;
