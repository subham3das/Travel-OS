import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Archive,
  ArchiveRestore,
  User,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  HeartPulse,
} from 'lucide-react';
import {
  travelProfileService,
  SavedTravelerItem,
  hasValidGovId,
} from '../../../services/travelProfile.service';
import { UniversalImageUploader } from '../../../../components/common/UniversalImageUploader';
import { useToast } from '../../../context/ToastContext';

export const SavedTravelersSection: React.FC = () => {
  const { showToast } = useToast();
  const [travelers, setTravelers] = useState<SavedTravelerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTraveler, setEditingTraveler] = useState<SavedTravelerItem | null>(null);
  const [modalSaving, setModalSaving] = useState(false);
  const [govIdType, setGovIdType] = useState<'aadhaar' | 'voterId'>('aadhaar');

  // Form State
  const [formData, setFormData] = useState<Partial<SavedTravelerItem>>({
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
    drivingLicence: { number: '', frontUrl: '', backUrl: '' },
    passport: { number: '', expiryDate: '', documentUrl: '' },
    photoUrl: '',
    isArchived: false,
  });

  const loadTravelers = async () => {
    try {
      const list = await travelProfileService.listSavedTravelers(true);
      setTravelers(list);
    } catch (err: any) {
      showToast(err.message || 'Failed to load saved travelers', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravelers();
  }, []);

  const openAddModal = () => {
    setEditingTraveler(null);
    setGovIdType('aadhaar');
    setFormData({
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
      drivingLicence: { number: '', frontUrl: '', backUrl: '' },
      passport: { number: '', expiryDate: '', documentUrl: '' },
      photoUrl: '',
      isArchived: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (t: SavedTravelerItem) => {
    setEditingTraveler(t);
    const prefersVoterId = Boolean(t.voterId?.frontUrl && !t.aadhaar?.frontUrl);
    setGovIdType(prefersVoterId ? 'voterId' : 'aadhaar');
    setFormData({
      fullName: t.fullName,
      relationship: t.relationship,
      dob: t.dob ? t.dob.split('T')[0] : '',
      gender: t.gender,
      nationality: t.nationality,
      phone: t.phone || '',
      email: t.email || '',
      address: t.address || '',
      emergencyContact: t.emergencyContact || { name: '', phone: '', relationship: '' },
      medicalNotes: t.medicalNotes || '',
      bloodGroup: t.bloodGroup || '',
      aadhaar: t.aadhaar || { number: '', frontUrl: '', backUrl: '' },
      voterId: t.voterId || { number: '', frontUrl: '' },
      drivingLicence: t.drivingLicence || { number: '', frontUrl: '', backUrl: '' },
      passport: t.passport || { number: '', expiryDate: '', documentUrl: '' },
      photoUrl: t.photoUrl || '',
      isArchived: t.isArchived,
    });
    setIsModalOpen(true);
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName?.trim()) {
      showToast('Traveler name is required', 'error');
      return;
    }
    if (!formData.dob) {
      showToast('Date of birth is required', 'error');
      return;
    }

    setModalSaving(true);
    try {
      if (editingTraveler) {
        await travelProfileService.updateSavedTraveler(editingTraveler.id, formData);
        showToast('Saved traveler updated', 'success');
      } else {
        await travelProfileService.addSavedTraveler(formData);
        showToast('Saved traveler added', 'success');
      }
      setIsModalOpen(false);
      loadTravelers();
    } catch (err: any) {
      showToast(err.message || 'Failed to save traveler', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  const handleArchiveToggle = async (t: SavedTravelerItem) => {
    try {
      const nextState = !t.isArchived;
      await travelProfileService.archiveSavedTraveler(t.id, nextState);
      showToast(nextState ? 'Traveler archived' : 'Traveler unarchived', 'success');
      loadTravelers();
    } catch (err: any) {
      showToast(err.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (t: SavedTravelerItem) => {
    if (t.relationship === 'self') {
      showToast('You cannot delete your own primary profile traveler', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove ${t.fullName}?`)) return;

    try {
      await travelProfileService.deleteSavedTraveler(t.id);
      showToast('Traveler removed', 'success');
      loadTravelers();
    } catch (err: any) {
      showToast(err.message || 'Delete failed', 'error');
    }
  };

  const calcAge = (dobString?: string) => {
    if (!dobString) return '';
    const diff = Date.now() - new Date(dobString).getTime();
    const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    return isNaN(age) || age < 0 ? '' : `${age} yrs`;
  };

  const filteredTravelers = travelers.filter((t) => {
    if (filter === 'active') return !t.isArchived;
    if (filter === 'archived') return t.isArchived;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-black text-[#0F172A]">Saved Travelers</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add companions, family members, or friends once. Select them instantly when booking any trip.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm shadow-[#6356E5]/25 hover:shadow-md hover:shadow-[#6356E5]/35 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add New Traveler</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['active', 'archived', 'all'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold capitalize cursor-pointer transition-all ${
              filter === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80'
            }`}
          >
            {tab}
            <span className="ml-1.5 text-[11px] opacity-70">
              {tab === 'active'
                ? travelers.filter((t) => !t.isArchived).length
                : tab === 'archived'
                ? travelers.filter((t) => t.isArchived).length
                : travelers.length}
            </span>
          </button>
        ))}
      </div>

      {/* Traveler List */}
      {loading ? (
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-100 shadow-2xs space-y-3">
          <Loader2 className="w-8 h-8 text-[#6356E5] animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-500">Loading travelers list...</p>
        </div>
      ) : filteredTravelers.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h4 className="text-base font-black text-[#0F172A]">No {filter} travelers found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {filter === 'archived'
              ? 'Archived travelers will appear here.'
              : 'Add your travel companions once to reuse their profiles across all future bookings.'}
          </p>
          {filter !== 'archived' && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer"
            >
              + Add First Traveler
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTravelers.map((t) => {
            const isSelf = t.relationship === 'self';
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl p-5 border shadow-2xs space-y-4 relative transition-all ${
                  t.isArchived
                    ? 'border-slate-200/60 opacity-70 bg-slate-50/50'
                    : 'border-slate-100 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.photoUrl ? (
                      <img
                        src={t.photoUrl}
                        alt={t.fullName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-100 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-100 to-indigo-50 text-[#6356E5] font-black text-sm flex items-center justify-center border border-purple-100">
                        {t.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black text-[#0F172A]">{t.fullName}</h4>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            isSelf
                              ? 'bg-purple-50 text-[#6356E5] border border-purple-100'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.relationship}
                        </span>
                        {t.isArchived && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                            Archived
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium">
                        {t.gender} &bull; {calcAge(t.dob)} &bull; {t.nationality}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(t)}
                      title="Edit"
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!isSelf && (
                      <>
                        <button
                          onClick={() => handleArchiveToggle(t)}
                          title={t.isArchived ? 'Unarchive' : 'Archive'}
                          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          {t.isArchived ? (
                            <ArchiveRestore className="w-4 h-4" />
                          ) : (
                            <Archive className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(t)}
                          title="Delete"
                          className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Additional Info Badges & Verification Status */}
                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const govStatus = hasValidGovId(t);
                      if (govStatus.isValid) {
                        return (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            {govStatus.label}
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-black border border-rose-200">
                          <AlertCircle className="w-3 h-3 text-rose-500" />
                          Primary ID Required
                        </span>
                      );
                    })()}

                    {t.drivingLicence?.frontUrl && t.drivingLicence?.backUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        DL Uploaded
                      </span>
                    )}

                    {t.passport?.documentUrl && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        Passport Uploaded
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{t.phone || 'No phone'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-medium truncate">
                      <FileText className="w-3.5 h-3.5 text-[#6356E5] shrink-0" />
                      <span className="truncate">
                        {t.aadhaar?.number
                          ? `Aadhaar: ${t.aadhaar.number}`
                          : t.voterId?.number
                          ? `Voter: ${t.voterId.number}`
                          : t.passport?.number
                          ? `Passport: ${t.passport.number}`
                          : 'No ID number'}
                      </span>
                    </div>

                    {t.emergencyContact?.name && (
                      <div className="flex items-center gap-1.5 font-medium col-span-2 truncate text-slate-500">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">
                          Emergency: {t.emergencyContact.name} ({t.emergencyContact.phone})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Traveler Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h3 className="text-base font-black text-[#0F172A]">
                    {editingTraveler ? 'Edit Saved Traveler' : 'Add New Saved Traveler'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Traveler details are saved once and available for 1-click bookings.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleModalSave} className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-28 shrink-0">
                    <UniversalImageUploader
                      label="Photo"
                      helpText="PNG/JPG"
                      folder="travelos/travelers/avatars"
                      value={formData.photoUrl || ''}
                      onChange={(url) => setFormData({ ...formData, photoUrl: url })}
                      aspectRatio="square"
                    />
                  </div>
                  <div className="flex-1 space-y-3 w-full">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Relationship *
                      </label>
                      <select
                        value={formData.relationship}
                        onChange={(e) =>
                          setFormData({ ...formData, relationship: e.target.value as any })
                        }
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                      >
                        <option value="self">Self</option>
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
                        value={formData.fullName || ''}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Traveler full name"
                        className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dob || ''}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Gender *
                    </label>
                    <select
                      value={formData.gender || 'male'}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
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
                      value={formData.nationality || 'Indian'}
                      onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
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
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 00000"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="traveler@example.com"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Residential address"
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h5 className="text-xs font-black text-[#0F172A]">Emergency Contact</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={formData.emergencyContact?.name || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            name: e.target.value,
                          },
                        })
                      }
                      placeholder="Contact Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                    />
                    <input
                      type="tel"
                      value={formData.emergencyContact?.phone || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            phone: e.target.value,
                          },
                        })
                      }
                      placeholder="Contact Phone"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={formData.emergencyContact?.relationship || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          emergencyContact: {
                            ...formData.emergencyContact,
                            relationship: e.target.value,
                          },
                        })
                      }
                      placeholder="Relationship"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Medical Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={formData.bloodGroup || ''}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      placeholder="e.g. O+, A+"
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Medical Notes
                    </label>
                    <input
                      type="text"
                      value={formData.medicalNotes || ''}
                      onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                      placeholder="Allergies, conditions, etc."
                      className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Document Verification Section */}
                <div className="space-y-4 pt-3 border-t border-slate-100">
                  {/* Primary Government ID Box */}
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-black text-[#0F172A] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#6356E5]" />
                          Primary Government ID (Mandatory for Bookings)
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Choose either Aadhaar Card or Voter ID Card.
                        </p>
                      </div>

                      {/* Toggle / Selection */}
                      <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200/80 text-xs font-bold shrink-0">
                        <button
                          type="button"
                          onClick={() => setGovIdType('aadhaar')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            govIdType === 'aadhaar'
                              ? 'bg-[#6356E5] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Aadhaar Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setGovIdType('voterId')}
                          className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                            govIdType === 'voterId'
                              ? 'bg-[#6356E5] text-white shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Voter ID Card
                        </button>
                      </div>
                    </div>

                    {/* Aadhaar Uploaders */}
                    {govIdType === 'aadhaar' && (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Aadhaar Number
                          </label>
                          <input
                            type="text"
                            value={formData.aadhaar?.number || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                aadhaar: { ...formData.aadhaar, number: e.target.value },
                              })
                            }
                            placeholder="12-digit Aadhaar number"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="min-w-0 p-3 rounded-xl bg-white border border-slate-200/80 overflow-hidden">
                            <span className="text-[11px] font-black text-slate-700 block mb-1.5">
                              Front Side (Mandatory)
                            </span>
                            <UniversalImageUploader
                              label="Aadhaar Front"
                              helpText="JPG, PNG, WEBP, PDF (Max 10MB)"
                              folder="travelos/travelers/aadhaar"
                              allowPdf={true}
                              compact={true}
                              value={formData.aadhaar?.frontUrl || ''}
                              onChange={(url) =>
                                setFormData({
                                  ...formData,
                                  aadhaar: { ...formData.aadhaar, frontUrl: url },
                                })
                              }
                            />
                          </div>

                          <div className="min-w-0 p-3 rounded-xl bg-white border border-slate-200/80 overflow-hidden">
                            <span className="text-[11px] font-black text-slate-700 block mb-1.5">
                              Back Side (Mandatory)
                            </span>
                            <UniversalImageUploader
                              label="Aadhaar Back"
                              helpText="JPG, PNG, WEBP, PDF (Max 10MB)"
                              folder="travelos/travelers/aadhaar"
                              allowPdf={true}
                              compact={true}
                              value={formData.aadhaar?.backUrl || ''}
                              onChange={(url) =>
                                setFormData({
                                  ...formData,
                                  aadhaar: { ...formData.aadhaar, backUrl: url },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Voter ID Uploader */}
                    {govIdType === 'voterId' && (
                      <div className="space-y-3 pt-1">
                        <div>
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                            Voter ID (EPIC) Number
                          </label>
                          <input
                            type="text"
                            value={formData.voterId?.number || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                voterId: { ...formData.voterId, number: e.target.value },
                              })
                            }
                            placeholder="e.g. ABC1234567"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20 focus:border-[#6356E5]"
                          />
                        </div>

                        <div className="min-w-0 p-3 rounded-xl bg-white border border-slate-200/80 overflow-hidden">
                          <span className="text-[11px] font-black text-slate-700 block mb-1.5">
                            Front Side Only (Mandatory)
                          </span>
                          <UniversalImageUploader
                            label="Voter ID Front"
                            helpText="JPG, PNG, WEBP, PDF (Max 10MB)"
                            folder="travelos/travelers/voter-id"
                            allowPdf={true}
                            compact={true}
                            value={formData.voterId?.frontUrl || ''}
                            onChange={(url) =>
                              setFormData({
                                ...formData,
                                voterId: { ...formData.voterId, frontUrl: url },
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Optional Documents Section */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-black text-slate-600 block uppercase tracking-wider">
                      Optional Documents (Can be uploaded later)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Driving Licence */}
                      <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 overflow-hidden">
                        <span className="text-xs font-black text-[#0F172A] block">Driving Licence (Optional)</span>
                        <input
                          type="text"
                          value={formData.drivingLicence?.number || ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              drivingLicence: { ...formData.drivingLicence, number: e.target.value },
                            })
                          }
                          placeholder="Licence Number"
                          className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div className="min-w-0 overflow-hidden">
                            <UniversalImageUploader
                              label="Front Side"
                              folder="travelos/travelers/driving-licence"
                              allowPdf={true}
                              compact={true}
                              value={formData.drivingLicence?.frontUrl || ''}
                              onChange={(url) =>
                                setFormData({
                                  ...formData,
                                  drivingLicence: { ...formData.drivingLicence, frontUrl: url },
                                })
                              }
                            />
                          </div>
                          <div className="min-w-0 overflow-hidden">
                            <UniversalImageUploader
                              label="Back Side"
                              folder="travelos/travelers/driving-licence"
                              allowPdf={true}
                              compact={true}
                              value={formData.drivingLicence?.backUrl || ''}
                              onChange={(url) =>
                                setFormData({
                                  ...formData,
                                  drivingLicence: { ...formData.drivingLicence, backUrl: url },
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Passport */}
                      <div className="min-w-0 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 overflow-hidden">
                        <span className="text-xs font-black text-[#0F172A] block">Passport (Optional)</span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={formData.passport?.number || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                passport: { ...formData.passport, number: e.target.value },
                              })
                            }
                            placeholder="Passport Number"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20"
                          />
                          <input
                            type="date"
                            value={formData.passport?.expiryDate ? formData.passport.expiryDate.split('T')[0] : ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                passport: { ...formData.passport, expiryDate: e.target.value },
                              })
                            }
                            placeholder="Expiry Date"
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6356E5]/20"
                          />
                        </div>
                        <div className="min-w-0 overflow-hidden">
                          <UniversalImageUploader
                            label="Photo / Information Page Only"
                            helpText="Single page upload"
                            folder="travelos/travelers/passports"
                            allowPdf={true}
                            compact={true}
                            value={formData.passport?.documentUrl || ''}
                            onChange={(url) =>
                              setFormData({
                                ...formData,
                                passport: { ...formData.passport, documentUrl: url },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Save Button */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalSaving}
                    className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 shadow-sm shadow-[#6356E5]/25 hover:shadow-md hover:shadow-[#6356E5]/35 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {modalSaving && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                    <span>{editingTraveler ? 'Update Traveler' : 'Save Traveler'}</span>
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
