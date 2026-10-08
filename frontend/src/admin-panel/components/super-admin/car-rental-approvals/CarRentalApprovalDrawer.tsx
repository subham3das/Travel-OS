import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  ExternalLink,
  Car,
  Users,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Landmark,
  Save,
  Maximize2,
} from 'lucide-react';
import { CarRentalApprovalItem, CarRentalVehicleItem } from '../../../types/carRentalApproval';
import { adminCarRentalApprovalService } from '../../../services/adminCarRentalApproval.service';
import { useToast } from '../../../../user-panel/context/ToastContext';

interface CarRentalApprovalDrawerProps {
  request: CarRentalApprovalItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (request: CarRentalApprovalItem) => void;
  onReject: (request: CarRentalApprovalItem) => void;
  onRequestChanges: (request: CarRentalApprovalItem) => void;
  onUpdateRequest?: (updated: CarRentalApprovalItem) => void;
}

export const CarRentalApprovalDrawer: React.FC<CarRentalApprovalDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestChanges,
  onUpdateRequest,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'Business' | 'Fleet & Vehicles' | 'Drivers' | 'Documents' | 'Activity'>('Business');
  const [currentRequest, setCurrentRequest] = useState<CarRentalApprovalItem | null>(request);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteSavedSuccess, setNoteSavedSuccess] = useState(false);

  // Document preview zoom modal
  const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
  const [previewDocName, setPreviewDocName] = useState<string>('');

  useEffect(() => {
    if (request) {
      setCurrentRequest(request);
      setReviewNotes(request.reviewNotes || '');
      setNoteSavedSuccess(false);
    }
  }, [request]);

  if (!isOpen || !currentRequest) return null;

  const activeData = currentRequest;

  const handleSaveNote = async () => {
    if (!activeData || !reviewNotes.trim() || isSavingNote) return;
    setIsSavingNote(true);
    try {
      await adminCarRentalApprovalService.saveReviewNotes(activeData.id, reviewNotes.trim());
      setNoteSavedSuccess(true);
      setTimeout(() => setNoteSavedSuccess(false), 2500);
      showToast('Review note saved successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save note', 'error');
    } finally {
      setIsSavingNote(false);
    }
  };

  const handleApproveDocs = async (docId?: string) => {
    if (!activeData) return;
    try {
      const res = await adminCarRentalApprovalService.approveDocuments(
        activeData.id,
        docId ? [docId] : undefined
      );
      if (res.success && res.request) {
        setCurrentRequest(res.request);
        if (onUpdateRequest) onUpdateRequest(res.request);
        showToast('Document(s) approved successfully', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to approve documents', 'error');
    }
  };

  const handlePreviewDoc = (url?: string, name?: string) => {
    if (url && url !== '#') {
      setPreviewDocUrl(url);
      setPreviewDocName(name || 'Document Preview');
    }
  };

  const handleDownloadDoc = (url?: string, name?: string) => {
    if (url && url !== '#') {
      const link = document.createElement('a');
      link.href = url;
      link.download = name || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenOriginal = (url?: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const vehicles = activeData.vehicles || [];
  const drivers = activeData.drivers || [];
  const documents = activeData.documents || [];
  const activities = activeData.activities || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Slide-over Inspector (540px wide for comprehensive fleet view) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[560px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* 1. Header Banner */}
            <div className="bg-white px-6 py-4.5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={activeData.logo}
                  alt={activeData.businessName}
                  className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shadow-xs shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop';
                  }}
                />
                <div className="min-w-0">
                  <h2 className="text-base font-black text-[#0F172A] truncate">
                    {activeData.businessName}
                  </h2>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span className="font-mono text-[11px]">{activeData.applicationId}</span>
                    <span>•</span>
                    <span>{activeData.city}, {activeData.state}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Navigation Tabs */}
            <div className="bg-white px-6 flex items-center gap-2 border-b border-slate-100 overflow-x-auto scrollbar-none shrink-0">
              {(['Business', 'Fleet & Vehicles', 'Drivers', 'Documents', 'Activity'] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-3 text-xs font-bold transition-all relative whitespace-nowrap cursor-pointer ${
                      isActive ? 'text-[#6356E5] font-black' : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>{tab}</span>
                    {tab === 'Fleet & Vehicles' && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 font-black text-slate-600">
                        {vehicles.length}
                      </span>
                    )}
                    {tab === 'Documents' && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 font-black text-slate-600">
                        {documents.length}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="drawerTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6356E5]"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3. Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TAB 1: BUSINESS & OWNER */}
              {activeTab === 'Business' && (
                <div className="space-y-4">
                  {/* Business Information Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100/90 shadow-2xs space-y-3.5">
                    <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#6356E5]" />
                      <span>Legal Business Profile</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Legal Business Name</span>
                        <span className="font-bold text-[#0F172A]">{activeData.legalBusinessName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Display Name</span>
                        <span className="font-bold text-[#0F172A]">{activeData.businessName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">GST Number</span>
                        <span className="font-mono font-bold text-[#0F172A]">{activeData.gstNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">PAN Number</span>
                        <span className="font-mono font-bold text-[#0F172A]">{activeData.panNumber}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[11px] block">Commercial Registration No.</span>
                        <span className="font-mono font-bold text-[#0F172A]">{activeData.businessLicenseNumber}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 text-[11px] block">Operating Address</span>
                        <span className="font-bold text-[#0F172A]">{activeData.address}, {activeData.city}, {activeData.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner & Contact Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100/90 shadow-2xs space-y-3.5">
                    <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#6356E5]" />
                      <span>Owner & Dispatch Contacts</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Authorized Owner</span>
                        <span className="font-bold text-[#0F172A]">{activeData.ownerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Primary Email</span>
                        <span className="font-bold text-[#0F172A] truncate block">{activeData.ownerEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Phone Number</span>
                        <span className="font-bold text-[#0F172A]">{activeData.ownerPhone}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">24/7 Helpline</span>
                        <span className="font-bold text-[#0F172A]">{activeData.emergencyContact}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Operating Hours</span>
                        <span className="font-bold text-[#0F172A]">{activeData.workingHours}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Assigned Reviewer</span>
                        <span className="font-bold text-[#0F172A]">{activeData.assignedReviewer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bank & Settlement Details Card */}
                  {activeData.bankDetails && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100/90 shadow-2xs space-y-3.5">
                      <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#6356E5]" />
                        <span>Payout & Settlement Account</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 text-[11px] block">Account Holder</span>
                          <span className="font-bold text-[#0F172A]">{activeData.bankDetails.accountHolderName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Bank Name</span>
                          <span className="font-bold text-[#0F172A]">{activeData.bankDetails.bankName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">Account Number</span>
                          <span className="font-mono font-bold text-[#0F172A]">{activeData.bankDetails.accountNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[11px] block">IFSC Code</span>
                          <span className="font-mono font-bold text-[#0F172A]">{activeData.bankDetails.ifscCode}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Admin Review Notes Input */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100/90 shadow-2xs space-y-3">
                    <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                      Internal Admin Review Notes
                    </h3>
                    <textarea
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add compliance notes, verification remarks, or background check details..."
                      className="w-full p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white transition-all resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNote}
                        disabled={isSavingNote || !reviewNotes.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{noteSavedSuccess ? 'Saved!' : isSavingNote ? 'Saving...' : 'Save Note'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FLEET & VEHICLES */}
              {activeTab === 'Fleet & Vehicles' && (
                <div className="space-y-4">
                  {/* Fleet Overview Metrics */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-100/90 shadow-2xs">
                    <h3 className="text-xs font-black text-[#0F172A] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#6356E5]" />
                      <span>Commercial Fleet Specifications</span>
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Declared Size</span>
                        <span className="text-base font-black text-[#0F172A]">{activeData.fleetSize} Vehicles</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Catalog Registered</span>
                        <span className="text-base font-black text-[#0F172A]">{vehicles.length} Units</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Service Hubs</span>
                        <span className="text-xs font-black text-[#0F172A] truncate block mt-0.5">
                          {activeData.operatingCities.slice(0, 2).join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Registered Vehicle Cards */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        Registered Vehicles ({vehicles.length})
                      </span>
                    </div>

                    {vehicles.length === 0 ? (
                      <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
                        <Car className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-xs font-bold">No individual vehicles registered yet.</p>
                        <p className="text-[11px]">Provider declared a fleet capacity of {activeData.fleetSize} vehicles.</p>
                      </div>
                    ) : (
                      vehicles.map((v) => (
                        <div
                          key={v.id}
                          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs hover:border-slate-200 transition-all flex gap-3.5"
                        >
                          <img
                            src={v.thumbnail || (v.images && v.images[0]) || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=200&auto=format&fit=crop'}
                            alt={v.name}
                            className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-xs font-black text-[#0F172A] truncate">
                                  {v.brand} {v.name}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                  <span className="text-[11px] font-bold text-slate-400">
                                    {v.modelYear} • {v.type.toUpperCase()} • {v.fuel}
                                  </span>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                      v.serviceType === 'SELF_DRIVE_RENTAL' || v.serviceType === 'self_drive_car' || v.serviceType === 'self_drive_bike'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                                    }`}
                                  >
                                    {v.serviceType === 'SELF_DRIVE_RENTAL' || v.serviceType === 'self_drive_car' || v.serviceType === 'self_drive_bike'
                                      ? 'Self-Drive Rental'
                                      : 'Route Booking'}
                                  </span>
                                </div>
                              </div>
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-700 shrink-0">
                                {v.serviceType === 'SELF_DRIVE_RENTAL' || v.serviceType === 'self_drive_car' || v.serviceType === 'self_drive_bike'
                                  ? `₹${v.rentalPricing?.dailyRate || v.dailyPrice}/day`
                                  : `₹${v.routePricing?.oneWayPrice || v.dailyPrice} (Fare)`}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Registration No.</span>
                                <span className="font-mono font-bold text-[#0F172A]">{v.registrationNumber}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">
                                  {v.serviceType === 'SELF_DRIVE_RENTAL' || v.serviceType === 'self_drive_car' || v.serviceType === 'self_drive_bike'
                                    ? 'Operating Model'
                                    : 'Chauffeur'}
                                </span>
                                <span className="font-bold text-[#0F172A] truncate block">
                                  {v.serviceType === 'SELF_DRIVE_RENTAL' || v.serviceType === 'self_drive_car' || v.serviceType === 'self_drive_bike'
                                    ? 'Customer Self-Drive'
                                    : (v.driver?.name || 'Assigned on Dispatch')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DRIVERS */}
              {activeTab === 'Drivers' && (
                <div className="space-y-3">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    Assigned Chauffeur Roster ({drivers.length})
                  </span>

                  {drivers.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-bold">No individual chauffeurs assigned yet.</p>
                      <p className="text-[11px]">Chauffeur licenses will be verified on vehicle registration.</p>
                    </div>
                  ) : (
                    drivers.map((d, i) => (
                      <div
                        key={i}
                        className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#6356E5] flex items-center justify-center font-black text-xs shrink-0">
                            {d.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-[#0F172A] truncate">
                              {d.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{d.experienceYears} Years Exp</span>
                              <span>•</span>
                              <span className="font-mono">{d.licenseNumber}</span>
                            </div>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0">
                          Verified Chauffeur
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: DOCUMENTS */}
              {activeTab === 'Documents' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Uploaded Compliance Documents ({documents.length})
                    </span>
                    <button
                      onClick={() => handleApproveDocs()}
                      className="text-xs font-bold text-[#6356E5] hover:underline cursor-pointer"
                    >
                      Approve All Docs
                    </button>
                  </div>

                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-[#0F172A] truncate">
                              {doc.name}
                            </h4>
                            <span className="text-[10px] font-bold text-slate-400">
                              {doc.type} • Uploaded {doc.uploadedAt}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 ${
                            doc.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-600'
                              : 'bg-amber-50 text-amber-600'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>

                      {/* Document Actions: Preview, Zoom, Download, Open Original */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handlePreviewDoc(doc.fileUrl, doc.name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview / Zoom</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDoc(doc.fileUrl, doc.name)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                        <button
                          onClick={() => handleOpenOriginal(doc.fileUrl)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[11px] font-bold cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Open Original</span>
                        </button>
                        {doc.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveDocs(doc.id)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-[11px] font-bold cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verify Doc</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 5: ACTIVITY */}
              {activeTab === 'Activity' && (
                <div className="space-y-3">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                    Audit Trail & History ({activities.length})
                  </span>

                  {activities.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 text-center text-slate-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs font-bold">No previous audit logs found.</p>
                      <p className="text-[11px]">Subsequent administrative decisions will appear here.</p>
                    </div>
                  ) : (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-100 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#0F172A]">{act.action}</span>
                          <span className="text-[10px] text-slate-400">{act.timestamp}</span>
                        </div>
                        <div className="text-[11px] text-slate-500">{act.notes}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">
                          Actor: {act.adminName}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4. Action Decision Footer Bar */}
            <div className="bg-white p-5 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 shadow-lg">
              <div className="flex items-center gap-2">
                {activeData.verificationStatus !== 'REJECTED' && (
                  <button
                    onClick={() => onReject(activeData)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                )}

                {activeData.verificationStatus !== 'APPROVED' &&
                  activeData.verificationStatus !== 'CHANGES_REQUESTED' && (
                    <button
                      onClick={() => onRequestChanges(activeData)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 text-xs font-extrabold transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>Request Changes</span>
                    </button>
                  )}
              </div>

              {activeData.verificationStatus !== 'APPROVED' && (
                <button
                  onClick={() => onApprove(activeData)}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Car Rental</span>
                </button>
              )}
            </div>
          </motion.div>

          {/* Document Preview & Zoom Modal */}
          {previewDocUrl && (
            <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full p-5 space-y-4 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-[#0F172A]">{previewDocName}</h3>
                  <button
                    onClick={() => setPreviewDocUrl(null)}
                    className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="max-h-[70vh] overflow-auto flex items-center justify-center bg-slate-50 rounded-xl p-2">
                  <img
                    src={previewDocUrl}
                    alt={previewDocName}
                    className="max-h-[65vh] object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenOriginal(previewDocUrl)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Original</span>
                  </button>
                  <button
                    onClick={() => handleDownloadDoc(previewDocUrl, previewDocName)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6356E5] text-white text-xs font-bold cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};
