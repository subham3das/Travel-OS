/**
 * Image Compression Utility
 * Compresses images client-side before uploading to Cloudinary.
 * Resizes large dimensions, strips bloat, maintains aspect ratio, and outputs optimized web-ready images.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default 0.85)
  maxSizeMB?: number; // If file is smaller than this and dimensions are within bounds, skip re-encoding
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 2560,
  maxHeight: 2560,
  quality: 0.85,
  maxSizeMB: 0.8, // 800KB
};

export async function compressImage(file: File, options?: CompressionOptions): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // If not an image (e.g. PDF document), return untouched
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // If already small and SVG/GIF (which we shouldn't compress via canvas), return
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Skip compression if already well within size and dimensions
        const fileSizeMB = file.size / (1024 * 1024);
        if (width <= opts.maxWidth && height <= opts.maxHeight && fileSizeMB <= opts.maxSizeMB) {
          resolve(file);
          return;
        }

        // Calculate proportional dimensions maintaining exact aspect ratio
        if (width > opts.maxWidth || height > opts.maxHeight) {
          const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Target output format: maintain PNG for transparency, otherwise webp or original
        const outputMime = file.type === 'image/png' ? 'image/png' : 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Only use compressed if it actually reduced the size or resized dimensions
            if (blob.size < file.size || width !== img.width || height !== img.height) {
              const extension = outputMime === 'image/webp' ? '.webp' : file.name.substring(file.name.lastIndexOf('.'));
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
              const compressedFile = new File([blob], `${baseName}${extension}`, {
                type: outputMime,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          outputMime,
          opts.quality
        );
      };

      img.onerror = () => {
        resolve(file); // fallback to original file safely
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
