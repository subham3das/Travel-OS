import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Phone, MessageSquare, Navigation, ChevronRight, Building } from 'lucide-react';
import { Trip } from '../../../data/trips';

interface AgencyCardProps {
  trip: Trip;
}

const DEFAULT_AGENCY_LOGO =
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=200&auto=format&fit=crop';

export const AgencyCard: React.FC<AgencyCardProps> = ({ trip }) => {
  const navigate = useNavigate();
  const agency = trip?.agency || ({} as any);

  const agencyName = agency.name || (agency as any)?.businessName || 'Verified Travel Partner';
  const agencyLogo = agency.logo || DEFAULT_AGENCY_LOGO;
  const agencyPhone = agency.phone || '';
  const agencyId = agency.id || trip?.agencyId || '';

  const handleCardClick = () => {
    if (agencyId && agencyId !== 'car-agency') {
      navigate(`/agencies/${agencyId}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
        agencyId ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-slate-100 shrink-0 border border-slate-100 flex items-center justify-center">
          {agencyLogo ? (
            <img
              src={agencyLogo}
              alt={agencyName}
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                (e.target as HTMLElement).style.display = 'none';
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <Building className="w-5 h-5 text-slate-400" />
          )}
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {trip?.tripType === 'car_rental' ? 'Car Rental Partner' : 'Travel Agency'}
          </h3>
          <div className="flex items-center gap-1.5 pt-0.5">
            <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
              {agencyName}
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
        {agencyPhone && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`tel:${agencyPhone}`);
            }}
            className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Call agency"
          >
            <Phone className="w-4 h-4 fill-current" />
          </button>
        )}

        {agencyId && agencyId !== 'car-agency' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/agencies/${agencyId}`);
            }}
            className="w-9 h-9 rounded-2xl bg-purple-50 text-[#6356E5] hover:bg-purple-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Chat with agency"
          >
            <MessageSquare className="w-4 h-4 fill-current" />
          </button>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(agencyName)}`,
              '_blank'
            );
          }}
          className="w-9 h-9 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 flex items-center justify-center transition-colors cursor-pointer"
          title="Agency directions"
        >
          <Navigation className="w-4 h-4 fill-current" />
        </button>

        {agencyId && (
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0 ml-1" />
        )}
      </div>
    </div>
  );
};
