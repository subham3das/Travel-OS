import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { AgencyData } from './AgencyCard';

interface AgencyCompareBarProps {
  selectedAgencies: AgencyData[];
  onRemoveAgency: (id: string) => void;
  onCompareNow: () => void;
}

export const AgencyCompareBar: React.FC<AgencyCompareBarProps> = ({
  selectedAgencies,
  onRemoveAgency,
  onCompareNow,
}) => {
  if (selectedAgencies.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl bg-white/95 backdrop-blur-md rounded-3xl p-3.5 sm:p-4 shadow-2xl border border-slate-100 flex items-center justify-between gap-4"
      >
        {/* Info & Selected Logos */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center -space-x-2">
            {selectedAgencies.map((agency) => (
              <div
                key={agency.id}
                className="relative w-9 h-9 rounded-full border-2 border-white overflow-hidden bg-slate-900 text-white text-xs font-bold flex items-center justify-center shadow-2xs group"
              >
                {agency.logoUrl ? (
                  <img src={agency.logoUrl} alt={agency.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{agency.name.substring(0, 2).toUpperCase()}</span>
                )}
                <button
                  onClick={() => onRemoveAgency(agency.id)}
                  className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {selectedAgencies.length < 3 && (
              <div className="w-9 h-9 rounded-full border-2 border-dashed border-slate-300 text-slate-400 flex items-center justify-center text-xs bg-slate-50">
                <Plus className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="space-y-0.5">
            <h5 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
              {selectedAgencies.length} Agencies Selected
            </h5>
            <p className="text-[10px] font-medium text-slate-400">
              You can compare up to 3 agencies
            </p>
          </div>
        </div>

        {/* Compare Action CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onCompareNow}
          className="px-5 py-2.5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-bold shadow-md shadow-[#6356E5]/20 transition-all shrink-0 focus:outline-none cursor-pointer"
        >
          Compare Agencies
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};
