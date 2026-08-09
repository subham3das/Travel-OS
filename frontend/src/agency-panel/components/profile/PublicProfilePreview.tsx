import React from 'react';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';
import { AgencyHeroData } from '../../data/profile';
import { useNavigate } from 'react-router-dom';

interface PublicProfilePreviewProps {
  hero: AgencyHeroData;
}

export const PublicProfilePreview: React.FC<PublicProfilePreviewProps> = ({ hero }) => {
  const navigate = useNavigate();

  const handleViewPublic = () => {
    navigate(`/public/agency/${hero.agencyId}`);
  };

  return (
    <div className="bg-purple-50/40 rounded-3xl p-4 sm:p-5 border border-purple-200/60 space-y-3 select-none overflow-hidden">
      <h3 className="text-xs font-black text-[#583BE8] uppercase tracking-wider">
        Public Profile Preview
      </h3>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-purple-100 shadow-2xs">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-200 overflow-hidden shrink-0">
            <img
              src={hero.logo}
              alt={hero.agencyName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate">
                {hero.agencyName}
              </h4>
              {hero.isVerified && (
                <CheckCircle className="w-3.5 h-3.5 text-[#583BE8] fill-[#583BE8] shrink-0 stroke-none" />
              )}
            </div>

            <p className="text-[11px] font-semibold text-slate-500 truncate">
              {hero.category}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-slate-600 truncate">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
              <span>{hero.rating} ({hero.reviewCount} Reviews)</span>
              <span className="text-slate-400 font-semibold">• {hero.location}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleViewPublic}
          className="px-4 py-2.5 rounded-2xl border border-[#583BE8] hover:bg-purple-50 text-[#583BE8] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
        >
          <span>View Public Profile</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PublicProfilePreview;
