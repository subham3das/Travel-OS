import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface TravelAgency {
  id: string;
  name: string;
  logoUrl?: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  specialization: string;
  tripsCompleted: string;
  bgColor?: string;
}

interface AgencyCardProps {
  agency: TravelAgency;
  onViewAgency?: (agency: TravelAgency) => void;
  className?: string;
}

export const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  onViewAgency,
  className = '',
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
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
      onClick={handleNavigate}
      className={`bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between shrink-0 w-64 sm:w-72 cursor-pointer group ${className}`}
    >
      <div className="space-y-3">
        {/* Header: Logo + Verified Badge */}
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-extrabold text-[#0F172A] shadow-2xs border border-slate-100 ${
              agency.bgColor || 'bg-slate-900 text-white'
            }`}
          >
            {agency.logoUrl ? (
              <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
            ) : (
              <span>{agency.name.substring(0, 2).toUpperCase()}</span>
            )}
          </div>

          <div className="space-y-0.5 overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm sm:text-base font-bold text-[#0F172A] tracking-tight truncate">
                {agency.name}
              </h4>
              {agency.isVerified && (
                <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/10 shrink-0" />
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
              <span>{agency.rating}</span>
              <span className="text-slate-400">({agency.reviewsCount})</span>
            </div>
          </div>
        </div>

        {/* Specialization Pill */}
        <div className="pt-1">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600">
            {agency.specialization}
          </span>
        </div>
      </div>

      {/* Footer: Trips completed + View Button */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Briefcase className="w-3.5 h-3.5 text-[#FF4D6D]" />
          {agency.tripsCompleted}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleNavigate();
          }}
          className="text-xs font-bold text-[#FF4D6D] group-hover:underline focus:outline-none cursor-pointer"
        >
          View Profile →
        </button>
      </div>
    </motion.div>
  );
};

export default AgencyCard;
