import React from 'react';
import { UniversalImageUploader } from '../../../components/common/UniversalImageUploader';

export interface DriverPhotoUploadProps {
  value: string;
  onChange: (photoUrl: string) => void;
  className?: string;
}

export const DriverPhotoUpload: React.FC<DriverPhotoUploadProps> = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <UniversalImageUploader
        label="Driver Face Photo (Required for Verification)"
        helpText="Clear portrait shot • PNG, JPG, WEBP (Max 10MB)"
        folder="travelos/drivers"
        value={value}
        onChange={onChange}
        aspectRatio="square"
      />
    </div>
  );
};
