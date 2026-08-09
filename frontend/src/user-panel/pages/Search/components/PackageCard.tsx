import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, CheckCircle2, ChevronRight } from 'lucide-react';
import { SearchResultItem } from '../../../data/search';

interface PackageCardProps {
  item: SearchResultItem;
}

export const PackageCard: React.FC<PackageCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      onClick={() => navigate(item.targetUrl)}
      className="bg-white rounded-3xl p-3 border border-slate-100/90 shadow-2xs hover:shadow-md hover:scale-[1.02] hover:border-[#6356E5]/30 transition-all cursor-pointer flex items-center justify-between gap-3.5 group"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Cover Image */}
        <div className="relative w-24 sm:w-28 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase shadow-2xs">
            Bestseller
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/30 backdrop-blur-md text-white hover:bg-black/50 transition-colors"
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-white'}`} />
          </button>
        </div>

        {/* Details */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <h4 className="text-sm font-extrabold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
            {item.title}
          </h4>

          <p className="text-xs font-semibold text-slate-400 truncate">
            {item.subtitle}
          </p>

          <p className="text-[11px] font-extrabold text-slate-600 flex items-center gap-1">
            <span>by Himalayan Explorers</span>
            <CheckCircle2 className="w-3 h-3 fill-[#6356E5] text-white" />
          </p>

          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{item.rating || 4.8}</span>
              <span className="text-slate-400 font-semibold">(312 reviews)</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold text-slate-400 leading-none">From</p>
              <p className="text-sm font-black text-[#0F172A] leading-tight">{item.badge || '₹14,999'}</p>
            </div>
          </div>
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#6356E5] transition-colors shrink-0 mr-1" />
    </div>
  );
};
