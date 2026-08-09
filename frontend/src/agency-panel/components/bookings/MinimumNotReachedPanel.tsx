import React, { useState } from 'react';
import { AlertTriangle, Calendar, XCircle, ArrowRight, ShieldAlert, Check } from 'lucide-react';
import { BookingGroup } from '../../data/bookings';

interface MinimumNotReachedPanelProps {
  group: BookingGroup;
  onExtendDeadline: (group: BookingGroup, newDate: string) => void;
  onCancelDeparture: (group: BookingGroup) => void;
  onForceCreateTrip: (group: BookingGroup) => void;
}

export const MinimumNotReachedPanel: React.FC<MinimumNotReachedPanelProps> = ({
  group,
  onExtendDeadline,
  onCancelDeparture,
  onForceCreateTrip,
}) => {
  const [isExtending, setIsExtending] = useState(false);
  const [newDeadline, setNewDeadline] = useState('2026-08-25');
  const [showForceConfirm, setShowForceConfirm] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-4 text-amber-950 select-none">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-black text-amber-900">
              Minimum Travelers Not Reached
            </h4>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
              {group.confirmedTravelerCount} / {group.minTravelers} Minimum Required
            </span>
          </div>
          <p className="text-xs font-semibold text-amber-800/90 leading-relaxed pt-0.5">
            This departure does not have enough confirmed travelers to operate normally.
          </p>
        </div>
      </div>

      {/* 3 Operations Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Action 1: Extend Deadline */}
        <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-900">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Extend Deadline</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 pt-0.5">
              Set a new closing date to allow more bookings.
            </p>
          </div>

          {isExtending ? (
            <div className="space-y-1.5 pt-1">
              <input
                type="date"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
                className="w-full text-[11px] font-bold p-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-[#583BE8]"
              />
              <button
                type="button"
                onClick={() => {
                  onExtendDeadline(group, newDeadline);
                  setIsExtending(false);
                }}
                className="w-full py-1.5 rounded-lg bg-[#583BE8] text-white text-[11px] font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save Date</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsExtending(true)}
              className="w-full py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-extrabold transition-colors cursor-pointer text-center"
            >
              Extend Date
            </button>
          )}
        </div>

        {/* Action 2: Cancel Departure */}
        <div className="p-3 rounded-xl bg-white border border-rose-200/60 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-rose-700">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>Cancel Departure</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 pt-0.5">
              Cancel departure and mark bookings as cancelled.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCancelDeparture(group)}
            className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 text-xs font-extrabold transition-colors cursor-pointer text-center"
          >
            Cancel Group
          </button>
        </div>

        {/* Action 3: Force Create Trip */}
        <div className="p-3 rounded-xl bg-white border border-purple-200/60 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-900">
              <ShieldAlert className="w-3.5 h-3.5 text-[#583BE8]" />
              <span>Force Create Trip</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-500 pt-0.5">
              Operate trip below minimum capacity requirement.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForceConfirm(true)}
            className="w-full py-1.5 rounded-lg bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-colors cursor-pointer"
          >
            <span>Force Create</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Force Create Trip */}
      {showForceConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-black text-[#0F172A]">Create Trip Anyway?</h3>
            </div>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              This departure has not reached the minimum traveler requirement ({group.confirmedTravelerCount} / {group.minTravelers} minimum).
              Creating this trip may reduce overall profitability.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForceConfirm(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-extrabold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForceConfirm(false);
                  onForceCreateTrip(group);
                }}
                className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
              >
                Create Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimumNotReachedPanel;
