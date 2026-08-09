import React from 'react';

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-5 border border-slate-100 space-y-3 animate-pulse">
          <div className="w-full h-40 bg-slate-200/70 rounded-2xl" />
          <div className="h-4 bg-slate-200/70 rounded-md w-3/4" />
          <div className="h-3 bg-slate-200/50 rounded-md w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-slate-200/70 rounded-md w-20" />
            <div className="h-8 bg-slate-200/70 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-full bg-slate-200/70 shrink-0" />
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="h-4 bg-slate-200/70 rounded-md w-1/3" />
              <div className="h-3 bg-slate-200/50 rounded-md w-1/2" />
            </div>
          </div>
          <div className="h-6 bg-slate-200/70 rounded-full w-16 shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between">
        <div className="h-4 bg-slate-200/70 rounded-md w-1/4" />
        <div className="h-4 bg-slate-200/70 rounded-md w-1/6" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="h-4 bg-slate-200/60 rounded-md w-1/3" />
            <div className="h-4 bg-slate-200/60 rounded-md w-1/4" />
            <div className="h-4 bg-slate-200/60 rounded-md w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200/70 rounded-md w-1/3" />
        <div className="h-8 bg-slate-200/70 rounded-xl w-28" />
      </div>
      <div className="h-56 bg-slate-100/80 rounded-2xl flex items-end justify-between p-4 gap-2">
        {[40, 65, 30, 80, 50, 90, 70].map((h, i) => (
          <div key={i} className="w-full bg-purple-200/60 rounded-t-lg" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-slate-200/70 shrink-0" />
        <div className="space-y-2 flex-1">
          <div className="h-5 bg-slate-200/70 rounded-md w-1/2" />
          <div className="h-3 bg-slate-200/50 rounded-md w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
        <div className="h-12 bg-slate-100/70 rounded-xl" />
        <div className="h-12 bg-slate-100/70 rounded-xl" />
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-white rounded-3xl p-4 border border-slate-100 animate-pulse" />
        ))}
      </div>
      <ChartSkeleton />
      <ListSkeleton rows={3} />
    </div>
  );
};

export const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <ChartSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CardSkeleton count={2} />
      </div>
    </div>
  );
};

export const PackageSkeleton: React.FC = () => <CardSkeleton count={3} />;
export const TripSkeleton: React.FC = () => <ListSkeleton rows={4} />;
export const TravelerSkeleton: React.FC = () => <ListSkeleton rows={5} />;
