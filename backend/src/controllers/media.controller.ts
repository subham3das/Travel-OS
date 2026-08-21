import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service.js';
import { ResponseUtil } from '../utils/response.util.js';
import { HTTP_STATUS } from '../constants/http.constant.js';
import { CLOUDINARY_FOLDERS, CloudinaryFolder } from '../config/cloudinary.config.js';
import { BadRequestError } from '../utils/errors.util.js';

export class MediaController {
  /**
   * Upload single image
   * POST /api/upload/image (or /api/media/upload)
   */
  public async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError('No image file uploaded');
      }

      const folder = (req.body.folder || req.query.folder || CLOUDINARY_FOLDERS.MISC) as CloudinaryFolder;
      const oldPublicId = req.body.oldPublicId as string | undefined;

      const result = await mediaService.uploadSingleImage(req.file, folder, oldPublicId);

      ResponseUtil.success(
        res,
        result,
        'Image uploaded successfully to Cloudinary',
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple images
   * POST /api/upload/multiple (or /api/media/upload-multiple)
   */
  public async uploadMultiple(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        throw new BadRequestError('No image files uploaded');
      }

      const folder = (req.body.folder || req.query.folder || CLOUDINARY_FOLDERS.MISC) as CloudinaryFolder;

      const results = await mediaService.uploadMultipleImages(files, folder);

      ResponseUtil.success(
        res,
        {
          count: results.length,
          images: results,
        },
        `${results.length} images uploaded successfully to Cloudinary`,
        HTTP_STATUS.CREATED
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete image from Cloudinary
   * DELETE /api/upload/:publicId(*) (or POST /api/upload/delete)
   */
  public async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const publicId = req.params.publicId || req.body.publicId || (req.query.publicId as string);

      if (!publicId) {
        throw new BadRequestError('Public ID is required for deletion');
      }

      const result = await mediaService.deleteImage(publicId);

      ResponseUtil.success(
        res,
        result,
        'Image deleted successfully from Cloudinary'
      );
    } catch (error) {
      next(error);
    }
  }
}

export const mediaController = new MediaController();
