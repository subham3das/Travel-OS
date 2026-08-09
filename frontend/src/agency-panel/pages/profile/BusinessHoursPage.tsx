import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Save, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { MOCK_AGENCY_PROFILE, DayBusinessHours } from '../../data/profile';

export const BusinessHoursPage: React.FC = () => {
  const navigate = useNavigate();
  const [hours, setHours] = useState<DayBusinessHours[]>(MOCK_AGENCY_PROFILE.businessHours);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggleOpen = (index: number) => {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, isOpen: !h.isOpen, isHoliday: h.isOpen } : h))
    );
  };

  const handleTimeChange = (index: number, field: 'openTime' | 'closeTime', val: string) => {
    setHours((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: val } : h))
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        <div className="bg-white border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[3.5rem] z-20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/profile')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Business Hours</h2>
              <p className="text-[11px] font-semibold text-slate-400">Working days, opening hours & holidays</p>
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4 text-xs font-bold"
          >
            {isSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Business Hours updated successfully!</span>
              </div>
            )}

            <div className="space-y-3">
              {hours.map((h, idx) => (
                <div
                  key={h.day}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
                >
                  <div className="flex items-center justify-between sm:justify-start gap-3 min-w-[140px]">
                    <span className="text-xs font-black text-[#0F172A] w-24">{h.day}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleOpen(idx)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black cursor-pointer ${
                        h.isOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {h.isOpen ? 'Open' : 'Closed / Holiday'}
                    </button>
                  </div>

                  {h.isOpen ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h.openTime}
                        onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-extrabold w-28 text-center"
                      />
                      <span className="text-slate-400 font-bold">to</span>
                      <input
                        type="text"
                        value={h.closeTime}
                        onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 text-xs font-extrabold w-28 text-center"
                      />
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 italic">Day Off / Holiday</span>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/agency/profile')}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.form>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default BusinessHoursPage;
