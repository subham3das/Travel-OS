import React, { useState } from 'react';
import { ArrowLeft, Save, Send, Loader2, AlertCircle } from 'lucide-react';
import { usePackageWizard, checkPackageHasValidSchedule } from '../../../../context/PackageWizardContext';
import { PublishSuccessModal } from './PublishSuccessModal';
import { agencyPackagesService } from '../../../../services/agencyPackages.service';

export const PublishActionBar: React.FC = () => {
  const {
    prevStep,
    goToStep,
    saveDraftToast,
    draft,
    validateAllSteps,
    startFreshDraft,
  } = usePackageWizard();

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdPackageId, setCreatedPackageId] = useState<string | undefined>(undefined);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const buildPayload = (isDraft: boolean) => {
    const rawCover = draft.step5.coverImage;
    const cleanCover =
      typeof rawCover === 'string'
        ? rawCover
        : (rawCover as any)?.url || (rawCover as any)?.secure_url || (rawCover as any)?.secureUrl || (rawCover as any)?.imageUrl || '';
    const cleanGallery = (draft.step5.galleryImages || [])
      .map((g: any) => {
        if (!g) return null;
        if (typeof g === 'string') {
          return {
            url: g,
            publicId: '',
            uploadedAt: new Date().toISOString(),
          };
        }
        const resolvedUrl =
          typeof g.url === 'string'
            ? g.url
            : typeof g.url === 'object' && g.url?.url
            ? g.url.url
            : g.secure_url || g.secureUrl || g.imageUrl || '';
        if (!resolvedUrl) return null;
        return {
          url: resolvedUrl,
          publicId: g.publicId || g.id || '',
          width: g.width,
          height: g.height,
          format: g.format,
          size: g.size || (g.sizeMB ? Math.round(g.sizeMB * 1024 * 1024) : undefined),
          bytes: g.bytes || (g.sizeMB ? Math.round(g.sizeMB * 1024 * 1024) : undefined),
          uploadedAt: g.uploadedAt || new Date().toISOString(),
          originalFilename: g.name || g.originalFilename || '',
          category: g.category || '',
        };
      })
      .filter((img: any) => Boolean(img?.url));

    return {
      title: draft.step1.packageName || (isDraft ? 'Draft Package' : 'Untitled Package'),
      packageName: draft.step1.packageName,
      subtitle: draft.step1.shortDescription || '',
      description: draft.step1.shortDescription || '',
      category: (draft.step1.packageType as string) || 'Domestic',
      adventureType: draft.step1.adventureType || 'General Adventure',
      durationDays: draft.step2.days || 3,
      durationNights: draft.step2.nights || 2,
      destination: draft.step2.primaryDestination || (draft.step2.destinationsCovered || []).join(', ') || 'Himalayan Circuit',
      destinationCountry: 'India',
      destinationRegion: draft.step2.primaryDestination || 'North India',
      pickupCity: draft.step2.pickupCity || '',
      dropOffCity: draft.step2.dropOffCity || '',
      pickupLocation: draft.step2.pickupCity || '',
      dropOffLocation: draft.step2.dropOffCity || '',
      meetingPoint: draft.step2.meetingPoint || '',
      travelModes: draft.step2.travelModes || [],
      price: draft.step3.discountedPrice || draft.step3.originalPrice || 9999,
      originalPrice: draft.step3.originalPrice || 11999,
      availableSeats: draft.step3.maxTravelers || 20,
      totalSeats: draft.step3.maxTravelers || 20,
      coverImage: cleanCover,
      galleryImages: cleanGallery,
      inclusions: [...(draft.step6.includedItems || []), ...(draft.step6.customIncludedItems || [])],
      exclusions: [...(draft.step6.excludedItems || []), ...(draft.step6.customExcludedItems || [])],
      itinerary: (draft.step4.days || []).map((d) => ({
        day: d.dayNumber,
        title: d.title,
        description: d.description || '',
        plans: (d.plans || []).map((p: any) => ({
          text: (
            typeof p === 'string'
              ? p
              : p?.text ?? p?.title ?? p?.description ?? p?.content ?? p?.name ?? ''
          ).toString().trim(),
          icon: p.icon || '',
          notes: p.notes || '',
        })),
        meals: (d.meals || []).join(', '),
        stay: d.stay || 'Hotel',
      })),
      accommodationConfirmed: Boolean(draft.stepAccommodation?.accommodationConfirmed),
      accommodations: draft.stepAccommodation?.accommodationConfirmed
        ? (draft.stepAccommodation?.hotels || []).map((h) => ({
            hotelName: h.hotelName,
            hotelImages: h.hotelImages || [],
            category: h.category || 'Hotel',
            address: h.address || '',
            city: h.city || '',
            amenities: h.amenities || [],
            roomType: h.roomType || '',
            checkIn: h.checkIn || '',
            checkOut: h.checkOut || '',
            shortDescription: h.shortDescription || '',
            dayRange: h.dayRange || '',
          }))
        : [],
      departures: draft.stepDepartures?.departures || [],
      cancellationPolicy: draft.step7?.cancellationPolicy || '',
      bookingTerms: draft.step7?.bookingTerms || [],
      emergencyContact: draft.step7?.emergencyContact || null,
      whatsappGroupLink: draft.step7?.whatsappGroupLink || '',
      faqs: draft.step7?.faqs || [],
      isDraft,
    };
  };

  const isEditingPublished = draft.status === 'PUBLISHED' && Boolean(draft.packageId);

  const handleSaveDraft = async () => {
    if (draft.status === 'PUBLISHED') return;
    setIsSavingDraft(true);
    try {
      const payload = buildPayload(true);
      if (draft.packageId) {
        await agencyPackagesService.updatePackage(draft.packageId, payload);
      } else if (draft.draftId) {
        await agencyPackagesService.createPackage({ ...payload, draftId: draft.draftId });
      } else {
        await agencyPackagesService.createPackage(payload);
      }
      saveDraftToast();
    } catch (err: any) {
      console.warn('Network save draft notice:', err?.message);
      saveDraftToast();
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    // 1. Validation must happen BEFORE publish
    const validation = validateAllSteps();
    if (!validation.isValid) {
      setValidationErrors(validation.missingSections);
      goToStep(validation.firstInvalidStep);
      return;
    }
    setValidationErrors([]);

    // 2. Disable Publish button immediately, prevent double-click
    setIsPublishing(true);
    try {
      const payload = buildPayload(false);

      if (isEditingPublished && draft.packageId) {
        // Update existing published package without creating duplicate
        await agencyPackagesService.updatePackage(draft.packageId, {
          ...payload,
          isDraft: false,
          status: 'PUBLISHED',
        });
        setCreatedPackageId(draft.packageId);
        setShowSuccessModal(true);
      } else {
        // Publish draft or new package
        let created: any;
        if (draft.draftId) {
          created = await agencyPackagesService.createPackage({ ...payload, draftId: draft.draftId });
        } else {
          created = await agencyPackagesService.createPackage(payload);
        }

        if (created && (created.packageId || (created as any).id || (created as any)._id)) {
          setCreatedPackageId(created.packageId || (created as any).id || (created as any)._id);
        }

        // Invalidate draft session immediately after publish
        startFreshDraft();
        setShowSuccessModal(true);
      }
    } catch (err: any) {
      console.error('Failed to publish package:', err);
      alert(`Publishing failed: ${err?.response?.data?.message || err?.message || 'Could not publish package. Please check required fields.'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3.5 sm:px-6 shadow-2xl select-none md:ml-64">
        <div className="max-w-3xl mx-auto space-y-2.5">
          {/* Validation Errors Notice Banner */}
          {validationErrors.length > 0 && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-start justify-between gap-3 text-rose-900 text-xs font-bold animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5 min-w-0">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-extrabold text-rose-950 text-xs">
                    Please complete the following required sections before publishing:
                  </p>
                  <ul className="list-disc list-inside space-y-0.5 text-rose-800 text-[11px] font-semibold">
                    {validationErrors.map((sec, idx) => (
                      <li key={idx}>{sec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValidationErrors([])}
                className="text-rose-500 hover:text-rose-800 text-xs font-black cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
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
              {!isEditingPublished && (
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || isPublishing}
                  className="flex-1 sm:flex-initial px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-[#583BE8]/40 bg-white hover:bg-purple-50 text-[#583BE8] text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs truncate disabled:opacity-60"
                >
                  {isSavingDraft ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#583BE8] shrink-0" />
                  ) : (
                    <Save className="w-4 h-4 text-[#583BE8] shrink-0" />
                  )}
                  <span className="truncate">Save Draft</span>
                </button>
              )}

              {/* Publish or Update Package */}
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 sm:flex-initial px-5 sm:px-8 py-2.5 sm:py-3.5 rounded-2xl text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all truncate bg-[#583BE8] hover:bg-[#472dbf] cursor-pointer active:scale-98 disabled:opacity-60"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span className="truncate">{isEditingPublished ? 'Updating...' : 'Publishing...'}</span>
                  </>
                ) : isEditingPublished ? (
                  <>
                    <Save className="w-4 h-4 shrink-0" />
                    <span className="truncate">Save Changes</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-current shrink-0" />
                    <span className="truncate">Publish Package</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        packageId={createdPackageId}
        hasSchedule={true}
      />
    </>
  );
};

export default PublishActionBar;
