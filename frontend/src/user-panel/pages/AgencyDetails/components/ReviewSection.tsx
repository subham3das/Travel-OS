import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { AgencyReview } from '../../../types/agency';

interface ReviewSectionProps {
  reviews: AgencyReview[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews }) => {
  const navigate = useNavigate();

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight">
          What Travelers Say
        </h3>
        <button
          onClick={() => alert('All reviews viewer coming soon!')}
          className="text-xs sm:text-sm font-bold text-[#6356E5] hover:underline focus:outline-none flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>View All Reviews</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {reviews.map((rev) => (
          <motion.div
            key={rev.id}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            className="w-[310px] sm:w-[380px] lg:w-[420px] rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-2xs space-y-3 shrink-0 flex flex-col justify-between"
          >
            {/* Header: Avatar + Name + Rating */}
            <div className="flex items-start justify-between gap-3">
              <div
                onClick={() => navigate(`/traveler/${rev.travelerId}`)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <img
                  src={rev.travelerAvatar}
                  alt={rev.travelerName}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-100"
                />
                <div>
                  <h4 className="text-sm font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors leading-tight">
                    {rev.travelerName}
                  </h4>
                  <p className="text-xs font-medium text-slate-400 pt-0.5">{rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs sm:text-sm font-black text-amber-500 shrink-0 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rev.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Content & Photo Row */}
            <div className="flex items-start justify-between gap-3 flex-1">
              <div className="space-y-3 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed line-clamp-3">
                  {rev.comment}
                </p>

                {/* Tag Chips */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {rev.tags.map((tg, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-[#F5F3FF] text-[#6356E5] text-[11px] font-extrabold"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>

              {/* Optional Photo Thumbnail */}
              {rev.imageUrl && (
                <div className="w-24 sm:w-28 h-20 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={rev.imageUrl}
                    alt="Traveler photo"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
