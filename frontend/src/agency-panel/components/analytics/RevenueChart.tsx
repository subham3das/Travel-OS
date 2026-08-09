import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RevenueOverviewData } from '../../data/analytics';

interface RevenueChartProps {
  data: RevenueOverviewData;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Revenue Overview
        </span>

        <select className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer">
          <option value="This Month">This Month</option>
          <option value="This Week">This Week</option>
          <option value="This Year">This Year</option>
        </select>
      </div>

      {/* Main Grid: Line Chart on Left, Revenue Metrics Column on Right */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue Line Chart */}
        <div className="md:col-span-2 space-y-3">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold text-slate-400">Total Revenue</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                {data.totalRevenue}
              </h3>
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{data.growthPct} vs last month</span>
              </p>
            </div>
          </div>

          {/* Lightweight SVG Line Chart */}
          <div className="relative pt-2">
            <svg viewBox="0 0 400 120" className="w-full h-32 overflow-visible">
              <defs>
                <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#583BE8" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#583BE8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Y Axis Grid Lines */}
              <line x1="0" y1="20" x2="400" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="55" x2="400" y2="55" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="0" y1="90" x2="400" y2="90" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="3 3" />

              {/* Y Axis Text */}
              <text x="0" y="22" fill="#94A3B8" fontSize="9" fontWeight="600">₹1,00K</text>
              <text x="0" y="57" fill="#94A3B8" fontSize="9" fontWeight="600">₹75K</text>
              <text x="0" y="92" fill="#94A3B8" fontSize="9" fontWeight="600">₹25K</text>
              <text x="0" y="115" fill="#94A3B8" fontSize="9" fontWeight="600">₹0</text>

              {/* Gradient Area */}
              <path
                d="M 40 100 Q 90 75, 140 60 T 240 40 T 340 30 L 380 15 L 380 110 L 40 110 Z"
                fill="url(#revAreaGrad)"
              />

              {/* Smooth Line */}
              <path
                d="M 40 100 Q 90 75, 140 60 T 240 40 T 340 30 L 380 15"
                fill="none"
                stroke="#583BE8"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Dots */}
              {[
                { x: 40, y: 100 },
                { x: 95, y: 80 },
                { x: 150, y: 60 },
                { x: 205, y: 72 },
                { x: 260, y: 40 },
                { x: 315, y: 48 },
                { x: 350, y: 32 },
                { x: 380, y: 15 },
              ].map((pt, i) => (
                <circle
                  key={i}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  fill="#583BE8"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>

            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 pl-8">
              {data.chartLabels.map((lbl) => (
                <span key={lbl}>{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Financial Details */}
        <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-100 space-y-3.5 flex flex-col justify-center">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Gross Revenue
            </span>
            <span className="text-sm sm:text-base font-black text-[#0F172A]">
              {data.grossRevenue}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Refunds
            </span>
            <span className="text-sm font-black text-rose-600">
              {data.refunds}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Net Revenue
            </span>
            <span className="text-sm sm:text-base font-black text-[#583BE8]">
              {data.netRevenue}
            </span>
          </div>

          <div className="pt-1 border-t border-slate-200/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              Avg. Booking Value
            </span>
            <span className="text-sm font-black text-[#0F172A]">
              {data.avgBookingValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;
