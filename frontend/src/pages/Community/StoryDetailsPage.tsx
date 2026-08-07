import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Share2, Send, MapPin } from 'lucide-react';

export const StoryDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([
    { id: '1', author: 'Ananya S', text: 'This looks so serene! Is Dawki boating open during November?', time: '2h ago' },
    { id: '2', author: 'Subham D', text: 'Yes, November to March is the best time for crystal clear water!', time: '1h ago' },
  ]);

  const story = {
    authorName: 'Rohan Verma',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    timeAgo: '3 hours ago',
    location: 'Dawki, Meghalaya',
    content: 'Floating on the emerald Umngot river in Dawki felt like floating in air! Organized through Himalayan Explorers, everything from camping to local guide was top notch.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1000&auto=format&fit=crop',
    likesCount: 142,
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments((prev) => [...prev, { id: String(Date.now()), author: 'You', text: commentText.trim(), time: 'Just now' }]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Story Post</h2>
        <button className="p-2 text-slate-500"><Share2 className="w-4 h-4" /></button>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-24">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3">
            <img src={story.authorAvatar} alt={story.authorName} className="w-11 h-11 rounded-full object-cover" />
            <div>
              <h4 className="text-sm font-extrabold text-[#0F172A]">{story.authorName}</h4>
              <p className="text-xs font-medium text-slate-400 flex items-center gap-1">
                <span>{story.timeAgo}</span> • <MapPin className="w-3 h-3 text-[#FF4D6D]" /> {story.location}
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">{story.content}</p>

          <img src={story.image} alt="Story" className="w-full h-64 sm:h-80 rounded-2xl object-cover" />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 text-[#FF4D6D]">
              <Heart className="w-4 h-4 fill-current" /> {story.likesCount} Likes
            </span>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> {comments.length} Comments
            </span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
          <h3 className="text-sm font-extrabold text-[#0F172A]">Comments</h3>

          <div className="space-y-3">
            {comments.map((c) => (
              <div key={c.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#0F172A]">{c.author}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-xs font-medium text-slate-600">{c.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-4 py-2.5 text-xs font-semibold text-[#0F172A] focus:outline-none focus:bg-white"
            />
            <button type="submit" className="p-2.5 rounded-full bg-[#FF4D6D] text-white">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default StoryDetailsPage;
