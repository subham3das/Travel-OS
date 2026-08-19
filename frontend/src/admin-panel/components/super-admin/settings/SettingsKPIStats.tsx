import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Layers,
  LayoutGrid,
  Database,
  Zap,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { SettingsKPIStats, SettingsKPICardItem } from '../../../types/settingsManagement';

interface SettingsKPIStatsProps {
  stats: SettingsKPIStats;
  onCardClick?: (id: string) => void;
}

export const SettingsKPIStatsCards: React.FC<SettingsKPIStatsProps> = ({
  stats,
  onCardClick,
}) => {
  const getCardIcon = (type: SettingsKPICardItem['iconType']) => {
    switch (type) {
      case 'health':
        return {
          icon: <Heart className="w-4 h-4 text-[#6356E5]" />,
          bg: 'bg-purple-50',
          strokeColor: '#6356E5',
        };
      case 'integrations':
        return {
          icon: <Layers className="w-4 h-4 text-blue-600" />,
          bg: 'bg-blue-50',
          strokeColor: '#3B82F6',
        };
      case 'modules':
        return {
          icon: <LayoutGrid className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50',
          strokeColor: '#8B5CF6',
        };
      case 'storage':
        return {
          icon: <Database className="w-4 h-4 text-[#6356E5]" />,
          bg: 'bg-purple-50',
          strokeColor: '#6356E5',
        };
      case 'api':
        return {
          icon: <Zap className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50',
          strokeColor: '#8B5CF6',
        };
      case 'backup':
      default:
        return {
          icon: <Clock className="w-4 h-4 text-purple-600" />,
          bg: 'bg-purple-50',
          strokeColor: '#8B5CF6',
        };
    }
  };

  const cardsList: SettingsKPICardItem[] = [
    stats.platformHealth,
    stats.activeIntegrations,
    stats.enabledModules,
    stats.storageUsage,
    stats.apiRequestsToday,
    stats.lastBackup,
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 w-full select-none">
      {cardsList.map((card, idx) => {
        const { icon, bg, strokeColor } = getCardIcon(card.iconType);

        return (
          <motion.div
            key={card.id || idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.03 }}
            whileHover={{ y: -2 }}
            onClick={() => onCardClick && onCardClick(card.id)}
            className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between group"
          >
            {/* Top row: Title + Icon */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] font-bold text-slate-400 truncate">{card.title}</p>
                <h3 className="text-lg sm:text-xl font-black text-[#0F172A] tracking-tight group-hover:text-[#6356E5] transition-colors truncate">
                  {card.value}
                </h3>
              </div>

              <div
                className={`w-8 h-8 rounded-2xl ${bg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
              >
                {icon}
              </div>
            </div>

            {/* Middle Section: Progress Bar or Mini Sparkline */}
            {card.progressPercent !== undefined ? (
              <div className="my-2.5 space-y-1">
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#6356E5]"
                    style={{ width: `${card.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono text-slate-400">
                  <span>136 GB</span>
                  <span>200 GB</span>
                </div>
              </div>
            ) : card.sparklineColor ? (
              <div className="my-2.5 h-3.5 w-full opacity-75 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 100 20" className="w-full h-full" fill="none">
                  <path
                    d="M0 14 Q 25 18, 50 8 T 100 4"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            ) : (
              <div className="my-2.5 h-3.5" />
            )}

            {/* Bottom row: Subtitle / Comparison */}
            <div className="pt-1.5 flex items-center gap-1.5 text-[10px] font-extrabold border-t border-slate-50">
              {card.growth ? (
                <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded-md font-black text-emerald-600 bg-emerald-50">
                  <ArrowUpRight className="w-2.5 h-2.5 stroke-[3]" />
                  <span>{card.growth}</span>
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
              <span className="font-semibold text-slate-500 truncate">
                {card.subtitle || card.comparison}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
