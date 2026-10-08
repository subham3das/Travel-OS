import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';

export const GalleryGrid: React.FC = () => {
  const { draft, updateStep5 } = usePackageWizard();

  const galleryImages = draft?.step5?.galleryImages || [];
  const imageUrls = galleryImages.map((img) => img.url);

  const handleGalleryChange = (urls: string[]) => {
    const updatedImages = (urls || []).map((url, idx) => ({
      id: galleryImages[idx]?.id || `img-${Date.now()}-${idx}`,
      url,
      name: galleryImages[idx]?.name || `photo_${idx + 1}.webp`,
    }));
    updateStep5({ galleryImages: updatedImages });
  };

  return (
    <div className="space-y-3 select-none">
      <UniversalImageUploader
        label="Gallery Images *"
        helpText="Drag & drop destination, activity and hotel photos (Min. 3, Max 20)"
        folder="travelos/packages/gallery"
        multiple={true}
        maxFiles={20}
        value={imageUrls}
        onChange={handleGalleryChange}
      />
    </div>
  );
};

export default GalleryGrid;
