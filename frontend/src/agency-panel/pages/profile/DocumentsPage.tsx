import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Folder, Eye, RefreshCw, Trash2, Plus, FileText, CheckCircle2 } from 'lucide-react';
import { DashboardHeader } from '../../components/dashboard/DashboardHeader';
import { DesktopSidebar } from '../../components/dashboard/DesktopSidebar';
import { BottomNavigation } from '../../components/dashboard/BottomNavigation';
import { MOCK_AGENCY_PROFILE, DocumentItem } from '../../data/profile';

export const DocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [docs, setDocs] = useState<DocumentItem[]>(MOCK_AGENCY_PROFILE.documents);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleAction = (action: string, title: string) => {
    alert(`${action} action triggered for "${title}".`);
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
              <h2 className="text-base sm:text-lg font-black text-[#0F172A]">Uploaded Documents</h2>
              <p className="text-[11px] font-semibold text-slate-400">Business certificates, permits & insurance files</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAction('Upload New', 'Document')}
            className="px-4 py-2 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#583BE8]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-2xs space-y-4"
          >
            <div className="space-y-3">
              {docs.map((d) => (
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
                      onClick={() => handleAction('Preview', d.title)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAction('Replace', d.title)}
                      className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 hover:bg-purple-100 text-[#583BE8] text-xs font-extrabold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(d.id, d.title)}
                      className="p-1.5 rounded-xl hover:bg-rose-50 text-rose-600 transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default DocumentsPage;
