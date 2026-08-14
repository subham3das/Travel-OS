import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AdminPaymentItem, PaymentSortConfig } from '../../../types/paymentManagement';
import { PaymentTableHeader } from './PaymentTableHeader';
import { PaymentTableRow } from './PaymentTableRow';
import { RefreshCw, CreditCard } from 'lucide-react';

interface PaymentTableProps {
  payments: AdminPaymentItem[];
  selectedIds: string[];
  selectedPayment: AdminPaymentItem | null;
  sortConfig?: PaymentSortConfig;
  onSort?: (key: PaymentSortConfig['key']) => void;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onSelectPayment: (payment: AdminPaymentItem) => void;
  onRowAction: (actionType: string, payment: AdminPaymentItem) => void;
  onRefresh?: () => void;
}

export const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  selectedIds,
  selectedPayment,
  sortConfig,
  onSort,
  onToggleSelectAll,
  onToggleSelect,
  onSelectPayment,
  onRowAction,
  onRefresh,
}) => {
  const isAllSelected = payments.length > 0 && selectedIds.length === payments.length;

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-100/90 shadow-2xs space-y-4 select-none">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto text-xl font-black shadow-2xs">
          <CreditCard className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-[#0F172A]">No Transactions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No payment records match your current filter parameters or search queries.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Payments</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs overflow-hidden select-none">
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left border-collapse">
          <PaymentTableHeader
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
            sortConfig={sortConfig}
            onSort={onSort}
          />
          <tbody>
            <AnimatePresence initial={false}>
              {payments.map((payment) => (
                <PaymentTableRow
                  key={payment.id}
                  payment={payment}
                  isSelected={selectedIds.includes(payment.id)}
                  isDrawerSelected={selectedPayment?.id === payment.id}
                  onToggleSelect={onToggleSelect}
                  onSelectPayment={onSelectPayment}
                  onRowAction={onRowAction}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
};
