import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle2, MapPin, Calendar, Briefcase, Languages, Zap, ArrowRight } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';
import { VerifiedBadge } from './VerifiedBadge';

export interface AgencyData {
  id: string;
  name: string;
  isVerified: boolean;
  badges: { text: string; variant: 'green' | 'blue' | 'purple' | 'amber' }[];
  rating: number;
  reviewsCount: number;
  location: string;
  yearsExperience: string;
  tripsCompleted: string;
  languagesCount: string;
  specializationTags: string[];
  startingPrice: string;
  responseTime: string;
  coverImageUrl: string;
  logoUrl?: string;
}

interface AgencyCardProps {
  agency: AgencyData;
  isCompared?: boolean;
  onCompareToggle?: (agency: AgencyData) => void;
  onViewAgency?: (agency: AgencyData) => void;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  isCompared = false,
  onCompareToggle,
  onViewAgency,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onViewAgency) {
      onViewAgency(agency);
    } else {
      navigate(`/agencies/${agency.id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="w-full rounded-3xl bg-white border border-slate-100/90 p-4 sm:p-5 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row gap-5 group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Left Column: Cover Image */}
      <div className="relative w-full md:w-64 h-48 sm:h-52 md:h-full rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img
          src={agency.coverImageUrl}
          alt={agency.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Heart Button */}
        <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton />
        </div>
      </div>

      {/* Middle Column: Agency Details */}
      <div className="flex-1 space-y-3.5 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header Row: Logo, Name & Badges */}
          <div className="flex items-start gap-3">
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
              className="w-12 h-12 rounded-2xl border border-slate-100 overflow-hidden bg-white shadow-2xs flex items-center justify-center font-bold text-slate-800 shrink-0 cursor-pointer"
            >
              {agency.logoUrl ? (
                <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
              ) : (
                <span>{agency.name.substring(0, 2).toUpperCase()}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight hover:text-[#6356E5] transition-colors cursor-pointer"
                >
                  {agency.name}
                </h3>
                {agency.isVerified && (
                  <CheckCircle2 className="w-5 h-5 text-[#6356E5] fill-[#6356E5]/10 shrink-0" />
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {agency.badges.map((badge, idx) => (
                  <VerifiedBadge key={idx} text={badge.text} variant={badge.variant} />
                ))}
              </div>
            </div>
          </div>

          {/* Rating, Reviews & Location */}
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 flex-wrap">
            <span className="flex items-center gap-1 text-amber-500 font-extrabold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{agency.rating}</span>
              <span className="text-slate-400 font-normal">({agency.reviewsCount} reviews)</span>
            </span>

            <span className="text-slate-300">•</span>

            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{agency.location}</span>
            </span>
          </div>

          {/* Key Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-100/60 text-center">
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Experience</p>
              <p className="text-xs font-bold text-[#0F172A] flex items-center justify-center gap-1">
                <Calendar className="w-3 h-3 text-[#6356E5]" />
                <span>{agency.yearsExperience}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Trips Done</p>
              <p className="text-xs font-bold text-[#0F172A] flex items-center justify-center gap-1">
                <Briefcase className="w-3 h-3 text-[#6356E5]" />
                <span>{agency.tripsCompleted}</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400">Languages</p>
              <p className="text-xs font-bold text-[#0F172A] flex items-center justify-center gap-1">
                <Languages className="w-3 h-3 text-[#6356E5]" />
                <span>{agency.languagesCount} Speaks</span>
              </p>
            </div>
          </div>

          {/* Specialization Tag Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {agency.specializationTags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-600 text-[10px] font-bold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Price & Action CTA */}
      <div className="md:w-44 flex flex-col justify-between pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-5 space-y-4">
        <div>
          <p className="text-[10px] font-semibold text-slate-400">Packages starting from</p>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#0F172A]">{agency.startingPrice}</span>
            <span className="text-[10px] text-slate-400 font-semibold">/ person</span>
          </div>
        </div>

        {/* Compare Checkbox */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (onCompareToggle) onCompareToggle(agency);
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer select-none"
        >
          <input
            type="checkbox"
            checked={isCompared}
            onChange={() => {}}
            className="w-4 h-4 rounded text-[#6356E5] focus:ring-[#6356E5]"
          />
          <span>Compare</span>
        </div>

        {/* Response Time Indicator */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold text-slate-400">Response time</p>
          <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-emerald-500" />
            <span>{agency.responseTime}</span>
          </p>
        </div>

        {/* View Agency CTA Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-bold transition-all shadow-xs focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>View Agency</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
};
