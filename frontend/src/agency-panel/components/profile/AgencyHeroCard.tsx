import React from 'react';
import { Camera, CheckCircle, Star, Calendar, MapPin, Briefcase, Users, ShieldCheck } from 'lucide-react';
import { AgencyHeroData } from '../../data/profile';

interface AgencyHeroCardProps {
  hero: AgencyHeroData;
  onEditCover?: () => void;
  onEditLogo?: () => void;
}

export const AgencyHeroCard: React.FC<AgencyHeroCardProps> = ({
  hero,
  onEditCover,
  onEditLogo,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      {/* Cover Photo */}
      <div className="relative h-44 sm:h-56 w-full bg-slate-900 overflow-hidden">
        <img
          src={hero.coverImage}
          alt={hero.agencyName}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Change Cover Camera Button */}
        <button
          type="button"
          onClick={onEditCover}
          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-800 flex items-center justify-center transition-all cursor-pointer shadow-md"
          title="Change Cover Photo"
        >
          <Camera className="w-4 h-4 text-purple-900" />
        </button>
      </div>

      {/* Hero Content Section */}
      <div className="p-4 sm:p-6 pt-0 relative space-y-4">
        {/* Overlapping Logo */}
        <div className="flex items-end justify-between -mt-12 sm:-mt-14 mb-2">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white bg-slate-900 shadow-lg overflow-hidden shrink-0">
              <img
                src={hero.logo}
                alt={hero.agencyName}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={onEditLogo}
              className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#583BE8] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform cursor-pointer"
              title="Change Logo"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Name & Badges */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {hero.agencyName}
            </h1>
            {hero.isVerified && (
              <span className="w-5 h-5 rounded-full bg-[#583BE8] text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-3.5 h-3.5 fill-current text-white stroke-none" />
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            {hero.category}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span>{hero.rating}</span>
            <span className="text-slate-400 font-semibold">({hero.reviewCount} Reviews)</span>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-bold pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{hero.yearsInBusiness}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>{hero.location}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-700 font-extrabold ml-auto sm:ml-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Verified Agency</span>
          </div>
        </div>

        {/* Summary Metric Cards (2 Columns) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Card 1: Total Packages */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/40 border border-purple-100/90 flex items-center justify-between min-w-0">
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase block truncate">
                Total Packages
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0F172A] block truncate">
                {hero.totalPackages}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-[#583BE8] flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-50/40 border border-purple-100/90 flex items-center justify-between min-w-0">
            <div className="min-w-0 space-y-0.5">
              <span className="text-[10px] sm:text-xs font-extrabold text-slate-400 uppercase block truncate">
                Total Bookings
              </span>
              <span className="text-lg sm:text-2xl font-black text-[#0F172A] block truncate">
                {hero.totalBookings}
              </span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-purple-100/80 text-[#583BE8] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyHeroCard;
