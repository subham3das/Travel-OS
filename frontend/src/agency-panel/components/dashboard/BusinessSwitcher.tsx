import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Car, ChevronDown, Check, X, CheckCircle2, Layers } from 'lucide-react';
import { useActiveBusiness } from '../../context/ActiveBusinessContext';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';

export const BusinessSwitcher: React.FC = () => {
  const { agency } = useAgencyAuth();
  const { activeBusiness, isCarRentalApproved, businessTypes, switchBusiness } = useActiveBusiness();

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAgencyApproved =
    agency?.verificationStatus === 'APPROVED' ||
    (agency?.verificationStatus as any) === 'VERIFIED' ||
    agency?.status === 'ACTIVE';

  const types = businessTypes || agency?.businessTypes || ['agency'];
  const hasBothBusinesses =
    types.includes('agency') &&
    types.includes('car_rental') &&
    isAgencyApproved &&
    isCarRentalApproved;

  // Close desktop dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDesktopDropdownOpen(false);
      }
    };
    if (desktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [desktopDropdownOpen]);

  // Lock body scroll when mobile bottom sheet is open
  useEffect(() => {
    if (mobileSheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSheetOpen]);

  // Only render switcher when partner owns BOTH verified businesses
  if (!hasBothBusinesses) {
    return null;
  }

  const handleSelectWorkspace = (target: 'agency' | 'car_rental') => {
    switchBusiness(target);
    setDesktopDropdownOpen(false);
    setMobileSheetOpen(false);
  };

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* ── 1. DESKTOP VIEW (sm:flex) ── */}
      <div className="hidden sm:block">
        <button
          type="button"
          onClick={() => setDesktopDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-xs font-black text-slate-800 transition-all cursor-pointer shadow-2xs"
          title="Switch operational workspace"
        >
          {activeBusiness === 'agency' ? (
            <Compass className="w-3.5 h-3.5 text-[#583BE8]" />
          ) : (
            <Car className="w-3.5 h-3.5 text-[#583BE8]" />
          )}
          <span>{activeBusiness === 'agency' ? 'Agency' : 'Car Rental'}</span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              desktopDropdownOpen ? 'rotate-180 text-[#583BE8]' : ''
            }`}
          />
        </button>

        {/* Desktop Floating Dropdown Menu */}
        <AnimatePresence>
          {desktopDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden"
            >
              <div className="px-3.5 py-2 border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Switch Workspace
                </span>
              </div>

              {/* Option 1: Travel Agency */}
              <button
                type="button"
                onClick={() => handleSelectWorkspace('agency')}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  activeBusiness === 'agency' ? 'bg-purple-50/70 text-[#583BE8]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeBusiness === 'agency' ? 'bg-[#583BE8] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold">Agency Dashboard</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Tour packages & itineraries</p>
                  </div>
                </div>
                {activeBusiness === 'agency' && <Check className="w-4 h-4 text-[#583BE8]" />}
              </button>

              {/* Option 2: Car Rental */}
              <button
                type="button"
                onClick={() => handleSelectWorkspace('car_rental')}
                className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  activeBusiness === 'car_rental' ? 'bg-purple-50/70 text-[#583BE8]' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      activeBusiness === 'car_rental' ? 'bg-[#583BE8] text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-extrabold">Car Rental Dashboard</h5>
                    <p className="text-[10px] text-slate-400 font-medium">Fleet management & bookings</p>
                  </div>
                </div>
                {activeBusiness === 'car_rental' && <Check className="w-4 h-4 text-[#583BE8]" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── 2. MOBILE VIEW (flex sm:hidden) ── */}
      <div className="flex sm:hidden">
        <button
          type="button"
          onClick={() => setMobileSheetOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-black text-slate-800 cursor-pointer shadow-2xs active:scale-98 transition-all"
        >
          {activeBusiness === 'agency' ? (
            <Compass className="w-3.5 h-3.5 text-[#583BE8]" />
          ) : (
            <Car className="w-3.5 h-3.5 text-[#583BE8]" />
          )}
          <span>{activeBusiness === 'agency' ? 'Agency' : 'Car Rental'}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {/* Mobile Bottom Sheet Modal */}
        <AnimatePresence>
          {mobileSheetOpen && (
            <div className="fixed inset-0 z-50 flex items-end justify-center">
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileSheetOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              />

              {/* Bottom Sheet Card */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative w-full max-w-lg bg-white rounded-t-3xl p-5 pb-8 shadow-2xl border-t border-slate-100 space-y-5 z-10"
              >
                {/* Drag Handle Indicator */}
                <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />

                {/* Sheet Title Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#0F172A]">Select Workspace</h3>
                      <p className="text-xs text-slate-400 font-medium">Switch operational domain</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileSheetOpen(false)}
                    className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Workspace Cards */}
                <div className="space-y-3">
                  {/* Option 1: Travel Agency */}
                  <button
                    type="button"
                    onClick={() => handleSelectWorkspace('agency')}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      activeBusiness === 'agency'
                        ? 'border-[#583BE8] bg-purple-50/50 shadow-xs ring-1 ring-[#583BE8]/20'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          activeBusiness === 'agency'
                            ? 'bg-[#583BE8] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Compass className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-[#0F172A]">Travel Agency</h4>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Tour packages, itineraries, and bookings
                        </p>
                      </div>
                    </div>
                    {activeBusiness === 'agency' && (
                      <CheckCircle2 className="w-5 h-5 text-[#583BE8] shrink-0 ml-2" />
                    )}
                  </button>

                  {/* Option 2: Car Rental */}
                  <button
                    type="button"
                    onClick={() => handleSelectWorkspace('car_rental')}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      activeBusiness === 'car_rental'
                        ? 'border-[#583BE8] bg-purple-50/50 shadow-xs ring-1 ring-[#583BE8]/20'
                        : 'border-slate-200/80 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                          activeBusiness === 'car_rental'
                            ? 'bg-[#583BE8] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Car className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-black text-[#0F172A]">Car Rental</h4>
                          <span className="px-2 py-0.2 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-bold">
                            Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Fleet inventory, drivers, and reservations
                        </p>
                      </div>
                    </div>
                    {activeBusiness === 'car_rental' && (
                      <CheckCircle2 className="w-5 h-5 text-[#583BE8] shrink-0 ml-2" />
                    )}
                  </button>
                </div>

                {/* Cancel Button */}
                <button
                  type="button"
                  onClick={() => setMobileSheetOpen(false)}
                  className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BusinessSwitcher;
