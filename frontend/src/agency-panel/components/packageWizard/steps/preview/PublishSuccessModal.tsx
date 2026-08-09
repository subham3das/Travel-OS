import React from 'react';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToPackages = () => {
    onClose();
    navigate('/agency/trips');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Celebration Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Titles */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
            Package Published Successfully!
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Your package is now live and ready for travelers across ApnaTrip.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleGoToPackages}
            className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            <span>Go to Packages</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Close Modal</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
