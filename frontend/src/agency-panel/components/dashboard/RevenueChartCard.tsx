import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RevenueData } from '../../data/dashboardInsights';

interface RevenueChartCardProps {
  data: RevenueData;
  selectedRange: string;
  onRangeChange: (range: any) => void;
}

export const RevenueChartCard: React.FC<RevenueChartCardProps> = ({
  data,
  selectedRange,
  onRangeChange,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header with Title & Dropdown */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-bold text-slate-500">
          Revenue This Month
        </span>

        <select
          value={selectedRange}
          onChange={(e) => onRangeChange(e.target.value)}
          className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="Today">Today</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Revenue Amount & Growth Badge */}
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          {data.revenueAmount}
        </h3>
        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>{data.growthPct} vs last month</span>
        </p>
      </div>

      {/* Lightweight SVG Mini Line Chart */}
      <div className="pt-2 relative">
        <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#583BE8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#583BE8" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

          {/* Y Axis Labels */}
          <text x="0" y="22" fill="#94A3B8" fontSize="8" fontWeight="600">₹60K</text>
          <text x="0" y="52" fill="#94A3B8" fontSize="8" fontWeight="600">₹40K</text>
          <text x="0" y="82" fill="#94A3B8" fontSize="8" fontWeight="600">₹20K</text>

          {/* Area Fill */}
          <path
            d="M 30 75 Q 70 65, 110 50 T 190 35 T 270 20 L 270 90 L 30 90 Z"
            fill="url(#purpleGradient)"
          />

          {/* Smooth Line Path */}
          <path
            d="M 30 75 Q 70 65, 110 50 T 190 35 T 270 20"
            fill="none"
            stroke="#583BE8"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Dots matching reference image */}
          <circle cx="30" cy="75" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="70" cy="70" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="110" cy="50" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="62" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="190" cy="35" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="230" cy="42" r="4" fill="#583BE8" stroke="white" strokeWidth="2" />
          <circle cx="270" cy="20" r="5" fill="#583BE8" stroke="white" strokeWidth="2" />
        </svg>

        {/* X Axis Labels */}
        <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 pt-1 px-1">
          <span>1 Aug</span>
          <span>8 Aug</span>
          <span>15 Aug</span>
          <span>22 Aug</span>
          <span>31 Aug</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChartCard;
