import React from 'react';
import { Package, Plus } from 'lucide-react';

interface EmptyPackagesStateProps {
  onCreatePackage?: () => void;
  title?: string;
  subtitle?: string;
}

export const EmptyPackagesState: React.FC<EmptyPackagesStateProps> = ({
  onCreatePackage,
  title = 'No Packages Yet',
  subtitle = 'Create your first travel package and start receiving bookings.',
}) => {
  return (
    <div className="bg-white rounded-3xl p-10 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center flex flex-col items-center justify-center space-y-4 select-none my-6">
      <div className="w-16 h-16 rounded-3xl bg-purple-50 text-[#583BE8] flex items-center justify-center shadow-inner">
        <Package className="w-8 h-8 stroke-[1.8]" />
      </div>

      <div className="space-y-1 max-w-sm">
        <h3 className="text-base font-extrabold text-[#0F172A]">{title}</h3>
        <p className="text-xs font-semibold text-slate-400 leading-relaxed">{subtitle}</p>
      </div>

      {onCreatePackage && (
        <button
          type="button"
          onClick={onCreatePackage}
          className="px-5 py-3 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Create Package</span>
        </button>
      )}
    </div>
  );
};

export default EmptyPackagesState;
