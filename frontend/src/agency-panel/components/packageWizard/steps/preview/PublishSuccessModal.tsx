import React from 'react';
import { CheckCircle2, ArrowRight, Package, Calendar, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({ isOpen, onClose, packageId }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGoToPackages = () => {
    onClose();
    navigate('/agency/packages');
  };

  const handleScheduleDeparture = () => {
    onClose();
    if (packageId) {
      navigate(`/agency/departures?packageId=${packageId}`);
    } else {
      navigate('/agency/departures');
    }
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
            Your package details and itinerary have been saved to your catalog.
          </p>
        </div>

        {/* Phase 8: Schedule Departure Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-left flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-black text-amber-950">
              This package is not visible to travelers until a departure is scheduled.
            </p>
            <p className="text-[11px] font-medium text-amber-800">
              Travelers will only see and book this package once you configure at least one active scheduled departure.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleScheduleDeparture}
            className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Departure Now →</span>
          </button>

          <button
            type="button"
            onClick={handleGoToPackages}
            className="w-full py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>Go to Packages</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
