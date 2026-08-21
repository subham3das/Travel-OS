import { UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { cloudinary, CLOUDINARY_FOLDERS, CloudinaryFolder } from '../config/cloudinary.config.js';
import { logger } from '../config/logger.config.js';
import { BadRequestError, InternalServerError } from '../utils/errors.util.js';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  resourceType: string;
  originalFilename?: string;
  uploadedAt: Date;
}

export interface UploadOptions {
  folder?: CloudinaryFolder;
  publicId?: string;
  width?: number;
  height?: number;
  crop?: string;
  gravity?: string;
  quality?: string | number;
  tags?: string[];
}

export class CloudinaryStorage {
  private static instance: CloudinaryStorage;

  private constructor() {}

  public static getInstance(): CloudinaryStorage {
    if (!CloudinaryStorage.instance) {
      CloudinaryStorage.instance = new CloudinaryStorage();
    }
    return CloudinaryStorage.instance;
  }

  /**
   * Upload an image buffer directly to Cloudinary with automatic WebP & quality optimization
   */
  public async uploadImage(
    fileBuffer: Buffer,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestError('Cannot upload empty file buffer');
    }

    const folder = options.folder || CLOUDINARY_FOLDERS.MISC;

    const uploadOptions: UploadApiOptions = {
      folder,
      public_id: options.publicId,
      resource_type: 'image',
      format: 'webp',
      quality: options.quality || 'auto:good',
      fetch_format: 'auto',
      flags: 'strip_profile', // Strip EXIF/metadata for privacy and size reduction
      tags: options.tags || ['travelos', folder.split('/').pop() || 'misc'],
    };

    if (options.width || options.height) {
      uploadOptions.transformation = [
        {
          width: options.width,
          height: options.height,
          crop: options.crop || 'limit',
          gravity: options.gravity || 'auto',
        },
      ];
    }

    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            logger.error('❌ Cloudinary upload error: %s', error?.message || 'Unknown error');
            return reject(
              new InternalServerError(
                `Failed to upload image to cloud storage: ${error?.message || 'Upload failed'}`
              )
            );
          }

          logger.info('☁️ Uploaded image to Cloudinary: %s (%s, %d bytes)', result.public_id, result.format, result.bytes);

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
            resourceType: result.resource_type,
            originalFilename: result.original_filename,
            uploadedAt: new Date(result.created_at || Date.now()),
          });
        }
      );

      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Replace an existing image in Cloudinary (deleting the old asset if present)
   */
  public async replaceImage(
    newFileBuffer: Buffer,
    oldPublicId?: string,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (oldPublicId && oldPublicId.trim()) {
      try {
        await this.deleteImage(oldPublicId.trim());
      } catch (err: any) {
        logger.warn('Could not delete old Cloudinary asset during replacement: %s', err.message);
      }
    }

    return this.uploadImage(newFileBuffer, options);
  }

  /**
   * Upload multiple image buffers to Cloudinary in parallel
   */
  public async uploadMultipleImages(
    files: Array<{ buffer: Buffer; originalname?: string }>,
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) => this.uploadImage(file.buffer, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete an image from Cloudinary by public ID
   */
  public async deleteImage(publicId: string): Promise<{ success: boolean; result?: string }> {
    if (!publicId || !publicId.trim()) {
      return { success: false, result: 'No public ID provided' };
    }

    try {
      const res = await cloudinary.uploader.destroy(publicId.trim(), {
        resource_type: 'image',
        invalidate: true,
      });

      logger.info('🗑️ Deleted Cloudinary asset: %s (result: %s)', publicId, res.result);
      return { success: res.result === 'ok', result: res.result };
    } catch (err: any) {
      logger.error('❌ Failed to delete Cloudinary asset %s: %s', publicId, err.message);
      return { success: false, result: err.message };
    }
  }

  /**
   * Delete multiple images from Cloudinary by public IDs
   */
  public async deleteMultipleImages(publicIds: string[]): Promise<void> {
    if (!publicIds || publicIds.length === 0) return;
    const validIds = publicIds.filter((id) => Boolean(id && id.trim()));
    if (validIds.length === 0) return;

    try {
      await cloudinary.api.delete_resources(validIds, {
        resource_type: 'image',
        invalidate: true,
      });
      logger.info('🗑️ Bulk deleted %d Cloudinary assets', validIds.length);
    } catch (err: any) {
      logger.error('❌ Failed bulk Cloudinary asset deletion: %s', err.message);
    }
  }
}

export const cloudinaryStorage = CloudinaryStorage.getInstance();
