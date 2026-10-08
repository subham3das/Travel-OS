import { useState, useCallback, useRef } from 'react';
import { compressImage } from '../utils/imageCompression';
import { universalUploadService, UploadedImage } from '../services/upload.service';

export interface UseImageUploadOptions {
  folder?: string;
  maxSizeMB?: number;
  autoCompress?: boolean;
  onSuccess?: (image: UploadedImage) => void;
  onError?: (error: string) => void;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const upload = useCallback(
    async (file: File, oldPublicId?: string): Promise<UploadedImage | null> => {
      setIsUploading(true);
      setProgress(5);
      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        // Step 1: Compress if enabled
        let processedFile = file;
        if (options.autoCompress !== false && file.type.startsWith('image/')) {
          setProgress(10);
          processedFile = await compressImage(file);
        }

        setProgress(20);

        // Step 2: Upload to Cloudinary with real progress
        const result = await universalUploadService.uploadSingle(processedFile, {
          folder: options.folder || 'travelos/misc',
          oldPublicId,
          signal: abortControllerRef.current.signal,
          onProgress: (pct) => {
            // Scale progress from 20% to 95%
            const scaled = Math.round(20 + pct * 0.75);
            setProgress(scaled);
          },
        });

        setProgress(100);
        setIsUploading(false);
        options.onSuccess?.(result);
        return result;
      } catch (err: any) {
        setIsUploading(false);
        setProgress(0);
        const errMsg = err?.message || 'Failed to upload image. Please try again.';
        setError(errMsg);
        options.onError?.(errMsg);
        return null;
      }
    },
    [options]
  );

  const uploadBatch = useCallback(
    async (files: File[]): Promise<UploadedImage[]> => {
      if (files.length === 0) return [];
      setIsUploading(true);
      setProgress(10);
      setError(null);

      try {
        // Compress files in parallel
        const processed = await Promise.all(
          files.map(async (f) => (options.autoCompress !== false && f.type.startsWith('image/') ? compressImage(f) : f))
        );

        setProgress(30);

        const results = await universalUploadService.uploadMultiple(processed, {
          folder: options.folder || 'travelos/misc',
          onProgress: (pct) => {
            const scaled = Math.round(30 + pct * 0.65);
            setProgress(scaled);
          },
        });

        setProgress(100);
        setIsUploading(false);
        return results;
      } catch (err: any) {
        setIsUploading(false);
        setProgress(0);
        const errMsg = err?.message || 'Failed to upload images.';
        setError(errMsg);
        options.onError?.(errMsg);
        return [];
      }
    },
    [options]
  );

  const deleteAsset = useCallback(async (publicId: string): Promise<boolean> => {
    return universalUploadService.deleteImage(publicId);
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsUploading(false);
      setProgress(0);
    }
  }, []);

  return {
    isUploading,
    progress,
    error,
    upload,
    uploadBatch,
    deleteAsset,
    cancel,
    setError,
  };
}
