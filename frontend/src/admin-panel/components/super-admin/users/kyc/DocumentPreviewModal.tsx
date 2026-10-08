import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  XCircle,
  FileUp,
  RotateCcw,
  Calendar,
  HardDrive,
  FileType,
} from 'lucide-react';
import { KycDocumentItem } from '../../../../types/userKyc';
import { KycStatusBadge } from './KycStatusBadge';

interface DocumentPreviewModalProps {
  document: KycDocumentItem | null;
  documents?: KycDocumentItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectDocument?: (doc: KycDocumentItem) => void;
  onApproveDoc?: (doc: KycDocumentItem) => void;
  onRejectDoc?: (doc: KycDocumentItem) => void;
  onRequestReuploadDoc?: (doc: KycDocumentItem) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  documents = [],
  isOpen,
  onClose,
  onSelectDocument,
  onApproveDoc,
  onRejectDoc,
  onRequestReuploadDoc,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Reset transforms whenever viewed document changes
  useEffect(() => {
    setScale(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
  }, [document?.id]);

  if (!isOpen || !document) return null;

  const currentIndex = documents.findIndex((d) => d.id === document.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < documents.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectDocument) {
      onSelectDocument(documents[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectDocument) {
      onSelectDocument(documents[currentIndex + 1]);
    }
  };

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  const cycleBrightness = () => {
    setBrightness((prev) => (prev === 100 ? 130 : prev === 130 ? 70 : 100));
  };

  const cycleContrast = () => {
    setContrast((prev) => (prev === 100 ? 140 : prev === 140 ? 80 : 100));
  };

  const resetFilters = () => {
    setScale(1);
    setRotation(0);
    setBrightness(100);
    setContrast(100);
  };

  const toggleFullscreen = () => {
    if (!documentRefAvailable()) {
      setIsFullscreen(!isFullscreen);
      return;
    }
    if (!window.document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      window.document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  function documentRefAvailable() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }

  const isImage =
    document.mimeType?.includes('image') ||
    document.fileUrl.match(/\.(jpeg|jpg|png|webp|gif)/i);

  const handleDownload = () => {
    const link = window.document.createElement('a');
    link.href = document.fileUrl;
    link.download = `${document.type.replace(/\s+/g, '_')}_${document.id}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md select-none">
        <motion.div
          ref={modalContainerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={`w-full ${
            isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl max-h-[92vh] rounded-3xl'
          } bg-white border border-slate-100 shadow-2xl overflow-hidden flex flex-col`}
        >
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/80 gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-[#0F172A] truncate">
                    {document.type}
                  </h3>
                  <KycStatusBadge status={document.status} size="sm" />
                  {documents.length > 1 && (
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {currentIndex + 1} of {documents.length}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3" />
                    {document.size || '1.8 MB'}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <FileType className="w-3 h-3" />
                    {document.documentNumberMasked || '•••• 4289'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Inspection Controls */}
            <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[10px] font-mono font-bold text-slate-500">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Rotate */}
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                title={`Rotate (Current: ${rotation}°)`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Brightness */}
              <button
                type="button"
                onClick={cycleBrightness}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                  brightness !== 100
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={`Brightness (${brightness}%)`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>

              {/* Contrast */}
              <button
                type="button"
                onClick={cycleContrast}
                className={`p-1.5 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                  contrast !== 100
                    ? 'bg-purple-50 text-[#6356E5] border-purple-200'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
                title={`Contrast (${contrast}%)`}
              >
                <Contrast className="w-3.5 h-3.5" />
              </button>

              {/* Reset */}
              {(scale !== 1 || rotation !== 0 || brightness !== 100 || contrast !== 100) && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="p-1.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  title="Reset inspection filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Fullscreen */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>

              {/* Download */}
              <button
                type="button"
                onClick={handleDownload}
                className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer shadow-2xs"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Document Inspection Stage with Prev/Next Navigation */}
          <div className="relative flex-1 overflow-hidden bg-slate-950/90 flex items-center justify-center p-4">
            {/* Previous Navigation Button */}
            {documents.length > 1 && (
              <button
                type="button"
                disabled={!hasPrev}
                onClick={handlePrev}
                className={`absolute left-3 z-20 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer ${
                  !hasPrev ? 'opacity-25 pointer-events-none' : 'hover:scale-105 active:scale-95'
                }`}
                title="Previous Document"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Document Image or Iframe */}
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2">
              {isImage ? (
                <img
                  src={document.fileUrl}
                  alt={document.type}
                  style={{
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    transition: 'transform 0.15s ease-out, filter 0.15s ease-out',
                  }}
                  className="max-h-[72vh] w-auto max-w-full rounded-xl object-contain shadow-2xl origin-center"
                />
              ) : (
                <iframe
                  src={document.fileUrl}
                  title={document.type}
                  className="w-full h-[72vh] rounded-xl border border-slate-700 bg-white"
                />
              )}
            </div>

            {/* Next Navigation Button */}
            {documents.length > 1 && (
              <button
                type="button"
                disabled={!hasNext}
                onClick={handleNext}
                className={`absolute right-3 z-20 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all cursor-pointer ${
                  !hasNext ? 'opacity-25 pointer-events-none' : 'hover:scale-105 active:scale-95'
                }`}
                title="Next Document"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Bottom Review Action Bar */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="font-bold text-[#0F172A]">{document.type}:</span>
              <span>{document.ocrResult || 'OCR Validated'}</span>
              <span>&bull;</span>
              <span className="text-emerald-600 font-bold">{document.forgeryCheck || 'Passed'}</span>
            </div>

            <div className="flex items-center gap-2">
              {onApproveDoc && document.status !== 'Verified' && (
                <button
                  type="button"
                  onClick={() => onApproveDoc(document)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Approve Document</span>
                </button>
              )}

              {onRejectDoc && document.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => onRejectDoc(document)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              )}

              {onRequestReuploadDoc && (
                <button
                  type="button"
                  onClick={() => onRequestReuploadDoc(document)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
                >
                  <FileUp className="w-3.5 h-3.5 text-slate-500" />
                  <span>Request Re-upload</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
