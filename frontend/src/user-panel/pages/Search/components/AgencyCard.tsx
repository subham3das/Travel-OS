import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { SearchResultItem } from '../../../data/search';

interface AgencyCardProps {
  item: SearchResultItem;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(item.targetUrl)}
      className="bg-white rounded-3xl p-3.5 border border-slate-100/90 shadow-2xs hover:shadow-md hover:scale-[1.02] hover:border-[#6356E5]/30 transition-all cursor-pointer flex items-center justify-between gap-3.5 group"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Logo Circle */}
        <img
          src={item.image}
          alt={item.title}
          className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
        />

        {/* Agency Info */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
              {item.title}
            </h4>
            <CheckCircle2 className="w-4 h-4 fill-[#6356E5] text-white shrink-0" />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating || 4.8}</span>
            </span>
            <span className="text-slate-400 font-semibold">(320 reviews) • 6+ Years</span>
          </div>

          <p className="text-[11px] font-semibold text-slate-400 truncate">
            120+ Trips • 8.6K Travelers
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[10px] font-semibold text-slate-400 leading-none">From</p>
          <p className="text-sm font-black text-[#0F172A] leading-tight">₹9,999</p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0 mr-1" />
    </div>
  );
};
