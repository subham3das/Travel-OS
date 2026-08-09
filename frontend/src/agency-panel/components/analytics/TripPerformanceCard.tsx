import React from 'react';
import { ArrowUpRight, CheckCircle, Clock, XCircle, Send } from 'lucide-react';
import { TripPerformanceSummary } from '../../data/analytics';

interface TripPerformanceCardProps {
  data: TripPerformanceSummary;
}

export const TripPerformanceCard: React.FC<TripPerformanceCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Trip Performance
        </span>
      </div>

      {/* Trip Status Breakdown List */}
      <div className="space-y-3 text-xs font-bold pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-purple-100 text-[#583BE8] flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Upcoming Trips</span>
          </div>
          <span className="text-[#0F172A] font-black">{data.upcoming}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Send className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Ongoing Trips</span>
          </div>
          <span className="text-[#0F172A] font-black">{data.ongoing}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Completed Trips</span>
          </div>
          <span className="text-[#0F172A] font-black">{data.completed}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-600">Cancelled Trips</span>
          </div>
          <span className="text-[#0F172A] font-black">{data.cancelled}</span>
        </div>
      </div>

      {/* Average Occupancy Progress Bar */}
      <div className="pt-2 border-t border-slate-100 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400">Average Occupancy</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-black text-[#0F172A]">{data.avgOccupancyPct}%</span>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3 h-3" />
              <span>{data.occupancyGrowth}</span>
            </span>
          </div>
        </div>

        {/* Animated Fill Bar */}
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#583BE8] rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${data.avgOccupancyPct}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TripPerformanceCard;
