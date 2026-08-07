import React from 'react';
import { MapPin, Sun } from 'lucide-react';

interface GreetingCardProps {
  userName?: string;
  avatarUrl?: string;
  location?: string;
  temperature?: string;
  greetingTime?: string;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({
  userName = 'Subham Das',
  avatarUrl,
  location = 'Dibrugarh',
  temperature = '28°C',
  greetingTime = 'Good Morning',
}) => {
  return (
    <div className="flex items-center gap-4 py-2">
      {/* Avatar with Online Badge */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-200">
          {avatarUrl ? (
            <img src={avatarUrl} alt={userName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-700 via-slate-800 to-slate-900 flex items-center justify-center text-white font-bold text-lg">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
          )}
        </div>
        {/* Green Online Dot */}
        <span className="absolute bottom-0 right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
      </div>

      {/* Greeting Text & Location/Weather */}
      <div className="space-y-0.5">
        <p className="text-xs sm:text-sm font-medium text-slate-400 leading-none">
          {greetingTime},
        </p>
        <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-1.5 leading-tight">
          <span>{userName}</span>
          <span className="animate-wave inline-block origin-[70%_70%]">👋</span>
        </h2>

        {/* Location & Weather info */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-0.5">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#FF4D6D]" />
            {location}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            {temperature}
          </span>
        </div>
      </div>
    </div>
  );
};
