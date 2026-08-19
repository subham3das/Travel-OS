import React from 'react';
import { LogIn, Zap, FileText, Clock } from 'lucide-react';
import { AdminQuickStatItem } from '../../../types/profileManagement';

interface ProfileQuickStatsProps {
  stats: AdminQuickStatItem[];
}

export const ProfileQuickStats: React.FC<ProfileQuickStatsProps> = ({ stats }) => {
  const getIcon = (type: AdminQuickStatItem['iconType']) => {
    switch (type) {
      case 'logins':
        return <LogIn className="w-4 h-4 text-purple-600" />;
      case 'actions':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'reports':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'active':
      default:
        return <Clock className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3 select-none">
      <h3 className="text-xs font-black text-[#0F172A] pb-1 border-b border-slate-100/80">
        Quick Statistics
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((st) => (
          <div
            key={st.id}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400">{st.title}</span>
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                {getIcon(st.iconType)}
              </div>
            </div>

            <div>
              <span className="text-base font-black text-[#0F172A] tracking-tight">{st.value}</span>
              {st.growth && (
                <span className="text-[9px] font-semibold text-emerald-600 block">
                  {st.growth}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
