import React from 'react';
import { PackageWizardProvider, usePackageWizard } from '../../context/PackageWizardContext';
import { WizardLayout } from '../../components/packageWizard/WizardLayout';
import { BasicInformationStep } from '../../components/packageWizard/steps/BasicInformationStep';
import { DestinationStep } from '../../components/packageWizard/steps/DestinationStep';
import { PricingStep } from '../../components/packageWizard/steps/PricingStep';
import { DeparturesStep } from '../../components/packageWizard/steps/DeparturesStep';
import { ItineraryStep } from '../../components/packageWizard/steps/ItineraryStep';
import { GalleryStep } from '../../components/packageWizard/steps/GalleryStep';
import { InclusionsStep } from '../../components/packageWizard/steps/InclusionsStep';
import { PoliciesStep } from '../../components/packageWizard/steps/PoliciesStep';
import { PreviewStep } from '../../components/packageWizard/steps/PreviewStep';

/**
 * Inner Step Switcher Component (9 Steps)
 */
const WizardStepSwitcher: React.FC = () => {
  const { currentStep } = usePackageWizard();

  switch (currentStep) {
    case 1:
      return <BasicInformationStep />;
    case 2:
      return <DestinationStep />;
    case 3:
      return <PricingStep />;
    case 4:
      return <DeparturesStep />;
    case 5:
      return <ItineraryStep />;
    case 6:
      return <GalleryStep />;
    case 7:
      return <InclusionsStep />;
    case 8:
      return <PoliciesStep />;
    case 9:
      return <PreviewStep />;
    default:
      return <BasicInformationStep />;
  }
};

/**
 * Single Package Creation Page Component
 * Route: /agency/packages/create
 */
export const PackageCreatePage: React.FC = () => {
  return (
    <PackageWizardProvider>
      <WizardLayout>
        <WizardStepSwitcher />
      </WizardLayout>
    </PackageWizardProvider>
  );
};

export default PackageCreatePage;
