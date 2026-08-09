import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareQuote } from 'lucide-react';
import { CustomerReviewItem } from '../../data/customers';

interface ReviewCardProps {
  reviews: CustomerReviewItem[];
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ reviews }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A] flex items-center gap-2">
          <MessageSquareQuote className="w-4 h-4 text-amber-500" />
          Customer Reviews ({reviews.length})
        </h3>
        <span className="text-xs font-semibold text-slate-400">Feedback submitted by customer</span>
      </div>

      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs font-bold text-slate-400">
            No reviews submitted by customer yet.
          </div>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="p-3.5 rounded-2xl bg-amber-50/40 border border-amber-100 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-extrabold text-[#0F172A]">{rev.packageName}</span>
                <div className="flex items-center gap-1 text-amber-500 font-extrabold">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-3.5 h-3.5 ${star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-100'}`}
                    />
                  ))}
                  <span className="ml-1 text-[#0F172A] text-[11px]">{rev.rating}/5</span>
                </div>
              </div>
              <p className="text-slate-700 font-semibold leading-relaxed">"{rev.reviewText}"</p>
              <span className="text-[10px] text-slate-400 font-bold block text-right">{rev.reviewDate}</span>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard;
