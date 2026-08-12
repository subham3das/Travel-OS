import React from 'react';
import { X, Star } from 'lucide-react';
import { Agency } from '../../../types/agency';
import { AgencyStatusBadge } from './AgencyStatusBadge';

interface AgencyDrawerHeaderProps {
  agency: Agency;
  onClose: () => void;
}

export const AgencyDrawerHeader: React.FC<AgencyDrawerHeaderProps> = ({ agency, onClose }) => {
  return (
    <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10 select-none">
      {/* Top row: Title + Close Button */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-black text-[#0F172A] tracking-tight">{agency.name}</h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Agency Profile Snippet */}
      <div className="flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-2xs shrink-0">
          <img
            src={agency.logo}
            alt={agency.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-extrabold text-[#0F172A] truncate leading-tight">
              {agency.name}
            </h3>
            <AgencyStatusBadge status={agency.status} />
          </div>

          <p className="text-xs font-bold text-slate-500">{agency.businessType}</p>

          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[#0F172A] font-extrabold">{agency.rating}</span>
            <span className="text-slate-400 text-[11px]">({agency.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
