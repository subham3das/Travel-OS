import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PackageWizardDraft,
  INITIAL_WIZARD_DRAFT,
  Step1BasicInfo,
  Step2DestinationInfo,
  Step3PricingInfo,
  StepDeparturesInfo,
  DepartureScheduleItem,
  INITIAL_DEPARTURE_ITEM,
  Step6InclusionsInfo,
  Step7PoliciesInfo,
  Step8PublishInfo,
  AddOnState,
} from '../types/packageWizard';
import { Step4ItineraryInfo, ItineraryDay } from '../types/itinerary';
import { Step5GalleryInfo, GalleryImage, VideoFile, CategoryTag } from '../types/gallery';
import { FAQItem, CustomCancellationRule } from '../data/policies';

const DRAFT_STORAGE_KEY = 'apnatrip_agency_package_wizard_draft';

interface PackageWizardContextType {
  currentStep: number;
  draft: PackageWizardDraft;
  updateStep1: (data: Partial<Step1BasicInfo>) => void;
  updateStep2: (data: Partial<Step2DestinationInfo>) => void;
  updateStep3: (data: Partial<Step3PricingInfo>) => void;
  updateStepDepartures: (data: Partial<StepDeparturesInfo>) => void;
  addDepartureItem: () => void;
  removeDepartureItem: (id: string) => void;
  updateDepartureItem: (id: string, updated: Partial<DepartureScheduleItem>) => void;
  updateStep4: (data: Partial<Step4ItineraryInfo>) => void;
  updateStep5: (data: Partial<Step5GalleryInfo>) => void;
  updateStep6: (data: Partial<Step6InclusionsInfo>) => void;
  updateStep7: (data: Partial<Step7PoliciesInfo>) => void;
  updateStep8: (data: Partial<Step8PublishInfo>) => void;
  addItineraryDay: () => void;
  deleteItineraryDay: (id: string) => void;
  duplicateItineraryDay: (id: string) => void;
  moveItineraryDay: (id: string, direction: 'up' | 'down') => void;
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
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  isStep3Valid: boolean;
  isStepDeparturesValid: boolean;
  isStep4Valid: boolean;
  isStep5Valid: boolean;
  isStep6Valid: boolean;
  isStep7Valid: boolean;
  isStep8Valid: boolean;
  isItineraryDurationValid: boolean;
  isAllStepsValid: boolean;
  isCurrentStepValid: boolean;
}

const PackageWizardContext = createContext<PackageWizardContextType | undefined>(undefined);

export const PackageWizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draft, setDraft] = useState<PackageWizardDraft>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            ...INITIAL_WIZARD_DRAFT,
            ...parsed,
            currentStep: parsed.currentStep || 1,
            step1: { ...INITIAL_WIZARD_DRAFT.step1, ...(parsed.step1 || {}) },
            step2: { ...INITIAL_WIZARD_DRAFT.step2, ...(parsed.step2 || {}) },
            step3: { ...INITIAL_WIZARD_DRAFT.step3, ...(parsed.step3 || {}) },
            stepDepartures: {
              departures: parsed?.stepDepartures?.departures?.length
                ? parsed.stepDepartures.departures
                : INITIAL_WIZARD_DRAFT.stepDepartures.departures,
            },
            step4: {
              days: parsed?.step4?.days?.length ? parsed.step4.days : INITIAL_WIZARD_DRAFT.step4.days,
              activeDayId: parsed?.step4?.activeDayId || INITIAL_WIZARD_DRAFT.step4.activeDayId,
            },
            step5: {
              coverImage: parsed?.step5?.coverImage || INITIAL_WIZARD_DRAFT.step5.coverImage,
              galleryImages: parsed?.step5?.galleryImages?.length
                ? parsed.step5.galleryImages
                : INITIAL_WIZARD_DRAFT.step5.galleryImages,
              videos: parsed?.step5?.videos || INITIAL_WIZARD_DRAFT.step5.videos,
              imageCategories: parsed?.step5?.imageCategories || INITIAL_WIZARD_DRAFT.step5.imageCategories,
              previewIndex: parsed?.step5?.previewIndex || 0,
            },
            step6: {
              includedItems: parsed?.step6?.includedItems || INITIAL_WIZARD_DRAFT.step6.includedItems,
              customIncludedItems: parsed?.step6?.customIncludedItems || INITIAL_WIZARD_DRAFT.step6.customIncludedItems,
              excludedItems: parsed?.step6?.excludedItems || INITIAL_WIZARD_DRAFT.step6.excludedItems,
              customExcludedItems: parsed?.step6?.customExcludedItems || INITIAL_WIZARD_DRAFT.step6.customExcludedItems,
              packingItems: parsed?.step6?.packingItems || INITIAL_WIZARD_DRAFT.step6.packingItems,
              customPackingItems: parsed?.step6?.customPackingItems || INITIAL_WIZARD_DRAFT.step6.customPackingItems,
              optionalAddOns: parsed?.step6?.optionalAddOns || INITIAL_WIZARD_DRAFT.step6.optionalAddOns,
              importantNotes: parsed?.step6?.importantNotes || '',
            },
            step7: {
              cancellationPolicy: parsed?.step7?.cancellationPolicy || INITIAL_WIZARD_DRAFT.step7.cancellationPolicy,
              customCancellationRules: parsed?.step7?.customCancellationRules || INITIAL_WIZARD_DRAFT.step7.customCancellationRules,
              bookingTerms: parsed?.step7?.bookingTerms || INITIAL_WIZARD_DRAFT.step7.bookingTerms,
              refundProcessing: parsed?.step7?.refundProcessing || INITIAL_WIZARD_DRAFT.step7.refundProcessing,
              requiredDocuments: parsed?.step7?.requiredDocuments || INITIAL_WIZARD_DRAFT.step7.requiredDocuments,
              customDocuments: parsed?.step7?.customDocuments || INITIAL_WIZARD_DRAFT.step7.customDocuments,
              healthSafety: parsed?.step7?.healthSafety || INITIAL_WIZARD_DRAFT.step7.healthSafety,
              faqs: parsed?.step7?.faqs || INITIAL_WIZARD_DRAFT.step7.faqs,
              emergencyContact: parsed?.step7?.emergencyContact || INITIAL_WIZARD_DRAFT.step7.emergencyContact,
              legalConfirmed: parsed?.step7?.legalConfirmed ?? INITIAL_WIZARD_DRAFT.step7.legalConfirmed,
            },
            step8: {
              seoSettings: parsed?.step8?.seoSettings || INITIAL_WIZARD_DRAFT.step8.seoSettings,
              publishMode: parsed?.step8?.publishMode || INITIAL_WIZARD_DRAFT.step8.publishMode,
              scheduleEnabled: parsed?.step8?.scheduleEnabled || INITIAL_WIZARD_DRAFT.step8.scheduleEnabled,
              publishDate: parsed?.step8?.publishDate || INITIAL_WIZARD_DRAFT.step8.publishDate,
              publishTime: parsed?.step8?.publishTime || INITIAL_WIZARD_DRAFT.step8.publishTime,
              timezone: parsed?.step8?.timezone || INITIAL_WIZARD_DRAFT.step8.timezone,
              visibilityTargets: parsed?.step8?.visibilityTargets || INITIAL_WIZARD_DRAFT.step8.visibilityTargets,
              finalAgreement: parsed?.step8?.finalAgreement ?? INITIAL_WIZARD_DRAFT.step8.finalAgreement,
            },
          };
        }
      }
    } catch {
      // Ignore storage errors
    }
    return INITIAL_WIZARD_DRAFT;
  });

  const [currentStep, setCurrentStep] = useState<number>(draft.currentStep || 1);

  useEffect(() => {
    setDraft((prev) => ({ ...prev, currentStep }));
  }, [currentStep]);

  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // Ignore storage errors
    }
  }, [draft]);

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
        minimumTravelers: prev?.step3?.minTravelers || 8,
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
        description: 'Describe today\'s activities and itinerary highlights...',
        activities: [{ id: `act-${Date.now()}`, time: '09:00', title: 'Morning Exploration' }],
        meals: ['Breakfast'],
        stay: 'Hotel',
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
        activities: targetDay.activities.map((a, i) => ({
          ...a,
          id: `act-dup-${Date.now()}-${i}`,
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

  const setCoverImage = (url: string) => {
    updateStep5({ coverImage: url });
  };

  const addGalleryImage = (url: string) => {
    setDraft((prev) => {
      const current = prev?.step5?.galleryImages || [];
      if (current.length >= 20) {
        alert('Maximum 20 gallery images allowed.');
        return prev;
      }
      const newImg: GalleryImage = {
        id: `img-${Date.now()}`,
        url,
        name: `photo_${current.length + 1}.jpg`,
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
    setCurrentStep((prev) => Math.min(prev + 1, 9));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= 9) {
      setCurrentStep(step);
    }
  };

  const resetDraft = () => {
    setDraft(INITIAL_WIZARD_DRAFT);
    setCurrentStep(1);
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
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

  const isStepDeparturesValid = Boolean(
    (draft?.stepDepartures?.departures?.length ?? 0) > 0 &&
      draft?.stepDepartures?.departures?.every(
        (dep) =>
          dep.departureDate &&
          dep.departureTime &&
          dep.bookingClosingDate &&
          dep.minimumTravelers <= dep.maximumTravelers &&
          new Date(dep.bookingClosingDate) <= new Date(dep.departureDate)
      )
  );

  const itineraryDaysCount = draft?.step4?.days?.length ?? 0;
  const packageDaysCount = draft?.step2?.days ?? 7;
  const isItineraryDurationValid = itineraryDaysCount === packageDaysCount;

  const isStep4Valid = Boolean(
    itineraryDaysCount > 0 &&
      isItineraryDurationValid &&
      draft?.step4?.days?.every(
        (day) =>
          day.title.trim().length > 0 &&
          day.description.trim().length > 0 &&
          day.activities.length > 0
      )
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
  const isStep7Valid = Boolean(
    step7?.cancellationPolicy &&
      (step7?.bookingTerms?.length ?? 0) >= 1 &&
      (step7?.emergencyContact?.phone?.trim()?.length ?? 0) >= 10 &&
      (step7?.emergencyContact?.email?.trim()?.includes('@') ?? false) &&
      step7?.legalConfirmed === true
  );

  const isStep8Valid = Boolean(draft?.step8?.finalAgreement === true);

  const isAllStepsValid =
    isStep1Valid &&
    isStep2Valid &&
    isStep3Valid &&
    isStepDeparturesValid &&
    isStep4Valid &&
    isStep5Valid &&
    isStep6Valid &&
    isStep7Valid &&
    isStep8Valid;

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
      isCurrentStepValid = isStep5Valid;
      break;
    case 7:
      isCurrentStepValid = isStep6Valid;
      break;
    case 8:
      isCurrentStepValid = isStep7Valid;
      break;
    case 9:
      isCurrentStepValid = isStep8Valid;
      break;
  }

  return (
    <PackageWizardContext.Provider
      value={{
        currentStep,
        draft,
        updateStep1,
        updateStep2,
        updateStep3,
        updateStepDepartures,
        addDepartureItem,
        removeDepartureItem,
        updateDepartureItem,
        updateStep4,
        updateStep5,
        updateStep6,
        updateStep7,
        updateStep8,
        addItineraryDay,
        deleteItineraryDay,
        duplicateItineraryDay,
        moveItineraryDay,
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
        isStep1Valid,
        isStep2Valid,
        isStep3Valid,
        isStepDeparturesValid,
        isStep4Valid,
        isStep5Valid,
        isStep6Valid,
        isStep7Valid,
        isStep8Valid,
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
