import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';

export const GalleryGrid: React.FC = () => {
  const { draft, updateStep5 } = usePackageWizard();

  const galleryImages = draft?.step5?.galleryImages || [];

  const handleGalleryChange = (rawItems: any[]) => {
    const list = Array.isArray(rawItems) ? rawItems : [];
    const updatedImages = list
      .map((item, idx) => {
        if (typeof item === 'string') {
          return {
            id: `img-${Date.now()}-${idx}`,
            url: item,
            publicId: '',
            name: `photo_${idx + 1}.webp`,
          };
        }
        if (item && typeof item === 'object') {
          const resolvedUrl = typeof item.url === 'string' ? item.url : (item.url as any)?.url || '';
          if (!resolvedUrl) return null;
          return {
            id: item.publicId || item.id || `img-${Date.now()}-${idx}`,
            url: resolvedUrl,
            publicId: item.publicId || '',
            width: item.width ? Number(item.width) : undefined,
            height: item.height ? Number(item.height) : undefined,
            format: item.format || undefined,
            size: item.size || item.bytes || undefined,
            bytes: item.bytes || item.size || undefined,
            uploadedAt: item.uploadedAt || new Date().toISOString(),
            originalFilename: item.originalFilename || item.name || undefined,
            name: item.name || item.originalFilename || `photo_${idx + 1}.webp`,
            category: item.category || undefined,
          };
        }
        return null;
      })
      .filter(Boolean);

    updateStep5({ galleryImages: updatedImages as any });
  };

  return (
    <div className="space-y-3 select-none">
      <UniversalImageUploader
        label="Gallery Images *"
        helpText="Drag & drop destination, activity and hotel photos (Min. 3, Max 20)"
        folder="travelos/packages/gallery"
        multiple={true}
        maxFiles={20}
        value={galleryImages as any}
        returnUrlOnly={false}
        onChange={handleGalleryChange}
      />
    </div>
  );
};

export default GalleryGrid;
