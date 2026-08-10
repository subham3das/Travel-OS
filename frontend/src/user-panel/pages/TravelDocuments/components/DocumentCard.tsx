import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Receipt,
  Building2,
  Plane,
  PhoneCall,
  Bus,
  Download,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { TravelDocument } from '../../../data/documents';

interface DocumentCardProps {
  document: TravelDocument;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document: doc }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!doc.available) return;

    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    }, 1200);
  };

  const renderIcon = () => {
    switch (doc.type) {
      case 'booking':
        return <Ticket className="w-5 h-5 text-emerald-600" />;
      case 'invoice':
        return <Receipt className="w-5 h-5 text-amber-600" />;
      case 'hotel':
        return <Building2 className="w-5 h-5 text-sky-600" />;
      case 'flight':
        return <Plane className="w-5 h-5 text-purple-600" />;
      case 'contact':
        return <PhoneCall className="w-5 h-5 text-amber-500" />;
      case 'transport':
        return <Bus className="w-5 h-5 text-rose-500" />;
      default:
        return <Ticket className="w-5 h-5 text-[#6356E5]" />;
    }
  };

  const getIconBg = () => {
    switch (doc.type) {
      case 'booking':
        return 'bg-emerald-50';
      case 'invoice':
        return 'bg-amber-50';
      case 'hotel':
        return 'bg-sky-50';
      case 'flight':
        return 'bg-purple-50';
      case 'contact':
        return 'bg-yellow-50';
      case 'transport':
        return 'bg-rose-50';
      default:
        return 'bg-purple-50';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={() => {
        if (doc.available) {
          const element = document.createElement('a');
          const file = new Blob([`Document: ${doc.title}`], { type: 'text/plain' });
          element.href = URL.createObjectURL(file);
          element.download = `${doc.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      }}
      className={`bg-white rounded-3xl p-4 border border-slate-100/90 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 ${
        !doc.available ? 'opacity-60 cursor-not-allowed' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className={`w-11 h-11 rounded-2xl ${getIconBg()} flex items-center justify-center shrink-0`}>
          {renderIcon()}
        </div>

        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-[#0F172A] truncate">
              {doc.title}
            </h3>
            {doc.status === 'Confirmed' && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black shrink-0">
                Confirmed
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-500 truncate">
            {doc.subtitle}
          </p>
        </div>
      </div>

      {/* Download Action Button */}
      <div className="shrink-0">
        {!doc.available ? (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Waiting for Agency</span>
          </span>
        ) : downloading ? (
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#6356E5]">
            <div className="w-3.5 h-3.5 border-2 border-[#6356E5]/30 border-t-[#6356E5] rounded-full animate-spin" />
            <span>Downloading...</span>
          </div>
        ) : downloaded ? (
          <span className="flex items-center gap-1 text-xs font-extrabold text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
            <span>Downloaded</span>
          </span>
        ) : (
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 text-xs font-black text-[#6356E5] hover:text-[#5245d6] transition-colors cursor-pointer focus:outline-none"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
