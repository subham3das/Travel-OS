import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { PaymentSortConfig } from '../../../types/paymentManagement';

interface PaymentTableHeaderProps {
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  sortConfig?: PaymentSortConfig;
  onSort?: (key: PaymentSortConfig['key']) => void;
}

export const PaymentTableHeader: React.FC<PaymentTableHeaderProps> = ({
  isAllSelected,
  onToggleSelectAll,
  sortConfig,
  onSort,
}) => {
  const renderSortableHeader = (label: string, sortKey: PaymentSortConfig['key']) => (
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
        {renderSortableHeader('Transaction ID', 'transactionId')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Booking ID
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Traveler
        </th>
        {renderSortableHeader('Agency', 'agency')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Package
        </th>
        {renderSortableHeader('Amount', 'amount')}
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Platform Fee
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Gateway
        </th>
        <th className="py-3.5 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Method
        </th>
        {renderSortableHeader('Status', 'status')}
        {renderSortableHeader('Settlement', 'settlement')}
        {renderSortableHeader('Payment Date', 'date')}
        <th className="py-3.5 pr-4 pl-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">
          Actions
        </th>
      </tr>
    </thead>
  );
};
