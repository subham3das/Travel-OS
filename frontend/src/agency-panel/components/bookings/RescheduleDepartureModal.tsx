import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { DepartureItem, agencyDepartureService } from '../../services/agencyDeparture.service';

interface RescheduleDepartureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  departure: DepartureItem | null;
}

export const RescheduleDepartureModal: React.FC<RescheduleDepartureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  departure,
}) => {
  const [newDate, setNewDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !departure) return null;
  if (departure.status === 'ONGOING' || departure.status === 'COMPLETED') {
    return null;
  }

  const currentFormatted = new Date(departure.departureDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate) {
      setError('Please select a new departure date');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await agencyDepartureService.rescheduleDeparture(departure.id, newDate);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to reschedule departure');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 border border-slate-100 space-y-5"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-[#0F172A]">Reschedule Departure</h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">
              {departure.packageName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1">
            <span className="text-slate-400 font-bold block">Current Departure</span>
            <div className="flex items-center gap-1.5 font-extrabold text-[#0F172A]">
              <Calendar className="w-3.5 h-3.5 text-[#583BE8]" />
              <span>{currentFormatted}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              New Departure Date *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white font-bold text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#583BE8]"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Existing bookings and manifests will automatically update to this new date.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-2xl bg-[#583BE8] text-white text-xs font-black hover:bg-[#472ec4] transition-colors shadow-lg shadow-[#583BE8]/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Updating...' : 'Confirm Reschedule'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RescheduleDepartureModal;
