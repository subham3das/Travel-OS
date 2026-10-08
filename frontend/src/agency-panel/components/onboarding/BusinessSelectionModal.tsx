import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Car, X, ArrowRight, Check } from 'lucide-react';

interface BusinessSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BusinessSelectionModal: React.FC<BusinessSelectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSelect = (_businessType: 'agency' | 'car_rental') => {
    onClose();
    navigate('/agency/signup');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-black text-[#583BE8] uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded-md inline-block">
              ApnaTrip Partner Ecosystem
            </span>
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              Choose your business
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Select the category you operate in to proceed with your verified partner subscription.
            </p>
          </div>

          {/* Business Type Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Travel Agency Card */}
            <div
              onClick={() => handleSelect('agency')}
              className="group p-5 rounded-2xl border-2 border-slate-100 hover:border-[#583BE8] bg-white hover:bg-purple-50/20 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/70 text-[#583BE8] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#583BE8] transition-colors">
                    Travel Agency
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Tour & Package Operators</p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Create travel packages</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manage bookings</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manage customers</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-black text-[#583BE8]">
                <span>Select Agency</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Car Rental Card */}
            <div
              onClick={() => handleSelect('car_rental')}
              className="group p-5 rounded-2xl border-2 border-slate-100 hover:border-[#583BE8] bg-white hover:bg-purple-50/20 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100/70 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#0F172A] group-hover:text-[#583BE8] transition-colors">
                    Car Rental
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">Fleet & Taxi Operators</p>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manage fleet</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Receive bookings</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Manage drivers</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-black text-[#583BE8]">
                <span>Select Car Rental</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
