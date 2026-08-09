import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, CloudSun, MapPin } from 'lucide-react';
import { Destination } from '../../../data/destinations';

interface DestinationHeroProps {
  destination: Destination;
}

export const DestinationHero: React.FC<DestinationHeroProps> = ({ destination }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination.name,
        text: destination.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Destination link copied to clipboard!');
    }
  };

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] overflow-hidden bg-slate-900">
      {/* Background Image */}
      <img
        src={destination.heroImage}
        alt={destination.name}
        className="w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

      {/* Top Floating Buttons */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer focus:outline-none"
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-white'}`} />
          </button>
          <button
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all cursor-pointer focus:outline-none"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hero Bottom Information */}
      <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 z-20 flex items-end justify-between gap-4">
        <div className="space-y-1.5 text-white max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-[#FF4D6D]" />
            <span>{destination.region}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none text-white drop-shadow-md">
            {destination.name}
          </h1>

          <p className="text-xs sm:text-sm font-semibold text-white/90">
            {destination.tagline}
          </p>

          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pt-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{destination.rating}</span>
            <span className="text-white/70">({destination.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Right Floating Weather Badge */}
        <div className="hidden min-[480px]:flex flex-col items-end p-3 rounded-2xl bg-black/35 backdrop-blur-md border border-white/20 text-white text-right shrink-0">
          <div className="flex items-center gap-2">
            <CloudSun className="w-6 h-6 text-amber-300" />
            <span className="text-xl font-black">{destination.weather.temp}</span>
          </div>
          <p className="text-xs font-bold text-white/90">{destination.weather.condition}</p>
          <p className="text-[10px] font-semibold text-white/70 pt-0.5">
            ↑ {destination.weather.high}  ↓ {destination.weather.low}
          </p>
        </div>
      </div>
    </div>
  );
};
