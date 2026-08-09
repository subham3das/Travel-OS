import React from 'react';
import { PackageSummaryHeader } from './itinerary/PackageSummaryHeader';
import { PackageCoverUploader } from './gallery/PackageCoverUploader';
import { GalleryGrid } from './gallery/GalleryGrid';
import { VideoUploader } from './gallery/VideoUploader';
import { Experience360Card } from './gallery/Experience360Card';
import { ImageCategorySelector } from './gallery/ImageCategorySelector';
import { GalleryPreviewCarousel } from './gallery/GalleryPreviewCarousel';
import { UploadGuidelinesCard } from './gallery/UploadGuidelinesCard';

export const GalleryStep: React.FC = () => {
  return (
    <div className="space-y-6 select-none">
      {/* 1. Package Summary Header */}
      <PackageSummaryHeader />

      {/* 2. Cover Photo Section */}
      <PackageCoverUploader />

      {/* 3. Gallery Images Grid */}
      <GalleryGrid />

      {/* 4. Video Uploader */}
      <VideoUploader />

      {/* 5. 360° Experience Placeholder */}
      <Experience360Card />

      {/* 6. Image Categories Selector */}
      <ImageCategorySelector />

      {/* 7. Gallery Preview Carousel */}
      <GalleryPreviewCarousel />

      {/* 8. Upload Guidelines Card */}
      <UploadGuidelinesCard />
    </div>
  );
};

export default GalleryStep;
