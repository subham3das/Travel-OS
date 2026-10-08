import React from 'react';
import { UniversalImageUploader } from '../../../components/common/UniversalImageUploader';

export interface ComplianceDocumentUploadProps {
  label: string;
  subtitle?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  className?: string;
}

export const ComplianceDocumentUpload: React.FC<ComplianceDocumentUploadProps> = ({
  label,
  subtitle = 'Upload clear photo or PDF copy',
  value,
  onChange,
  required = false,
  className = '',
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <UniversalImageUploader
        label={`${label} ${required ? '*' : ''}`}
        helpText={subtitle}
        folder="travelos/vehicle-documents"
        value={value}
        onChange={onChange}
        allowPdf={true}
        aspectRatio="wide"
      />
    </div>
  );
};
