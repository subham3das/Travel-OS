/**
 * Cloudinary URL & Metadata Helper Utilities
 */

export interface CloudinaryTransformOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  quality?: string | number; // 'auto', 'auto:eco', 80
  format?: 'auto' | 'webp' | 'png' | 'jpg';
}

/**
 * Parses publicId from a raw Cloudinary URL
 * Example: https://res.cloudinary.com/hcysv27y/image/upload/v12345/travelos/cms/banner_01.webp -> travelos/cms/banner_01
 */
export function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return null;
  }

  try {
    const uploadIndex = url.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    let pathAfterUpload = url.substring(uploadIndex + '/upload/'.length);

    // Strip version prefix if present, e.g. v1723456789/
    pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '');

    // Strip extension
    const dotIndex = pathAfterUpload.lastIndexOf('.');
    if (dotIndex !== -1) {
      pathAfterUpload = pathAfterUpload.substring(0, dotIndex);
    }

    return decodeURIComponent(pathAfterUpload);
  } catch {
    return null;
  }
}

/**
 * Transforms a Cloudinary URL on the fly with responsive dimensions, quality, and format
 */
export function getOptimizedCloudinaryUrl(
  url: string,
  options: CloudinaryTransformOptions = {}
): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) {
    return url;
  }

  const uploadSegment = '/upload/';
  const idx = url.indexOf(uploadSegment);
  if (idx === -1) return url;

  const transformations: string[] = ['f_auto', 'q_auto'];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);

  const transformString = transformations.join(',');
  const prefix = url.substring(0, idx + uploadSegment.length);
  const suffix = url.substring(idx + uploadSegment.length);

  // If already has transformation parameters, avoid duplicate insertion
  if (suffix.match(/^[a-z]_[a-z0-9,]+\//)) {
    return url;
  }

  return `${prefix}${transformString}/${suffix}`;
}

/**
 * Format bytes into human readable string (KB, MB)
 */
export function formatBytes(bytes?: number, decimals = 1): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
