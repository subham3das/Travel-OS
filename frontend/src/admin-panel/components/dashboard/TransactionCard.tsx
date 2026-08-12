import React from 'react';
import { motion } from 'framer-motion';
import { Transaction } from '../../types/dashboard';

interface TransactionCardProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({
  transactions,
  onViewAll,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-base font-extrabold text-[#0F172A] tracking-tight">Latest Transactions</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {/* Transactions Table / List */}
      <div className="space-y-3">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-xs font-extrabold shrink-0 ${
                  tx.statusColor === 'emerald'
                    ? 'text-blue-600'
                    : tx.statusColor === 'amber'
                    ? 'text-purple-600'
                    : 'text-rose-600'
                }`}
              >
                {tx.transactionId}
              </span>
              <span className="text-xs font-bold text-[#0F172A] truncate group-hover:text-[#6356E5] transition-colors">
                {tx.agencyName}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <span className="text-xs font-black text-[#0F172A]">{tx.amount}</span>

              <span
                className={`px-2.5 py-1 rounded-full text-[10px] font-black text-center min-w-[65px] ${
                  tx.status === 'Success'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : tx.status === 'Pending'
                    ? 'bg-amber-50 text-amber-600 border border-amber-100'
                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                }`}
              >
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
