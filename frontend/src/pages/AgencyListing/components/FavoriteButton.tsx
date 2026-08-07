import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface FavoriteButtonProps {
  initialState?: boolean;
  onToggle?: (isFav: boolean) => void;
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  initialState = false,
  onToggle,
  className = '',
}) => {
  const [isFav, setIsFav] = useState(initialState);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isFav;
    setIsFav(nextState);
    if (onToggle) onToggle(nextState);
  };

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={handleClick}
      className={`w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-2xs hover:bg-white transition-all focus:outline-none cursor-pointer ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-colors ${
          isFav ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-slate-600 hover:text-slate-900'
        }`}
      />
    </motion.button>
  );
};
