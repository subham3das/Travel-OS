import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors.util.js';

// Memory storage for stream upload to Cloudinary/S3
const storage = multer.memoryStorage();

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        `Unsupported file type: ${file.mimetype}. Allowed types: JPG, PNG, WEBP, GIF, PDF`
      )
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB maximum file size
  },
  fileFilter,
});
