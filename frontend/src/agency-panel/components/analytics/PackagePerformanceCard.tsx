import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PackageAnalyticsItem } from '../../data/analytics';

interface PackagePerformanceCardProps {
  packages: PackageAnalyticsItem[];
  sortBy: 'Revenue' | 'Bookings' | 'Rating';
  onSortChange: (sortBy: 'Revenue' | 'Bookings' | 'Rating') => void;
}

export const PackagePerformanceCard: React.FC<PackagePerformanceCardProps> = ({
  packages,
  sortBy,
  onSortChange,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs sm:text-sm font-extrabold text-slate-700">
          Top Performing Packages
        </span>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="appearance-none bg-slate-50 border border-slate-200/80 text-slate-700 font-extrabold text-[11px] px-3 py-1 rounded-xl focus:outline-none shadow-2xs cursor-pointer"
        >
          <option value="Revenue">By Revenue</option>
          <option value="Bookings">By Bookings</option>
          <option value="Rating">By Rating</option>
        </select>
      </div>

      {/* Package List */}
      <div className="space-y-3 divide-y divide-slate-100/80">
        {packages.slice(0, 5).map((pkg, idx) => (
          <div key={pkg.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-5 h-5 rounded-full bg-purple-50 text-[#583BE8] text-[10px] font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </span>

              <img
                src={pkg.coverImage}
                alt={pkg.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
              />

              <div className="min-w-0 space-y-0.5">
                <h4 className="text-xs font-black text-[#0F172A] truncate">
                  {pkg.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-400">
                  {pkg.bookings} Bookings
                </p>
              </div>
            </div>

            <span className="text-xs font-black text-[#0F172A] shrink-0">
              {pkg.revenue}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="pt-2 border-t border-slate-100 text-center">
        <button
          type="button"
          onClick={() => navigate('/agency/packages')}
          className="text-xs font-black text-[#583BE8] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View All Packages</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default PackagePerformanceCard;
