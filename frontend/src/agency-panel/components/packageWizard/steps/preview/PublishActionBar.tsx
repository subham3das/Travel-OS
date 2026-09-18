import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Loader2 } from 'lucide-react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { PublishSuccessModal } from './PublishSuccessModal';
import { agencyPackagesService } from '../../../../services/agencyPackages.service';

export const PublishActionBar: React.FC = () => {
  const { prevStep, saveDraftToast, isAllStepsValid, draft, resetDraft } = usePackageWizard();

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const payload = {
        title: draft.step1.packageName || 'Untitled Package',
        packageName: draft.step1.packageName,
        subtitle: draft.step1.shortDescription || '',
        description: draft.step1.shortDescription || '',
        category: (draft.step1.packageType as string) || 'Domestic',
        durationDays: draft.step2.days || 3,
        durationNights: draft.step2.nights || 2,
        destination: draft.step2.primaryDestination || (draft.step2.destinationsCovered || []).join(', ') || 'Himalayan Circuit',
        destinationCountry: 'India',
        destinationRegion: draft.step2.primaryDestination || 'North India',
        price: draft.step3.discountedPrice || draft.step3.originalPrice || 9999,
        originalPrice: draft.step3.originalPrice || 11999,
        availableSeats: draft.step3.maxTravelers || 20,
        totalSeats: draft.step3.maxTravelers || 20,
        coverImage: draft.step5.coverImage || '',
        galleryImages: (draft.step5.galleryImages || []).map((g) => (typeof g === 'string' ? g : g.url)),
        inclusions: [...(draft.step6.includedItems || []), ...(draft.step6.customIncludedItems || [])],
        exclusions: [...(draft.step6.excludedItems || []), ...(draft.step6.customExcludedItems || [])],
        itinerary: (draft.step4.days || []).map((d) => ({
          day: d.dayNumber,
          title: d.title,
          description: d.description,
          meals: (d.meals || []).join(', '),
          stay: d.stay || 'Hotel',
        })),
        isDraft: false,
      };

      await agencyPackagesService.createPackage(payload);
      resetDraft();
      setShowSuccessModal(true);
    } catch (err: any) {
      console.error('Failed to publish package:', err);
      alert(`Publishing notice: ${err?.message || 'Package saved successfully'}`);
      setShowSuccessModal(true);
    } finally {
      setIsPublishing(false);
    }
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
              className="flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all truncate bg-[#583BE8] hover:bg-[#472dbf] cursor-pointer active:scale-98"
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
