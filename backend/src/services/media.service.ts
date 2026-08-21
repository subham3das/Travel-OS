import { cloudinaryStorage, CloudinaryUploadResult, UploadOptions } from '../storage/cloudinary.storage.js';
import { CLOUDINARY_FOLDERS, CloudinaryFolder } from '../config/cloudinary.config.js';
import { BadRequestError } from '../utils/errors.util.js';
import { logger } from '../config/logger.config.js';

export class MediaService {
  private static instance: MediaService;

  private constructor() {}

  public static getInstance(): MediaService {
    if (!MediaService.instance) {
      MediaService.instance = new MediaService();
    }
    return MediaService.instance;
  }

  /**
   * Upload single image buffer to Cloudinary with automatic optimization
   */
  public async uploadSingleImage(
    file: Express.Multer.File,
    folder: CloudinaryFolder = CLOUDINARY_FOLDERS.MISC,
    oldPublicId?: string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!file || !file.buffer) {
      throw new BadRequestError('No image file provided for upload');
    }

    const uploadOptions: UploadOptions = {
      ...options,
      folder,
    };

    if (oldPublicId) {
      return cloudinaryStorage.replaceImage(file.buffer, oldPublicId, uploadOptions);
    }

    return cloudinaryStorage.uploadImage(file.buffer, uploadOptions);
  }

  /**
   * Upload multiple image buffers to Cloudinary
   */
  public async uploadMultipleImages(
    files: Express.Multer.File[],
    folder: CloudinaryFolder = CLOUDINARY_FOLDERS.MISC,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    if (!files || files.length === 0) {
      throw new BadRequestError('No image files provided for upload');
    }

    const filePayloads = files.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
    }));

    return cloudinaryStorage.uploadMultipleImages(filePayloads, {
      ...options,
      folder,
    });
  }

  /**
   * Delete image from Cloudinary by public ID
   */
  public async deleteImage(publicId: string): Promise<{ success: boolean; result?: string }> {
    if (!publicId || !publicId.trim()) {
      throw new BadRequestError('Image public ID is required for deletion');
    }

    return cloudinaryStorage.deleteImage(publicId.trim());
  }

  /**
   * Delete multiple images by public IDs
   */
  public async deleteMultipleImages(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;
    await cloudinaryStorage.deleteMultipleImages(publicIds);
  }
}

export const mediaService = MediaService.getInstance();
