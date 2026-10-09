/**
 * Universal Upload Service
 * Communicates with backend /api/upload endpoints with real-time XMLHttpRequest progress tracking.
 */

export interface UploadedImage {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  size?: number;
  bytes?: number;
  uploadedAt?: string;
  originalFilename?: string;
}

export interface UploadOptions {
  folder?: string;
  oldPublicId?: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

class UniversalUploadService {
  private static instance: UniversalUploadService;

  private constructor() {}

  public static getInstance(): UniversalUploadService {
    if (!UniversalUploadService.instance) {
      UniversalUploadService.instance = new UniversalUploadService();
    }
    return UniversalUploadService.instance;
  }

  /**
   * Upload single image with progress tracking
   */
  public uploadSingle(file: File, options?: UploadOptions): Promise<UploadedImage> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', file);
      if (options?.folder) {
        formData.append('folder', options.folder);
      }
      if (options?.oldPublicId) {
        formData.append('oldPublicId', options.oldPublicId);
      }

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload/image');

      // Attach auth token if present
      const token = localStorage.getItem('apnatrip_access_token') || localStorage.getItem('apnatrip_admin_access_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options?.onProgress) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          options.onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            const data = res.data;
            if (data && (data.url || data.secureUrl)) {
              resolve({
                url: data.url || data.secureUrl,
                publicId: data.publicId,
                width: data.width,
                height: data.height,
                format: data.format,
                size: data.bytes || data.size,
                bytes: data.bytes || data.size,
                uploadedAt: data.uploadedAt || new Date().toISOString(),
                originalFilename: file.name,
              });
            } else {
              reject(new Error(res.message || 'Malformed upload response'));
            }
          } catch {
            reject(new Error('Failed to parse upload response'));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.message || `Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      if (options?.signal) {
        options.signal.addEventListener('abort', () => {
          xhr.abort();
          reject(new Error('Upload aborted by user'));
        });
      }

      xhr.send(formData);
    });
  }

  /**
   * Upload multiple images
   */
  public uploadMultiple(files: File[], options?: UploadOptions): Promise<UploadedImage[]> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      if (options?.folder) formData.append('folder', options.folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload/multiple');

      const token = localStorage.getItem('apnatrip_access_token') || localStorage.getItem('apnatrip_admin_access_token');
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && options?.onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          options.onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            const images = res.data?.images || [];
            const mapped: UploadedImage[] = images.map((img: any, idx: number) => ({
              url: img.url || img.secureUrl,
              publicId: img.publicId,
              width: img.width,
              height: img.height,
              format: img.format,
              size: img.bytes || img.size,
              bytes: img.bytes || img.size,
              uploadedAt: img.uploadedAt || new Date().toISOString(),
              originalFilename: files[idx]?.name || '',
            }));
            console.log('[1. Immediately after Cloudinary upload returns]', mapped);
            resolve(mapped);
          } catch {
            reject(new Error('Failed to parse multiple upload response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(formData);
    });
  }

  /**
   * Delete image from Cloudinary
   */
  public async deleteImage(publicId: string): Promise<boolean> {
    if (!publicId) return true;
    try {
      const response = await fetch('/api/upload/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('apnatrip_access_token') || localStorage.getItem('apnatrip_admin_access_token') || ''}`,
        },
        body: JSON.stringify({ publicId }),
      });
      const data = await response.json();
      return !!data.success;
    } catch {
      return false;
    }
  }
}

export const universalUploadService = UniversalUploadService.getInstance();
