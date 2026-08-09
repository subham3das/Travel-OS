import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageWizardLayout } from '../../components/packages/wizard/PackageWizardLayout';
import { PackageNameField } from '../../components/packages/wizard/PackageNameField';
import { DescriptionField } from '../../components/packages/wizard/DescriptionField';
import { PackageTypeSelector } from '../../components/packages/wizard/PackageTypeSelector';
import { DifficultySelector } from '../../components/packages/wizard/DifficultySelector';
import { VisibilitySelector } from '../../components/packages/wizard/VisibilitySelector';
import { WizardFooter } from '../../components/packages/wizard/WizardFooter';
import { usePackageWizard } from '../../hooks/usePackageWizard';

/**
 * Step 1 Content Component (Inside Provider)
 */
const CreatePackageStep1Content: React.FC = () => {
  const navigate = useNavigate();
  const { draft, updateStep1, isStep1Valid } = usePackageWizard();

  const step1 = draft?.step1 || {
    packageName: '',
    shortDescription: '',
    packageType: 'Adventure',
    tripDifficulty: 'Moderate',
    visibility: 'Draft',
  };

  const handleNext = () => {
    if (isStep1Valid) {
      navigate('/agency/packages/create/destination');
    }
  };

  const handleCancel = () => {
    navigate('/agency/packages');
  };

  return (
    <div className="space-y-6">
      {/* Package Name */}
      <PackageNameField
        value={step1.packageName || ''}
        onChange={(val) => updateStep1({ packageName: val })}
      />

      {/* Short Description */}
      <DescriptionField
        value={step1.shortDescription || ''}
        onChange={(val) => updateStep1({ shortDescription: val })}
      />

      {/* Package Type */}
      <PackageTypeSelector
        value={step1.packageType}
        onChange={(type) => updateStep1({ packageType: type })}
      />

      {/* Trip Difficulty */}
      <DifficultySelector
        value={step1.tripDifficulty}
        onChange={(diff) => updateStep1({ tripDifficulty: diff })}
      />

      {/* Package Visibility */}
      <VisibilitySelector
        value={step1.visibility || 'Draft'}
        onChange={(vis) => updateStep1({ visibility: vis })}
      />

      {/* Fixed Bottom Footer Bar */}
      <WizardFooter
        onCancel={handleCancel}
        onNext={handleNext}
        isNextDisabled={!isStep1Valid}
        nextLabel="Next"
      />
    </div>
  );
};

/**
 * Step 1 Page Component
 * Route: /agency/packages/create
 */
export const CreatePackageStep1Page: React.FC = () => {
  return (
    <PackageWizardLayout currentStep={1} stepTitle="Basic Information">
      <CreatePackageStep1Content />
    </PackageWizardLayout>
  );
};

export default CreatePackageStep1Page;
