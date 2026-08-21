import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './env.config.js';
import { logger } from './logger.config.js';

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDERS = {
  CUSTOMERS_PROFILE: 'travelos/customers/profile',
  CUSTOMERS_COVER: 'travelos/customers/cover',
  CUSTOMERS_GALLERY: 'travelos/customers/gallery',
  AGENCIES_LOGO: 'travelos/agencies/logo',
  AGENCIES_BANNER: 'travelos/agencies/banner',
  AGENCIES_GALLERY: 'travelos/agencies/gallery',
  AGENCIES_DOCUMENTS: 'travelos/agencies/documents',
  TRIPS_COVER: 'travelos/trips/cover',
  TRIPS_GALLERY: 'travelos/trips/gallery',
  CMS_BANNERS: 'travelos/cms/banners',
  DOCUMENTS: 'travelos/documents',
  REVIEWS: 'travelos/reviews',
  CHAT: 'travelos/chat',
  MISC: 'travelos/misc',
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS] | string;

logger.info('☁️ Cloudinary SDK configured successfully for cloud: %s', envConfig.CLOUDINARY_CLOUD_NAME);

export { cloudinary };
