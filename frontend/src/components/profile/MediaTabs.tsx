import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Play, Star, Image, MapPin } from 'lucide-react';

export interface UserMediaPost {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
}

const defaultUserPosts: UserMediaPost[] = [
  {
    id: 'p-1',
    title: 'Ladakh Road Trip',
    location: 'Ladakh',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p-2',
    title: 'Meghalaya Waterfalls',
    location: 'Meghalaya',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p-3',
    title: 'Goa Sunset',
    location: 'Goa',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'p-4',
    title: 'Spiti Monastery',
    location: 'Spiti Valley',
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
  },
];

export const MediaTabsSection: React.FC = () => {
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

      {/* Posts Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {defaultUserPosts.map((post) => (
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
    </div>
  );
};
