import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowUpRight, ArrowRight } from 'lucide-react';
import { TopPerformingAgencyItem } from '../../../types/financeManagement';

interface TopPerformingAgenciesProps {
  agencies: TopPerformingAgencyItem[];
  selectedAgencyName?: string;
  onSelectAgency?: (agency: TopPerformingAgencyItem) => void;
}

export const TopPerformingAgencies: React.FC<TopPerformingAgenciesProps> = ({
  agencies,
  selectedAgencyName,
  onSelectAgency,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Top Performing Agencies</h3>
      </div>

      <div className="overflow-x-auto scrollbar-none flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase">
              <th className="py-2 pr-2 w-6">#</th>
              <th className="py-2 px-2">Agency</th>
              <th className="py-2 px-2">Revenue</th>
              <th className="py-2 px-2">Bookings</th>
              <th className="py-2 px-2">Commission</th>
              <th className="py-2 px-2">Growth</th>
              <th className="py-2 pl-2 text-right">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {agencies.map((agency) => {
              const isSelected = selectedAgencyName === agency.agencyName;

              return (
                <tr
                  key={agency.id}
                  onClick={() => onSelectAgency && onSelectAgency(agency)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer group ${
                    isSelected ? 'bg-purple-50/60' : ''
                  }`}
                >
                  <td className="py-2.5 pr-2 font-black text-slate-400 text-xs">
                    {agency.rank}
                  </td>
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2 min-w-[130px]">
                      <img
                        src={agency.agencyLogo}
                        alt={agency.agencyName}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <span className="font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors truncate">
                        {agency.agencyName}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 font-black text-[#0F172A] whitespace-nowrap">
                    {agency.revenue}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-600">
                    {agency.bookings.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-2 font-bold text-slate-700 whitespace-nowrap">
                    {agency.commission}
                  </td>
                  <td className="py-2.5 px-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-0.5 text-emerald-600 font-black text-[11px]">
                      <ArrowUpRight className="w-3 h-3 stroke-[3]" />
                      <span>{agency.growth}</span>
                    </span>
                  </td>
                  <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-black text-slate-800 text-xs">
                      <span>{agency.rating}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <button
          onClick={() => navigate('/admin/agencies')}
          className="inline-flex items-center gap-1 text-xs font-black text-[#6356E5] hover:text-[#5244e0] transition-colors cursor-pointer"
        >
          <span>View All Agencies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
