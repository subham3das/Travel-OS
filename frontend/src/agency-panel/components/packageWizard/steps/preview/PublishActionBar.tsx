import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { PublishSuccessModal } from './PublishSuccessModal';

export const PublishActionBar: React.FC = () => {
  const { prevStep, saveDraftToast, isAllStepsValid } = usePackageWizard();

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePublish = () => {
    if (!isAllStepsValid) {
      alert('Please complete all required fields across steps 1-8 before publishing.');
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3.5 sm:px-6 shadow-2xl select-none md:ml-64">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          {/* Previous */}
          <button
            type="button"
            onClick={prevStep}
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Action Right Group */}
          <div className="flex items-center gap-2.5 flex-1 sm:flex-initial justify-end min-w-0">
            {/* Save Draft */}
            <button
              type="button"
              onClick={saveDraftToast}
              className="flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#583BE8]/40 bg-white hover:bg-purple-50 text-[#583BE8] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs truncate"
            >
              <Save className="w-4 h-4 text-[#583BE8] shrink-0" />
              <span className="truncate">Save Draft</span>
            </button>

            {/* Publish Package */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={isPublishing}
              className={`flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all truncate ${
                isAllStepsValid
                  ? 'bg-[#583BE8] hover:bg-[#472dbf] cursor-pointer active:scale-98'
                  : 'bg-[#583BE8]/80 cursor-pointer hover:bg-[#472dbf]'
              }`}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span className="truncate">Publishing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 fill-current shrink-0" />
                  <span className="truncate">Publish Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <PublishSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </>
  );
};

export default PublishActionBar;
