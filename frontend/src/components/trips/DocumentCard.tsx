import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Ticket, Receipt, FileSpreadsheet, ShieldCheck } from 'lucide-react';

export interface TripDocumentCategory {
  id: string;
  title: string;
  countText: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
}

const defaultDocumentCategories: TripDocumentCategory[] = [
  {
    id: 'tickets',
    title: 'E-Tickets',
    countText: '3 Documents',
    icon: <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-rose-50',
    iconColor: 'text-[#FF4D6D]',
  },
  {
    id: 'vouchers',
    title: 'Hotel Vouchers',
    countText: '5 Documents',
    icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-[#FFF1F2]',
    iconColor: 'text-rose-600',
  },
  {
    id: 'invoices',
    title: 'Invoices',
    countText: '4 Documents',
    icon: <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    id: 'visa',
    title: 'Visa',
    countText: '2 Documents',
    icon: <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
  {
    id: 'insurance',
    title: 'Insurance',
    countText: '1 Document',
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />,
    bgColor: 'bg-teal-50',
    iconColor: 'text-teal-600',
  },
];

interface DocumentCardGridProps {
  documents?: TripDocumentCategory[];
  onCategoryClick?: (doc: TripDocumentCategory) => void;
}

export const DocumentCardGrid: React.FC<DocumentCardGridProps> = ({
  documents = defaultDocumentCategories,
  onCategoryClick,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 w-full">
      {documents.map((doc) => (
        <motion.div
          key={doc.id}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onCategoryClick && onCategoryClick(doc)}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:shadow-md transition-all flex flex-col items-center text-center cursor-pointer group"
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${doc.bgColor} ${doc.iconColor} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105`}
          >
            {doc.icon}
          </div>

          <h5 className="text-xs sm:text-sm font-bold text-[#0F172A] tracking-tight leading-snug">
            {doc.title}
          </h5>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium leading-none mt-1">
            {doc.countText}
          </p>
        </motion.div>
      ))}
    </div>
  );
};
