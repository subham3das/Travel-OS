import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'dark',
  size = 'md',
  showSubtitle = false,
  className = '',
  onClick,
}) => {
  const isDark = variant === 'dark';

  const sizeClasses = {
    sm: {
      plane: 'w-5 h-5',
      text: 'text-xl',
      sub: 'text-xs',
      spacing: 'gap-1',
    },
    md: {
      plane: 'w-7 h-7',
      text: 'text-3xl',
      sub: 'text-sm',
      spacing: 'gap-1.5',
    },
    lg: {
      plane: 'w-9 h-9',
      text: 'text-4xl',
      sub: 'text-base',
      spacing: 'gap-2',
    },
  }[size];

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center text-center ${
        onClick ? 'cursor-pointer select-none' : ''
      } ${className}`}
    >
      {/* Plane icon with dotted flight curve path above text */}
      <div className="relative mb-1 flex items-center justify-center">
        {/* Dashed flight trail curve */}
        <svg
          width="70"
          height="32"
          viewBox="0 0 70 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-slate-400/60"
        >
          <path
            d="M 5 28 C 20 28, 35 15, 58 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeDasharray="3 3"
            strokeLinecap="round"
          />
        </svg>

        {/* Floating Airplane */}
        <motion.div
          initial={{ x: -10, y: 5, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute -top-1 right-1"
        >
          <svg
            className={`${sizeClasses.plane} text-[#0F172A] transform rotate-12`}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </motion.div>
      </div>

      {/* Brand Text */}
      <motion.h1
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`${sizeClasses.text} font-extrabold tracking-tight ${
          isDark ? 'text-[#0F172A]' : 'text-white'
        }`}
      >
        ApnaTrip
      </motion.h1>

      {/* Subtitle */}
      {showSubtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`${sizeClasses.sub} font-medium mt-1 ${
            isDark ? 'text-slate-500' : 'text-white/80'
          }`}
        >
          Your Journey Begins Here
        </motion.p>
      )}

      {/* Decorative Accent Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="w-8 h-[3px] bg-[#FF4D6D] rounded-full mt-2"
      />
    </div>
  );
};
