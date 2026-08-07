import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';

export interface TravelerStory {
  id: string;
  avatarUrl: string;
  quote: string;
  authorName: string;
  destinationName: string;
  thumbnailUrl: string;
}

const defaultStories: TravelerStory[] = [
  {
    id: 'story-1',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    quote: '“I spent five days in Spiti and it changed the way I travel.”',
    authorName: 'Ananya Sharma',
    destinationName: 'Spiti Valley',
    thumbnailUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'story-2',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    quote: '“Trekking through Meghalaya waterfalls was an unforgettable soul refresh.”',
    authorName: 'Rohan Mehta',
    destinationName: 'Cherrapunji',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=600&auto=format&fit=crop',
  },
  {
    id: 'story-3',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    quote: '“Staying with local families in Ladakh showed me true Himalayan hospitality.”',
    authorName: 'Priya Nair',
    destinationName: 'Pangong Lake',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=600&auto=format&fit=crop',
  },
];

interface TravelerStoryCardProps {
  stories?: TravelerStory[];
  onReadStory?: (story: TravelerStory) => void;
}

export const TravelerStoryCard: React.FC<TravelerStoryCardProps> = ({
  stories = defaultStories,
  onReadStory,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const currentStory = stories[activeIdx];

  return (
    <div className="w-full space-y-2">
      {/* Small Section Subtitle */}
      <span className="text-xs font-extrabold text-[#FF4D6D] uppercase tracking-wider">
        Traveler Story
      </span>

      {/* Main Card */}
      <div className="relative w-full rounded-3xl bg-[#FFF8F6] border border-rose-100/60 p-5 sm:p-6 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Column: Avatar & Story Quote */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-slate-200">
                <img
                  src={currentStory.avatarUrl}
                  alt={currentStory.authorName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm sm:text-base font-bold text-[#0F172A] leading-snug tracking-tight">
                  {currentStory.quote}
                </p>

                <p className="text-xs font-semibold text-slate-500">
                  <span>{currentStory.authorName}</span>
                  <span className="mx-1 text-slate-300">•</span>
                  <span className="text-[#FF4D6D]">{currentStory.destinationName}</span>
                </p>
              </div>
            </div>

            {/* Bottom Actions: Dots & Read Story */}
            <div className="flex items-center justify-between pt-2">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {stories.map((story, idx) => (
                  <button
                    key={story.id}
                    onClick={() => setActiveIdx(idx)}
                    className="focus:outline-none"
                    aria-label={`Story ${idx + 1}`}
                  >
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIdx ? 'w-5 bg-[#FF4D6D]' : 'w-1.5 bg-rose-200'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Read Story Button */}
              <button
                onClick={() => onReadStory && onReadStory(currentStory)}
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#FF4D6D] hover:text-[#e03d5c] transition-colors focus:outline-none"
              >
                <span>Read Story</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Thumbnail Video/Photo Preview */}
          <div className="md:col-span-5 relative w-full h-36 sm:h-44 md:h-36 rounded-2xl overflow-hidden shadow-xs border border-white/60 group cursor-pointer"
               onClick={() => onReadStory && onReadStory(currentStory)}>
            <img
              src={currentStory.thumbnailUrl}
              alt={currentStory.destinationName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />

            {/* Play Button Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-[#FF4D6D] pl-0.5"
              >
                <Play className="w-5 h-5 fill-[#FF4D6D]" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
