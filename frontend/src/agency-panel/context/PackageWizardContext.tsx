import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PackageWizardDraft,
  INITIAL_WIZARD_DRAFT,
  EMPTY_WIZARD_DRAFT,
  Step1BasicInfo,
  Step2DestinationInfo,
  Step3PricingInfo,
  StepDeparturesInfo,
  DepartureScheduleItem,
  INITIAL_DEPARTURE_ITEM,
  StepAccommodationInfo,
  PackageHotelEntry,
  Step6InclusionsInfo,
  Step7PoliciesInfo,
  Step8PublishInfo,
  AddOnState,
} from '../types/packageWizard';
import { Step4ItineraryInfo, ItineraryDay, ItineraryPlanItem, normalizeItineraryDays } from '../types/itinerary';
import { Step5GalleryInfo, GalleryImage, VideoFile, CategoryTag } from '../types/gallery';
import { FAQItem, CustomCancellationRule } from '../data/policies';
import { agencyPackagesService } from '../services/agencyPackages.service';

const DRAFT_STORAGE_KEY = 'apnatrip_agency_package_wizard_draft';

interface PackageWizardContextType {
  currentStep: number;
  draft: PackageWizardDraft;
  autosaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  updateStep1: (data: Partial<Step1BasicInfo>) => void;
  updateStep2: (data: Partial<Step2DestinationInfo>) => void;
  updateStep3: (data: Partial<Step3PricingInfo>) => void;
  updateStepDepartures: (data: Partial<StepDeparturesInfo>) => void;
  addDepartureItem: () => void;
  removeDepartureItem: (id: string) => void;
  updateDepartureItem: (id: string, updated: Partial<DepartureScheduleItem>) => void;
  updateStep4: (data: Partial<Step4ItineraryInfo>) => void;
  updateStepAccommodation: (data: Partial<StepAccommodationInfo>) => void;
  toggleAccommodationConfirmed: (confirmed: boolean) => void;
  addHotel: (hotel: Omit<PackageHotelEntry, 'id'>) => void;
  updateHotel: (id: string, hotel: Partial<PackageHotelEntry>) => void;
  removeHotel: (id: string) => void;
  updateStep5: (data: Partial<Step5GalleryInfo>) => void;
  updateStep6: (data: Partial<Step6InclusionsInfo>) => void;
  updateStep7: (data: Partial<Step7PoliciesInfo>) => void;
  updateStep8: (data: Partial<Step8PublishInfo>) => void;
  addItineraryDay: () => void;
  deleteItineraryDay: (id: string) => void;
  duplicateItineraryDay: (id: string) => void;
  moveItineraryDay: (id: string, direction: 'up' | 'down') => void;
  addPlanItem: (dayId: string, text?: string) => void;
  updatePlanItem: (dayId: string, planId: string, updated: Partial<ItineraryPlanItem>) => void;
  removePlanItem: (dayId: string, planId: string) => void;
  movePlanItem: (dayId: string, planId: string, direction: 'up' | 'down') => void;
  reorderPlanItems: (dayId: string, startIndex: number, endIndex: number) => void;
  setCoverImage: (url: string) => void;
  addGalleryImage: (url: string) => void;
  removeGalleryImage: (id: string) => void;
  addVideo: (video: VideoFile) => void;
  removeVideo: (id: string) => void;
  toggleCategoryTag: (tag: CategoryTag) => void;
  toggleIncludedItem: (id: string) => void;
  addCustomInclusion: (text: string) => void;
  removeCustomInclusion: (index: number) => void;
  toggleExcludedItem: (id: string) => void;
  addCustomExclusion: (text: string) => void;
  removeCustomExclusion: (index: number) => void;
  togglePackingItem: (id: string) => void;
  addCustomPackingItem: (text: string) => void;
  removeCustomPackingItem: (index: number) => void;
  toggleAddOn: (id: string, defaultPrice: number) => void;
  updateAddOnPrice: (id: string, price: number) => void;
  toggleBookingTerm: (term: string) => void;
  toggleRequiredDocument: (id: string) => void;
  addCustomDocument: (text: string) => void;
  removeCustomDocument: (index: number) => void;
  toggleHealthSafety: (item: string) => void;
  addFAQ: (faq: Omit<FAQItem, 'id'>) => void;
  updateFAQ: (id: string, updated: Omit<FAQItem, 'id'>) => void;
  removeFAQ: (id: string) => void;
  addCustomCancellationRule: (rule: Omit<CustomCancellationRule, 'id'>) => void;
  removeCustomCancellationRule: (id: string) => void;
  toggleVisibilityTarget: (target: string) => void;
  saveDraftToast: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetDraft: () => void;
  startFreshDraft: () => void;
  loadActiveDraft: (data: any) => void;
  completionPercentage: number;
  validateAllSteps: () => { isValid: boolean; firstInvalidStep: number; missingSections: string[] };
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  isStep3Valid: boolean;
  isStepDeparturesValid: boolean;
  isStep4Valid: boolean;
  isStepAccommodationValid: boolean;
  isStep5Valid: boolean;
  isStep6Valid: boolean;
  isStep7Valid: boolean;
  isStep8Valid: boolean;
  isItineraryDurationValid: boolean;
  hasValidSchedule: boolean;
  isAllStepsValid: boolean;
  isCurrentStepValid: boolean;
}

/**
 * Validates whether the package has a configured schedule without relying on transient UI state.
 */
export const checkPackageHasValidSchedule = (draft: any): boolean => {
  if (!draft) return false;

  const departures =
    draft?.stepDepartures?.departures ||
    draft?.departures ||
    draft?.upcomingDepartures ||
    [];

  if (Array.isArray(departures) && departures.length > 0) {
    const hasValid = departures.some((dep: any) => {
      if (!dep) return false;
      // Valid if departure date string is specified
      if (dep.departureDate && typeof dep.departureDate === 'string' && dep.departureDate.trim().length > 0) {
        return true;
      }
      if (dep.date && typeof dep.date === 'string' && dep.date.trim().length > 0) {
        return true;
      }
      // Or valid if departure time and closing/reporting times are defined
      if (dep.departureTime && (dep.reportingTime || dep.bookingClosingTime)) {
        return true;
      }
      return false;
    });
    if (hasValid) return true;
  }

  // Top-level direct package fields
  if (
    draft.departureDate &&
    typeof draft.departureDate === 'string' &&
    draft.departureDate.trim().length > 0
  ) {
    return true;
  }
  if (
    draft.departureDate &&
    (draft.departureTime || draft.reportingTime || draft.bookingClosingTime)
  ) {
    return true;
  }

  return false;
};

const PackageWizardContext = createContext<PackageWizardContextType | undefined>(undefined);

export const PackageWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<PackageWizardDraft>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.status === 'PUBLISHED' || parsed?.isPublished) {
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          return EMPTY_WIZARD_DRAFT;
        }
        if (parsed && typeof parsed === 'object') {
          return {
            ...EMPTY_WIZARD_DRAFT,
            ...parsed,
            currentStep: parsed.currentStep || 1,
            step1: { ...EMPTY_WIZARD_DRAFT.step1, ...(parsed.step1 || {}) },
            step2: { ...EMPTY_WIZARD_DRAFT.step2, ...(parsed.step2 || {}) },
            step3: { ...EMPTY_WIZARD_DRAFT.step3, ...(parsed.step3 || {}) },
            stepDepartures: {
              departures: parsed?.stepDepartures?.departures?.length
                ? parsed.stepDepartures.departures
                : [],
            },
            step4: {
              days: parsed?.step4?.days?.length ? normalizeItineraryDays(parsed.step4.days) : [],
              activeDayId: parsed?.step4?.activeDayId || '',
            },
            stepAccommodation: {
              accommodationConfirmed: parsed?.stepAccommodation?.accommodationConfirmed ?? false,
              hotels: Array.isArray(parsed?.stepAccommodation?.hotels) ? parsed.stepAccommodation.hotels : [],
            },
            step5: {
              coverImage: parsed?.step5?.coverImage || '',
              galleryImages: parsed?.step5?.galleryImages?.length
                ? parsed.step5.galleryImages
                : [],
              videos: parsed?.step5?.videos || [],
              imageCategories: parsed?.step5?.imageCategories || [],
              previewIndex: parsed?.step5?.previewIndex || 0,
            },
            step6: {
              includedItems: parsed?.step6?.includedItems || [],
              customIncludedItems: parsed?.step6?.customIncludedItems || [],
              excludedItems: parsed?.step6?.excludedItems || [],
              customExcludedItems: parsed?.step6?.customExcludedItems || [],
              packingItems: parsed?.step6?.packingItems || [],
              customPackingItems: parsed?.step6?.customPackingItems || [],
              optionalAddOns: parsed?.step6?.optionalAddOns || [],
              importantNotes: parsed?.step6?.importantNotes || '',
            },
            step7: {
              cancellationPolicy: parsed?.step7?.cancellationPolicy || 'Moderate',
              customCancellationRules: parsed?.step7?.customCancellationRules || [],
              bookingTerms: parsed?.step7?.bookingTerms || [],
              refundProcessing: parsed?.step7?.refundProcessing || 'Standard Refund',
              requiredDocuments: parsed?.step7?.requiredDocuments || [],
              customDocuments: parsed?.step7?.customDocuments || [],
              healthSafety: parsed?.step7?.healthSafety || [],
              faqs: parsed?.step7?.faqs || [],
              emergencyContact: parsed?.step7?.emergencyContact || { phone: '', alternatePhone: '', email: '', is24x7: false },
              legalConfirmed: parsed?.step7?.legalConfirmed ?? false,
            },
            step8: {
              seoSettings: parsed?.step8?.seoSettings || EMPTY_WIZARD_DRAFT.step8.seoSettings,
              publishMode: parsed?.step8?.publishMode || 'Published',
              scheduleEnabled: parsed?.step8?.scheduleEnabled || false,
              publishDate: parsed?.step8?.publishDate || '',
              publishTime: parsed?.step8?.publishTime || '09:00',
              timezone: parsed?.step8?.timezone || 'Asia/Kolkata (IST)',
              visibilityTargets: parsed?.step8?.visibilityTargets || ['Website'],
              finalAgreement: parsed?.step8?.finalAgreement ?? false,
            },
          };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return EMPTY_WIZARD_DRAFT;
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const stepParam = searchParams.get('step');
  const initialStepNum = stepParam ? Math.max(1, Math.min(10, parseInt(stepParam, 10) || 1)) : (draft.currentStep || 1);
  const [currentStep, setCurrentStep] = useState<number>(initialStepNum);

  useEffect(() => {
    const s = searchParams.get('step');
    if (s) {
      const parsed = parseInt(s, 10);
      if (parsed >= 1 && parsed <= 10 && parsed !== currentStep) {
        setCurrentStep(parsed);
      }
    }
  }, [searchParams, currentStep]);

  useEffect(() => {
    setDraft((prev) => ({ ...prev, currentStep }));
  }, [currentStep]);

  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    try {
      if (draft.status === 'PUBLISHED') {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return;
      }
      if (!draft.step1?.packageName && !draft.draftId && !draft.step2?.primaryDestination) {
        return;
      }
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  }, [draft]);

  // Debounced backend autosave for active drafts
  useEffect(() => {
    if (draft.status === 'PUBLISHED') return;
    if (!draft.step1?.packageName && !draft.draftId && !draft.step2?.primaryDestination) return;

    setAutosaveStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const d = draftRef.current;
        const rawCover = d.step5?.coverImage;
        const cleanCover =
          typeof rawCover === 'string'
            ? rawCover
            : (rawCover as any)?.url || (rawCover as any)?.secure_url || '';
        const cleanGallery = (d.step5?.galleryImages || [])
          .map((g: any) => {
            if (!g) return null;
            if (typeof g === 'string') return { url: g, publicId: '' };
            return {
              url: g.url || (g as any).secure_url || '',
              publicId: g.publicId || g.id || '',
              width: g.width,
              height: g.height,
              format: g.format,
              size: g.size,
              bytes: g.bytes,
              uploadedAt: g.uploadedAt,
              originalFilename: g.originalFilename || g.name || '',
              category: g.category || '',
            };
          })
          .filter((img: any) => Boolean(img?.url));

        const payload = {
          title: d.step1?.packageName || 'Draft Package',
          packageName: d.step1?.packageName,
          subtitle: d.step1?.shortDescription || '',
          description: d.step1?.shortDescription || '',
          category: (d.step1?.packageType as string) || 'Domestic',
          adventureType: d.step1?.adventureType || 'General Adventure',
          durationDays: d.step2?.days || 3,
          durationNights: d.step2?.nights || 2,
          destination: d.step2?.primaryDestination || (d.step2?.destinationsCovered || []).join(', ') || 'Himalayan Circuit',
          destinationCountry: 'India',
          destinationRegion: d.step2?.primaryDestination || 'North India',
          pickupCity: d.step2?.pickupCity || '',
          dropOffCity: d.step2?.dropOffCity || '',
          pickupLocation: d.step2?.pickupCity || '',
          dropOffLocation: d.step2?.dropOffCity || '',
          meetingPoint: d.step2?.meetingPoint || '',
          travelModes: d.step2?.travelModes || [],
          price: d.step3?.discountedPrice || d.step3?.originalPrice || 9999,
          originalPrice: d.step3?.originalPrice || 11999,
          availableSeats: d.step3?.maxTravelers || 20,
          totalSeats: d.step3?.maxTravelers || 20,
          coverImage: cleanCover,
          galleryImages: cleanGallery,
          inclusions: [...(d.step6?.includedItems || []), ...(d.step6?.customIncludedItems || [])],
          exclusions: [...(d.step6?.excludedItems || []), ...(d.step6?.customExcludedItems || [])],
          itinerary: (d.step4?.days || []).map((day) => ({
            day: day.dayNumber,
            title: day.title,
            description: day.description || '',
            plans: (day.plans || [])
              .map((p: any) => {
                const resolvedText = (
                  typeof p === 'string'
                    ? p
                    : p?.text ?? p?.title ?? p?.description ?? p?.content ?? p?.name ?? ''
                ).toString().trim();
                return {
                  text: resolvedText,
                  icon: p?.icon || '',
                  notes: p?.notes || '',
                };
              })
              .filter((p: any) => p.text.length > 0),
            meals: (day.meals || []).join(', '),
            stay: day.stay || 'Hotel',
          })),
          accommodationConfirmed: Boolean(d.stepAccommodation?.accommodationConfirmed),
          accommodations: d.stepAccommodation?.accommodationConfirmed
            ? (d.stepAccommodation?.hotels || []).map((h) => ({
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
          departures: d.stepDepartures?.departures || [],
          cancellationPolicy: d.step7?.cancellationPolicy || '',
          bookingTerms: d.step7?.bookingTerms || [],
          emergencyContact: d.step7?.emergencyContact || null,
          whatsappGroupLink: d.step7?.whatsappGroupLink || '',
          faqs: d.step7?.faqs || [],
          isDraft: true,
        };

        let res: any;
        if (d.packageId) {
          res = await agencyPackagesService.updatePackage(d.packageId, payload);
        } else if (d.draftId) {
          res = await agencyPackagesService.createPackage({ ...payload, draftId: d.draftId });
        } else {
          res = await agencyPackagesService.createPackage(payload);
        }

        if (res && (res.packageId || (res as any).id || (res as any)._id)) {
          const newDraftId = (res as any)._id?.toString() || res.packageId || (res as any).id;
          if (newDraftId && draftRef.current.draftId !== newDraftId) {
            setDraft((prev) => ({ ...prev, draftId: newDraftId }));
          }
        }
        setAutosaveStatus('saved');
      } catch (err) {
        console.warn('Backend draft autosave notice:', err);
        setAutosaveStatus('error');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [
    draft.step1,
    draft.step2,
    draft.step3,
    draft.stepDepartures,
    draft.step4,
    draft.stepAccommodation,
    draft.step5,
    draft.step6,
    draft.step7,
  ]);

  const updateStep1 = (data: Partial<Step1BasicInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step1: { ...(prev?.step1 || INITIAL_WIZARD_DRAFT.step1), ...data },
    }));
  };

  const updateStep2 = (data: Partial<Step2DestinationInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step2: { ...(prev?.step2 || INITIAL_WIZARD_DRAFT.step2), ...data },
    }));
  };

  const updateStep3 = (data: Partial<Step3PricingInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step3: { ...(prev?.step3 || INITIAL_WIZARD_DRAFT.step3), ...data },
    }));
  };

  const updateStepDepartures = (data: Partial<StepDeparturesInfo>) => {
    setDraft((prev) => ({
      ...prev,
      stepDepartures: { ...(prev?.stepDepartures || INITIAL_WIZARD_DRAFT.stepDepartures), ...data },
    }));
  };

  const addDepartureItem = () => {
    setDraft((prev) => {
      const currentList = prev?.stepDepartures?.departures || [];
      const daysCount = prev?.step2?.days || 7;
      const lastDep = currentList[currentList.length - 1] || INITIAL_DEPARTURE_ITEM;

      // Add 14 days to last departure date
      const lastDateObj = new Date(lastDep.departureDate || '2026-09-10');
      lastDateObj.setDate(lastDateObj.getDate() + 14);
      const newDepDateStr = lastDateObj.toISOString().split('T')[0];

      // Auto compute return date: depDate + (daysCount - 1)
      const returnDateObj = new Date(lastDateObj);
      returnDateObj.setDate(returnDateObj.getDate() + Math.max(0, daysCount - 1));
      const newReturnDateStr = returnDateObj.toISOString().split('T')[0];

      // Closing date: 5 days before departure
      const closingDateObj = new Date(lastDateObj);
      closingDateObj.setDate(closingDateObj.getDate() - 5);
      const newClosingDateStr = closingDateObj.toISOString().split('T')[0];

      const newItem: DepartureScheduleItem = {
        id: `dep-${Date.now()}`,
        departureDate: newDepDateStr,
        departureTime: lastDep.departureTime || '09:00',
        timezone: lastDep.timezone || 'Asia/Kolkata (IST)',
        pickupLocation: lastDep.pickupLocation || prev?.step2?.pickupCity || 'Leh Airport (IXL)',
        reportingTime: '07:30 AM',
        bookingClosingDate: newClosingDateStr,
        bookingClosingTime: '23:59',
        maximumTravelers: prev?.step3?.maxTravelers || 20,
        bookedTravelers: 0,
        availableSeats: prev?.step3?.maxTravelers || 20,
        status: 'Upcoming',
        returnDate: newReturnDateStr,
        returnTime: lastDep.departureTime || '09:00',
      };

      return {
        ...prev,
        stepDepartures: {
          departures: [...currentList, newItem],
        },
      };
    });
  };

  const removeDepartureItem = (id: string) => {
    setDraft((prev) => {
      const currentList = prev?.stepDepartures?.departures || [];
      if (currentList.length <= 1) {
        alert('Package must contain at least 1 departure schedule.');
        return prev;
      }
      return {
        ...prev,
        stepDepartures: {
          departures: currentList.filter((d) => d.id !== id),
        },
      };
    });
  };

  const updateDepartureItem = (id: string, updated: Partial<DepartureScheduleItem>) => {
    setDraft((prev) => {
      const currentList = prev?.stepDepartures?.departures || [];
      const daysCount = prev?.step2?.days || 7;

      const updatedList = currentList.map((item) => {
        if (item.id !== id) return item;

        const merged = { ...item, ...updated };

        // Recalculate return date if departure date or days changes
        if (updated.departureDate || updated.departureTime) {
          const depDateObj = new Date(merged.departureDate);
          if (!isNaN(depDateObj.getTime())) {
            const retDateObj = new Date(depDateObj);
            retDateObj.setDate(retDateObj.getDate() + Math.max(0, daysCount - 1));
            merged.returnDate = retDateObj.toISOString().split('T')[0];
          }
          if (updated.departureTime && !updated.returnTime) {
            merged.returnTime = updated.departureTime;
          }
        }

        // Recalculate available seats
        merged.availableSeats = Math.max(0, merged.maximumTravelers - merged.bookedTravelers);

        return merged;
      });

      return {
        ...prev,
        stepDepartures: {
          departures: updatedList,
        },
      };
    });
  };

  const updateStep4 = (data: Partial<Step4ItineraryInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step4: { ...(prev?.step4 || INITIAL_WIZARD_DRAFT.step4), ...data },
    }));
  };

  const updateStepAccommodation = (data: Partial<StepAccommodationInfo>) => {
    setDraft((prev) => ({
      ...prev,
      stepAccommodation: { ...(prev?.stepAccommodation || INITIAL_WIZARD_DRAFT.stepAccommodation), ...data },
    }));
  };

  const toggleAccommodationConfirmed = (confirmed: boolean) => {
    setDraft((prev) => {
      const existingHotels = prev?.stepAccommodation?.hotels || [];
      return {
        ...prev,
        stepAccommodation: {
          accommodationConfirmed: confirmed,
          hotels: confirmed && existingHotels.length === 0
            ? [
                {
                  id: `hotel-${Date.now()}`,
                  hotelName: '',
                  hotelImages: [],
                  category: 'Hotel',
                  address: '',
                  city: prev?.step2?.primaryDestination || '',
                  amenities: ['Free WiFi', 'Breakfast Included'],
                  roomType: 'Deluxe Room',
                  checkIn: '12:00 PM',
                  checkOut: '11:00 AM',
                  shortDescription: '',
                  dayRange: 'Day 1-2',
                },
              ]
            : confirmed ? existingHotels : [],
        },
      };
    });
  };

  const addHotel = (hotel: Omit<PackageHotelEntry, 'id'>) => {
    const newEntry: PackageHotelEntry = {
      ...hotel,
      id: `hotel-${Date.now()}`,
    };
    setDraft((prev) => ({
      ...prev,
      stepAccommodation: {
        accommodationConfirmed: true,
        hotels: [...(prev?.stepAccommodation?.hotels || []), newEntry],
      },
    }));
  };

  const updateHotel = (id: string, hotel: Partial<PackageHotelEntry>) => {
    setDraft((prev) => ({
      ...prev,
      stepAccommodation: {
        ...(prev?.stepAccommodation || { accommodationConfirmed: true, hotels: [] }),
        hotels: (prev?.stepAccommodation?.hotels || []).map((h) => (h.id === id ? { ...h, ...hotel } : h)),
      },
    }));
  };

  const removeHotel = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      stepAccommodation: {
        ...(prev?.stepAccommodation || { accommodationConfirmed: true, hotels: [] }),
        hotels: (prev?.stepAccommodation?.hotels || []).filter((h) => h.id !== id),
      },
    }));
  };

  const updateStep5 = (data: Partial<Step5GalleryInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step5: { ...(prev?.step5 || INITIAL_WIZARD_DRAFT.step5), ...data },
    }));
  };

  const updateStep6 = (data: Partial<Step6InclusionsInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step6: { ...(prev?.step6 || INITIAL_WIZARD_DRAFT.step6), ...data },
    }));
  };

  const updateStep7 = (data: Partial<Step7PoliciesInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step7: { ...(prev?.step7 || INITIAL_WIZARD_DRAFT.step7), ...data },
    }));
  };

  const updateStep8 = (data: Partial<Step8PublishInfo>) => {
    setDraft((prev) => ({
      ...prev,
      step8: { ...(prev?.step8 || INITIAL_WIZARD_DRAFT.step8), ...data },
    }));
  };

  const addItineraryDay = () => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const newDayNum = currentDays.length + 1;
      const newDayId = `day-${Date.now()}`;
      const newDay: ItineraryDay = {
        id: newDayId,
        dayNumber: newDayNum,
        title: `Day ${newDayNum}`,
        description: '',
        plans: [
          { id: `plan-${Date.now()}-1`, text: 'Morning Sightseeing' },
          { id: `plan-${Date.now()}-2`, text: 'Afternoon Exploration' },
        ],
        stay: 'Hotel',
        meals: ['Breakfast'],
        transportation: ['Cab'],
      };
      const updatedDays = [...currentDays, newDay];
      return {
        ...prev,
        step4: {
          days: updatedDays,
          activeDayId: newDayId,
        },
      };
    });
  };

  const deleteItineraryDay = (id: string) => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      if (currentDays.length <= 1) {
        alert('Package must contain at least 1 day itinerary.');
        return prev;
      }
      const filtered = currentDays.filter((d) => d.id !== id);
      const renumbered = filtered.map((d, index) => ({
        ...d,
        dayNumber: index + 1,
      }));
      const nextActiveId =
        prev.step4.activeDayId === id
          ? renumbered[0]?.id || ''
          : prev.step4.activeDayId;

      return {
        ...prev,
        step4: {
          days: renumbered,
          activeDayId: nextActiveId,
        },
      };
    });
  };

  const duplicateItineraryDay = (id: string) => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const targetIndex = currentDays.findIndex((d) => d.id === id);
      if (targetIndex === -1) return prev;

      const targetDay = currentDays[targetIndex];
      const dupId = `day-dup-${Date.now()}`;
      const duplicatedDay: ItineraryDay = {
        ...targetDay,
        id: dupId,
        title: `${targetDay.title} (Copy)`,
        plans: (targetDay.plans || []).map((p, i) => ({
          ...p,
          id: `plan-dup-${Date.now()}-${i}`,
        })),
        activities: (targetDay.plans || []).map((p, i) => ({
          id: `act-dup-${Date.now()}-${i}`,
          title: p.text,
        })),
      };

      const updatedDays = [
        ...currentDays.slice(0, targetIndex + 1),
        duplicatedDay,
        ...currentDays.slice(targetIndex + 1),
      ].map((d, index) => ({ ...d, dayNumber: index + 1 }));

      return {
        ...prev,
        step4: {
          days: updatedDays,
          activeDayId: dupId,
        },
      };
    });
  };

  const addPlanItem = (dayId: string, text: string = '') => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const updatedDays = currentDays.map((d) => {
        if (d.id !== dayId) return d;
        const currentPlans = d.plans || [];
        const newPlan: ItineraryPlanItem = {
          id: `plan-${Date.now()}-${currentPlans.length + 1}`,
          text,
        };
        return {
          ...d,
          plans: [...currentPlans, newPlan],
        };
      });
      return {
        ...prev,
        step4: { ...prev.step4, days: updatedDays },
      };
    });
  };

  const updatePlanItem = (dayId: string, planId: string, updated: Partial<ItineraryPlanItem>) => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const updatedDays = currentDays.map((d) => {
        if (d.id !== dayId) return d;
        const currentPlans = (d.plans || []).map((p) =>
          p.id === planId ? { ...p, ...updated } : p
        );
        return { ...d, plans: currentPlans };
      });
      return {
        ...prev,
        step4: { ...prev.step4, days: updatedDays },
      };
    });
  };

  const removePlanItem = (dayId: string, planId: string) => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const updatedDays = currentDays.map((d) => {
        if (d.id !== dayId) return d;
        return { ...d, plans: (d.plans || []).filter((p) => p.id !== planId) };
      });
      return {
        ...prev,
        step4: { ...prev.step4, days: updatedDays },
      };
    });
  };

  const movePlanItem = (dayId: string, planId: string, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const updatedDays = currentDays.map((d) => {
        if (d.id !== dayId) return d;
        const plans = [...(d.plans || [])];
        const index = plans.findIndex((p) => p.id === planId);
        if (index === -1) return d;
        if (direction === 'up' && index === 0) return d;
        if (direction === 'down' && index === plans.length - 1) return d;
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = plans[index];
        plans[index] = plans[targetIndex];
        plans[targetIndex] = temp;
        return { ...d, plans };
      });
      return {
        ...prev,
        step4: { ...prev.step4, days: updatedDays },
      };
    });
  };

  const reorderPlanItems = (dayId: string, startIndex: number, endIndex: number) => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const updatedDays = currentDays.map((d) => {
        if (d.id !== dayId) return d;
        const plans = [...(d.plans || [])];
        const [removed] = plans.splice(startIndex, 1);
        plans.splice(endIndex, 0, removed);
        return { ...d, plans };
      });
      return {
        ...prev,
        step4: { ...prev.step4, days: updatedDays },
      };
    });
  };

  const moveItineraryDay = (id: string, direction: 'up' | 'down') => {
    setDraft((prev) => {
      const currentDays = prev?.step4?.days || [];
      const index = currentDays.findIndex((d) => d.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === currentDays.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const updatedDays = [...currentDays];
      const temp = updatedDays[index];
      updatedDays[index] = updatedDays[targetIndex];
      updatedDays[targetIndex] = temp;

      const renumbered = updatedDays.map((d, idx) => ({
        ...d,
        dayNumber: idx + 1,
      }));

      return {
        ...prev,
        step4: {
          ...prev.step4,
          days: renumbered,
        },
      };
    });
  };

  const setCoverImage = (url: any) => {
    const cleanUrl = typeof url === 'string' ? url : url?.url || '';
    updateStep5({ coverImage: cleanUrl });
  };

  const addGalleryImage = (url: any) => {
    const cleanUrl = typeof url === 'string' ? url : url?.url || '';
    setDraft((prev) => {
      const current = prev?.step5?.galleryImages || [];
      if (current.length >= 20) {
        alert('Maximum 20 gallery images allowed.');
        return prev;
      }
      const newImg: GalleryImage = {
        id: `img-${Date.now()}`,
        url: cleanUrl,
        name: `photo_${current.length + 1}.webp`,
      };
      return {
        ...prev,
        step5: {
          ...prev.step5,
          galleryImages: [...current, newImg],
        },
      };
    });
  };

  const removeGalleryImage = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step5?.galleryImages || [];
      return {
        ...prev,
        step5: {
          ...prev.step5,
          galleryImages: current.filter((img) => img.id !== id),
        },
      };
    });
  };

  const addVideo = (video: VideoFile) => {
    setDraft((prev) => {
      const current = prev?.step5?.videos || [];
      if (current.length >= 2) {
        alert('Maximum 2 videos allowed.');
        return prev;
      }
      return {
        ...prev,
        step5: {
          ...prev.step5,
          videos: [...current, video],
        },
      };
    });
  };

  const removeVideo = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step5?.videos || [];
      return {
        ...prev,
        step5: {
          ...prev.step5,
          videos: current.filter((v) => v.id !== id),
        },
      };
    });
  };

  const toggleCategoryTag = (tag: CategoryTag) => {
    setDraft((prev) => {
      const current = prev?.step5?.imageCategories || [];
      const updated = current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag];
      return {
        ...prev,
        step5: {
          ...prev.step5,
          imageCategories: updated,
        },
      };
    });
  };

  const toggleIncludedItem = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step6?.includedItems || [];
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      return {
        ...prev,
        step6: {
          ...prev.step6,
          includedItems: updated,
        },
      };
    });
  };

  const addCustomInclusion = (text: string) => {
    if (!text.trim()) return;
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customIncludedItems: [...(prev.step6.customIncludedItems || []), text.trim()],
      },
    }));
  };

  const removeCustomInclusion = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customIncludedItems: (prev.step6.customIncludedItems || []).filter((_, i) => i !== index),
      },
    }));
  };

  const toggleExcludedItem = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step6?.excludedItems || [];
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      return {
        ...prev,
        step6: {
          ...prev.step6,
          excludedItems: updated,
        },
      };
    });
  };

  const addCustomExclusion = (text: string) => {
    if (!text.trim()) return;
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customExcludedItems: [...(prev.step6.customExcludedItems || []), text.trim()],
      },
    }));
  };

  const removeCustomExclusion = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customExcludedItems: (prev.step6.customExcludedItems || []).filter((_, i) => i !== index),
      },
    }));
  };

  const togglePackingItem = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step6?.packingItems || [];
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      return {
        ...prev,
        step6: {
          ...prev.step6,
          packingItems: updated,
        },
      };
    });
  };

  const addCustomPackingItem = (text: string) => {
    if (!text.trim()) return;
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customPackingItems: [...(prev.step6.customPackingItems || []), text.trim()],
      },
    }));
  };

  const removeCustomPackingItem = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      step6: {
        ...prev.step6,
        customPackingItems: (prev.step6.customPackingItems || []).filter((_, i) => i !== index),
      },
    }));
  };

  const toggleAddOn = (id: string, defaultPrice: number) => {
    setDraft((prev) => {
      const current = prev?.step6?.optionalAddOns || [];
      const index = current.findIndex((a) => a.id === id);

      let updated: AddOnState[];
      if (index > -1) {
        updated = current.map((a) =>
          a.id === id ? { ...a, enabled: !a.enabled } : a
        );
      } else {
        updated = [...current, { id, enabled: true, price: defaultPrice }];
      }

      return {
        ...prev,
        step6: {
          ...prev.step6,
          optionalAddOns: updated,
        },
      };
    });
  };

  const updateAddOnPrice = (id: string, price: number) => {
    setDraft((prev) => {
      const current = prev?.step6?.optionalAddOns || [];
      const updated = current.map((a) => (a.id === id ? { ...a, price } : a));
      return {
        ...prev,
        step6: {
          ...prev.step6,
          optionalAddOns: updated,
        },
      };
    });
  };

  const toggleBookingTerm = (term: string) => {
    setDraft((prev) => {
      const current = prev?.step7?.bookingTerms || [];
      const updated = current.includes(term)
        ? current.filter((t) => t !== term)
        : [...current, term];
      return {
        ...prev,
        step7: {
          ...prev.step7,
          bookingTerms: updated,
        },
      };
    });
  };

  const toggleRequiredDocument = (id: string) => {
    setDraft((prev) => {
      const current = prev?.step7?.requiredDocuments || [];
      const updated = current.includes(id)
        ? current.filter((i) => i !== id)
        : [...current, id];
      return {
        ...prev,
        step7: {
          ...prev.step7,
          requiredDocuments: updated,
        },
      };
    });
  };

  const addCustomDocument = (text: string) => {
    if (!text.trim()) return;
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        customDocuments: [...(prev.step7.customDocuments || []), text.trim()],
      },
    }));
  };

  const removeCustomDocument = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        customDocuments: (prev.step7.customDocuments || []).filter((_, i) => i !== index),
      },
    }));
  };

  const toggleHealthSafety = (item: string) => {
    setDraft((prev) => {
      const current = prev?.step7?.healthSafety || [];
      const updated = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item];
      return {
        ...prev,
        step7: {
          ...prev.step7,
          healthSafety: updated,
        },
      };
    });
  };

  const addFAQ = (faq: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { id: `faq-${Date.now()}`, ...faq };
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        faqs: [...(prev.step7.faqs || []), newFaq],
      },
    }));
  };

  const updateFAQ = (id: string, updated: Omit<FAQItem, 'id'>) => {
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        faqs: (prev.step7.faqs || []).map((f) => (f.id === id ? { ...f, ...updated } : f)),
      },
    }));
  };

  const removeFAQ = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        faqs: (prev.step7.faqs || []).filter((f) => f.id !== id),
      },
    }));
  };

  const addCustomCancellationRule = (rule: Omit<CustomCancellationRule, 'id'>) => {
    const newRule: CustomCancellationRule = { id: `rule-${Date.now()}`, ...rule };
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        customCancellationRules: [...(prev.step7.customCancellationRules || []), newRule],
      },
    }));
  };

  const removeCustomCancellationRule = (id: string) => {
    setDraft((prev) => ({
      ...prev,
      step7: {
        ...prev.step7,
        customCancellationRules: (prev.step7.customCancellationRules || []).filter((r) => r.id !== id),
      },
    }));
  };

  const toggleVisibilityTarget = (target: string) => {
    setDraft((prev) => {
      const current = prev?.step8?.visibilityTargets || [];
      const updated = current.includes(target)
        ? current.filter((t) => t !== target)
        : [...current, target];
      return {
        ...prev,
        step8: {
          ...prev.step8,
          visibilityTargets: updated,
        },
      };
    });
  };

  const saveDraftToast = () => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      alert('Draft Saved Successfully! You can return to edit anytime.');
    } catch {
      alert('Error saving draft locally.');
    }
  };

  const nextStep = () => {
    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, 10);
      setSearchParams(
        (p) => {
          const nextParams = new URLSearchParams(p);
          nextParams.set('step', String(next));
          return nextParams;
        },
        { replace: true }
      );
      return next;
    });
  };

  const prevStep = () => {
    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 1);
      setSearchParams(
        (p) => {
          const nextParams = new URLSearchParams(p);
          nextParams.set('step', String(next));
          return nextParams;
        },
        { replace: true }
      );
      return next;
    });
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 10) {
      setCurrentStep(step);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('step', String(step));
          return next;
        },
        { replace: true }
      );
    }
  };

  const startFreshDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setDraft(EMPTY_WIZARD_DRAFT);
    setCurrentStep(1);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('step', '1');
        return next;
      },
      { replace: true }
    );
  };

  const resetDraft = () => {
    startFreshDraft();
  };

  const loadActiveDraft = (data: any) => {
    if (!data) return;
    const raw = data.rawDoc || data.raw || data;
    setDraft((prev) => ({
      ...prev,
      draftId: raw._id?.toString() || raw.packageId || raw.id,
      packageId: raw.packageId || raw.id || raw._id?.toString(),
      status: raw.status || 'DRAFT',
      step1: {
        packageName: raw.title || raw.packageName || '',
        shortDescription: raw.subtitle || raw.description || '',
        packageType: (raw.category as any) || 'Domestic',
        adventureType: raw.adventureType || 'General Adventure',
        tripDifficulty: (raw.tripDifficulty as any) || 'Moderate',
        visibility: raw.visibility || 'Draft',
      },
      step2: {
        primaryDestination: raw.destination || '',
        destinationsCovered: raw.destinationsCovered || (raw.destination ? [raw.destination] : []),
        durationPreset: `${raw.durationDays || 3} Days / ${raw.durationNights || 2} Nights`,
        days: Number(raw.durationDays || 3),
        nights: Number(raw.durationNights || 2),
        seasons: raw.seasons || [],
        bestMonths: raw.bestMonths || [],
        pickupCity: raw.pickupCity || raw.pickupLocation || '',
        dropOffCity: raw.dropOffCity || raw.dropOffLocation || '',
        meetingPoint: raw.meetingPoint || '',
        travelModes: raw.travelModes || ['Private Vehicle'],
      },
      step3: {
        pricingModel: 'Price Per Person',
        originalPrice: Number(raw.originalPrice || raw.price || 0),
        discountedPrice: Number(raw.price || 0),
        maxTravelers: Number(raw.availableSeats || raw.totalSeats || 20),
        recommendedGroupSize: Number(raw.recommendedGroupSize || 10),
        paymentType: 'Full Payment',
        advanceAmount: 0,
        inclusions: [],
        extraCharges: {
          singleOccupancy: false,
          childPrice: false,
          extraBed: false,
          peakSeasonSurcharge: false,
        },
        allowCouponCodes: true,
        cancellationPolicy: 'Moderate',
      },
      stepDepartures: {
        departures: Array.isArray(raw.departures) && raw.departures.length > 0
          ? raw.departures.map((d: any, idx: number) => ({
              id: d.id || d.departureId || `dep-${idx + 1}`,
              departureDate: d.departureDate ? new Date(d.departureDate).toISOString().split('T')[0] : '',
              departureTime: d.departureTime || '09:00',
              timezone: d.timezone || 'Asia/Kolkata (IST)',
              pickupLocation: d.pickupLocation || raw.pickupCity || raw.destination || 'Airport',
              reportingTime: d.reportingTime || '07:30 AM',
              bookingClosingDate: d.bookingClosingDate ? new Date(d.bookingClosingDate).toISOString().split('T')[0] : '',
              bookingClosingTime: d.bookingClosingTime || '23:59',
              maximumTravelers: d.maximumTravelers || d.capacity || raw.totalSeats || 20,
              bookedTravelers: d.bookedTravelers || d.bookedSeats || 0,
              availableSeats: d.availableSeats !== undefined ? d.availableSeats : (d.capacity || raw.totalSeats || 20) - (d.bookedSeats || 0),
              status: d.status || 'Upcoming',
              returnDate: d.returnDate ? new Date(d.returnDate).toISOString().split('T')[0] : '',
              returnTime: d.returnTime || '09:00',
            }))
          : (Array.isArray(raw.upcomingDepartures) && raw.upcomingDepartures.length > 0
              ? raw.upcomingDepartures.map((d: any, idx: number) => ({
                  id: d.id || d.departureId || `dep-${idx + 1}`,
                  departureDate: d.departureDate ? new Date(d.departureDate).toISOString().split('T')[0] : '',
                  departureTime: d.departureTime || '09:00',
                  timezone: d.timezone || 'Asia/Kolkata (IST)',
                  pickupLocation: d.pickupLocation || raw.pickupCity || raw.destination || 'Airport',
                  reportingTime: d.reportingTime || '07:30 AM',
                  bookingClosingDate: d.bookingClosingDate ? new Date(d.bookingClosingDate).toISOString().split('T')[0] : '',
                  bookingClosingTime: d.bookingClosingTime || '23:59',
                  maximumTravelers: d.maximumTravelers || d.capacity || raw.totalSeats || 20,
                  bookedTravelers: d.bookedTravelers || d.bookedSeats || 0,
                  availableSeats: d.availableSeats !== undefined ? d.availableSeats : (d.capacity || raw.totalSeats || 20) - (d.bookedSeats || 0),
                  status: d.status || 'Upcoming',
                  returnDate: d.returnDate ? new Date(d.returnDate).toISOString().split('T')[0] : '',
                  returnTime: d.returnTime || '09:00',
                }))
              : []),
      },
      step4: {
        days: Array.isArray(raw.itinerary) && raw.itinerary.length > 0 ? normalizeItineraryDays(raw.itinerary) : [],
        activeDayId: '',
      },
      stepAccommodation: {
        accommodationConfirmed: Boolean(raw.accommodationConfirmed),
        hotels: Array.isArray(raw.accommodations)
          ? raw.accommodations.map((h: any, idx: number) => ({
              id: h._id?.toString() || `hotel-${idx + 1}`,
              hotelName: h.hotelName || '',
              hotelImages: Array.isArray(h.hotelImages) ? h.hotelImages : [],
              category: h.category || 'Hotel',
              address: h.address || '',
              city: h.city || '',
              amenities: Array.isArray(h.amenities) ? h.amenities : [],
              roomType: h.roomType || '',
              checkIn: h.checkIn || '',
              checkOut: h.checkOut || '',
              shortDescription: h.shortDescription || '',
              dayRange: h.dayRange || '',
            }))
          : [],
      },
      step5: {
        coverImage: raw.coverImage || raw.featuredImage || '',
        galleryImages: Array.isArray(raw.galleryImages)
          ? raw.galleryImages.map((img: any, idx: number) => ({
              id: img.publicId || `img-${idx + 1}`,
              url: typeof img === 'string' ? img : img.url,
              publicId: img.publicId || '',
              width: img.width,
              height: img.height,
              format: img.format,
              bytes: img.bytes,
              size: img.size,
              uploadedAt: img.uploadedAt,
              name: img.originalFilename || `image_${idx + 1}.webp`,
              category: img.category,
            }))
          : [],
        videos: [],
        imageCategories: [],
        previewIndex: 0,
      },
      step6: {
        includedItems: Array.isArray(raw.inclusions) ? raw.inclusions : [],
        customIncludedItems: [],
        excludedItems: Array.isArray(raw.exclusions) ? raw.exclusions : [],
        customExcludedItems: [],
        packingItems: [],
        customPackingItems: [],
        optionalAddOns: [],
        importantNotes: '',
      },
      step7: {
        cancellationPolicy: raw.cancellationPolicy || raw.step7?.cancellationPolicy || 'Moderate',
        customCancellationRules: raw.customCancellationRules || raw.step7?.customCancellationRules || [],
        bookingTerms: Array.isArray(raw.bookingTerms) ? raw.bookingTerms : (raw.step7?.bookingTerms || ['Standard booking terms apply']),
        refundProcessing: raw.refundProcessing || raw.step7?.refundProcessing || 'Standard Refund',
        requiredDocuments: raw.requiredDocuments || raw.step7?.requiredDocuments || [],
        customDocuments: raw.customDocuments || raw.step7?.customDocuments || [],
        healthSafety: raw.healthSafety || raw.step7?.healthSafety || [],
        faqs: Array.isArray(raw.faq || raw.faqs) ? (raw.faq || raw.faqs) : (raw.step7?.faqs || []),
        emergencyContact: raw.emergencyContact || raw.step7?.emergencyContact || { phone: '', alternatePhone: '', email: '', is24x7: false },
        whatsappGroupLink: raw.whatsappGroupLink || raw.step7?.whatsappGroupLink || '',
        legalConfirmed: raw.legalConfirmed ?? raw.step7?.legalConfirmed ?? true,
      },
      step8: {
        ...EMPTY_WIZARD_DRAFT.step8,
        finalAgreement: raw.status === 'PUBLISHED' ? true : Boolean(raw.step8?.finalAgreement),
      },
    }));
  };

  const isStep1Valid = Boolean(
    (draft?.step1?.packageName?.trim()?.length ?? 0) > 0 &&
      (draft?.step1?.packageName?.trim()?.length ?? 0) <= 100 &&
      (draft?.step1?.shortDescription?.length ?? 0) <= 150 &&
      draft?.step1?.packageType !== null &&
      draft?.step1?.tripDifficulty !== null &&
      draft?.step1?.visibility !== null
  );

  const isStep2Valid = Boolean(
    (draft?.step2?.primaryDestination?.trim()?.length ?? 0) > 0 &&
      (draft?.step2?.destinationsCovered?.length ?? 0) > 0 &&
      (draft?.step2?.pickupCity?.trim()?.length ?? 0) > 0 &&
      (draft?.step2?.dropOffCity?.trim()?.length ?? 0) > 0 &&
      (draft?.step2?.travelModes?.length ?? 0) > 0
  );

  const isStep3Valid = Boolean(
    (draft?.step3?.originalPrice ?? 0) > 0 &&
      (draft?.step3?.maxTravelers ?? 0) > 0 &&
      (draft?.step3?.paymentType === 'Full Payment' || (draft?.step3?.advanceAmount ?? 0) > 0)
  );

  const hasValidSchedule = checkPackageHasValidSchedule(draft);
  const isStepDeparturesValid = hasValidSchedule;

  const itineraryDaysCount = draft?.step4?.days?.length ?? 0;
  const packageDaysCount = draft?.step2?.days ?? 7;
  const isItineraryDurationValid = itineraryDaysCount === packageDaysCount;

  const isStep4Valid = Boolean(
    itineraryDaysCount > 0 &&
      isItineraryDurationValid &&
      draft?.step4?.days?.every((day) => {
        const hasTitle = Boolean(day.title && day.title.trim().length > 0);
        const hasPlans = Array.isArray(day.plans) && day.plans.length > 0;
        const allPlansValid =
          hasPlans &&
          day.plans.every((p) => {
            const text = (
              typeof p === 'string'
                ? p
                : p?.text ?? (p as any)?.title ?? (p as any)?.description ?? (p as any)?.content ?? (p as any)?.name ?? ''
            ).toString().trim();
            return text.length > 0;
          });
        return hasTitle && allPlansValid;
      })
  );

  const isStepAccommodationValid = Boolean(
    !draft?.stepAccommodation?.accommodationConfirmed ||
    ((draft?.stepAccommodation?.hotels?.length ?? 0) > 0 &&
      draft.stepAccommodation.hotels.every((h) => (h.hotelName?.trim()?.length ?? 0) > 0))
  );

  const isStep5Valid = Boolean(
    (draft?.step5?.coverImage?.length ?? 0) > 0 &&
      (draft?.step5?.galleryImages?.length ?? 0) >= 3
  );

  const totalInclusionsCount =
    (draft?.step6?.includedItems?.length ?? 0) +
    (draft?.step6?.customIncludedItems?.length ?? 0);

  const totalExclusionsCount =
    (draft?.step6?.excludedItems?.length ?? 0) +
    (draft?.step6?.customExcludedItems?.length ?? 0);

  const isStep6Valid = Boolean(
    totalInclusionsCount >= 5 && totalExclusionsCount >= 3
  );

  const step7 = draft?.step7;
  const isWhatsappLinkValid =
    !step7?.whatsappGroupLink ||
    step7.whatsappGroupLink.trim() === '' ||
    /^https:\/\/(chat\.whatsapp\.com\/[A-Za-z0-9_-]+|wa\.me\/[0-9]+)/i.test(step7.whatsappGroupLink.trim());

  const isStep7Valid = Boolean(
    step7?.cancellationPolicy &&
      (step7?.bookingTerms?.length ?? 0) >= 1 &&
      (step7?.faqs?.length ?? 0) >= 1 &&
      (step7?.emergencyContact?.phone?.trim()?.length ?? 0) >= 10 &&
      (step7?.emergencyContact?.email?.trim()?.includes('@') ?? false) &&
      step7?.legalConfirmed === true &&
      isWhatsappLinkValid
  );

  const isStep8Valid = Boolean(draft?.step8?.finalAgreement === true);

  const isAllStepsValid =
    isStep1Valid &&
    isStep2Valid &&
    isStep3Valid &&
    isStepDeparturesValid &&
    isStep4Valid &&
    isStepAccommodationValid &&
    isStep5Valid &&
    isStep6Valid &&
    isStep7Valid &&
    isStep8Valid;

  const validStepCount = [
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isStepDeparturesValid,
    isStep4Valid,
    isStepAccommodationValid,
    isStep5Valid,
    isStep6Valid,
    isStep7Valid,
  ].filter(Boolean).length;
  const completionPercentage = Math.round((validStepCount / 9) * 100);

  const validateAllSteps = () => {
    const missingSections: string[] = [];
    let firstInvalidStep = 0;

    if (!isStep1Valid) {
      missingSections.push('Step 1: Basic Information (Title & Package Type)');
      if (!firstInvalidStep) firstInvalidStep = 1;
    }
    if (!isStep2Valid) {
      missingSections.push('Step 2: Destination & Route (Primary Destination, Pickup/Drop)');
      if (!firstInvalidStep) firstInvalidStep = 2;
    }
    if (!isStep3Valid) {
      missingSections.push('Step 3: Pricing & Capacity (Base Price, Max Travelers)');
      if (!firstInvalidStep) firstInvalidStep = 3;
    }
    if (!isStepDeparturesValid) {
      missingSections.push('Step 4: Departure Schedule (At least one future scheduled date)');
      if (!firstInvalidStep) firstInvalidStep = 4;
    }
    if (!isStep4Valid) {
      if (itineraryDaysCount === 0) {
        missingSections.push('Step 5: Itinerary (Itinerary days are required)');
      } else if (!isItineraryDurationValid) {
        missingSections.push(`Step 5: Itinerary (Days count [${itineraryDaysCount}] must match package duration [${packageDaysCount} days])`);
      } else {
        draft?.step4?.days?.forEach((day) => {
          if (!day.title || day.title.trim().length === 0) {
            missingSections.push(`Step 5: Itinerary - Day ${day.dayNumber}: Title is required`);
          }
          if (!day.plans || day.plans.length === 0) {
            missingSections.push(`Step 5: Itinerary - Day ${day.dayNumber} ("${day.title || 'Untitled'}") requires at least one planned activity`);
          } else {
            day.plans.forEach((p, pIdx) => {
              const text = (
                typeof p === 'string'
                  ? p
                  : p?.text ?? (p as any)?.title ?? (p as any)?.description ?? (p as any)?.content ?? (p as any)?.name ?? ''
              ).toString().trim();
              if (!text) {
                missingSections.push(`Step 5: Itinerary - Day ${day.dayNumber} ("${day.title || 'Untitled'}"): Plan item ${pIdx + 1} activity text is required`);
              }
            });
          }
        });
      }
      if (!firstInvalidStep) firstInvalidStep = 5;
    }
    if (!isStepAccommodationValid) {
      missingSections.push('Step 6: Accommodation (Hotel names required if enabled)');
      if (!firstInvalidStep) firstInvalidStep = 6;
    }
    if (!isStep5Valid) {
      missingSections.push('Step 7: Gallery & Media (Cover image + min 3 gallery photos)');
      if (!firstInvalidStep) firstInvalidStep = 7;
    }
    if (!isStep6Valid) {
      missingSections.push('Step 8: Inclusions & Exclusions (Min 5 inclusions, min 3 exclusions)');
      if (!firstInvalidStep) firstInvalidStep = 8;
    }
    if (!isStep7Valid) {
      if (!isWhatsappLinkValid) {
        missingSections.push('Step 9: WhatsApp Group Link must be a valid WhatsApp invite/chat URL');
      } else {
        missingSections.push('Step 9: Policies & Emergency Contact (Cancellation, FAQs, phone/email, legal agreement)');
      }
      if (!firstInvalidStep) firstInvalidStep = 9;
    }
    if (!isStep8Valid) {
      missingSections.push('Step 10: Final Agreement checkbox');
      if (!firstInvalidStep) firstInvalidStep = 10;
    }

    return {
      isValid: missingSections.length === 0,
      firstInvalidStep: firstInvalidStep || 1,
      missingSections,
    };
  };

  let isCurrentStepValid = false;
  switch (currentStep) {
    case 1:
      isCurrentStepValid = isStep1Valid;
      break;
    case 2:
      isCurrentStepValid = isStep2Valid;
      break;
    case 3:
      isCurrentStepValid = isStep3Valid;
      break;
    case 4:
      isCurrentStepValid = isStepDeparturesValid;
      break;
    case 5:
      isCurrentStepValid = isStep4Valid;
      break;
    case 6:
      isCurrentStepValid = isStepAccommodationValid;
      break;
    case 7:
      isCurrentStepValid = isStep5Valid;
      break;
    case 8:
      isCurrentStepValid = isStep6Valid;
      break;
    case 9:
      isCurrentStepValid = isStep7Valid;
      break;
    case 10:
      isCurrentStepValid = isStep8Valid;
      break;
  }

  return (
    <PackageWizardContext.Provider
      value={{
        currentStep,
        draft,
        autosaveStatus,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStepDepartures,
        addDepartureItem,
        removeDepartureItem,
        updateDepartureItem,
        updateStep4,
        updateStepAccommodation,
        toggleAccommodationConfirmed,
        addHotel,
        updateHotel,
        removeHotel,
        updateStep5,
        updateStep6,
        updateStep7,
        updateStep8,
        addItineraryDay,
        deleteItineraryDay,
        duplicateItineraryDay,
        moveItineraryDay,
        addPlanItem,
        updatePlanItem,
        removePlanItem,
        movePlanItem,
        reorderPlanItems,
        setCoverImage,
        addGalleryImage,
        removeGalleryImage,
        addVideo,
        removeVideo,
        toggleCategoryTag,
        toggleIncludedItem,
        addCustomInclusion,
        removeCustomInclusion,
        toggleExcludedItem,
        addCustomExclusion,
        removeCustomExclusion,
        togglePackingItem,
        addCustomPackingItem,
        removeCustomPackingItem,
        toggleAddOn,
        updateAddOnPrice,
        toggleBookingTerm,
        toggleRequiredDocument,
        addCustomDocument,
        removeCustomDocument,
        toggleHealthSafety,
        addFAQ,
        updateFAQ,
        removeFAQ,
        addCustomCancellationRule,
        removeCustomCancellationRule,
        toggleVisibilityTarget,
        saveDraftToast,
        nextStep,
        prevStep,
        goToStep,
        resetDraft,
        startFreshDraft,
        loadActiveDraft,
        completionPercentage,
        validateAllSteps,
        isStep1Valid,
        isStep2Valid,
        isStep3Valid,
        isStepDeparturesValid,
        isStep4Valid,
        isStepAccommodationValid,
        isStep5Valid,
        isStep6Valid,
        isStep7Valid,
        isStep8Valid,
        hasValidSchedule,
        isItineraryDurationValid,
        isAllStepsValid,
        isCurrentStepValid,
      }}
    >
      {children}
    </PackageWizardContext.Provider>
  );
};

export const usePackageWizard = () => {
  const context = useContext(PackageWizardContext);
  if (!context) {
    throw new Error('usePackageWizard must be used within a PackageWizardProvider');
  }
  return context;
};
