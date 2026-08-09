import React from 'react';
import { PaymentStatus } from '../../data/bookings';
import { CheckCircle2, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  amountPaid?: number;
  remainingAmount?: number;
  size?: 'sm' | 'md';
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'PAID':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-black shadow-2xs ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Fully Paid</span>
        </span>
      );

    case 'PARTIALLY_PAID':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-black shadow-2xs ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Partially Paid</span>
        </span>
      );

    case 'UNPAID':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 font-black shadow-2xs ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Unpaid</span>
        </span>
      );

    case 'REFUNDED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80 font-black shadow-2xs ${
            size === 'sm' ? 'px-2.5 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refunded</span>
        </span>
      );
  }
};

export default PaymentStatusBadge;
