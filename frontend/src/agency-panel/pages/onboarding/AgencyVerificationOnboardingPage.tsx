import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  UploadCloud,
  FileText,
  UserCheck,
  MapPin,
  Lock,
  CheckCircle2,
  X,
  RefreshCw,
  AlertCircle,
  File,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
} from 'lucide-react';
import { OnboardingStepper } from '../../components/OnboardingStepper';
import { cloudinaryUploadService } from '../../../services/cloudinaryUpload.service';

const STORAGE_KEY = 'apnatrip_agency_onboarding_verification';

export interface DocumentUploadItem {
  id: string;
  name: string;
  size: number;
  sizeFormatted: string;
  type: string;
  dataUrl?: string;
  uploadedAt: string;
}

export interface VerificationFormData {
  registrationCert: DocumentUploadItem | null;
  gstCert: DocumentUploadItem | null;
  panCard: DocumentUploadItem | null;
  governmentIdType: string;
  governmentIdFile: DocumentUploadItem | null;
  selfieFile: DocumentUploadItem | null;
  addressProofFile: DocumentUploadItem | null;
}

const initialVerificationData: VerificationFormData = {
  registrationCert: null,
  gstCert: null,
  panCard: null,
  governmentIdType: '',
  governmentIdFile: null,
  selfieFile: null,
  addressProofFile: null,
};

export const GOVERNMENT_ID_TYPES = [
  'Aadhaar Card',
  'Passport',
  'Driving Licence',
  'Voter ID',
];

export const AgencyVerificationOnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VerificationFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return initialVerificationData;
  });

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hidden File Inputs Refs
  const registrationCertRef = useRef<HTMLInputElement>(null);
  const gstCertRef = useRef<HTMLInputElement>(null);
  const panCardRef = useRef<HTMLInputElement>(null);
  const governmentIdRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const addressProofRef = useRef<HTMLInputElement>(null);

  // Auto save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      // ignore
    }
  }, [formData]);

  // Utility to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Generic File Upload Processor with simulated upload progress
  const processFileUpload = (
    fieldKey: keyof VerificationFormData,
    file: File,
    allowedTypes: string[],
    maxSizeMB: number = 10
  ) => {
    setErrorMessage(null);

    // Format & Size Validation
    const ext = file.name.split('.').pop()?.toLowerCase();
    const isTypeAllowed = allowedTypes.includes(ext || '') || file.type.startsWith('image/');
    if (!isTypeAllowed) {
      setErrorMessage(`Invalid file format. Allowed formats: ${allowedTypes.join(', ').toUpperCase()}`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setErrorMessage(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
      return;
    }

    // Upload via Cloudinary
    setUploadingField(fieldKey as string);
    setUploadProgress(30);

    try {
      setUploadProgress(60);
      const uploadRes = await cloudinaryUploadService.uploadImage(file, 'travelos/agencies/documents');
      setUploadProgress(100);

      const item: DocumentUploadItem = {
        id: `${fieldKey}-${Date.now()}`,
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        type: file.type || ext || 'file',
        dataUrl: uploadRes.secureUrl,
        uploadedAt: new Date().toISOString(),
      };

      setFormData((prev) => ({ ...prev, [fieldKey]: item }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload document to Cloudinary');
    } finally {
      setUploadingField(null);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (
    fieldKey: keyof VerificationFormData,
    e: React.ChangeEvent<HTMLInputElement>,
    allowedTypes: string[],
    maxSizeMB: number = 10
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      processFileUpload(fieldKey, file, allowedTypes, maxSizeMB);
    }
  };

  const removeFile = (fieldKey: keyof VerificationFormData) => {
    setFormData((prev) => ({ ...prev, [fieldKey]: null }));
  };

  // Form Validation
  const isRegCertValid = formData.registrationCert !== null;
  const isPanValid = formData.panCard !== null;
  const isGovIdValid = formData.governmentIdType !== '' && formData.governmentIdFile !== null;
  const isSelfieValid = formData.selfieFile !== null;
  const isAddressProofValid = formData.addressProofFile !== null;

  const isFormValid =
    isRegCertValid && isPanValid && isGovIdValid && isSelfieValid && isAddressProofValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      navigate('/agency/onboarding/bank');
    }
  };

  // Helper render for Upload Slot
  const renderUploadBox = (
    fieldKey: keyof VerificationFormData,
    inputRef: React.RefObject<HTMLInputElement | null>,
    buttonLabel: string = 'Upload File',
    allowedFormats: string[] = ['pdf', 'png', 'jpg', 'jpeg'],
    isImageOnly: boolean = false
  ) => {
    const fileItem = formData[fieldKey] as DocumentUploadItem | null;
    const isUploading = uploadingField === fieldKey;

    if (isUploading) {
      return (
        <div className="w-full sm:w-48 h-24 rounded-2xl border border-purple-200 bg-purple-50/50 p-4 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#583BE8]">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Uploading... {uploadProgress}%</span>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#583BE8] h-full transition-all duration-200"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      );
    }

    if (fileItem) {
      const isImg = fileItem.type.startsWith('image/') || fileItem.dataUrl?.startsWith('data:image');

      return (
        <div className="w-full sm:w-56 bg-purple-50/40 rounded-2xl border border-purple-200/80 p-3 flex flex-col justify-between space-y-2">
          <div className="flex items-start gap-2.5">
            {isImg && fileItem.dataUrl ? (
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-purple-200">
                <img src={fileItem.dataUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#583BE8] flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="space-y-0.5 min-w-0 flex-1">
              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1 leading-tight">
                <CheckCircle2 className="w-3 h-3" /> Uploaded
              </span>
              <p className="text-xs font-bold text-[#0F172A] truncate" title={fileItem.name}>
                {fileItem.name}
              </p>
              <p className="text-[10px] font-semibold text-slate-400">{fileItem.sizeFormatted}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-purple-100/80 justify-end">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-[11px] font-bold text-[#583BE8] hover:underline cursor-pointer"
            >
              Replace
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => removeFile(fieldKey)}
              className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        onClick={() => inputRef.current?.click()}
        className="w-full sm:w-48 h-24 sm:h-28 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 hover:bg-purple-50/70 hover:border-[#583BE8] transition-all flex flex-col items-center justify-center text-center p-3 cursor-pointer group shrink-0"
      >
        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#583BE8] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-[#583BE8]">{buttonLabel}</span>
        <span className="text-[10px] font-semibold text-slate-400 mt-0.5">
          {isImageOnly ? 'JPG, PNG • Max 10MB' : 'PDF, JPG, PNG • Max 10MB'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] flex flex-col font-sans select-none">
      {/* ── Top Header with Brand Logo ── */}
      <header className="py-4 px-6 flex justify-center items-center bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#583BE8] flex items-center justify-center shadow-md shadow-[#583BE8]/25 shrink-0">
            <svg className="w-4.5 h-4.5 text-white" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.5C12 21.5 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21.5 12 21.5Z"
                fill="white"
                fillOpacity="0.25"
              />
              <circle cx="12" cy="9.5" r="3.5" stroke="white" strokeWidth="1.8" />
              <path d="M12 7.5L13.5 11L12 10L10.5 11L12 7.5Z" fill="white" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
            Apna<span className="text-[#583BE8]">Trip</span>
          </span>
        </div>
      </header>

      {/* ── Progress Stepper ── */}
      <div className="pt-4 pb-2 bg-white border-b border-slate-100">
        <OnboardingStepper currentStep={3} />
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6 space-y-6 pb-28">
        {/* Title Header with Shield/Lock Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start justify-between gap-4"
        >
          <div className="space-y-1.5 max-w-md">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Verify Your Agency
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Upload the required documents to verify your business. Your information is encrypted and securely stored.
            </p>
          </div>

          {/* Verification Shield Illustration */}
          <div className="shrink-0 w-24 h-20 sm:w-32 sm:h-24 relative hidden xs:flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 140 100" fill="none">
              <rect x="25" y="15" width="80" height="75" rx="6" fill="#EDE8FF" />
              <rect x="35" y="25" width="45" height="6" rx="2" fill="#583BE8" />
              <rect x="35" y="35" width="60" height="4" rx="1" fill="#B4A4FF" />
              <rect x="35" y="43" width="50" height="4" rx="1" fill="#CBD5E1" />
              <circle cx="95" cy="65" r="16" fill="#583BE8" />
              <path d="M90 65L93.5 68.5L100 61" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        {/* Global Error Banner */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Hidden File Inputs */}
          <input
            type="file"
            ref={registrationCertRef}
            onChange={(e) => handleFileChange('registrationCert', e, ['pdf', 'png', 'jpg', 'jpeg'], 10)}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />
          <input
            type="file"
            ref={gstCertRef}
            onChange={(e) => handleFileChange('gstCert', e, ['pdf', 'png', 'jpg', 'jpeg'], 10)}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />
          <input
            type="file"
            ref={panCardRef}
            onChange={(e) => handleFileChange('panCard', e, ['pdf', 'png', 'jpg', 'jpeg'], 10)}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />
          <input
            type="file"
            ref={governmentIdRef}
            onChange={(e) => handleFileChange('governmentIdFile', e, ['pdf', 'png', 'jpg', 'jpeg'], 10)}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />
          <input
            type="file"
            ref={selfieRef}
            onChange={(e) => handleFileChange('selfieFile', e, ['png', 'jpg', 'jpeg'], 10)}
            accept=".png, .jpg, .jpeg"
            className="hidden"
          />
          <input
            type="file"
            ref={addressProofRef}
            onChange={(e) => handleFileChange('addressProofFile', e, ['pdf', 'png', 'jpg', 'jpeg'], 10)}
            accept=".pdf, .png, .jpg, .jpeg"
            className="hidden"
          />

          {/* ── SECTION 1: Business Documents ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">1. Business Documents</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              {/* Business Registration Certificate */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0 font-black text-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      Business Registration Certificate <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Upload your business registration certificate
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        PDF, JPG, PNG
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Max 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {renderUploadBox('registrationCert', registrationCertRef)}
              </div>

              {/* GST Certificate (Optional) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0 font-black text-[10px]">
                    GST
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      GST Certificate <span className="text-slate-400 font-normal">(Optional)</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Upload your GST certificate
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        PDF, JPG, PNG
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Max 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {renderUploadBox('gstCert', gstCertRef)}
              </div>

              {/* PAN Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0 font-black text-[10px]">
                    PAN
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      PAN Card <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Upload PAN card of the business
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        PDF, JPG, PNG
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Max 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {renderUploadBox('panCard', panCardRef)}
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 2: Owner Verification ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">2. Owner Verification</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
              {/* Government ID */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3 min-w-0 space-y-2 flex-1">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-2.5 w-full">
                    <div>
                      <h3 className="font-extrabold text-[#0F172A] text-sm">
                        Government ID <span className="text-rose-500">*</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">Select ID type and upload</p>
                    </div>

                    <select
                      name="governmentIdType"
                      value={formData.governmentIdType}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, governmentIdType: e.target.value }))
                      }
                      className="w-full max-w-xs px-3.5 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="">Select ID Type</option>
                      {GOVERNMENT_ID_TYPES.map((idType) => (
                        <option key={idType} value={idType}>
                          {idType}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {renderUploadBox('governmentIdFile', governmentIdRef)}
              </div>

              {/* Selfie Verification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      Selfie Verification <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium max-w-xs">
                      Upload a clear selfie holding your selected Government ID.
                    </p>
                  </div>
                </div>

                {renderUploadBox('selfieFile', selfieRef, 'Upload Selfie', ['png', 'jpg', 'jpeg'], true)}
              </div>
            </div>
          </motion.div>

          {/* ── SECTION 3: Business Address Proof ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <h2 className="text-base font-extrabold text-[#0F172A]">3. Business Address Proof</h2>
            </div>

            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#583BE8] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h3 className="font-extrabold text-[#0F172A] text-sm">
                      Business Address Proof <span className="text-rose-500">*</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Upload any one of the following documents:<br />
                      <span className="text-slate-400">
                        • Electricity Bill • Rental Agreement • Bank Statement<br />
                        • Water Bill • Telephone Bill
                      </span>
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        PDF, JPG, PNG
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        Max 10MB
                      </span>
                    </div>
                  </div>
                </div>

                {renderUploadBox('addressProofFile', addressProofRef)}
              </div>
            </div>
          </motion.div>

          {/* ── SECURITY CARD ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="p-4 rounded-3xl bg-purple-50/70 border border-purple-100 flex items-center gap-3.5"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#583BE8]/20">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs sm:text-sm font-extrabold text-[#0F172A]">
                Your documents are safe and secure
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Your documents are encrypted, securely stored, and used only for agency verification.
              </p>
            </div>
          </motion.div>
        </form>
      </main>

      {/* ── Fixed Sticky Bottom Action Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 shadow-lg">
        <div className="w-full max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/agency/onboarding/profile')}
            className="w-1/2 py-3.5 px-6 rounded-2xl bg-white border border-[#583BE8]/30 hover:border-[#583BE8] active:scale-[0.99] text-[#583BE8] font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Back</span>
          </button>

          {/* Continue Button */}
          <button
            type="button"
            disabled={!isFormValid}
            onClick={handleSubmit}
            className={`w-1/2 py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg ${
              isFormValid
                ? 'bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white shadow-[#583BE8]/25 cursor-pointer'
                : 'bg-slate-300 text-slate-500 shadow-none cursor-not-allowed opacity-70'
            }`}
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgencyVerificationOnboardingPage;
