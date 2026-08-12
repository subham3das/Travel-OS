import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (num: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage = 1,
  totalPages = 125,
  totalItems = 1248,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-2 text-xs font-semibold text-slate-500 select-none">
      {/* Showing item count */}
      <div>
        Showing <span className="font-extrabold text-[#0F172A]">{startItem}</span> to{' '}
        <span className="font-extrabold text-[#0F172A]">{endItem}</span> of{' '}
        <span className="font-extrabold text-[#0F172A]">{totalItems.toLocaleString()}</span> agencies
      </div>

      {/* Rows per page + Page buttons */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Items per page dropdown */}
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-[#0F172A] pr-7 cursor-pointer hover:border-slate-300 transition-colors"
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {[1, 2, 3, 4, 5].map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/25'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <span className="px-1 text-slate-400 font-bold">...</span>

          <button
            onClick={() => onPageChange(125)}
            className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer ${
              currentPage === 125
                ? 'bg-[#6356E5] text-white shadow-md shadow-[#6356E5]/25'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            125
          </button>

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all cursor-pointer shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
