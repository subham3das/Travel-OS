import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp, Heart, Flame, Award, CheckCircle2, Pin, MessageSquare, Send, Building2 } from 'lucide-react';
import { CommentItem } from '../../../data/comments';

interface CommentCardProps {
  comment: CommentItem;
  onReplySubmit: (parentId: string, replyText: string) => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({ comment, onReplySubmit }) => {
  const navigate = useNavigate();
  const [likes, setLikes] = useState(comment.likeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleLikeToggle = () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplySubmit(comment.id, replyText.trim());
    setReplyText('');
    setShowReplyBox(false);
  };

  return (
    <div className={`space-y-3 p-3.5 sm:p-4 rounded-3xl border transition-all ${
      comment.isPinned
        ? 'bg-purple-50/40 border-purple-200'
        : comment.isAgency
        ? 'bg-sky-50/30 border-sky-100'
        : 'bg-white border-slate-100'
    }`}>
      {/* Pinned Header */}
      {comment.isPinned && (
        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#6356E5]">
          <Pin className="w-3.5 h-3.5 fill-current" />
          <span>Pinned by Author</span>
        </div>
      )}

      {/* Main Comment Row */}
      <div className="flex items-start gap-3">
        <img
          src={comment.userAvatar}
          alt={comment.userName}
          onClick={() => navigate(`/community/user/${comment.userId}`)}
          className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-100 mt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
        />

        <div className="flex-1 min-w-0 space-y-1">
          {/* Header Info */}
          <div className="flex flex-wrap items-center justify-between gap-1">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span
                onClick={() => navigate(`/community/user/${comment.userId}`)}
                className="text-xs sm:text-sm font-black text-[#0F172A] truncate cursor-pointer hover:underline hover:text-[#6356E5]"
              >
                {comment.userName}
              </span>

              {comment.isAgency && (
                <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  <span>Agency</span>
                </span>
              )}

              {comment.isVerifiedTraveler && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Verified Traveler</span>
                </span>
              )}

              <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                ⭐ {comment.reputationTitle}
              </span>
            </div>

            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
              {comment.createdAt}
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-xs font-medium text-slate-700 leading-relaxed break-words pt-0.5">
            {comment.content}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-4 pt-1.5 text-xs font-extrabold text-slate-500">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center gap-1 hover:text-[#6356E5] cursor-pointer transition-colors ${
                hasLiked ? 'text-[#6356E5]' : ''
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={() => setShowReplyBox((prev) => !prev)}
              className="flex items-center gap-1 hover:text-[#6356E5] cursor-pointer transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </div>

          {/* Inline Reply Input Box */}
          <AnimatePresence>
            {showReplyBox && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSendReply}
                className="pt-2 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to @${comment.userName}...`}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#0F172A] focus:outline-none focus:border-[#6356E5]"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3 py-1.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold hover:bg-[#5245d6] transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Recursive Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-6 sm:pl-8 space-y-3 pt-2 border-l-2 border-slate-100">
          {comment.replies.map((reply) => (
            <CommentCard key={reply.id} comment={reply} onReplySubmit={onReplySubmit} />
          ))}
        </div>
      )}
    </div>
  );
};
