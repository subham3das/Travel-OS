import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, ShieldCheck, User } from 'lucide-react';
import { PackageReview } from '../../../types/package';

interface ReviewSectionProps {
  reviews?: PackageReview[];
  rating?: number;
  reviewCount?: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews = [],
  rating = 0,
  reviewCount = 0,
}) => {
  const navigate = useNavigate();

  // If 0 reviews, display clean "No reviews yet" state with no fake ratings
  if (!reviews || reviews.length === 0) {
    return (
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            Traveler Reviews
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100/90 shadow-2xs text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 fill-[#6356E5]/20 text-[#6356E5]" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
            No reviews yet
          </h3>
          <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
            Be the first traveler to review this package after completing your trip.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
            Traveler Reviews
          </h2>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-xs font-extrabold text-[#0F172A] bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({reviewCount})</span>
            </div>
          )}
        </div>

        {reviews.length > 2 && (
          <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
            <span>View All ({reviews.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              {/* Traveler Header */}
              <div
                onClick={() => review.travelerId && navigate(`/traveler/${review.travelerId}`)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                {review.travelerAvatar ? (
                  <img
                    src={review.travelerAvatar}
                    alt={review.travelerName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-100 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-purple-100 text-[#6356E5] flex items-center justify-center font-black text-sm">
                    {review.travelerName ? review.travelerName.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">
                      {review.travelerName}
                    </h3>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-md">
                      <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                      <span>Verified</span>
                    </span>
                  </div>
                  {review.date && (
                    <p className="text-[10px] font-semibold text-slate-400">{review.date}</p>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 font-extrabold text-[#0F172A] text-sm">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    className={`w-3.5 h-3.5 ${
                      idx < review.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-200'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-black">{review.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Comment Text */}
            <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
              {review.comment}
            </p>

            {/* Real Review Photos Grid */}
            {review.photos && review.photos.length > 0 && (
              <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
                {review.photos.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                    <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                ))}

                {review.photos.length > 3 && (
                  <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer">
                    <img
                      src={review.photos[3]}
                      alt="Review thumbnail"
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-white text-base font-black">
                      +{review.photos.length - 3}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
