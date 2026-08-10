import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Share2, Send, Smile, Filter } from 'lucide-react';

import { getCommentsByPostId, addCommentToPost, addReplyToComment, CommentItem } from '../../data/comments';
import { useToast } from '../../context/ToastContext';
import { TravelerPost, PostData } from '../../components/community/TravelerPost';
import { CommentCard } from './components/CommentCard';

const sampleFeedPost: PostData = {
  id: 'post-001',
  authorName: 'Ananya Sharma',
  authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  isVerified: true,
  timeAgo: '2h ago',
  location: 'Spiti Valley',
  imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=800&auto=format&fit=crop',
  slideCount: '1/8',
  caption:
    'Today I finally reached Chandratal Lake after an amazing trek through the mountains! The view was absolutely unreal. Nature at its best! 🏔️💙',
  likesCount: 254,
  commentsCount: 128,
  sharesCount: 18,
  agencyName: 'Himalayan Trekkers',
  agencyVerified: true,
};

export const PostCommentsPage: React.FC = () => {
  const { postId } = useParams<{ postId?: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const targetPostId = postId || 'post-001';
  const [comments, setComments] = useState<CommentItem[]>(getCommentsByPostId(targetPostId));
  const [sortOption, setSortOption] = useState<'top' | 'newest' | 'oldest'>('top');

  const [inputContent, setInputContent] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);

  const mentionUsers = ['Subham Das', 'Ananya Sharma', 'Rahul Verma', 'Wander North Travel'];

  const handleInputChange = (val: string) => {
    setInputContent(val);
    if (val.endsWith('@')) {
      setShowMentionSuggestions(true);
    } else if (!val.includes('@')) {
      setShowMentionSuggestions(false);
    }
  };

  const handleSelectMention = (name: string) => {
    const updated = inputContent.replace(/@[a-zA-Z0-9\s]*$/, `@${name} `);
    setInputContent(updated);
    setShowMentionSuggestions(false);
  };

  const handleAddTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim()) return;

    addCommentToPost(targetPostId, inputContent.trim());
    setComments(getCommentsByPostId(targetPostId));
    setInputContent('');
    setShowMentionSuggestions(false);
  };

  const handleReplySubmit = (parentId: string, replyText: string) => {
    addReplyToComment(parentId, replyText);
    setComments(getCommentsByPostId(targetPostId));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Comments & Discussion
          </h1>

          <button
            onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
              showToast('Post link copied to clipboard!', 'success');
            }}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
        {/* Reusing existing TravelerPost component */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TravelerPost
            post={sampleFeedPost}
            onAgencyClick={() => navigate('/agency/agency-001')}
          />
        </motion.div>

        {/* Comment Summary Bar & Sorting */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <div>
            <h2 className="text-sm sm:text-base font-black text-[#0F172A]">
              Comments ({comments.length + 54})
            </h2>
            <p className="text-xs font-semibold text-slate-400">
              Verified traveler opinions and discussions
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-black text-slate-700 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-[#6356E5]" />
            <select
              value={sortOption}
              onChange={(e: any) => setSortOption(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="top">Top Comments</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.map((cmt) => (
            <motion.div
              key={cmt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <CommentCard comment={cmt} onReplySubmit={handleReplySubmit} />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Sticky Bottom Comment Input Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-2">
          {/* Mentions Suggestions Overlay */}
          <AnimatePresence>
            {showMentionSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white rounded-2xl p-2 border border-slate-200 shadow-lg space-y-1"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Mention User:</p>
                <div className="flex flex-wrap gap-1">
                  {mentionUsers.map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => handleSelectMention(u)}
                      className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs font-black transition-colors cursor-pointer"
                    >
                      @{u}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAddTopComment} className="flex items-center gap-2">
            <input
              type="text"
              value={inputContent}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Share your thoughts... (Type @ to mention)"
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all"
            />

            <button
              type="submit"
              disabled={!inputContent.trim()}
              className={`p-3.5 rounded-2xl text-white font-bold transition-all cursor-pointer shadow-md ${
                inputContent.trim()
                  ? 'bg-[#6356E5] hover:bg-[#5245d6] shadow-[#6356E5]/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostCommentsPage;
