import React from 'react';
import { X, Calendar, AlertCircle, ArrowRight, ShieldCheck, IndianRupee } from 'lucide-react';
import { BookingGroup } from '../../data/bookings';

interface MoveToTripsModalProps {
  group: BookingGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmMove: (group: BookingGroup) => void;
}

export const MoveToTripsModal: React.FC<MoveToTripsModalProps> = ({
  group,
  isOpen,
  onClose,
  onConfirmMove,
}) => {
  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#0F172A]">Create Operational Trip</h3>
              <p className="text-xs font-semibold text-slate-400">
                Transfer verified fully paid travelers to trip roster
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs font-semibold text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This action will create an operational trip using{' '}
            <strong className="font-extrabold text-emerald-700">
              {group.fullyPaidTravelerCount} fully paid eligible travelers
            </strong>. Under Travel OS rules, unpaid and partially paid travelers cannot be added to operational trips.
          </p>
        </div>

        {/* Departure Summary Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={group.coverImage}
              alt={group.packageName}
              className="w-14 h-14 rounded-xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-sm font-black text-[#0F172A] truncate">
                {group.packageName}
              </h4>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {group.departureDate} – {group.returnDate}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200/60 text-center text-xs">
            <div className="p-2 rounded-xl bg-white border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Fully Paid</span>
              <span className="text-sm font-black text-emerald-600">
                {group.fullyPaidTravelerCount} Travelers
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Pending Pmt</span>
              <span className="text-sm font-black text-rose-600">
                {group.pendingPaymentTravelerCount} Travelers
              </span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Min Required</span>
              <span className="text-sm font-black text-slate-700">{group.minTravelers}</span>
            </div>
            <div className="p-2 rounded-xl bg-white border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 block">Est. Revenue</span>
              <span className="text-xs font-black text-[#583BE8] flex items-center justify-center pt-0.5">
                <IndianRupee className="w-3 h-3" />
                {group.expectedRevenue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-extrabold transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirmMove(group)}
            className="flex-1 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <span>Confirm & Create Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToTripsModal;
