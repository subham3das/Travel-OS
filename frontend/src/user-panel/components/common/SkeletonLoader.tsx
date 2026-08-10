import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3 animate-pulse">
    <div className="w-full h-44 bg-slate-200 rounded-2xl" />
    <div className="space-y-2">
      <div className="h-4 bg-slate-200 rounded-md w-3/4" />
      <div className="h-3 bg-slate-200 rounded-md w-1/2" />
    </div>
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <div className="h-4 bg-slate-200 rounded-md w-1/4" />
      <div className="h-8 bg-slate-200 rounded-xl w-24" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="w-full bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between gap-4 animate-pulse"
      >
        <div className="flex items-center gap-3 w-full">
          <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded-md w-2/3" />
            <div className="h-3 bg-slate-200 rounded-md w-1/3" />
          </div>
        </div>
        <div className="w-6 h-6 bg-slate-200 rounded-full shrink-0" />
      </div>
    ))}
  </div>
);

export const HeroSkeleton: React.FC = () => (
  <div className="w-full h-64 sm:h-80 bg-slate-200 rounded-3xl animate-pulse" />
);
