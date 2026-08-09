import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Clock, AlertTriangle, Mountain, CreditCard, User, Calendar } from 'lucide-react';
import { TransactionItem } from '../../data/finance';

interface TransactionDetailsModalProps {
  transaction: TransactionItem | null;
  onClose: () => void;
}

export const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] font-black text-[#583BE8] uppercase block">Transaction Details</span>
              <h3 className="text-base font-black text-[#0F172A]">{transaction.bookingId}</h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount Hero */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center space-y-1">
            <span className="text-2xl font-black text-[#0F172A] block">{transaction.formattedAmount}</span>
            <span
              className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black ${
                transaction.paymentStatus === 'Paid'
                  ? 'bg-emerald-100 text-emerald-700'
                  : transaction.paymentStatus === 'Pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              Payment {transaction.paymentStatus}
            </span>
          </div>

          {/* Fields */}
          <div className="space-y-2.5 text-xs font-bold text-slate-700">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold">Package Name</span>
              <span className="text-[#0F172A] font-extrabold">{transaction.packageName}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold">Traveler</span>
              <span className="text-[#0F172A] font-extrabold">{transaction.travelerName}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold">Payment Method</span>
              <span className="text-[#0F172A] font-extrabold">{transaction.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 font-semibold">Transaction Date</span>
              <span className="text-slate-600 font-semibold">{transaction.transactionDate}</span>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-colors cursor-pointer"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TransactionDetailsModal;
