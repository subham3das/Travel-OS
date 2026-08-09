import React from 'react';
import { Home, BarChart2, Flame, CreditCard, Star, ArrowRight } from 'lucide-react';
import { AnalyticsInsightItem } from '../../data/analytics';

interface BusinessInsightsCardProps {
  insights: AnalyticsInsightItem[];
}

export const BusinessInsightsCard: React.FC<BusinessInsightsCardProps> = ({ insights }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Insights & Trends
        </span>
      </div>

      {/* Insights List */}
      <div className="space-y-3 pt-1">
        {insights.map((item) => {
          let IconComp = Home;
          let iconColor = 'bg-sky-50 text-sky-600';

          if (item.iconType === 'package') {
            IconComp = BarChart2;
            iconColor = 'bg-purple-50 text-[#583BE8]';
          } else if (item.iconType === 'warning') {
            IconComp = Flame;
            iconColor = 'bg-amber-50 text-amber-600';
          } else if (item.iconType === 'trend') {
            IconComp = CreditCard;
            iconColor = 'bg-emerald-50 text-emerald-600';
          } else if (item.iconType === 'rating') {
            IconComp = Star;
            iconColor = 'bg-indigo-50 text-indigo-600';
          }

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`p-1.5 rounded-xl shrink-0 ${iconColor}`}>
                <IconComp className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-bold text-slate-700 leading-snug">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => alert('Detailed BI Insights Report — ready')}
          className="text-xs font-black text-[#583BE8] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View Detailed Report</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default BusinessInsightsCard;
