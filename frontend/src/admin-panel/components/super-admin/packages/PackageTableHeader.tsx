import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PackageSortConfig } from '../../../types/packageManagement';

interface PackageTableHeaderProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  sortConfig?: PackageSortConfig;
  onSort?: (key: PackageSortConfig['key']) => void;
}

export const PackageTableHeader: React.FC<PackageTableHeaderProps> = ({
  isAllSelected,
  onToggleSelectAll,
  sortConfig,
  onSort,
}) => {
  const renderSortableHeader = (label: string, sortKey: PackageSortConfig['key']) => (
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
        {renderSortableHeader('Package', 'name')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Package ID
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Agency
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Destination
        </th>
        {renderSortableHeader('Duration', 'duration')}
        {renderSortableHeader('Price', 'price')}
        {renderSortableHeader('Seats', 'seats')}
        {renderSortableHeader('Bookings', 'bookings')}
        {renderSortableHeader('Rating', 'rating')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Status
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Approval
        </th>
        {renderSortableHeader('Last Updated', 'lastUpdated')}
        <th className="py-3.5 pr-4 pl-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
};
