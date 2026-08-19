import React from 'react';
import { motion } from 'framer-motion';
import { Award, Star, CheckCircle2, ArrowRight, MoreVertical, Building2 } from 'lucide-react';
import { TopPerformingAgencyItem } from '../../../types/financeManagement';

interface TopPerformingAgenciesProps {
  agencies: TopPerformingAgencyItem[];
  selectedAgencyName?: string;
  onSelectAgency?: (agency: TopPerformingAgencyItem) => void;
  onViewAll?: () => void;
}

export const TopPerformingAgencies: React.FC<TopPerformingAgenciesProps> = ({
  agencies,
  selectedAgencyName,
  onSelectAgency,
  onViewAll,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs flex flex-col justify-between select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100/80">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-black text-[#0F172A]">Top Performing Agencies</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
              Ranked by Revenue
            </span>
          </div>
          <p className="text-[11px] font-semibold text-slate-400">
            Leading partners driving Travel OS volume
          </p>
        </div>

        <button className="w-7 h-7 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Table Content */}
      <div className="divide-y divide-slate-100/80 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-2"># Rank</th>
              <th className="py-2.5 px-2">Agency</th>
              <th className="py-2.5 px-2 text-right">Revenue</th>
              <th className="py-2.5 px-2 text-right">Bookings</th>
              <th className="py-2.5 px-2 text-right">Commission</th>
              <th className="py-2.5 px-2 text-right">Growth</th>
              <th className="py-2.5 px-2 text-center">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60 text-xs">
            {agencies.map((agency) => {
              const isSelected = selectedAgencyName === agency.agencyName;

              return (
                <tr
                  key={agency.id}
                  onClick={() => onSelectAgency?.(agency)}
                  className={`transition-colors cursor-pointer group ${
                    isSelected ? 'bg-purple-50/70 font-semibold' : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3 px-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] font-black ${
                        agency.rank === 1
                          ? 'bg-amber-100 text-amber-800'
                          : agency.rank === 2
                          ? 'bg-slate-200 text-slate-700'
                          : agency.rank === 3
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-slate-50 text-slate-500'
                      }`}
                    >
                      {agency.rank}
                    </span>
                  </td>

                  {/* Agency */}
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2.5 min-w-[150px]">
                      <img
                        src={agency.agencyLogo}
                        alt={agency.agencyName}
                        className="w-8 h-8 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span
                            className={`truncate ${
                              isSelected
                                ? 'text-[#6356E5] font-black'
                                : 'font-bold text-[#0F172A] group-hover:text-[#6356E5]'
                            }`}
                          >
                            {agency.agencyName}
                          </span>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">
                          {agency.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className="py-3 px-2 text-right">
                    <span className="font-black text-[#0F172A] font-mono">
                      {agency.revenue}
                    </span>
                  </td>

                  {/* Bookings */}
                  <td className="py-3 px-2 text-right font-mono font-bold text-slate-600">
                    {agency.bookings}
                  </td>

                  {/* Commission */}
                  <td className="py-3 px-2 text-right font-mono font-extrabold text-[#6356E5]">
                    {agency.commission}
                  </td>

                  {/* Growth % */}
                  <td className="py-3 px-2 text-right">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 font-mono">
                      ↑{agency.growth}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex items-center gap-1 font-bold text-slate-700">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{agency.rating}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Link */}
      <div className="mt-2 pt-3 border-t border-slate-100/80 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-slate-400">
          Showing top 5 of 128 registered agencies
        </span>
        <button
          onClick={onViewAll}
          className="text-xs font-extrabold text-[#6356E5] hover:text-[#5245cc] flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>View All Agencies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
