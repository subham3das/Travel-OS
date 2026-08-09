import React from 'react';
import { User, Users, UserCheck, RefreshCw, Users2, ArrowUpRight } from 'lucide-react';
import { TravelerInsightsData } from '../../data/analytics';

interface TravelerInsightsCardProps {
  data: TravelerInsightsData;
}

export const TravelerInsightsCard: React.FC<TravelerInsightsCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Traveler Insights
        </span>
      </div>

      {/* Traveler Metrics List */}
      <div className="space-y-3 text-xs font-bold pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#583BE8] flex items-center justify-center">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Total Travelers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0F172A] font-black">{data.totalTravelers}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              <span>{data.totalGrowth}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">New Travelers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0F172A] font-black">{data.newTravelers}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              <span>{data.newGrowth}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Returning Travelers</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0F172A] font-black">{data.returningTravelers}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              <span>{data.returningGrowth}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Repeat Booking Rate</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#0F172A] font-black">{data.repeatBookingRate}</span>
            <span className="text-[10px] font-extrabold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              <span>{data.repeatGrowth}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <Users2 className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Average Group Size</span>
          </div>
          <span className="text-[#0F172A] font-black">{data.avgGroupSize}</span>
        </div>
      </div>
    </div>
  );
};

export default TravelerInsightsCard;
