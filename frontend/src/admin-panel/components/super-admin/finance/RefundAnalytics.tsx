import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RefundAnalyticsData } from '../../../types/financeManagement';

interface RefundAnalyticsProps {
  data: RefundAnalyticsData;
}

export const RefundAnalytics: React.FC<RefundAnalyticsProps> = ({ data }) => {
  const points = data.trendPoints;
  const maxVal = 800;

  // Blue line: Requests
  const reqSvgPath = points.reduce((acc, curr, idx, arr) => {
    const x = (idx / (arr.length - 1)) * 100;
    const y = 100 - (curr.requests / maxVal) * 100;
    if (idx === 0) return `M ${x} ${y}`;
    const prev = arr[idx - 1];
    const px = ((idx - 1) / (arr.length - 1)) * 100;
    const py = 100 - (prev.requests / maxVal) * 100;
    const cpx = px + (x - px) / 2;
    return `${acc} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
  }, '');

  // Green line: Approved
  const appSvgPath = points.reduce((acc, curr, idx, arr) => {
    const x = (idx / (arr.length - 1)) * 100;
    const y = 100 - (curr.approved / maxVal) * 100;
    if (idx === 0) return `M ${x} ${y}`;
    const prev = arr[idx - 1];
    const px = ((idx - 1) / (arr.length - 1)) * 100;
    const py = 100 - (prev.approved / maxVal) * 100;
    const cpx = px + (x - px) / 2;
    return `${acc} C ${cpx} ${py}, ${cpx} ${y}, ${x} ${y}`;
  }, '');

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-2xs space-y-3.5 select-none flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-[#0F172A]">Refund Analytics</h3>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
          This Month
        </span>
      </div>

      {/* 4 Stat Boxes */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="bg-purple-50/60 rounded-xl p-2 border border-purple-100/60">
          <span className="text-[9px] font-bold text-[#6356E5] block truncate">Total Requests</span>
          <span className="text-sm font-black text-[#0F172A] block mt-0.5">
            {data.totalRequests.value.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>{data.totalRequests.growth}</span>
          </span>
        </div>

        <div className="bg-emerald-50/60 rounded-xl p-2 border border-emerald-100/60">
          <span className="text-[9px] font-bold text-emerald-600 block truncate">Approved Refunds</span>
          <span className="text-sm font-black text-[#0F172A] block mt-0.5">
            {data.approvedRefunds.value.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-600">
            <ArrowUpRight className="w-2.5 h-2.5" />
            <span>{data.approvedRefunds.growth}</span>
          </span>
        </div>

        <div className="bg-amber-50/60 rounded-xl p-2 border border-amber-100/60">
          <span className="text-[9px] font-bold text-amber-600 block truncate">Pending Refunds</span>
          <span className="text-sm font-black text-[#0F172A] block mt-0.5">
            {data.pendingRefunds.value.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-rose-600">
            <ArrowDownRight className="w-2.5 h-2.5" />
            <span>{data.pendingRefunds.growth}</span>
          </span>
        </div>

        <div className="bg-rose-50/60 rounded-xl p-2 border border-rose-100/60">
          <span className="text-[9px] font-bold text-rose-600 block truncate">Rejected Refunds</span>
          <span className="text-sm font-black text-[#0F172A] block mt-0.5">
            {data.rejectedRefunds.value.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-rose-600">
            <ArrowDownRight className="w-2.5 h-2.5" />
            <span>{data.rejectedRefunds.growth}</span>
          </span>
        </div>
      </div>

      {/* Dual Line Chart Area */}
      <div className="relative h-28 w-full pt-1">
        {/* Y Axis Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between text-[9px] font-bold text-slate-300 pointer-events-none">
          <div className="border-b border-slate-100 flex justify-between">
            <span>800</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>600</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>400</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>200</span>
          </div>
          <div className="border-b border-slate-100 flex justify-between">
            <span>0</span>
          </div>
        </div>

        {/* SVG Curves */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 overflow-visible">
          {/* Blue Line (Requests) */}
          <path d={reqSvgPath} fill="none" stroke="#6356E5" strokeWidth="2.5" strokeLinecap="round" />
          {/* Green Line (Approved) */}
          <path d={appSvgPath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />

          {/* Dots */}
          {points.map((p, idx) => {
            const x = (idx / (points.length - 1)) * 100;
            const ry = 100 - (p.requests / maxVal) * 100;
            const ay = 100 - (p.approved / maxVal) * 100;
            return (
              <g key={idx}>
                <circle cx={x} cy={ry} r="2.5" fill="#6356E5" />
                <circle cx={x} cy={ay} r="2.5" fill="#10B981" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100">
        <span>Jun 1</span>
        <span>Jun 3</span>
        <span>Jun 5</span>
        <span>Jun 7</span>
        <span>Jun 9</span>
        <span>Jun 12</span>
      </div>
    </div>
  );
};
