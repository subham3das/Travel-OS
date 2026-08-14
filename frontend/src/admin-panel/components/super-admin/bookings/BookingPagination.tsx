import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface BookingPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const BookingPagination: React.FC<BookingPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 select-none text-xs font-semibold text-slate-500">
      {/* Left: Info Text */}
      <div>
        Showing <span className="font-extrabold text-[#0F172A]">{startItem}</span> to{' '}
        <span className="font-extrabold text-[#0F172A]">{endItem}</span> of{' '}
        <span className="font-extrabold text-[#0F172A]">{totalItems.toLocaleString()}</span> bookings
      </div>

      {/* Right: Page Size + Page Navigation */}
      <div className="flex items-center gap-3">
        {/* Page size dropdown */}
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-7 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6356E5] shadow-2xs cursor-pointer"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Page buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((p) => {
            if (p > totalPages && p > 5) return null;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold shadow-2xs transition-colors cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
                    : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {p}
              </button>
            );
          })}

          {totalPages > 5 && (
            <>
              <span className="px-1 text-slate-400">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-8 h-8 rounded-xl text-xs font-extrabold shadow-2xs transition-colors cursor-pointer ${
                  currentPage === totalPages
                    ? 'bg-[#6356E5] text-white shadow-[#6356E5]/20'
                    : 'bg-white border border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {totalPages.toLocaleString()}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center text-slate-600 shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
