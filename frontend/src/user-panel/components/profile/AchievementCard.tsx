import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Camera, Luggage, Globe2, Compass, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export interface AchievementBadge {
  id: string;
  title: string;
  level: string;
  unlocked?: boolean;
  icon?: string | React.ReactNode;
  bgColor?: string;
  borderColor?: string;
  iconColor?: string;
}

interface AchievementGridProps {
  badges?: AchievementBadge[];
}

const renderBadgeIcon = (icon: string | React.ReactNode) => {
  if (React.isValidElement(icon)) return icon;
  switch (icon) {
    case 'Compass':
      return <Compass className="w-6 h-6" />;
    case 'CheckCircle2':
      return <CheckCircle2 className="w-6 h-6" />;
    case 'Luggage':
      return <Luggage className="w-6 h-6" />;
    case 'Mountain':
      return <Mountain className="w-6 h-6" />;
    case 'Camera':
      return <Camera className="w-6 h-6" />;
    case 'Globe2':
      return <Globe2 className="w-6 h-6" />;
    default:
      return <Award className="w-6 h-6" />;
  }
};

export const AchievementGrid: React.FC<AchievementGridProps> = ({ badges }) => {
  const displayBadges: AchievementBadge[] = badges && badges.length > 0 ? badges : [
    {
      id: 'explorer',
      title: 'Explorer',
      level: 'Level 1',
      unlocked: true,
      icon: 'Compass',
      bgColor: 'bg-emerald-500',
      borderColor: 'border-emerald-600',
      iconColor: 'text-white',
    },
    {
      id: 'photographer',
      title: 'Photographer',
      level: 'Locked',
      unlocked: false,
      icon: 'Camera',
      bgColor: 'bg-slate-200',
      borderColor: 'border-slate-300',
      iconColor: 'text-slate-400',
    },
    {
      id: 'passport',
      title: 'Passport',
      level: 'Level 1',
      unlocked: true,
      icon: 'Luggage',
      bgColor: 'bg-amber-500',
      borderColor: 'border-amber-600',
      iconColor: 'text-white',
    },
    {
      id: 'globetrotter',
      title: 'Globetrotter',
      level: 'Locked',
      unlocked: false,
      icon: 'Globe2',
      bgColor: 'bg-slate-200',
      borderColor: 'border-slate-300',
      iconColor: 'text-slate-400',
    },
    {
      id: 'trekker',
      title: 'Trekker',
      level: 'Locked',
      unlocked: false,
      icon: 'Mountain',
      bgColor: 'bg-slate-200',
      borderColor: 'border-slate-300',
      iconColor: 'text-slate-400',
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full">
      {displayBadges.map((badge) => (
        <motion.div
          key={badge.id}
          whileHover={{ y: -3 }}
          className="flex flex-col items-center text-center group cursor-pointer"
        >
          {/* Polygon Shield Icon */}
          <div
            className={`w-12 h-14 sm:w-14 sm:h-16 ${badge.bgColor || 'bg-slate-200'} ${badge.borderColor || 'border-slate-300'} border-2 flex items-center justify-center ${badge.iconColor || 'text-white'} mb-2 shadow-sm transition-transform group-hover:scale-105`}
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          >
            {renderBadgeIcon(badge.icon)}
          </div>

          <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-tight">
            {badge.title}
          </h5>
          <p className="text-[10px] sm:text-xs font-semibold text-slate-400 leading-none mt-0.5">
            {badge.level}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
