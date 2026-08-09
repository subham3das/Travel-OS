import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, MessageSquare, Navigation, ChevronRight } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface AgencyCardProps {
  trip: Trip;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const { agency } = trip;

  return (
    <div
      onClick={() => navigate(`/agency/${agency.id}`)}
      className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <img
          src={agency.logo}
          alt={agency.name}
          className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-100 group-hover:scale-105 transition-transform"
        />

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Travel Agency</h3>
          <div className="flex items-center gap-1.5 pt-0.5">
            <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
              {agency.name}
            </h4>
            {agency.verified && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-blue-50 text-[#6356E5] text-[10px] font-black border border-blue-100 shrink-0">
                <CheckCircle2 className="w-3 h-3 fill-[#6356E5] text-white" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(`tel:${agency.phone}`);
          }}
          className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Call agency"
        >
          <Phone className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/agency/${agency.id}`);
          }}
          className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] hover:bg-purple-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Chat with agency"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agency.name)}`, '_blank');
          }}
          className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Agency directions"
        >
          <Navigation className="w-4 h-4 fill-current" />
        </button>

        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0 ml-1" />
      </div>
    </div>
  );
};
