import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Image, Video, MapPin, BarChart2 } from 'lucide-react';

interface CreatePostCardProps {
  userAvatar?: string;
  onPostCreate?: (text: string) => void;
}

export const CreatePostCard: React.FC<CreatePostCardProps> = ({
  userAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  onPostCreate,
}) => {
  const [postText, setPostText] = useState('');

  const handlePost = () => {
    if (!postText.trim()) return;
    if (onPostCreate) onPostCreate(postText);
    setPostText('');
  };

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Top Input Row */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-100 bg-slate-200">
          <img src={userAvatar} alt="User Avatar" className="w-full h-full object-cover" />
        </div>

        <input
          type="text"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Share your travel story..."
          className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handlePost}
          disabled={!postText.trim()}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
            postText.trim()
              ? 'bg-[#FF4D6D] text-white shadow-xs hover:bg-[#e03d5c]'
              : 'bg-rose-100 text-rose-300 cursor-not-allowed'
          }`}
        >
          Post
        </motion.button>
      </div>

      {/* Bottom Media Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors focus:outline-none shrink-0">
          <Image className="w-4 h-4 text-sky-500" />
          <span>Photo</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors focus:outline-none shrink-0">
          <Video className="w-4 h-4 text-purple-500" />
          <span>Video</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors focus:outline-none shrink-0">
          <MapPin className="w-4 h-4 text-[#FF4D6D]" />
          <span>Location</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors focus:outline-none shrink-0">
          <BarChart2 className="w-4 h-4 text-emerald-500" />
          <span>Poll</span>
        </button>
      </div>
    </div>
  );
};
