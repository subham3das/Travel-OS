import { apiClient } from './apiClient';

export interface CloudinaryUploadResponse {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
  uploadedAt: string;
}

export class CloudinaryUploadService {
  private static instance: CloudinaryUploadService;

  private constructor() {}

  public static getInstance(): CloudinaryUploadService {
    if (!CloudinaryUploadService.instance) {
      CloudinaryUploadService.instance = new CloudinaryUploadService();
    }
    return CloudinaryUploadService.instance;
  }

  /**
   * Upload a single image to Cloudinary via backend API
   * Used for both public onboarding/registration and authenticated uploads
   */
  public async uploadImage(
    file: File,
    folder: string = 'travelos/misc',
    oldPublicId?: string
  ): Promise<CloudinaryUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    if (oldPublicId) {
      formData.append('oldPublicId', oldPublicId);
    }

    const res = await apiClient.post<CloudinaryUploadResponse>('/upload/image', formData, {
      requiresAuth: false,
    });

    if (!res.data) {
      throw new Error(res.message || 'Failed to upload image to Cloudinary');
    }

    return res.data;
  }

  /**
   * Upload multiple images to Cloudinary via backend API
   */
  public async uploadMultipleImages(
    files: File[],
    folder: string = 'travelos/misc'
  ): Promise<CloudinaryUploadResponse[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);

    const res = await apiClient.post<{ images: CloudinaryUploadResponse[] }>('/upload/multiple', formData, {
      requiresAuth: false,
    });

    return res.data?.images || [];
  }

  /**
   * Upload customer avatar photo directly to /profile/photo
   */
  public async uploadProfileAvatar(file: File): Promise<{ avatarUrl: string; publicId?: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    const res = await apiClient.post<{ avatarUrl: string; publicId?: string }>('/profile/photo', formData, {
      requiresAuth: true,
    });

    if (!res.data) {
      throw new Error(res.message || 'Failed to upload profile photo');
    }

    return res.data;
  }

  /**
   * Delete an image from Cloudinary
   */
  public async deleteImage(publicId: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiClient.post<{ success: boolean; message?: string }>(
      '/upload/delete',
      { publicId },
      { requiresAuth: false }
    );
    return res;
  }
}

export const cloudinaryUploadService = CloudinaryUploadService.getInstance();
