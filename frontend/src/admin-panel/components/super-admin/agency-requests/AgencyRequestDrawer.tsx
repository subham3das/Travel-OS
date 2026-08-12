import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, XCircle, FileText, Download, Eye, Clock, ShieldCheck } from 'lucide-react';
import { AgencyRequestItem } from '../../../types/agencyRequest';
import { VerificationChecklist } from './VerificationChecklist';
import { ApplicationTimeline } from './ApplicationTimeline';

interface AgencyRequestDrawerProps {
  request: AgencyRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (request: AgencyRequestItem) => void;
  onReject: (request: AgencyRequestItem) => void;
  onRequestDocs: (request: AgencyRequestItem) => void;
}

export const AgencyRequestDrawer: React.FC<AgencyRequestDrawerProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestDocs,
}) => {
  const [activeTab, setActiveTab] = useState<'Overview' | 'Documents' | 'Verification' | 'Activity'>(
    'Overview'
  );
  const [reviewNotes, setReviewNotes] = useState('');

  if (!isOpen || !request) return null;

  const mockDocuments = [
    { name: 'GST Certificate.pdf', type: 'GST', status: 'Approved', uploadedAt: 'May 21, 2024 10:32 AM' },
    { name: 'PAN Card Copy.pdf', type: 'PAN', status: 'Approved', uploadedAt: 'May 21, 2024 10:35 AM' },
    { name: 'Trade License.pdf', type: 'License', status: 'Approved', uploadedAt: 'May 21, 2024 10:38 AM' },
    { name: 'Bank Statement.pdf', type: 'Bank Proof', status: 'Pending', uploadedAt: 'May 21, 2024 10:40 AM' },
    { name: 'Office Premises Proof.pdf', type: 'Address', status: 'Approved', uploadedAt: 'May 21, 2024 10:42 AM' },
    { name: 'Owner Aadhaar Card.pdf', type: 'Identity', status: 'Approved', uploadedAt: 'May 21, 2024 10:45 AM' },
  ];

  const mockActivities = [
    { title: 'Application Submitted', desc: 'Agency submitted registration form', time: 'May 21, 2024 10:30 AM', admin: 'Agency Owner' },
    { title: 'KYC Verification', desc: 'Aadhaar & PAN auto-verified', time: 'May 21, 2024 11:20 AM', admin: 'System Bot' },
    { title: 'Admin Audit', desc: 'Application opened for review', time: 'May 21, 2024 12:15 PM', admin: 'Super Admin' },
  ];

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

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative w-full sm:w-[450px] h-full bg-[#F8F9FC] shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-100 bg-white sticky top-0 z-10 select-none">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-lg font-black text-[#0F172A] tracking-tight">
                  {request.agencyName}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
                    {request.reviewStatus}
                  </span>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Agency Profile Banner */}
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shadow-2xs shrink-0">
                  <img
                    src={request.logo}
                    alt={request.agencyName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-xs font-extrabold text-[#0F172A] truncate">
                    {request.businessType} • {request.city}, {request.state}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400">
                    {request.applicationId}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400">
                    Submitted on {request.submittedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center border-b border-slate-200/80 bg-white px-5 shrink-0">
              {(['Overview', 'Documents', 'Verification', 'Activity'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-3 px-3.5 text-xs font-bold transition-all cursor-pointer border-b-2 -mb-px ${
                    activeTab === tab
                      ? 'border-[#6356E5] text-[#6356E5] font-black'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body Scroll Container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
              {activeTab === 'Overview' && (
                <>
                  {/* Agency & Owner Info Grid (2 Columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Agency Info */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Agency Information
                      </h4>
                      <div className="space-y-1.5 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Agency Name</span>
                          <span className="text-[#0F172A] font-extrabold text-[11px] leading-tight block truncate">
                            {request.agencyName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Business Type</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {request.businessType}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">GST Number</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {request.gstNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Website</span>
                          <span className="text-[#6356E5] font-bold text-[11px] leading-tight block truncate">
                            {request.website}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Owner Information
                      </h4>
                      <div className="space-y-1.5 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Owner Name</span>
                          <span className="text-[#0F172A] font-extrabold text-[11px] leading-tight block truncate">
                            {request.ownerName}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Email</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block truncate">
                            {request.ownerEmail}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">Phone</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {request.ownerPhone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold">PAN Number</span>
                          <span className="text-[#0F172A] font-bold text-[11px] leading-tight block">
                            {request.panNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checklist & Documents Summary Grid (2 Columns) */}
                  <div className="grid grid-cols-2 gap-3">
                    <VerificationChecklist checklist={request.verificationChecklist} />

                    {/* Documents Summary Card */}
                    <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                        Documents Summary
                      </h4>
                      <div className="space-y-2 text-xs font-semibold">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Total Documents</span>
                          <span className="font-extrabold text-[#0F172A]">{request.documentsTotalCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Uploaded</span>
                          <span className="font-extrabold text-emerald-600">{request.documentsUploadedCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Missing</span>
                          <span className="font-extrabold text-rose-600">
                            {request.documentsTotalCount - request.documentsUploadedCount}
                          </span>
                        </div>

                        {/* Completion Progress Bar */}
                        <div className="pt-2">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                            <span>Completion</span>
                            <span>{Math.round((request.documentsUploadedCount / request.documentsTotalCount) * 100)}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-[#6356E5] rounded-full"
                              style={{
                                width: `${(request.documentsUploadedCount / request.documentsTotalCount) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review Notes Textarea */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider">
                      Review Notes
                    </h4>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add internal review notes..."
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none focus:border-[#6356E5] resize-none"
                    />
                  </div>

                  {/* Decision Buttons (Approve, Reject, Request Documents) */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-2.5">
                    <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-wider mb-1">
                      Decision
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => onApprove(request)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>

                      <button
                        onClick={() => onReject(request)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => onRequestDocs(request)}
                        className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-600 hover:text-white text-xs font-extrabold transition-all cursor-pointer shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Request Docs</span>
                      </button>
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <ApplicationTimeline timeline={request.timeline} />
                </>
              )}

              {activeTab === 'Documents' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Uploaded Documents
                  </h4>
                  <div className="space-y-2.5">
                    {mockDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-[#6356E5] shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-extrabold text-[#0F172A] truncate">
                                {doc.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400">{doc.uploadedAt}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                              doc.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                : 'bg-amber-50 text-amber-600 border-amber-100'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60 justify-end">
                          <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer">
                            <Eye className="w-3 h-3 text-slate-400" />
                            <span>Preview</span>
                          </button>
                          <button className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[11px] font-extrabold hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer">
                            <Download className="w-3 h-3 text-slate-400" />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Verification' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                      Verification Scores
                    </h4>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Score: {request.complianceScore}/100
                    </span>
                  </div>

                  <div className="space-y-3 text-xs font-semibold text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Identity Verification</span>
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Passed
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Business Verification</span>
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Passed
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bank Verification</span>
                      <span className="text-amber-600 font-extrabold flex items-center gap-1">
                        <Clock className="w-4 h-4" /> Under Audit
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tax & GST Verification</span>
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <ShieldCheck className="w-4 h-4" /> Passed
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Activity' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-2xs space-y-3">
                  <h4 className="text-xs font-black text-[#0F172A] uppercase tracking-wider">
                    Activity Audit Log
                  </h4>
                  <div className="space-y-3">
                    {mockActivities.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-xl bg-purple-50 text-[#6356E5] flex items-center justify-center shrink-0 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-extrabold text-[#0F172A]">{act.title}</p>
                          <p className="text-[11px] font-semibold text-slate-500">{act.desc}</p>
                          <span className="text-[10px] font-bold text-slate-400 mt-0.5 block">
                            {act.time} • By {act.admin}
                          </span>
                        </div>
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
  );
};
