import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export interface HeroSlide {
  id: string;
  tag: string;
  titlePrefix: string;
  titleBold: string;
  description: string;
  ctaText: string;
  imageUrl: string;
  path: string;
}

const defaultSlides: HeroSlide[] = [
  {
    id: 'meghalaya',
    tag: 'EXPLORE NOW',
    titlePrefix: 'Discover',
    titleBold: 'Meghalaya',
    description: 'Explore waterfalls, living root bridges, caves and hidden gems.',
    ctaText: 'Explore Now',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    path: '/explore/meghalaya',
  },
  {
    id: 'kashmir',
    tag: 'DESTINATION OF THE MONTH',
    titlePrefix: 'Unexplored',
    titleBold: 'Kashmir',
    description: 'Experience snow-capped peaks, pristine lakes and rich alpine beauty.',
    ctaText: 'View Packages',
    imageUrl: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=1200&auto=format&fit=crop',
    path: '/explore/kashmir',
  },
  {
    id: 'kerala',
    tag: 'TOP CHOICE',
    titlePrefix: 'Serene',
    titleBold: 'Kerala',
    description: 'Cruise through tranquil backwaters and lush tropical greenery.',
    ctaText: 'Book Trip',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    path: '/explore/kerala',
  },
  {
    id: 'spiti',
    tag: 'ADVENTURE AWAITS',
    titlePrefix: 'Mystical',
    titleBold: 'Spiti Valley',
    description: 'Discover ancient monasteries and rugged high-altitude desert trails.',
    ctaText: 'Explore Spiti',
    imageUrl: 'https://images.unsplash.com/photo-1568849676085-51415703900f?q=80&w=1200&auto=format&fit=crop',
    path: '/explore/spiti',
  },
];

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoPlayInterval?: number;
  onExploreClick?: (slide: HeroSlide) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides = defaultSlides,
  autoPlayInterval = 5000,
  onExploreClick,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [slides.length, autoPlayInterval]);

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px] rounded-3xl overflow-hidden shadow-md border border-slate-100/50 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Image */}
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.titleBold}
            className="w-full h-full object-cover object-center"
          />

          {/* Dark Overlay for max text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

          {/* Slide Content */}
          <div className="absolute inset-0 p-6 sm:p-8 md:p-10 flex flex-col justify-between text-white z-10">
            {/* Top Tag with Accent Bar */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-0.5 bg-[#FF4D6D] rounded-full" />
              <span className="text-[11px] sm:text-xs font-extrabold tracking-widest text-white/90 uppercase">
                {currentSlide.tag}
              </span>
            </div>

            {/* Middle Title & Description */}
            <div className="space-y-1.5 sm:space-y-2 max-w-lg">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight tracking-tight drop-shadow-md">
                <span className="font-normal block text-white/90">{currentSlide.titlePrefix}</span>
                <span className="font-black text-white">{currentSlide.titleBold}</span>
              </h2>

              <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-md font-medium leading-relaxed">
                {currentSlide.description}
              </p>
            </div>

            {/* Bottom CTA Button */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onExploreClick && onExploreClick(currentSlide)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF4D6D] hover:bg-[#e03d5c] text-white font-bold text-[11px] shadow-md shadow-[#FF4D6D]/30 transition-all focus:outline-none"
              >
                <span>{currentSlide.ctaText}</span>
                <ArrowRight className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Dots Navigation */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIndex(idx)}
            className="focus:outline-none"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <motion.div
              animate={{
                width: idx === currentIndex ? 20 : 6,
                backgroundColor: idx === currentIndex ? '#FF4D6D' : 'rgba(255, 255, 255, 0.5)',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
