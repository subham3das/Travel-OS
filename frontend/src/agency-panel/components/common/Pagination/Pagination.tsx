import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-extrabold select-none ${className}`}>
      {/* Item Range Counter */}
      <div className="text-slate-400 text-[11px] font-semibold">
        Showing <span className="text-[#0F172A] font-extrabold">{startItem}</span> -{' '}
        <span className="text-[#0F172A] font-extrabold">{endItem}</span> of{' '}
        <span className="text-[#0F172A] font-extrabold">{totalItems}</span> items
      </div>

      <div className="flex items-center gap-2">
        {/* Items Per Page Select */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 mr-2">
            <span className="text-slate-400 text-[11px]">Show</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-2 py-1 rounded-xl border border-slate-200 bg-white font-extrabold text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}

        {/* Previous Button */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-[#583BE8] hover:text-[#583BE8] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) =>
            typeof p === 'number' ? (
              <button
                key={idx}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-xl font-black text-xs transition-all cursor-pointer ${
                  currentPage === p
                    ? 'bg-[#583BE8] text-white shadow-md shadow-[#583BE8]/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-[#583BE8] hover:text-[#583BE8]'
                }`}
              >
                {p}
              </button>
            ) : (
              <span key={idx} className="px-1 text-slate-400 font-bold">
                ...
              </span>
            )
          )}
        </div>

        {/* Next Button */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-[#583BE8] hover:text-[#583BE8] disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
