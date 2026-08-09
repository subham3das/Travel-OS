import React from 'react';

export const DashboardInsightsSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 select-none animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-1">
        <div className="h-5 w-36 bg-slate-200 rounded-md" />
        <div className="h-4 w-28 bg-slate-200 rounded-md" />
      </div>

      {/* Top Row Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 h-48 space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-8 w-44 bg-slate-200 rounded" />
          <div className="h-20 w-full bg-slate-100 rounded-xl" />
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 h-48 space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Row Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 h-40 space-y-3">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-16 bg-slate-200 rounded" />
            <div className="h-12 w-full bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardInsightsSkeleton;
