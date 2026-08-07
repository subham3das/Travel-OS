import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, MapPin, Tag, Send } from 'lucide-react';

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('Dawki, Meghalaya');

  const handlePublish = () => {
    if (!content.trim()) return;
    alert('Post published to Community!');
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </button>
        <h2 className="text-sm font-extrabold">Create Story Post</h2>
        <button
          onClick={handlePublish}
          disabled={!content.trim()}
          className="px-4 py-1.5 rounded-full bg-[#FF4D6D] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1"
        >
          <span>Publish</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your trip story, tips, or travel recommendations with the community..."
            className="w-full text-xs sm:text-sm font-medium text-[#0F172A] placeholder-slate-400 focus:outline-none resize-none"
          />

          <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
            <button className="flex items-center gap-1 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
              <Image className="w-4 h-4 text-purple-600" /> Photo
            </button>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
              <MapPin className="w-4 h-4 text-[#FF4D6D]" /> {location}
            </button>
            <button className="flex items-center gap-1 text-xs font-bold text-slate-600 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
              <Tag className="w-4 h-4 text-amber-500" /> Tag Agency
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePostPage;
