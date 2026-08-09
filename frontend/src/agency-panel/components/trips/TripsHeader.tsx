import React from 'react';

export const TripsHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
          Upcoming Trips
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Manage and operate all your upcoming trips
        </p>
      </div>
    </div>
  );
};

export default TripsHeader;
