import React, { useState } from 'react';
import { ArrowRight, Mountain, Hourglass, Palmtree } from 'lucide-react';
import { TransactionItem } from '../../data/finance';

interface RecentTransactionsCardProps {
  transactions: TransactionItem[];
  onSelectTransaction: (tx: TransactionItem) => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const getIcon = (type: TransactionItem['iconType']) => {
    switch (type) {
      case 'mountain':
        return <Mountain className="w-4 h-4 text-purple-700" />;
      case 'hourglass':
        return <Hourglass className="w-4 h-4 text-amber-700" />;
      case 'palm':
        return <Palmtree className="w-4 h-4 text-emerald-700" />;
      default:
        return <Mountain className="w-4 h-4 text-purple-700" />;
    }
  };

  const getStatusStyle = (status: TransactionItem['paymentStatus']) => {
    switch (status) {
      case 'Paid':
        return 'text-emerald-600';
      case 'Pending':
        return 'text-amber-600';
      case 'Failed':
        return 'text-rose-600';
      case 'Refunded':
        return 'text-blue-600';
      default:
        return 'text-slate-600';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 select-none overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm sm:text-base font-black text-[#0F172A]">
          Recent Transactions
        </h3>

        <button
          type="button"
          onClick={() => alert('Navigating to all transaction history...')}
          className="text-xs font-extrabold text-[#583BE8] hover:underline cursor-pointer flex items-center gap-1 shrink-0"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            onClick={() => onSelectTransaction(tx)}
            className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 flex items-center justify-between gap-3 transition-colors cursor-pointer min-w-0"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#583BE8] flex items-center justify-center shrink-0">
                {getIcon(tx.iconType)}
              </div>

              <div className="min-w-0 flex-1 space-y-0.5">
                <span className="text-[10px] font-black text-purple-700 block truncate">
                  {tx.bookingId}
                </span>
                <h4 className="text-xs font-black text-[#0F172A] truncate">
                  {tx.packageName}
                </h4>
                <p className="text-[11px] font-semibold text-slate-400 truncate">
                  {tx.travelerName}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs sm:text-sm font-black text-[#0F172A] block">
                {tx.formattedAmount}
              </span>
              <span className={`text-[10px] font-extrabold block ${getStatusStyle(tx.paymentStatus)}`}>
                {tx.paymentStatus}
              </span>
              <span className="text-[9px] font-bold text-slate-400 block">
                {tx.transactionDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactionsCard;
