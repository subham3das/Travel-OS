import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, CheckCircle2, MoreHorizontal, ArrowRight } from 'lucide-react';

export interface PostData {
  id: string;
  userId?: string;
  authorName: string;
  authorAvatar: string;
  isVerified?: boolean;
  timeAgo: string;
  location: string;
  imageUrl: string;
  slideCount?: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  agencyName?: string;
  agencyVerified?: boolean;
}

interface TravelerPostProps {
  post: PostData;
  onAgencyClick?: (agencyName: string) => void;
}

export const TravelerPost: React.FC<TravelerPostProps> = ({ post, onAgencyClick }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-2xs space-y-3.5"
    >
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/community/user/${post.userId || 'user-001'}`)}
          className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
            <img src={post.authorAvatar} alt={post.authorName} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-[#0F172A] tracking-tight">{post.authorName}</h4>
              {post.isVerified && <CheckCircle2 className="w-4 h-4 text-sky-500 fill-sky-500/10 shrink-0" />}
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              {post.timeAgo} <span className="text-slate-300">•</span> {post.location}
            </p>
          </div>
        </button>

        <button className="text-slate-400 hover:text-slate-600 focus:outline-none p-1">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Image Container */}
      <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden bg-slate-100">
        <img src={post.imageUrl} alt={post.location} className="w-full h-full object-cover" />
        {post.slideCount && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[11px] font-bold">
            {post.slideCount}
          </div>
        )}
      </div>

      {/* Caption Text */}
      <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
        {post.caption}
      </p>

      {/* Engagement Actions */}
      <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-600">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1.5 focus:outline-none transition-colors ${
              isLiked ? 'text-[#FF4D6D]' : 'hover:text-[#FF4D6D]'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#FF4D6D]' : ''}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => navigate(`/community/post/${post.id}`)}
            className="flex items-center gap-1.5 hover:text-slate-900 focus:outline-none transition-colors cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentsCount}</span>
          </button>

          <button className="flex items-center gap-1.5 hover:text-slate-900 focus:outline-none transition-colors">
            <Share2 className="w-5 h-5" />
            <span>{post.sharesCount}</span>
          </button>
        </div>

        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`focus:outline-none transition-colors ${
            isBookmarked ? 'text-[#FF4D6D]' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-[#FF4D6D]' : ''}`} />
        </button>
      </div>

      {/* Agency Attribution Bar */}
      {post.agencyName && (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="text-slate-400 font-normal">Visited via</span>
            <span className="font-bold text-[#0F172A]">{post.agencyName}</span>
            {post.agencyVerified && <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 shrink-0" />}
          </div>

          <button
            onClick={() => onAgencyClick && onAgencyClick(post.agencyName!)}
            className="flex items-center gap-1 text-[#FF4D6D] hover:underline focus:outline-none"
          >
            <span>View Agency</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
