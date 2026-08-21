const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  private getAuthToken(): string | null {
    return localStorage.getItem('apnatrip_access_token');
  }

  /**
   * Upload a single image to Cloudinary via backend API
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

    const headers: Record<string, string> = {};
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid response from upload server',
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload image to Cloudinary');
    }

    return data.data as CloudinaryUploadResponse;
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

    const headers: Record<string, string> = {};
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid response from upload server',
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload images to Cloudinary');
    }

    return (data.data?.images || []) as CloudinaryUploadResponse[];
  }

  /**
   * Upload customer avatar photo directly to /profile/photo
   */
  public async uploadProfileAvatar(file: File): Promise<{ avatarUrl: string; publicId?: string }> {
    const formData = new FormData();
    formData.append('photo', file);

    const headers: Record<string, string> = {};
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/profile/photo`, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Invalid response from profile server',
    }));

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload profile photo');
    }

    return data.data as { avatarUrl: string; publicId?: string };
  }

  /**
   * Delete an image from Cloudinary
   */
  public async deleteImage(publicId: string): Promise<{ success: boolean; message?: string }> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/upload/delete`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ publicId }),
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: 'Failed to delete asset',
    }));

    return data;
  }
}

export const cloudinaryUploadService = CloudinaryUploadService.getInstance();
