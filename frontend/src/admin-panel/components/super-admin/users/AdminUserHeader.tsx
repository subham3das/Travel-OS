import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Download, Plus } from 'lucide-react';

interface AdminUserHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleFilter: () => void;
  isFilterOpen: boolean;
  onExport: () => void;
  onAddUser: () => void;
}

export const AdminUserHeader: React.FC<AdminUserHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onToggleFilter,
  isFilterOpen,
  onExport,
  onAddUser,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
      {/* Left: Back Button + Title + Subtitle */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => navigate('/admin')}
          className="w-9 h-9 rounded-2xl bg-white border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs shrink-0"
          title="Back to Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Users
          </h1>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Manage all registered travelers on the platform.
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Filter, Export, Add User */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Quick Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] shadow-2xs transition-all"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={onToggleFilter}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs font-extrabold shadow-2xs transition-all cursor-pointer ${
            isFilterOpen
              ? 'bg-[#EEF2FF] border-[#6356E5] text-[#6356E5]'
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Filter</span>
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-extrabold shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export</span>
        </button>

        {/* Add User CTA Button */}
        <button
          onClick={onAddUser}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>
    </div>
  );
};
