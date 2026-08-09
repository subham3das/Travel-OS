import React from 'react';
import { AlertOctagon, Send, Eye } from 'lucide-react';

interface PendingPaymentCardProps {
  pendingTravelersCount: number;
  onViewPending: () => void;
  onSendReminder: () => void;
}

export const PendingPaymentCard: React.FC<PendingPaymentCardProps> = ({
  pendingTravelersCount,
  onViewPending,
  onSendReminder,
}) => {
  return (
    <div className="bg-rose-50/80 rounded-3xl p-5 border border-rose-200 shadow-2xs space-y-4 select-none">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-500/20">
          <AlertOctagon className="w-5 h-5" />
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="text-sm font-black text-rose-950 tracking-tight">
            Trip Cannot Be Created
          </h4>
          <p className="text-xs font-semibold text-rose-800 leading-relaxed">
            Some confirmed travelers have not completed payment. Trips can only contain fully paid travelers according to Travel OS business rules.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 rounded-2xl bg-white/90 border border-rose-200/60">
        <span className="text-xs font-extrabold text-rose-900">
          Pending Traveler Payments
        </span>
        <span className="px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-black">
          {pendingTravelersCount} Travelers
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <button
          type="button"
          onClick={onViewPending}
          className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-white hover:bg-rose-100/60 text-rose-900 border border-rose-300/80 text-xs font-black flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Eye className="w-4 h-4 text-rose-600" />
          <span>View Pending Payments</span>
        </button>

        <button
          type="button"
          onClick={onSendReminder}
          className="w-full sm:flex-1 py-2.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Send Payment Reminder</span>
        </button>
      </div>
    </div>
  );
};

export default PendingPaymentCard;
