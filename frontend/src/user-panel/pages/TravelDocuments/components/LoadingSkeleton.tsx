import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse my-6">
      <div className="h-28 bg-slate-200/70 rounded-3xl w-full" />
      <div className="h-14 bg-slate-200/50 rounded-2xl w-full" />
      <div className="space-y-3 pt-2">
        <div className="h-16 bg-slate-200/70 rounded-3xl w-full" />
        <div className="h-16 bg-slate-200/70 rounded-3xl w-full" />
        <div className="h-16 bg-slate-200/70 rounded-3xl w-full" />
      </div>
    </div>
  );
};
