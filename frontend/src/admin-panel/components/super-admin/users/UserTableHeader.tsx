import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { UserSortConfig } from '../../../types/userManagement';

interface UserTableHeaderProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  sortConfig?: UserSortConfig;
  onSort?: (key: UserSortConfig['key']) => void;
}

export const UserTableHeader: React.FC<UserTableHeaderProps> = ({
  isAllSelected,
  onToggleSelectAll,
  sortConfig,
  onSort,
}) => {
  const renderSortableHeader = (label: string, sortKey: UserSortConfig['key']) => (
    <th
      onClick={() => onSort && onSort(sortKey)}
      className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 transition-colors"
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <ArrowUpDown className="w-3 h-3 text-slate-400" />
      </div>
    </th>
  );

  return (
    <thead className="bg-[#F8FAFC] border-b border-slate-100 text-left select-none sticky top-0 z-10">
      <tr>
        <th className="py-3.5 pl-4 pr-2 w-10">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="w-4 h-4 rounded text-[#6356E5] focus:ring-0 cursor-pointer"
          />
        </th>
        {renderSortableHeader('User', 'name')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          User ID
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Email
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Phone
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Location
        </th>
        {renderSortableHeader('Trips', 'trips')}
        {renderSortableHeader('Bookings', 'bookings')}
        {renderSortableHeader('Total Spend', 'totalSpend')}
        {renderSortableHeader('Membership', 'membership')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Verification
        </th>
        {renderSortableHeader('Status', 'status')}
        {renderSortableHeader('Join Date', 'joinDate')}
        <th className="py-3.5 pr-4 pl-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
};
