import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardUpcomingDeparture } from '../../data/dashboardInsights';

interface UpcomingDeparturesSectionProps {
  departures: DashboardUpcomingDeparture[];
}

export const UpcomingDeparturesSection: React.FC<UpcomingDeparturesSectionProps> = ({ departures }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.2 }}
      className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none"
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">Upcoming Departures</h3>
        <button
          type="button"
          onClick={() => navigate('/agency/trips')}
          className="text-xs font-black text-[#583BE8] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {departures.length > 0 ? (
        <div className="divide-y divide-slate-100/80">
          {departures.map((dep) => {
            const isGreen = dep.occupancyPct >= 90;
            const isOrange = dep.occupancyPct >= 70 && dep.occupancyPct < 90;

            return (
              <div
                key={dep.id}
                onClick={() => navigate('/agency/trips')}
                className="py-3.5 flex items-center justify-between gap-3 group cursor-pointer hover:bg-slate-50/60 rounded-2xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Date Badge */}
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#583BE8] flex flex-col items-center justify-center shrink-0 border border-purple-100/60">
                    <span className="text-[9px] font-black uppercase text-[#583BE8] leading-none">
                      {dep.monthBadge}
                    </span>
                    <span className="text-sm font-black text-[#583BE8] leading-none mt-0.5">
                      {dep.dayBadge}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                      {dep.packageName}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 truncate">
                      {dep.dateRange}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-right">
                  <div>
                    <span className="text-xs font-black text-[#0F172A] block">
                      {dep.filledRatio}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold ${
                        isGreen
                          ? 'text-emerald-600'
                          : isOrange
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {dep.occupancyPct}% Filled
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center space-y-2">
          <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="text-xs font-bold text-slate-400">No upcoming departures.</p>
        </div>
      )}
    </motion.div>
  );
};

export default UpcomingDeparturesSection;
