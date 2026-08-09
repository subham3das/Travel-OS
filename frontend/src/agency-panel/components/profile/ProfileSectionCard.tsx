import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileSectionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  route?: string;
  badge?: string;
  badgeType?: 'success' | 'purple';
  onClick?: () => void;
}

export const ProfileSectionCard: React.FC<ProfileSectionCardProps> = ({
  icon,
  title,
  subtitle,
  route,
  badge,
  badgeType = 'success',
  onClick,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (route) {
      navigate(route);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 sm:p-4.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100/90 shadow-2xs flex items-center justify-between gap-3 transition-all cursor-pointer select-none min-w-0 group"
    >
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        {/* Soft Purple Circle Icon */}
        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] group-hover:bg-[#583BE8] group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
          {icon}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <h4 className="text-xs sm:text-sm font-black text-[#0F172A] truncate group-hover:text-[#583BE8] transition-colors">
            {title}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Action & Optional Badge */}
      <div className="flex items-center gap-2 shrink-0">
        {badge && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              badgeType === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-purple-100 text-[#583BE8]'
            }`}
          >
            {badge}
          </span>
        )}

        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#583BE8] group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
};

export default ProfileSectionCard;
