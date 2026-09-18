import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, Eye, RefreshCw, Plus, FileText } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { useAgencyProfile } from '../../hooks/useAgencyProfile';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, isLoading } = useAgencyProfile();

  const handlePreview = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('Document preview is being prepared by storage service.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      <DesktopSidebar />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24 md:pb-16">
        <DashboardHeader />

        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-[57px] sm:top-[65px] z-20 select-none">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/agency/profile')}
              className="w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Uploaded Documents</h2>
              <p className="text-[11px] font-semibold text-slate-400">Business certificates, permits & verification files</p>
            </div>
          </div>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full space-y-4">
          {isLoading && (!profile.documents || profile.documents.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <div className="w-8 h-8 border-3 border-[#583BE8] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-400">Loading documents archive...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4"
            >
              {profile.documents.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs font-bold">
                  No documents found in your agency archive.
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.documents.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>

                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A] truncate">
                              {d.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                              ✓ {d.status}
                            </span>
                          </div>

                          <p className="text-[11px] font-semibold text-slate-400 truncate">
                            {d.fileName} • {d.fileSize} • Uploaded {d.uploadDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handlePreview(d.fileUrl)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DocumentsPage;
