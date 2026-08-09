import React from 'react';
import { FileQuestion } from 'lucide-react';

export const EmptyDocuments: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xs text-center space-y-3 my-6">
      <div className="w-16 h-16 rounded-full bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
        <FileQuestion className="w-8 h-8" />
      </div>

      <h3 className="text-base font-black text-[#0F172A]">
        No Documents Available Yet
      </h3>

      <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto leading-relaxed">
        Your travel documents will appear here after the agency uploads them.
      </p>
    </div>
  );
};
