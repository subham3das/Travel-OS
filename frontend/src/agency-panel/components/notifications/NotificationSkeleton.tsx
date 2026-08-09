import React from 'react';

export const NotificationSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 select-none animate-pulse">
      <div className="h-4 w-24 bg-slate-200 rounded-md mb-2" />
      <div className="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 shadow-2xs">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3.5 pt-1 border-b border-slate-100 last:border-b-0 pb-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-36 bg-slate-200 rounded-md" />
                <div className="h-3 w-16 bg-slate-200 rounded-md" />
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-md" />
              <div className="h-3 w-3/4 bg-slate-100 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSkeleton;
