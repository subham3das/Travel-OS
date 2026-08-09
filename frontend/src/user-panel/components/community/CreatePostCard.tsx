import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Video, MapPin, Plus } from 'lucide-react';

interface CreatePostCardProps {
  userAvatar?: string;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate('/community/create')}
      className="w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-2xs space-y-3 cursor-pointer hover:border-purple-200 transition-colors"
    >
      {/* Top Input Row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
          <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
        </div>

        <input
          type="text"
          readOnly
          placeholder="Share your travel story or experience..."
          className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none cursor-pointer"
        />

        <div className="px-4 py-1.5 rounded-full bg-[#6356E5] text-white text-xs font-black shadow-xs hover:bg-[#5245d6] transition-all flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" />
          <span>Post</span>
        </div>
      </div>

      {/* Bottom Media Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold shrink-0">
          <Image className="w-4 h-4 text-sky-500" />
          <span>Photo</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold shrink-0">
          <Video className="w-4 h-4 text-purple-500" />
          <span>Video</span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold shrink-0">
          <MapPin className="w-4 h-4 text-rose-500" />
          <span>Check In</span>
        </div>
      </div>
    </div>
  );
};
