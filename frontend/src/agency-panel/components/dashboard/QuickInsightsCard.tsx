import React from 'react';
import { TrendingUp, Flame, AlertTriangle, Wallet } from 'lucide-react';
import { QuickInsightItem } from '../../data/dashboardInsights';

interface QuickInsightsCardProps {
  items: QuickInsightItem[];
}

export const QuickInsightsCard: React.FC<QuickInsightsCardProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 select-none flex flex-col justify-between">
      <div className="w-full text-left">
        <span className="text-xs font-bold text-slate-500">Quick Insights</span>
      </div>

      <div className="space-y-3 pt-1">
        {items.map((item) => {
          let IconComponent = TrendingUp;
          let iconBg = 'bg-emerald-50 text-emerald-600';

          if (item.type === 'fire') {
            IconComponent = Flame;
            iconBg = 'bg-amber-50 text-amber-600';
          } else if (item.type === 'warning') {
            IconComponent = AlertTriangle;
            iconBg = 'bg-rose-50 text-rose-600';
          } else if (item.type === 'wallet') {
            IconComponent = Wallet;
            iconBg = 'bg-sky-50 text-sky-600';
          }

          return (
            <div key={item.id} className="flex items-start gap-2.5">
              <div className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${iconBg}`}>
                <IconComponent className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-[#0F172A] leading-tight truncate">
                  {item.title}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickInsightsCard;
