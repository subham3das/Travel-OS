import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Play, Star, Image, MapPin, Camera, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface UserMediaPost {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

interface MediaTabsSectionProps {
  posts?: UserMediaPost[];
}

export const MediaTabsSection: React.FC<MediaTabsSectionProps> = ({ posts = [] }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('posts');

  const tabs = [
    { id: 'posts', label: 'Posts', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'stories', label: 'Stories', icon: <Play className="w-4 h-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="w-4 h-4" /> },
    { id: 'photos', label: 'Photos', icon: <Image className="w-4 h-4" /> },
  ];

  return (
    <div className="w-full rounded-3xl bg-white border border-slate-100 p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Tabs Header */}
      <div className="grid grid-cols-4 gap-1 border-b border-slate-100 pb-2 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-2 px-1 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors focus:outline-none cursor-pointer ${
                isActive ? 'text-[#FF4D6D]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeMediaTab"
                  className="absolute -bottom-[9px] inset-x-1 h-0.5 bg-[#FF4D6D] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Posts Media Grid or Empty State */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ y: -3 }}
              className="relative h-44 rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group cursor-pointer"
            >
              <img
                src={post.imageUrl}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent p-3 flex flex-col justify-end text-white">
                <p className="text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#FF4D6D]" />
                  {post.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF4D6D] flex items-center justify-center border border-rose-100">
            <Camera className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-black text-[#0F172A]">No travel moments shared yet</h5>
            <p className="text-xs font-semibold text-slate-400 max-w-xs mx-auto">
              Share your journeys, photos, and stories with the ApnaTrip traveler community!
            </p>
          </div>
          <button
            onClick={() => navigate('/create-post')}
            className="px-4 py-2 rounded-2xl bg-[#FF4D6D] hover:bg-[#ff3358] text-white text-xs font-extrabold shadow-md shadow-[#FF4D6D]/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Create Travel Post</span>
          </button>
        </div>
      )}
    </div>
  );
};
