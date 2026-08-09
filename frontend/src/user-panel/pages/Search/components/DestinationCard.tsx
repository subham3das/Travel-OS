import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, ChevronRight } from 'lucide-react';
import { SearchResultItem } from '../../../data/search';

interface DestinationCardProps {
  item: SearchResultItem;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      onClick={() => navigate(item.targetUrl)}
      className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-2xs hover:shadow-md hover:scale-[1.02] hover:border-[#6356E5]/30 transition-all cursor-pointer flex items-center justify-between gap-3.5 group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Thumbnail Image */}
        <div className="relative w-24 sm:w-28 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-1.5 left-1.5 p-1 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-white'}`} />
          </button>
        </div>

        {/* Info */}
        <div className="space-y-1 min-w-0">
          <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
            {item.title}
          </h4>
          <p className="text-xs font-semibold text-slate-400 truncate">
            {item.subtitle}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 pt-0.5">
            <span className="flex items-center gap-1 text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{item.rating || 4.8}</span>
              <span className="text-slate-400 font-semibold">(512 reviews)</span>
            </span>
          </div>

          <p className="text-[11px] font-extrabold text-[#6356E5]">
            52 Packages • 14 Agencies
          </p>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0 mr-1" />
    </div>
  );
};
