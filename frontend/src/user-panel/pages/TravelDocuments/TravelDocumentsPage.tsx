import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, CheckCircle2, WifiOff } from 'lucide-react';
import { getTripById } from '../../data/trips';
import { getDocumentsByTripId } from '../../data/documents';

import { TripSummaryCard } from './components/TripSummaryCard';
import { DocumentsList } from './components/DocumentsList';
import { DownloadAllCard } from './components/DownloadAllCard';
import { SupportCard } from './components/SupportCard';
import { EmptyDocuments } from './components/EmptyDocuments';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { BottomNavigation } from '../../components/common/BottomNavigation';

export const TravelDocumentsPage: React.FC = () => {
  const { tripId, id } = useParams<{ tripId?: string; id?: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const targetId = tripId || id || 'trip-001';
  const trip = getTripById(targetId);
  const documents = getDocumentsByTripId(targetId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#0F172A] flex flex-col font-sans selection:bg-[#6356E5]/20 selection:text-[#6356E5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-3.5 shadow-2xs">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
            Travel Documents
          </h1>

          <button
            onClick={() => {
              const element = document.createElement('a');
              const file = new Blob(['Mock Travel Documents Package ZIP'], { type: 'text/plain' });
              element.href = URL.createObjectURL(file);
              element.download = 'travel-documents-package.zip';
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all cursor-pointer focus:outline-none"
            title="Download All Documents"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-28">
        {/* Offline Alert Badge if offline */}
        {isOffline && (
          <div className="bg-amber-500 text-white px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>You are offline. Previously downloaded documents remain accessible.</span>
          </div>
        )}

        {/* 1. Trip Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <TripSummaryCard trip={trip} />
        </motion.div>

        {/* 2. Information Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <CheckCircle2 className="w-5 h-5 fill-current text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0F172A] leading-tight">
              Keep these documents handy during your trip.
            </h3>
            <p className="text-[11px] font-semibold text-slate-500 pt-0.5">
              Show at check-in, airport or whenever required.
            </p>
          </div>
        </motion.div>

        {loading ? (
          <LoadingSkeleton />
        ) : documents.length === 0 ? (
          <EmptyDocuments />
        ) : (
          <>
            {/* 3. Your Documents List */}
            <DocumentsList documents={documents} />

            {/* 4. Download All Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <DownloadAllCard />
            </motion.div>

            {/* 5. Need Help Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
            >
              <SupportCard agencyId={trip.agencyId} />
            </motion.div>
          </>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <BottomNavigation activeTab="trips" />
    </div>
  );
};

export default TravelDocumentsPage;
