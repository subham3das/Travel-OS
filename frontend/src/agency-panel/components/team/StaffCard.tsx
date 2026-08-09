import React from 'react';
import { Search, Filter, Star, Calendar } from 'lucide-react';
import { AvailableStaffMember, StaffRole } from '../../data/staff';

interface StaffCardProps {
  staffList: AvailableStaffMember[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  onAssignStaff: (staff: AvailableStaffMember) => void;
  onViewMore?: () => void;
}

export const StaffCard: React.FC<StaffCardProps> = ({
  staffList,
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  onAssignStaff,
  onViewMore,
}) => {
  const roles: string[] = ['All Roles', 'Tour Guide', 'Assistant Guide', 'Driver', 'Coordinator'];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-4 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-extrabold text-[#0F172A]">Available Staff</h3>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 sm:w-44 min-w-[140px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search staff..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#583BE8]"
            />
          </div>

          {/* Role Dropdown */}
          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#583BE8] cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Availability Dropdown */}
          <select className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#583BE8] cursor-pointer">
            <option value="all">Available Now</option>
            <option value="busy">Busy</option>
          </select>

          <button
            type="button"
            onClick={() => alert('Advanced Filter coming soon')}
            className="p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-600 hover:text-[#583BE8] transition-colors cursor-pointer"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Staff List Rows */}
      <div className="divide-y divide-slate-100">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="py-3 hover:bg-slate-50/80 rounded-2xl transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2"
          >
            {/* Left: Avatar & Main Details */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <img
                src={st.avatar}
                alt={st.name}
                className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
              />

              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                    {st.name}
                  </h4>
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider ${
                      st.role === 'Tour Guide'
                        ? 'text-purple-600'
                        : st.role === 'Driver'
                        ? 'text-sky-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {st.role}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-400 truncate">
                  {st.languages.join(', ')}
                </p>
              </div>
            </div>

            {/* Middle & Right: Experience, Rating, Badge & Assign Button */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
              <div className="text-left sm:text-right space-y-0.5">
                <div className="flex items-center sm:justify-end gap-2 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{st.experienceYears} Years Exp.</span>
                  </span>
                  <span className="flex items-center gap-0.5 text-amber-600 font-extrabold">
                    <Star className="w-3 h-3 fill-current" />
                    <span>{st.rating} ({st.reviewCount})</span>
                  </span>
                </div>

                <div className="flex items-center sm:justify-end gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                    {st.availability}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">
                    {st.tripsAssignedCount} Trips Assigned
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAssignStaff(st)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  st.isAssigned
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'border border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 text-[#583BE8]'
                }`}
              >
                {st.isAssigned ? 'Assigned ✓' : 'Assign'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View More Staff Footer */}
      <div className="text-center pt-1">
        <button
          type="button"
          onClick={onViewMore}
          className="text-xs font-extrabold text-[#583BE8] hover:underline inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View More Staff</span>
          <span>▾</span>
        </button>
      </div>
    </div>
  );
};

export default StaffCard;
