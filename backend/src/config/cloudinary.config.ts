import { v2 as cloudinary } from 'cloudinary';
import { envConfig } from './env.config.js';
import { logger } from './logger.config.js';

cloudinary.config({
  cloud_name: envConfig.CLOUDINARY_CLOUD_NAME,
  api_key: envConfig.CLOUDINARY_API_KEY,
  api_secret: envConfig.CLOUDINARY_API_SECRET,
  secure: true,
});

logger.debug('Cloudinary storage configuration loaded');

export { cloudinary };
