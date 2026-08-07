import React, { useState } from 'react';
import { ArrowLeft, Share2, Heart, MoreVertical, Star, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Agency } from '../../../types/agency';

interface AgencyHeroProps {
  agency: Agency;
}

export const AgencyHero: React.FC<AgencyHeroProps> = ({ agency }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="relative w-full bg-slate-950 text-white overflow-hidden">
      {/* Cover Image */}
      <div className="relative w-full h-72 sm:h-96">
        <img
          src={agency.coverImage}
          alt={agency.name}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

        {/* Top Header Buttons Bar - Exactly matching reference image */}
        <div className="absolute top-4 sm:top-6 inset-x-4 sm:inset-x-8 flex items-center justify-between z-30">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-slate-800" />
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: agency.name, url: window.location.href });
                } else {
                  alert('Agency link copied to clipboard!');
                }
              }}
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
              aria-label="Share Agency"
            >
              <Share2 className="w-4.5 h-4.5 text-slate-800" />
            </button>

            <button
              onClick={() => setIsWishlisted((p) => !p)}
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
              aria-label="Wishlist Agency"
            >
              <Heart
                className={`w-4.5 h-4.5 ${
                  isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-800'
                }`}
              />
            </button>

            <button
              onClick={() => alert('More agency options')}
              className="w-10 h-10 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-lg hover:bg-slate-100 transition-all cursor-pointer active:scale-95"
              aria-label="More Options"
            >
              <MoreVertical className="w-4.5 h-4.5 text-slate-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Agency Title & Details Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            {/* Logo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-slate-950 bg-white overflow-hidden shadow-2xl shrink-0 flex items-center justify-center text-slate-800 font-extrabold text-xl">
              {agency.logo ? (
                <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover" />
              ) : (
                <span>{agency.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            {/* Title Info */}
            <div className="space-y-1 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold">
                  ✓ {agency.featuredBadge || 'Verified Partner'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {agency.name}
                </h1>
                {agency.isVerified && (
                  <CheckCircle2 className="w-6 h-6 text-[#6356E5] fill-[#6356E5]/20 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-300 flex-wrap">
                <span className="flex items-center gap-1 font-bold text-amber-300">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span>{agency.rating}</span>
                  <span className="text-slate-300 font-normal">({agency.reviewCount} Reviews)</span>
                </span>
                <span className="text-slate-500">•</span>
                <span>{agency.tripsCompleted} Trips Completed</span>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-400 pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6356E5]" />
                  {agency.location}
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {agency.yearsExperience}+ Years in Business
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
