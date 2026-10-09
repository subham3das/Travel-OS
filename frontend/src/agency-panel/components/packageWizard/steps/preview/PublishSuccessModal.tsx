import React from 'react';
import { Sparkles, Eye, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePackageWizard } from '../../../../context/PackageWizardContext';

interface PublishSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
  hasSchedule?: boolean;
}

export const PublishSuccessModal: React.FC<PublishSuccessModalProps> = ({
  isOpen,
  onClose,
  packageId,
}) => {
  const navigate = useNavigate();
  const { startFreshDraft } = usePackageWizard();

  if (!isOpen) return null;

  const handleViewPackage = () => {
    onClose();
    if (packageId) {
      navigate(`/agency/packages/${packageId}`);
    } else {
      navigate('/agency/packages');
    }
  };

  const handleCreateAnotherPackage = () => {
    onClose();
    startFreshDraft();
    navigate('/agency/packages/create?step=1');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Celebration Header Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
          <Sparkles className="w-10 h-10 animate-pulse text-emerald-600" />
        </div>

        {/* Titles */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
            🎉 Package Published Successfully
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Your package is now live on ApnaTrip.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleViewPackage}
            className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#472dbf] text-white text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-[#583BE8]/25 transition-all cursor-pointer active:scale-98"
          >
            <Eye className="w-4 h-4" />
            <span>View Package</span>
          </button>

          <button
            type="button"
            onClick={handleCreateAnotherPackage}
            className="w-full py-3.5 rounded-2xl border-2 border-slate-200 hover:border-[#583BE8]/40 hover:bg-slate-50 text-slate-700 hover:text-[#583BE8] text-sm font-extrabold transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Another Package</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSuccessModal;
