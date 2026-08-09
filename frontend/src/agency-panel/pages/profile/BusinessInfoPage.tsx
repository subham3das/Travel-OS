import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Save, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { MOCK_AGENCY_PROFILE } from '../../data/profile';

export const BusinessInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(MOCK_AGENCY_PROFILE.business);
  const [isSaved, setIsSaved] = useState(false);

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

        {/* Header Bar */}
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
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Business Information</h2>
              <p className="text-[11px] font-semibold text-slate-400">License, GST, PAN, Registration & details</p>
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSave}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-5 text-xs font-bold"
          >
            {isSaved && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 font-extrabold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Business Information saved successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 block mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Legal Business Name *</label>
                <input
                  type="text"
                  required
                  value={data.legalBusinessName}
                  onChange={(e) => setData({ ...data, legalBusinessName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-extrabold"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">GST Number *</label>
                <input
                  type="text"
                  required
                  value={data.gstNumber}
                  onChange={(e) => setData({ ...data, gstNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-mono font-black uppercase"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">PAN Number *</label>
                <input
                  type="text"
                  required
                  value={data.panNumber}
                  onChange={(e) => setData({ ...data, panNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-mono font-black uppercase"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={data.registrationNumber}
                  onChange={(e) => setData({ ...data, registrationNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Business License Number *</label>
                <input
                  type="text"
                  required
                  value={data.businessLicenseNumber}
                  onChange={(e) => setData({ ...data, businessLicenseNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-700 block mb-1">Agency Type / Classification</label>
                <input
                  type="text"
                  value={data.agencyType}
                  onChange={(e) => setData({ ...data, agencyType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-700 block mb-1">Business Description</label>
                <textarea
                  rows={4}
                  value={data.businessDescription}
                  onChange={(e) => setData({ ...data, businessDescription: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-slate-800 font-semibold leading-relaxed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-700 block mb-1">Supported Languages (Comma separated)</label>
                <input
                  type="text"
                  value={data.languages.join(', ')}
                  onChange={(e) =>
                    setData({
                      ...data,
                      languages: e.target.value.split(',').map((s) => s.trim()),
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-700 block mb-1">Official Website</label>
                <input
                  type="text"
                  value={data.website}
                  onChange={(e) => setData({ ...data, website: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-slate-800 font-bold"
                />
              </div>
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

export default BusinessInfoPage;
