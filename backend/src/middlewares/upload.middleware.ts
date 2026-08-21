import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../utils/errors.util.js';

// Allowed MIME types for images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Allowed document MIME types for legal verification documents
const ALLOWED_DOCUMENT_MIME_TYPES = [
  ...ALLOWED_MIME_TYPES,
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 Megabytes

// Memory storage keeps file buffers in memory for direct stream upload to Cloudinary
const memoryStorage = multer.memoryStorage();

const imageFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        `Unsupported file format (${file.mimetype}). Allowed formats: JPG, JPEG, PNG, WEBP.`
      )
    );
  }
};

const documentFileFilter = (
  _req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  if (ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimetype.toLowerCase())) {
    callback(null, true);
  } else {
    callback(
      new BadRequestError(
        `Unsupported file format (${file.mimetype}). Allowed formats: JPG, PNG, WEBP, PDF.`
      )
    );
  }
};

export const uploadSingleImage = (fieldName: string = 'image') => {
  return multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
  }).single(fieldName);
};

export const uploadMultipleImages = (fieldName: string = 'images', maxCount: number = 10) => {
  return multer({
    storage: memoryStorage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: maxCount,
    },
  }).array(fieldName, maxCount);
};

export const uploadDocument = (fieldName: string = 'document') => {
  return multer({
    storage: memoryStorage,
    fileFilter: documentFileFilter,
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
  }).single(fieldName);
};
