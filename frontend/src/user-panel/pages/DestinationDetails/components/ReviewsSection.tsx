import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface ReviewsSectionProps {
  destination: Destination;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ destination }) => {
  const [helpfulCounts, setHelpfulCounts] = useState<{ [key: string]: number }>({});
  const [liked, setLiked] = useState<{ [key: string]: boolean }>({});

  const toggleHelpful = (id: string) => {
    const isLiked = liked[id];
    setLiked((prev) => ({ ...prev, [id]: !isLiked }));
    setHelpfulCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 12) + (isLiked ? -1 : 1),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Traveler Reviews
          </h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 pt-0.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{destination.rating} out of 5</span>
            <span className="text-slate-400">({destination.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {destination.reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-2xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.author}
                  className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                />
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">{rev.author}</h3>
                  <p className="text-[10px] font-bold text-slate-400">{rev.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              {rev.comment}
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <button
                onClick={() => toggleHelpful(rev.id)}
                className={`flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  liked[rev.id] ? 'text-[#6356E5]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${liked[rev.id] ? 'fill-current' : ''}`} />
                <span>Helpful ({helpfulCounts[rev.id] || 12})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
