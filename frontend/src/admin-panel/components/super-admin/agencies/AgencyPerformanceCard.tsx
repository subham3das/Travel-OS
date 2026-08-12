import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AgencyPerformanceCardProps {
  agency: Agency;
}

export const AgencyPerformanceCard: React.FC<AgencyPerformanceCardProps> = ({ agency }) => {
  const perf = agency.performance || {
    bookings: agency.bookings || 1245,
    bookingsGrowth: '12.4%',
    trips: 98,
    tripsGrowth: '6.1%',
    revenue: agency.revenue || '₹48,75,230',
    revenueGrowth: '8.2%',
    reviews: agency.reviewCount || 128,
    reviewsGrowth: '9.3%',
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
          Performance
        </h4>
        <span className="text-[11px] font-bold text-slate-400">(This Month)</span>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Bookings */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Bookings</p>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-base font-black text-[#0F172A]">{perf.bookings}</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600">
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              {perf.bookingsGrowth}
            </span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Revenue</p>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-black text-[#0F172A] truncate">{perf.revenue}</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 shrink-0">
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              {perf.revenueGrowth}
            </span>
          </div>
        </div>

        {/* Trips */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Trips</p>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-base font-black text-[#0F172A]">{perf.trips}</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600">
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              {perf.tripsGrowth}
            </span>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Reviews</p>
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-base font-black text-[#0F172A]">{perf.reviews}</span>
            <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600">
              <ArrowUpRight className="w-3 h-3 stroke-[3]" />
              {perf.reviewsGrowth}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
