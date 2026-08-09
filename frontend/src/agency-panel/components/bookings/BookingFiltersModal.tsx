import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface BookingFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterStatus: string;
  filterPayment: string;
  onApply: (status: string, payment: string) => void;
  onClear: () => void;
}

export const BookingFiltersModal: React.FC<BookingFiltersModalProps> = ({
  isOpen,
  onClose,
  filterStatus: initialStatus,
  filterPayment: initialPayment,
  onApply,
  onClear,
}) => {
  const [tempStatus, setTempStatus] = useState(initialStatus);
  const [tempPayment, setTempPayment] = useState(initialPayment);

  if (!isOpen) return null;

  const statuses = [
    'All',
    'Pending Payment',
    'Awaiting Confirmation',
    'Confirmed',
    'Cancelled',
    'Refunded',
  ];

  const paymentStatuses = ['All', 'Paid', 'Partially Paid', 'Unpaid', 'Refunded'];

  const handleApply = () => {
    onApply(tempStatus, tempPayment);
    onClose();
  };

  const handleClear = () => {
    setTempStatus('All');
    setTempPayment('All');
    onClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 select-none">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#0F172A]">Filter Bookings</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Booking Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
            Booking Status
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {statuses.map((st) => {
              const isSelected = tempStatus === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setTempStatus(st)}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 border-[#583BE8] text-[#583BE8] shadow-2xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#583BE8]" />}
                  <span>{st}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Status Filter */}
        <div className="space-y-2">
          <label className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
            Payment Status
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {paymentStatuses.map((pst) => {
              const isSelected = tempPayment === pst;
              return (
                <button
                  key={pst}
                  type="button"
                  onClick={() => setTempPayment(pst)}
                  className={`px-3.5 py-2 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50 border-[#583BE8] text-[#583BE8] shadow-2xs'
                      : 'bg-white border-slate-200/80 text-slate-700 hover:border-purple-200'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#583BE8]" />}
                  <span>{pst}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFiltersModal;
