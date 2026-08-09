import React from 'react';
import { DetailedPackage } from '../../../data/packageDetails';
import { Star, ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReviewsPreviewProps {
  reviews: DetailedPackage['reviews'];
  packageName: string;
}

export const ReviewsPreview: React.FC<ReviewsPreviewProps> = ({ reviews, packageName }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-lg font-black text-[#0F172A] flex items-center gap-2 truncate">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 shrink-0" />
          <span className="truncate">Traveler Reviews ({reviews.averageRating})</span>
        </h3>

        <button
          type="button"
          onClick={() => alert(`Navigating to all reviews for ${packageName}`)}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Summary Score & Distribution Bar Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 sm:p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 overflow-hidden">
        {/* Rating Score */}
        <div className="flex flex-col items-center justify-center text-center space-y-1 sm:border-r sm:border-amber-200/80 pr-0 sm:pr-4">
          <span className="text-2xl sm:text-4xl font-black text-[#0F172A]">
            {reviews.averageRating}
          </span>
          <div className="flex items-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-500">Based on recent travelers</span>
        </div>

        {/* Rating Distribution Bars */}
        <div className="sm:col-span-2 space-y-1.5 justify-center flex flex-col min-w-0">
          {reviews.ratingBreakdown.map((item) => (
            <div key={item.stars} className="flex items-center gap-2 text-xs font-bold text-slate-600 min-w-0">
              <span className="w-8 shrink-0 flex items-center gap-1">
                {item.stars} <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
              <div className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden min-w-0">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="w-8 text-right text-slate-400 font-semibold shrink-0">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Reviews */}
      <div className="space-y-3 pt-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
          Latest Verified Reviews
        </h4>

        <div className="space-y-2.5">
          {reviews.latestReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center font-bold shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-extrabold text-[#0F172A] truncate">{rev.travelerName}</h5>
                    <p className="text-[10px] text-slate-400 font-semibold truncate">Trip: {rev.tripDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="font-semibold text-slate-700 italic break-words">"{rev.comment}"</p>
              <span className="text-[10px] font-bold text-slate-400 block text-right">
                Reviewed on {rev.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewsPreview;
