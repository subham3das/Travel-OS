import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Users,
  Plus,
  AlertCircle,
  HeartPulse,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  FileText,
  User,
  Phone,
  Sparkles,
  Loader2,
  X,
  ExternalLink,
} from 'lucide-react';
import { TravelerSectionData } from '../types/checkout';
import { useToast } from '../../../context/ToastContext';
import {
  travelProfileService,
  SavedTravelerItem,
  TravelProfileStats,
  hasValidGovId,
} from '../../../services/travelProfile.service';
import { UniversalImageUploader } from '../../../../components/common/UniversalImageUploader';

interface TravelerSectionProps {
  packageData: {
    id: string;
    title: string;
    agencyName: string;
    agencyVerified: boolean;
    price: string;
    duration: string;
    coverImage: string;
    departureDate: string;
    requiresPassport?: boolean;
    requiresVisa?: boolean;
    requiresAadhaar?: boolean;
    requiresEmergencyContact?: boolean;
  };
  initialData: TravelerSectionData;
  isCollapsed: boolean;
  onSave: (data: TravelerSectionData) => void;
  onEdit: () => void;
}

export const TravelerSection: React.FC<TravelerSectionProps> = ({
  packageData,
  initialData,
  isCollapsed,
  onSave,
  onEdit,
}) => {
  const { showToast } = useToast();

  const [savedTravelers, setSavedTravelers] = useState<SavedTravelerItem[]>([]);
  const [profileStats, setProfileStats] = useState<TravelProfileStats | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialData.selectedTravelerIds || []);
  const [useMyProfile, setUseMyProfile] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // Quick Add Traveler Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [quickAddGovType, setQuickAddGovType] = useState<'aadhaar' | 'voterId'>('aadhaar');
  const [newTraveler, setNewTraveler] = useState<Partial<SavedTravelerItem>>({
    fullName: '',
    relationship: 'friend',
    dob: '',
    gender: 'male',
    nationality: 'Indian',
    phone: '',
    email: '',
    address: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    medicalNotes: '',
    bloodGroup: '',
    aadhaar: { number: '', frontUrl: '', backUrl: '' },
    voterId: { number: '', frontUrl: '' },
    passport: { number: '', expiryDate: '', documentUrl: '' },
  });

  // Load Saved Travelers and Travel Profile Stats
  const loadData = async () => {
    try {
      const [travelersList, profileRes] = await Promise.all([
        travelProfileService.listSavedTravelers(false),
        travelProfileService.getProfile(),
      ]);

      setSavedTravelers(travelersList);
      setProfileStats(profileRes.stats);

      // Default selection: if nothing selected yet, select 'self'
      if (selectedIds.length === 0) {
        const selfTraveler = travelersList.find((t) => t.relationship === 'self');
        if (selfTraveler) {
          setSelectedIds([selfTraveler.id]);
          setUseMyProfile(true);
        } else if (travelersList.length > 0) {
          setSelectedIds([travelersList[0].id]);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load saved travelers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle "Use My Travel Profile" toggle
  const handleToggleMyProfile = (checked: boolean) => {
    setUseMyProfile(checked);
    const selfTraveler = savedTravelers.find((t) => t.relationship === 'self');
    if (!selfTraveler) return;

    if (checked) {
      if (!selectedIds.includes(selfTraveler.id)) {
        setSelectedIds((prev) => [selfTraveler.id, ...prev]);
      }
    } else {
      setSelectedIds((prev) => prev.filter((id) => id !== selfTraveler.id));
    }
  };

  // Toggle individual traveler selection
  const handleToggleTraveler = (travelerId: string) => {
    setSelectedIds((prev) => {
      const next = prev.includes(travelerId)
        ? prev.filter((id) => id !== travelerId)
        : [...prev, travelerId];

      const selfTraveler = savedTravelers.find((t) => t.relationship === 'self');
      if (selfTraveler) {
        setUseMyProfile(next.includes(selfTraveler.id));
      }
      return next;
    });
  };

  // Quick Add Traveler submit
  const handleAddTravelerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTraveler.fullName?.trim()) {
      showToast('Traveler name is required', 'error');
      return;
    }
    if (!newTraveler.dob) {
      showToast('Date of birth is required', 'error');
      return;
    }

    setModalSaving(true);
    try {
      const added = await travelProfileService.addSavedTraveler(newTraveler);
      showToast(`${added.fullName} added and selected!`, 'success');

      // Update state without page refresh
      setSavedTravelers((prev) => [added, ...prev]);
      setSelectedIds((prev) => [...prev, added.id]);
      setIsAddModalOpen(false);

      // Reset form
      setNewTraveler({
        fullName: '',
        relationship: 'friend',
        dob: '',
        gender: 'male',
        nationality: 'Indian',
        phone: '',
        email: '',
        address: '',
        emergencyContact: { name: '', phone: '', relationship: '' },
        medicalNotes: '',
        bloodGroup: '',
        aadhaar: { number: '', frontUrl: '', backUrl: '' },
        voterId: { number: '', frontUrl: '' },
        passport: { number: '', expiryDate: '', documentUrl: '' },
      });
    } catch (err: any) {
      showToast(err.message || 'Failed to add traveler', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // Validation: Check Mandatory Government ID & Package Requirements
  const selectedTravelerObjects = savedTravelers.filter((t) => selectedIds.includes(t.id));

  const checkRequirementsForTraveler = (t: SavedTravelerItem) => {
    const missing: string[] = [];
    const govStatus = hasValidGovId(t);
    if (!govStatus.isValid) {
      missing.push(govStatus.reason || 'Government ID (Aadhaar or Voter ID)');
    }
    if (packageData.requiresPassport && !t.passport?.number && !t.passport?.documentUrl) {
      missing.push('Passport');
    }
    if (
      packageData.requiresEmergencyContact &&
      (!t.emergencyContact?.name || !t.emergencyContact?.phone)
    ) {
      missing.push('Emergency Contact');
    }
    return missing;
  };

  const travelersWithMissingGovId = selectedTravelerObjects
    .map((t) => ({ traveler: t, status: hasValidGovId(t) }))
    .filter((item) => !item.status.isValid);

  const travelersWithMissingReqs = selectedTravelerObjects
    .map((t) => ({ traveler: t, missing: checkRequirementsForTraveler(t) }))
    .filter((item) => item.missing.length > 0);

  const hasBlockingRequirements = travelersWithMissingReqs.length > 0;

  const getTravelerIdProof = (item: SavedTravelerItem) => {
    if (item.aadhaar?.frontUrl && item.aadhaar?.backUrl) {
      return { type: 'Aadhaar Card', number: item.aadhaar.number || 'Aadhaar Verified' };
    }
    if (item.voterId?.frontUrl) {
      return { type: 'Voter ID Card', number: item.voterId.number || 'Voter ID Verified' };
    }
    if (item.passport?.number) {
      return { type: 'Passport', number: item.passport.number };
    }
    return { type: 'Government ID', number: 'Not verified' };
  };

  // Handle proceed to Review
  const handleProceed = () => {
    if (selectedTravelerObjects.length === 0) {
      showToast('Please choose at least one traveler for this booking', 'error');
      return;
    }

    if (travelersWithMissingGovId.length > 0) {
      showToast(
        'Complete your Travel Profile before booking. Every traveler must have a verified Aadhaar (Front & Back) or Voter ID Card.',
        'error'
      );
      return;
    }

    if (hasBlockingRequirements) {
      showToast(
        'Please complete all traveler requirements before booking this package',
        'error'
      );
      return;
    }

    const lead =
      selectedTravelerObjects.find((t) => t.relationship === 'self') ||
      selectedTravelerObjects[0];

    const leadIdProof = getTravelerIdProof(lead);

    const formattedData: TravelerSectionData = {
      selectedTravelerIds: selectedIds,
      leadTraveler: {
        fullName: lead.fullName,
        email: lead.email || '',
        phone: lead.phone || '',
        gender: lead.gender === 'female' ? 'Female' : lead.gender === 'other' ? 'Other' : 'Male',
        dob: lead.dob ? lead.dob.split('T')[0] : '',
        idProofType: leadIdProof.type,
        idProofNumber: leadIdProof.number,
        address: lead.address || '',
        medicalNotes: lead.medicalNotes || '',
        travelPreferences: '',
        specialRequests: '',
      },
      additionalTravelers: selectedTravelerObjects
        .filter((t) => t.id !== lead.id)
        .map((t) => {
          const idProof = getTravelerIdProof(t);
          return {
            id: t.id,
            fullName: t.fullName,
            gender: t.gender === 'female' ? 'Female' : t.gender === 'other' ? 'Other' : 'Male',
            dob: t.dob ? t.dob.split('T')[0] : '',
            idProofType: idProof.type,
            idProofNumber: idProof.number,
            emergencyContact: t.emergencyContact?.phone || lead.phone || '',
          };
        }),
      emergencyContact: {
        name: lead.emergencyContact?.name || lead.fullName,
        phone: lead.emergencyContact?.phone || lead.phone || '',
        relationship: lead.emergencyContact?.relationship || 'Primary Contact',
      },
      medicalNotes: lead.medicalNotes || '',
      travelPreferences: '',
      specialRequests: '',
    };

    onSave(formattedData);
  };

  const calcAge = (dobString?: string) => {
    if (!dobString) return '';
    const diff = Date.now() - new Date(dobString).getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return isNaN(age) || age < 0 ? '' : `${age} yrs`;
  };

  // If section collapsed after saving
  if (isCollapsed) {
    return (
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-100 shadow-2xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-[#0F172A]">
              Travelers Selected ({selectedTravelerObjects.length} Seat{selectedTravelerObjects.length === 1 ? '' : 's'})
            </h4>
            <p className="text-xs text-slate-500">
              {selectedTravelerObjects.map((t) => t.fullName).join(', ')}
            </p>
          </div>
        </div>

        <button
          onClick={onEdit}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-2xs space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#6356E5] bg-purple-50 px-2.5 py-1 rounded-full">
            Step 1 &bull; Choose Travelers
          </span>
          <h3 className="text-lg sm:text-xl font-black text-[#0F172A] mt-1.5">
            Select Who Is Traveling
          </h3>
          <p className="text-xs text-slate-400">
            No repeated form filling. Simply check saved travelers or add new companions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6356E5] text-xs sm:text-sm font-bold border border-purple-100 whitespace-nowrap shrink-0 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Traveler</span>
        </button>
      </div>

      {/* 2. Profile Completion Widget (Part 7) */}
      {profileStats && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/40 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6356E5]" />
              <span className="font-extrabold text-[#0F172A]">
                Travel Profile: {profileStats.completionPercentage}% Complete
              </span>
            </div>
            {profileStats.missingFields.length > 0 ? (
              <span className="text-[11px] font-semibold text-rose-500">
                Missing: {profileStats.missingFields.join(', ')}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Ready
              </span>
            )}
          </div>
          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6356E5] to-[#FF4D6D] rounded-full transition-all duration-500"
              style={{ width: `${Math.max(5, profileStats.completionPercentage)}%` }}
            />
          </div>
        </div>
      )}

      {/* 3. "Use My Travel Profile" Top Switch (Part 6) */}
      <div
        onClick={() => handleToggleMyProfile(!useMyProfile)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          useMyProfile
            ? 'bg-purple-50/60 border-[#6356E5]/40 shadow-xs'
            : 'bg-white border-slate-200/80 hover:bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={useMyProfile}
            onChange={(e) => handleToggleMyProfile(e.target.checked)}
            className="w-5 h-5 rounded-lg accent-[#6356E5] cursor-pointer"
          />
          <div>
            <h4 className="text-xs sm:text-sm font-black text-[#0F172A] flex items-center gap-2">
              <span>Use My Travel Profile</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100/80 text-[#6356E5] text-[10px] font-black uppercase">
                Self
              </span>
            </h4>
            <p className="text-[11px] text-slate-500">
              Automatically applies your verified details, documents, and emergency contact.
            </p>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-white text-[#6356E5] border border-purple-100 flex items-center justify-center shrink-0">
          <User className="w-4 h-4" />
        </div>
      </div>

      {/* 4. Package Requirements Alert (Part 8) */}
      {(packageData.requiresPassport ||
        packageData.requiresVisa ||
        packageData.requiresAadhaar ||
        packageData.requiresEmergencyContact) && (
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-black">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Package Mandatory Requirements:</span>
          </div>
          <p className="text-[11px] text-amber-800/90 pl-5.5">
            This trip requires verified{' '}
            {[
              packageData.requiresPassport && 'Passport',
              packageData.requiresVisa && 'Visa Details',
              packageData.requiresAadhaar && 'Aadhaar',
              packageData.requiresEmergencyContact && 'Emergency Contact',
            ]
              .filter(Boolean)
              .join(', ')}{' '}
            for all travelers.
          </p>
        </div>
      )}

      {/* 5. Saved Travelers Selection Grid (Part 5) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-slate-400 uppercase tracking-wider text-[11px]">
            Saved Travelers Roster
          </span>
          <span className="font-extrabold text-[#6356E5]">
            {selectedTravelerObjects.length} Traveler{selectedTravelerObjects.length === 1 ? '' : 's'} Selected ({selectedTravelerObjects.length} Seat{selectedTravelerObjects.length === 1 ? '' : 's'})
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 font-bold text-xs">
            Loading saved travelers...
          </div>
        ) : savedTravelers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600">No saved travelers found</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer"
            >
              + Add Traveler Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedTravelers.map((t) => {
              const isSelected = selectedIds.includes(t.id);
              const missingReqs = checkRequirementsForTraveler(t);
              const hasMissing = missingReqs.length > 0;

              return (
                <div
                  key={t.id}
                  onClick={() => handleToggleTraveler(t.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? hasMissing
                        ? 'border-amber-400 bg-amber-50/40 shadow-xs'
                        : 'border-[#6356E5] bg-purple-50/30 shadow-xs'
                      : 'border-slate-200/80 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // Controlled by outer div click
                        className="w-4 h-4 rounded-md accent-[#6356E5] cursor-pointer"
                      />

                      {t.photoUrl ? (
                        <img
                          src={t.photoUrl}
                          alt={t.fullName}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100 shadow-2xs"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-black text-xs flex items-center justify-center">
                          {t.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">
                            {t.fullName}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                            {t.relationship}
                          </span>
                          {(() => {
                            const govStatus = hasValidGovId(t);
                            if (govStatus.isValid) {
                              return (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  {govStatus.label}
                                </span>
                              );
                            }
                            return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                Gov ID Required
                              </span>
                            );
                          })()}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {t.gender} &bull; {calcAge(t.dob)} &bull; {t.nationality}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#6356E5] text-white flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Requirements Warning on Traveler */}
                  {isSelected && hasMissing && (
                    <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-700 font-bold">
                      <span className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        Missing: {missingReqs.join(', ')}
                      </span>
                      <a
                        href="/profile?tab=travel-profile"
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#6356E5] hover:underline flex items-center gap-0.5 text-[10px]"
                      >
                        Complete Profile &rarr;
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. Booking Validation Gate: Government ID Verification */}
      {hasBlockingRequirements && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/90 border border-rose-200 text-rose-900 space-y-3">
          <div className="flex items-start gap-2.5 font-black text-rose-700">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black">Complete your Travel Profile before booking</h4>
              <p className="text-xs font-normal text-rose-700 mt-0.5">
                Every traveler must have at least one verified primary government ID before completing a booking.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl border border-rose-200/70 text-xs text-rose-950 space-y-2">
            <p className="font-bold text-slate-900">Please upload either:</p>
            <div className="pl-2 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6356E5]" />
                <span className="font-bold text-[#0F172A]">&bull; Aadhaar Card</span>
                <span className="text-[11px] text-slate-500">(Front Side AND Back Side are both mandatory)</span>
              </div>
              <p className="text-[11px] text-slate-400 font-bold pl-4">or</p>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6356E5]" />
                <span className="font-bold text-[#0F172A]">&bull; Voter ID Card</span>
                <span className="text-[11px] text-slate-500">(Front Side Only)</span>
              </div>
            </div>
            {travelersWithMissingReqs.length > 0 && (
              <p className="text-[11px] text-rose-600 font-semibold pt-1 border-t border-slate-100">
                Incomplete travelers:{' '}
                {travelersWithMissingReqs
                  .map((item) => `${item.traveler.fullName} (${item.missing.join(', ')})`)
                  .join('; ')}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <span className="text-[11px] font-bold text-rose-600">
              Payment is disabled until verification is completed.
            </span>
            <a
              href="/profile?tab=travel-profile"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-xs cursor-pointer"
            >
              <span>Upload ID in Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* 7. Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500">
          Total Seats:{' '}
          <span className="font-extrabold text-[#0F172A]">
            {selectedTravelerObjects.length} Passenger{selectedTravelerObjects.length === 1 ? '' : 's'}
          </span>{' '}
          &bull; Price updates automatically
        </div>

        <button
          type="button"
          onClick={handleProceed}
          disabled={selectedTravelerObjects.length === 0 || hasBlockingRequirements}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-7 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm shadow-[#6356E5]/25 hover:shadow-md hover:shadow-[#6356E5]/35 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <span>Continue to Review</span>
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>

      {/* + Add Traveler Modal (Seamless, No Page Refresh) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">Add New Traveler</h3>
                  <p className="text-xs text-slate-400">
                    Will be added to your saved travelers and selected immediately.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTravelerSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Relationship *
                    </label>
                    <select
                      value={newTraveler.relationship}
                      onChange={(e) =>
                        setNewTraveler({ ...newTraveler, relationship: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    >
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newTraveler.fullName || ''}
                      onChange={(e) => setNewTraveler({ ...newTraveler, fullName: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={newTraveler.dob || ''}
                      onChange={(e) => setNewTraveler({ ...newTraveler, dob: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Gender *
                    </label>
                    <select
                      value={newTraveler.gender || 'male'}
                      onChange={(e) =>
                        setNewTraveler({ ...newTraveler, gender: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={newTraveler.nationality || 'Indian'}
                      onChange={(e) => setNewTraveler({ ...newTraveler, nationality: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={newTraveler.phone || ''}
                      onChange={(e) => setNewTraveler({ ...newTraveler, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={newTraveler.emergencyContact?.phone || ''}
                      onChange={(e) =>
                        setNewTraveler({
                          ...newTraveler,
                          emergencyContact: {
                            ...newTraveler.emergencyContact,
                            name: newTraveler.fullName || 'Emergency',
                            phone: e.target.value,
                            relationship: 'Contact',
                          },
                        })
                      }
                      placeholder="Emergency Phone"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Primary Government ID for Quick Add */}
                <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#6356E5]" />
                      Primary Government ID *
                    </span>
                    <div className="inline-flex p-0.5 bg-white rounded-lg border border-slate-200 text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => setQuickAddGovType('aadhaar')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          quickAddGovType === 'aadhaar'
                            ? 'bg-[#6356E5] text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Aadhaar
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickAddGovType('voterId')}
                        className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                          quickAddGovType === 'voterId'
                            ? 'bg-[#6356E5] text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        Voter ID
                      </button>
                    </div>
                  </div>

                  {quickAddGovType === 'aadhaar' ? (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={newTraveler.aadhaar?.number || ''}
                        onChange={(e) =>
                          setNewTraveler({
                            ...newTraveler,
                            aadhaar: { ...newTraveler.aadhaar, number: e.target.value },
                          })
                        }
                        placeholder="12-digit Aadhaar Number"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <div className="min-w-0 overflow-hidden">
                          <UniversalImageUploader
                            label="Front Side *"
                            helpText="JPG/PNG/PDF"
                            folder="travelos/travelers/aadhaar"
                            allowPdf={true}
                            compact={true}
                            value={newTraveler.aadhaar?.frontUrl || ''}
                            onChange={(url) =>
                              setNewTraveler({
                                ...newTraveler,
                                aadhaar: { ...newTraveler.aadhaar, frontUrl: url },
                              })
                            }
                          />
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <UniversalImageUploader
                            label="Back Side *"
                            helpText="JPG/PNG/PDF"
                            folder="travelos/travelers/aadhaar"
                            allowPdf={true}
                            compact={true}
                            value={newTraveler.aadhaar?.backUrl || ''}
                            onChange={(url) =>
                              setNewTraveler({
                                ...newTraveler,
                                aadhaar: { ...newTraveler.aadhaar, backUrl: url },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <input
                        type="text"
                        value={newTraveler.voterId?.number || ''}
                        onChange={(e) =>
                          setNewTraveler({
                            ...newTraveler,
                            voterId: { ...newTraveler.voterId, number: e.target.value },
                          })
                        }
                        placeholder="Voter ID (EPIC) Number"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                      />
                      <div className="min-w-0 overflow-hidden">
                        <UniversalImageUploader
                          label="Front Side Only *"
                          helpText="JPG/PNG/PDF"
                          folder="travelos/travelers/voter-id"
                          allowPdf={true}
                          compact={true}
                          value={newTraveler.voterId?.frontUrl || ''}
                          onChange={(url) =>
                            setNewTraveler({
                              ...newTraveler,
                              voterId: { ...newTraveler.voterId, frontUrl: url },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSaving}
                    className="px-5 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs font-black shadow-md shadow-[#6356E5]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {modalSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Save & Select</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
