import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileSpreadsheet,
  FileText,
  User,
  Phone,
  Mail,
  ShieldAlert,
  FileCheck,
  MapPin,
  HeartPulse,
  ShieldCheck,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { DepartureItem, DepartureTravelerItem, agencyDepartureService } from '../../services/agencyDeparture.service';

interface ViewTravelersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  departure: DepartureItem | null;
  travelers: DepartureTravelerItem[];
  isLoading: boolean;
}

export const ViewTravelersModal: React.FC<ViewTravelersDrawerProps> = ({
  isOpen,
  onClose,
  departure,
  travelers,
  isLoading,
}) => {
  const [selectedTraveler, setSelectedTraveler] = useState<DepartureTravelerItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string } | null>(null);

  if (!isOpen || !departure) return null;

  const formattedDate = new Date(departure.departureDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-100"
        >
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#583BE8] bg-[#EEF2FF] px-2.5 py-0.5 rounded-full">
                  Traveler Manifest
                </span>
                <span className="text-xs font-bold text-slate-500">{formattedDate}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#0F172A] mt-1 line-clamp-1">
                {departure.packageName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Capacity:{' '}
                <span className="font-bold text-[#0F172A]">
                  {departure.bookedSeats} / {departure.capacity} Booked
                </span>{' '}
                ({departure.availableSeats} remaining)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => agencyDepartureService.downloadExcel(departure.id)}
                title="Export Excel"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Excel</span>
              </button>
              <button
                onClick={() => agencyDepartureService.downloadPdf(departure.id)}
                title="Export PDF"
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden sm:inline">PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {isLoading ? (
              <div className="py-20 text-center text-slate-400 font-bold text-sm">
                Loading travelers manifest...
              </div>
            ) : travelers.length === 0 ? (
              <div className="py-20 text-center">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No travelers booked yet</p>
                <p className="text-xs text-slate-400 mt-1">Bookings for this departure will appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {travelers.map((t, idx) => (
                  <div
                    key={t.bookingId || idx}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 hover:shadow-xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-[#0F172A]">{t.primaryName}</h4>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700">
                            {t.bookingType} ({t.seats} {t.seats === 1 ? 'seat' : 'seats'})
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {t.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {t.email}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTraveler(t)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#583BE8] hover:bg-[#EEF2FF] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </div>

                    {/* Quick Badges: Emergency & Medical */}
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      {t.emergencyContact?.name && (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          <ShieldAlert className="w-3 h-3 text-amber-500" />
                          Emergency: {t.emergencyContact.name} ({t.emergencyContact.phone})
                        </span>
                      )}
                      {t.pickupPreference && (
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                          <MapPin className="w-3 h-3 text-[#583BE8]" />
                          Pickup: {t.pickupPreference}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detailed Traveler Inspection Sub-drawer/modal */}
          <AnimatePresence>
            {selectedTraveler && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs select-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh]"
                >
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                    <div>
                      <h3 className="text-base font-black text-[#0F172A]">Traveler Profile Dossier</h3>
                      <p className="text-xs text-slate-500">Booking ID: #{selectedTraveler.bookingId || selectedTraveler.bookingMongoId}</p>
                    </div>
                    <button
                      onClick={() => setSelectedTraveler(null)}
                      className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="text-slate-400 uppercase tracking-wider text-[10px] font-black">Primary Contact</div>
                      <div className="text-sm font-black text-[#0F172A]">{selectedTraveler.primaryName}</div>
                      <div className="text-slate-600 font-bold">{selectedTraveler.phone} • {selectedTraveler.email}</div>
                      {selectedTraveler.address && <div className="text-slate-500">{selectedTraveler.address}</div>}
                    </div>

                    {/* Manifest Members */}
                    {selectedTraveler.travelers && selectedTraveler.travelers.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-slate-400 uppercase tracking-wider text-[10px] font-black">Passengers In Party ({selectedTraveler.travelers.length})</div>
                        <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl bg-white overflow-hidden">
                          {selectedTraveler.travelers.map((p, idx) => (
                            <div key={idx} className="p-3 flex items-center justify-between">
                              <div>
                                <span className="font-black text-[#0F172A]">{p.name}</span>
                                {p.isPrimary && <span className="ml-2 text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold">Primary</span>}
                                <div className="text-slate-500 text-[11px]">{p.gender}, Age {p.age}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Emergency & Health */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                        <div className="flex items-center gap-1.5 text-amber-800 font-black text-[11px] mb-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          Emergency Contact
                        </div>
                        <div className="font-bold text-slate-800">{selectedTraveler.emergencyContact?.name || 'Not provided'}</div>
                        <div className="text-slate-600">{selectedTraveler.emergencyContact?.phone || 'N/A'}</div>
                        <div className="text-[10px] text-slate-400">{selectedTraveler.emergencyContact?.relationship}</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100">
                        <div className="flex items-center gap-1.5 text-rose-800 font-black text-[11px] mb-1">
                          <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                          Medical & Health
                        </div>
                        <p className="text-slate-700 leading-relaxed">
                          {selectedTraveler.medicalNotes || 'No allergies or critical medical notes declared.'}
                        </p>
                      </div>
                    </div>

                    {/* Uploaded Documents */}
                    {selectedTraveler.documents && selectedTraveler.documents.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-slate-400 uppercase tracking-wider text-[10px] font-black">KYC & Travel Documents</div>
                        <div className="space-y-1.5">
                          {selectedTraveler.documents.map((doc, idx) => (
                            <div key={idx} className="p-2.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-emerald-600" />
                                <span className="font-bold text-slate-800">{doc.title}</span>
                              </div>
                              <button
                                onClick={() => setPreviewDoc({ title: doc.title, url: doc.url })}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Secure Document Preview Sub-modal */}
          <AnimatePresence>
            {previewDoc && (
              <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm select-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#583BE8]" />
                      <h4 className="text-xs sm:text-sm font-black text-[#0F172A]">{previewDoc.title}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={previewDoc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Open Full
                      </a>
                      <button
                        onClick={() => setPreviewDoc(null)}
                        className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/5 min-h-[300px]">
                    {previewDoc.url.toLowerCase().endsWith('.pdf') ? (
                      <iframe
                        src={previewDoc.url}
                        title={previewDoc.title}
                        className="w-full h-[65vh] rounded-xl border border-slate-200"
                      />
                    ) : (
                      <img
                        src={previewDoc.url}
                        alt={previewDoc.title}
                        className="max-h-[65vh] max-w-full rounded-xl object-contain shadow-md"
                      />
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
