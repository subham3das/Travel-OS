import React from 'react';

export const LoadingBookingSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4 animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="w-24 h-24 rounded-2xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-20 h-4 rounded bg-slate-200" />
                <div className="w-24 h-6 rounded-full bg-slate-200" />
              </div>
              <div className="w-48 h-5 rounded bg-slate-200" />
              <div className="w-36 h-4 rounded bg-slate-200" />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="w-32 h-4 rounded bg-slate-200" />
            <div className="w-20 h-6 rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingBookingSkeleton;
