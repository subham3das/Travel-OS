import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw, Home, Sparkles, Star } from 'lucide-react';
import { TravelerPost } from '../../../components/community/TravelerPost';

interface PublishedPreviewProps {
  postData: {
    type: 'story' | 'experience' | 'tip' | 'question';
    title?: string;
    caption: string;
    destinationName?: string;
    agencyName?: string;
    images?: string[];
    videoUrl?: string;
    tags?: string[];
    rating?: number;
  };
  onReset: () => void;
}

export const PublishedPreview: React.FC<PublishedPreviewProps> = ({ postData, onReset }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Published Success Banner */}
      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-black text-[#0F172A]">Published Successfully! 🎉</h2>
        <p className="text-xs font-semibold text-slate-500">
          Your {postData.type === 'story' ? 'Travel Story Reel' : 'Post'} is now live in the ApnaTrip Community.
        </p>
      </div>

      {/* Live Preview Card (Reusing Community Feed Post design) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#6356E5]" />
            <span>Live Feed Preview</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6356E5] text-[10px] font-black uppercase">
            Just Now
          </span>
        </div>

        {/* Video Story Reel Preview */}
        {postData.type === 'story' && postData.videoUrl ? (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100/90 shadow-2xs space-y-3 p-4">
            <div className="relative aspect-[9/16] max-h-96 mx-auto rounded-2xl overflow-hidden bg-black shadow-md">
              <video
                src={postData.videoUrl}
                controls
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 pt-1">
              <h3 className="text-base font-black text-[#0F172A]">{postData.title}</h3>
              <p className="text-xs font-medium text-slate-600">{postData.caption}</p>
              <div className="flex flex-wrap gap-1 pt-1">
                {postData.tags?.map((t) => (
                  <span key={t} className="text-[11px] font-bold text-[#6356E5]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Normal Post Preview using TravelerPost component */
          <TravelerPost
            post={{
              id: 'preview-post',
              authorName: 'Subham Das',
              authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
              isVerified: true,
              timeAgo: 'Just now',
              location: postData.destinationName || 'Meghalaya',
              imageUrl: postData.images && postData.images[0] ? postData.images[0] : 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop',
              caption: postData.title ? `${postData.title}\n\n${postData.caption}` : postData.caption,
              likesCount: 0,
              commentsCount: 0,
              sharesCount: 0,
              agencyName: postData.agencyName,
              agencyVerified: true,
            }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={() => navigate('/community')}
          className="w-full py-3.5 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>View in Community Feed</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onReset}
            className="py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-purple-100"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Create Another</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/community')}
            className="py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Community</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
