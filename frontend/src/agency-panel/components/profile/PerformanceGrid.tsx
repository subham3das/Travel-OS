import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PerformanceMetric } from '../../data/profile';
import { Briefcase, Plane, Calendar, IndianRupee, User, Star, ChevronDown, ExternalLink } from 'lucide-react';

interface PerformanceGridProps {
  metrics: PerformanceMetric[];
}

export const PerformanceGrid: React.FC<PerformanceGridProps> = ({ metrics }) => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('This Month');

  const getMetricIcon = (type: PerformanceMetric['type']) => {
    switch (type) {
      case 'packages':
        return <Briefcase className="w-4 h-4 text-[#583BE8]" />;
      case 'trips':
        return <Plane className="w-4 h-4 text-[#583BE8]" />;
      case 'bookings':
        return <Calendar className="w-4 h-4 text-[#583BE8]" />;
      case 'revenue':
        return <IndianRupee className="w-4 h-4 text-[#583BE8]" />;
      case 'travelers':
        return <User className="w-4 h-4 text-[#583BE8]" />;
      case 'rating':
        return <Star className="w-4 h-4 text-[#583BE8]" />;
      default:
        return <Briefcase className="w-4 h-4 text-[#583BE8]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      {/* Header & Filter */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
          Performance Snapshot
        </h3>

        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-purple-50 text-[#583BE8] font-extrabold text-xs px-3 py-1.5 pr-7 rounded-xl border border-purple-200 cursor-pointer focus:outline-none"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#583BE8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 6 Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {metrics.map((m) => {
          const isTravelers = m.type === 'travelers';

          return (
            <div
              key={m.id}
              onClick={() => isTravelers && navigate('/agency/customers')}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all space-y-2 min-w-0 ${
                isTravelers
                  ? 'bg-purple-50/60 border-purple-200 hover:border-[#583BE8] cursor-pointer shadow-xs group'
                  : 'bg-purple-50/30 border-purple-100/70'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
                  {getMetricIcon(m.type)}
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                  {m.growth}
                </span>
              </div>

              <div className="min-w-0 space-y-0.5">
                <span className="text-base sm:text-xl font-black text-[#0F172A] truncate block">
                  {m.value}
                </span>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-extrabold text-slate-500 truncate block">
                    {m.title}
                  </span>
                  {isTravelers && (
                    <span className="text-[10px] font-black text-[#583BE8] group-hover:underline flex items-center gap-0.5 shrink-0">
                      View All <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceGrid;
