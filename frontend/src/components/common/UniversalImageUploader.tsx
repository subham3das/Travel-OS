import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Maximize2,
  X,
  FileText,
} from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { UploadedImage } from '../../services/upload.service';
import { extractCloudinaryPublicId, formatBytes } from '../../utils/cloudinary';

export interface UniversalImageUploaderProps {
  /**
   * Current image URL or UploadedImage object, or array if multiple is true
   */
  value?: string | UploadedImage | (string | UploadedImage)[];
  /**
   * Callback invoked when image(s) change
   */
  onChange?: (result: any) => void;
  /**
   * If true, allows selecting and uploading multiple images as a gallery
   */
  multiple?: boolean;
  /**
   * Maximum allowed files in multiple mode
   */
  maxFiles?: number;
  /**
   * Cloudinary folder to upload into (e.g. 'travelos/cms', 'travelos/agencies')
   */
  folder?: string;
  /**
   * Visual label shown above the uploader
   */
  label?: string;
  /**
   * Helper description text
   */
  helpText?: string;
  /**
   * Maximum file size in MB (defaults to 10MB)
   */
  maxSizeMB?: number;
  /**
   * Allowed MIME types
   */
  allowedMimeTypes?: string[];
  /**
   * If true, also allows PDF documents (useful for car rental/compliance docs)
   */
  allowPdf?: boolean;
  /**
   * Aspect ratio styling for single image preview ('video' | 'square' | 'wide' | 'auto')
   */
  aspectRatio?: 'video' | 'square' | 'wide' | 'auto';
  /**
   * If true, onChange receives string URL directly instead of UploadedImage object
   * Defaults to true if initial value was a string, or false if it was an object.
   */
  returnUrlOnly?: boolean;
  /**
   * Compact height mode (e.g. for tight document or badge slots)
   */
  compact?: boolean;
  /**
   * Custom placeholder text
   */
  placeholder?: string;
  /**
   * Disabled state
   */
  disabled?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

export const UniversalImageUploader: React.FC<UniversalImageUploaderProps> = ({
  value,
  onChange,
  multiple = false,
  maxFiles = 8,
  folder = 'travelos/misc',
  label,
  helpText,
  maxSizeMB = 10,
  allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'],
  allowPdf = false,
  aspectRatio = 'wide',
  returnUrlOnly,
  disabled = false,
  compact = false,
  placeholder,
  className = '',
}) => {
  // Normalize internal state
  const [singleImage, setSingleImage] = useState<UploadedImage | null>(null);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Determine if consumer expects raw string URL or rich object
  const shouldReturnUrlOnly =
    returnUrlOnly !== undefined ? returnUrlOnly : typeof value === 'string' || (Array.isArray(value) && typeof value[0] === 'string');

  const { isUploading, progress, error, upload, uploadBatch, deleteAsset, setError } = useImageUpload({
    folder,
    maxSizeMB,
  });

  // Sync external value into internal state
  useEffect(() => {
    if (!value) {
      setSingleImage(null);
      setGalleryImages([]);
      return;
    }

    if (multiple) {
      if (Array.isArray(value)) {
        const mapped = value.map((item) => {
          if (typeof item === 'string') {
            return {
              url: item,
              publicId: extractCloudinaryPublicId(item) || '',
            };
          }
          return item;
        });
        setGalleryImages(mapped);
      }
    } else {
      if (typeof value === 'string') {
        setSingleImage({
          url: value,
          publicId: extractCloudinaryPublicId(value) || '',
        });
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        setSingleImage(value as UploadedImage);
      }
    }
  }, [value, multiple]);

  // Validation helper
  const validateFile = (file: File): string | null => {
    const isImage = allowedMimeTypes.includes(file.type);
    const isPdf = allowPdf && file.type === 'application/pdf';

    if (!isImage && !isPdf) {
      return `Invalid format. Accepted: ${allowPdf ? 'PNG, JPG, WEBP, PDF' : 'PNG, JPG, WEBP'}`;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return `File exceeds maximum limit of ${maxSizeMB}MB (${sizeMB.toFixed(1)}MB)`;
    }

    return null;
  };

  // Process files
  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      if (disabled || isUploading) return;
      setError(null);

      const fileList = Array.from(files);
      if (fileList.length === 0) return;

      // Validate each file
      for (const f of fileList) {
        const valErr = validateFile(f);
        if (valErr) {
          setError(valErr);
          return;
        }
      }

      if (multiple) {
        if (galleryImages.length + fileList.length > maxFiles) {
          setError(`Maximum ${maxFiles} images allowed in gallery.`);
          return;
        }

        const uploadedList = await uploadBatch(fileList);
        if (uploadedList.length > 0) {
          const updated = [...galleryImages, ...uploadedList];
          setGalleryImages(updated);
          if (onChange) {
            onChange(shouldReturnUrlOnly ? updated.map((i) => i.url) : updated);
          }
        }
      } else {
        const file = fileList[0];
        const oldPublicId = singleImage?.publicId;
        const uploaded = await upload(file, oldPublicId);
        if (uploaded) {
          setSingleImage(uploaded);
          if (onChange) {
            onChange(shouldReturnUrlOnly ? uploaded.url : uploaded);
          }
        }
      }
    },
    [disabled, isUploading, multiple, galleryImages, maxFiles, singleImage, upload, uploadBatch, onChange, shouldReturnUrlOnly]
  );

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !isUploading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset input value so re-selecting same file triggers change
      e.target.value = '';
    }
  };

  const triggerBrowse = () => {
    if (!disabled && !isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove single image
  const handleRemoveSingle = async () => {
    if (singleImage?.publicId) {
      deleteAsset(singleImage.publicId);
    }
    setSingleImage(null);
    setShowDeleteConfirm(false);
    if (onChange) {
      onChange(shouldReturnUrlOnly ? '' : null);
    }
  };

  // Remove gallery image
  const handleRemoveGalleryImage = (index: number) => {
    const item = galleryImages[index];
    if (item?.publicId) {
      deleteAsset(item.publicId);
    }
    const updated = galleryImages.filter((_, idx) => idx !== index);
    setGalleryImages(updated);
    if (onChange) {
      onChange(shouldReturnUrlOnly ? updated.map((i) => i.url) : updated);
    }
  };

  // Aspect ratio helper
  const getAspectRatioClass = () => {
    if (compact) {
      return aspectRatio === 'square'
        ? 'w-full aspect-square max-h-[130px]'
        : 'w-full min-h-[90px] max-h-[130px] py-2.5 px-3';
    }
    switch (aspectRatio) {
      case 'video':
        return 'w-full aspect-video';
      case 'square':
        return 'w-full aspect-square';
      case 'wide':
        return 'w-full aspect-[21/9] min-h-[110px] max-h-[220px]';
      case 'auto':
      default:
        return 'w-full min-h-[130px]';
    }
  };

  return (
    <div className={`w-full max-w-full min-w-0 space-y-1.5 select-none ${className}`}>
      {/* Optional Header Label */}
      {label && (
        <div className="flex items-center justify-between gap-2 min-w-0">
          <label className="text-[11px] sm:text-xs font-black text-slate-700 block truncate">{label}</label>
          {helpText && <span className="text-[10px] text-slate-400 font-semibold truncate shrink-0">{helpText}</span>}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowPdf ? 'image/jpeg,image/png,image/webp,application/pdf' : 'image/jpeg,image/png,image/webp'}
        onChange={handleFileInputChange}
        disabled={disabled || isUploading}
        className="hidden"
        aria-label={label || 'Upload file'}
      />

      {/* ── 1. SINGLE IMAGE MODE ── */}
      {!multiple && (
        <div className="relative w-full max-w-full min-w-0">
          {/* A. PREVIEW STATE (Uploaded Box Itself becomes the Preview) */}
          {singleImage?.url && !isUploading ? (
            <div
              className={`relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-900/5 shadow-2xs transition-all duration-200 w-full max-w-full min-w-0 ${getAspectRatioClass()}`}
            >
              {singleImage.url.endsWith('.pdf') ? (
                <div className={`w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-600 ${compact ? 'p-2.5 space-y-1' : 'p-4 sm:p-6 space-y-2'}`}>
                  <FileText className={`${compact ? 'w-6 h-6' : 'w-10 h-10'} text-red-500 shrink-0`} />
                  <span className="text-[11px] font-black truncate max-w-[200px]">
                    {singleImage.originalFilename || 'Document.pdf'}
                  </span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">PDF Document</span>
                </div>
              ) : (
                <img
                  src={singleImage.url}
                  alt="Uploaded preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                />
              )}

              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3.5 backdrop-blur-[2px]">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-black shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cloudinary Ready</span>
                  </span>
                  {singleImage.size && (
                    <span className="text-[10px] font-bold text-slate-200 bg-black/40 px-2 py-0.5 rounded-md">
                      {formatBytes(singleImage.size)}
                    </span>
                  )}
                </div>

                {/* Actions: Replace, Remove, View Full */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={triggerBrowse}
                    className={`flex items-center gap-1 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} rounded-xl bg-white/90 hover:bg-white text-slate-800 font-black shadow-sm transition-transform active:scale-95 cursor-pointer`}
                  >
                    <RefreshCw className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-blue-600`} />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewModalUrl(singleImage.url)}
                    className={`flex items-center gap-1 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} rounded-xl bg-white/90 hover:bg-white text-slate-800 font-black shadow-sm transition-transform active:scale-95 cursor-pointer`}
                  >
                    <Maximize2 className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-slate-600`} />
                    <span>View</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className={`flex items-center gap-1 ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} rounded-xl bg-red-500/90 hover:bg-red-600 text-white font-black shadow-sm transition-transform active:scale-95 cursor-pointer`}
                  >
                    <Trash2 className={`${compact ? 'w-3 h-3' : 'w-3.5 h-3.5'}`} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              {/* Inline Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center p-3 text-center space-y-2.5 backdrop-blur-xs">
                  <p className="text-[11px] font-bold text-white max-w-[240px]">
                    Delete image from cloud storage?
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveSingle}
                      className="px-2.5 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-black shadow-sm cursor-pointer"
                    >
                      Yes, Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* B. UPLOAD AREA (Drag & Drop + Click to Browse) */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerBrowse}
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  triggerBrowse();
                }
              }}
              className={`relative w-full max-w-full min-w-0 box-border rounded-2xl border-2 border-dashed ${
                compact ? 'p-3' : 'p-4 sm:p-6'
              } transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#6356E5] overflow-hidden ${
                isDragging
                  ? 'border-[#6356E5] bg-[#6356E5]/10 scale-[1.01] shadow-md'
                  : 'border-slate-200 hover:border-[#6356E5]/60 hover:bg-slate-50/70 bg-white'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${getAspectRatioClass()}`}
            >
              {/* UPLOADING STATE WITH PROGRESS BAR */}
              {isUploading ? (
                <div className="w-full max-w-[240px] space-y-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#6356E5] flex items-center justify-center mx-auto animate-pulse">
                    <UploadCloud className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-black text-slate-700">
                      <span>Uploading to Cloudinary...</span>
                      <span>{progress}%</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-[#6356E5] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium block">
                    Optimizing web resolution...
                  </span>
                </div>
              ) : (
                /* NORMAL & DRAGGING STATE */
                <div className={`w-full max-w-full pointer-events-none ${compact ? 'space-y-1' : 'space-y-2'}`}>
                  <div
                    className={`${
                      compact ? 'w-8 h-8 rounded-xl' : 'w-10 h-10 rounded-2xl'
                    } flex items-center justify-center mx-auto transition-transform ${
                      isDragging ? 'bg-[#6356E5] text-white scale-110' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    <ImageIcon className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
                  </div>

                  <div className="space-y-0.5 max-w-full px-1">
                    <p className={`${compact ? 'text-[11px]' : 'text-xs'} font-black text-[#0F172A] truncate`}>
                      {isDragging ? (
                        <span className="text-[#6356E5]">Release to Upload</span>
                      ) : (
                        placeholder || (compact ? 'Drag & drop image' : 'Drag & Drop Image Here')
                      )}
                    </p>
                    <p className={`${compact ? 'text-[10px]' : 'text-[11px]'} font-semibold text-slate-400 truncate`}>
                      or <span className="text-[#6356E5] font-black underline">Click to Browse</span>
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider truncate px-1">
                    {allowPdf ? 'PNG • JPG • WEBP • PDF' : 'PNG • JPG • WEBP'} — Max {maxSizeMB}MB
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── 2. MULTIPLE IMAGES / GALLERY MODE ── */}
      {multiple && (
        <div className="space-y-3">
          {/* Gallery Thumbnails Grid */}
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {galleryImages.map((img, idx) => (
                <div
                  key={img.publicId || img.url || idx}
                  className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100 border border-slate-200 shadow-2xs"
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(img.url)}
                      className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-800 cursor-pointer shadow-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="p-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white cursor-pointer shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add More Box (If below maxFiles) */}
          {galleryImages.length < maxFiles && (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerBrowse}
              tabIndex={0}
              role="button"
              className={`rounded-2xl border-2 border-dashed p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging ? 'border-[#6356E5] bg-[#6356E5]/10' : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              {isUploading ? (
                <div className="w-full max-w-[200px] space-y-2 py-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-[#6356E5]" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500 py-1">
                  <UploadCloud className="w-4 h-4 text-[#6356E5]" />
                  <span className="text-xs font-bold text-slate-700">Add More Photos</span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({galleryImages.length}/{maxFiles})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-100 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span className="font-semibold flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Fullscreen Image Preview Lightbox Modal */}
      {previewModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewModalUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300 p-1 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewModalUrl}
              alt="Full Preview"
              className="max-h-[85vh] w-auto rounded-2xl shadow-2xl object-contain border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
};
