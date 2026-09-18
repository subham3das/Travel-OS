import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Agency } from '../../../types/agency';

interface AgencyPerformanceCardProps {
  agency: Agency;
}

export const AgencyPerformanceCard: React.FC<AgencyPerformanceCardProps> = ({ agency }) => {
  const perf = agency.performance || {
    bookings: agency.bookings || 0,
    bookingsGrowth: '0%',
    trips: agency.bookings || 0,
    tripsGrowth: '0%',
    revenue: agency.revenue || '₹0',
    revenueGrowth: '0%',
    reviews: agency.reviewCount || 0,
    reviewsGrowth: '0%',
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
