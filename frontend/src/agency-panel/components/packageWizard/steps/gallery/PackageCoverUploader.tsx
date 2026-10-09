import React from 'react';
import { usePackageWizard } from '../../../../hooks/usePackageWizard';
import { UniversalImageUploader } from '../../../../../components/common/UniversalImageUploader';

export const PackageCoverUploader: React.FC = () => {
  const { draft, setCoverImage } = usePackageWizard();

  const coverImage = draft?.step5?.coverImage || '';

  return (
    <div className="space-y-1.5 select-none">
      <UniversalImageUploader
        label="Cover Photo *"
        helpText="Main thumbnail displayed on user search & listings (Max 10MB)"
        folder="travelos/packages/cover"
        value={coverImage}
        returnUrlOnly={true}
        onChange={(url: any) => {
          const cleanUrl = typeof url === 'string' ? url : url?.url || '';
          setCoverImage(cleanUrl);
        }}
        aspectRatio="wide"
      />
    </div>
  );
};

export default PackageCoverUploader;
