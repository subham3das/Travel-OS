import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star } from 'lucide-react';
import { PackageReview } from '../../../types/package';

interface ReviewSectionProps {
  reviews: PackageReview[];
  rating: number;
  reviewCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ reviews, rating, reviewCount }) => {
  const navigate = useNavigate();

  const defaultReview: PackageReview = reviews && reviews.length > 0 ? reviews[0] : {
    id: 'pr-1',
    travelerId: 'trv-priya',
    travelerName: 'Priya Sharma',
    travelerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    date: 'May 20, 2024',
    rating: 5.0,
    comment: 'Amazing experience! Everything was perfectly organized. The itinerary, hotels and team - all were excellent.',
    photos: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400&auto=format&fit=crop',
    ],
  };

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight">
          Traveler Reviews
        </h2>
        <button className="text-xs font-bold text-[#6356E5] hover:underline flex items-center gap-0.5 cursor-pointer">
          <span>View All Reviews ({reviewCount})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          {/* Traveler Header */}
          <div
            onClick={() => navigate(`/traveler/${defaultReview.travelerId}`)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src={defaultReview.travelerAvatar}
              alt={defaultReview.travelerName}
              className="w-11 h-11 rounded-full object-cover border border-slate-100 group-hover:scale-105 transition-transform"
            />
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A] group-hover:text-[#6356E5] transition-colors">
                {defaultReview.travelerName}
              </h3>
              <p className="text-[10px] font-semibold text-slate-400">{defaultReview.date}</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 font-extrabold text-[#0F172A] text-sm">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-1 text-xs font-black">{defaultReview.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
          {defaultReview.comment}
        </p>

        {/* Review Photos Grid with +3 Overlay */}
        {defaultReview.photos && defaultReview.photos.length > 0 && (
          <div className="flex items-center gap-2 pt-1 overflow-x-auto scrollbar-none">
            {defaultReview.photos.slice(0, 2).map((img, idx) => (
              <div key={idx} className="w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
              </div>
            ))}

            {defaultReview.photos.length > 2 && (
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-2xl overflow-hidden bg-slate-900 shrink-0 cursor-pointer">
                <img
                  src={defaultReview.photos[2]}
                  alt="Review thumbnail"
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center text-white text-base font-black">
                  +{defaultReview.photos.length - 2}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
