import React from 'react';
import { PackageNameField } from '../../packages/wizard/PackageNameField';
import { DescriptionField } from '../../packages/wizard/DescriptionField';
import { PackageTypeSelector } from '../../packages/wizard/PackageTypeSelector';
import { AdventureTypeSelector } from '../../packages/wizard/AdventureTypeSelector';
import { DifficultySelector } from '../../packages/wizard/DifficultySelector';
import { VisibilitySelector } from '../../packages/wizard/VisibilitySelector';
import { usePackageWizard } from '../../../hooks/usePackageWizard';

export const BasicInformationStep: React.FC = () => {
  const { draft, updateStep1 } = usePackageWizard();

  const step1 = draft?.step1 || {
    packageName: '',
    shortDescription: '',
    packageType: 'Adventure',
    adventureType: 'General Adventure',
    tripDifficulty: 'Moderate',
    visibility: 'Draft',
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

      {/* Adventure Type (Classification) */}
      <AdventureTypeSelector
        value={step1.adventureType || 'General Adventure'}
        onChange={(adv) => updateStep1({ adventureType: adv })}
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
    </div>
  );
};

export default BasicInformationStep;
