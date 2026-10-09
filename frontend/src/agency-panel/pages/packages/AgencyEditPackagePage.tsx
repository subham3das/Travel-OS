import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PackageWizardProvider, usePackageWizard } from '../../context/PackageWizardContext';
import { WizardLayout } from '../../components/packageWizard/WizardLayout';
import { BasicInformationStep } from '../../components/packageWizard/steps/BasicInformationStep';
import { DestinationStep } from '../../components/packageWizard/steps/DestinationStep';
import { PricingStep } from '../../components/packageWizard/steps/PricingStep';
import { DeparturesStep } from '../../components/packageWizard/steps/DeparturesStep';
import { ItineraryStep } from '../../components/packageWizard/steps/ItineraryStep';
import { AccommodationStep } from '../../components/packageWizard/steps/AccommodationStep';
import { GalleryStep } from '../../components/packageWizard/steps/GalleryStep';
import { InclusionsStep } from '../../components/packageWizard/steps/InclusionsStep';
import { PoliciesStep } from '../../components/packageWizard/steps/PoliciesStep';
import { PreviewStep } from '../../components/packageWizard/steps/PreviewStep';
import { agencyPackagesService } from '../../services/agencyPackages.service';
import { PackageType, TripDifficulty } from '../../types/packageWizard';

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
      return <AccommodationStep />;
    case 7:
      return <GalleryStep />;
    case 8:
      return <InclusionsStep />;
    case 9:
      return <PoliciesStep />;
    case 10:
      return <PreviewStep />;
    default:
      return <BasicInformationStep />;
  }
};

const EditPackageDataPreloader: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { loadActiveDraft } = usePackageWizard();

  useEffect(() => {
    if (!packageId) return;

    agencyPackagesService
      .getPackageById(packageId)
      .then((pkg) => {
        if (!pkg) return;
        loadActiveDraft(pkg);
      })
      .catch((err) => {
        console.error('Failed to load package for edit:', err);
      });
  }, [packageId, loadActiveDraft]);

  return (
    <WizardLayout>
      <WizardStepSwitcher />
    </WizardLayout>
  );
};

/**
 * Package Edit Page - Reuses the 9-Step Package Wizard with pre-filled fields
 * Route: /agency/packages/:packageId/edit
 */
export const AgencyEditPackagePage: React.FC = () => {
  return (
    <PackageWizardProvider>
      <EditPackageDataPreloader />
    </PackageWizardProvider>
  );
};

export default AgencyEditPackagePage;
