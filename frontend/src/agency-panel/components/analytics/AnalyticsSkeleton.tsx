import React from 'react';

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 select-none animate-pulse">
      {/* Top 5 KPI Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 h-28 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-slate-200" />
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-6 w-24 bg-slate-200 rounded" />
          </div>
        ))}
      </div>

      {/* Large Revenue Overview Card Skeleton */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 h-72 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-32 bg-slate-200 rounded" />
          <div className="h-4 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-48 w-full bg-slate-100 rounded-2xl" />
      </div>

      {/* 2-Col Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-100 h-56 space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-36 w-full bg-slate-100 rounded-2xl" />
        </div>
        <div className="bg-white rounded-3xl p-5 border border-slate-100 h-56 space-y-3">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-36 w-full bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
