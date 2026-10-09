import React from 'react';
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

/**
 * Inner Step Switcher Component (10 Steps)
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

/**
 * Active Draft Synchronization Component
 * Backend check: active draft?
 * If YES: Resume that draft.
 * If NO: Create an entirely new draft (all forms empty). Never reuse published package.
 */
const ActiveDraftLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadActiveDraft, startFreshDraft, draft } = usePackageWizard();

  React.useEffect(() => {
    let isMounted = true;

    // Check backend active draft
    agencyPackagesService
      .getActiveDraft()
      .then((activeDraft) => {
        if (!isMounted) return;
        if (activeDraft && (activeDraft.status === 'Draft' || activeDraft.status === 'DRAFT')) {
          // Valid active draft exists -> resume it
          loadActiveDraft(activeDraft);
        } else {
          // No active draft in backend
          // If local draft is a published draft or has no packageName, ensure clean fresh draft
          if (draft.status === 'PUBLISHED' || !draft.draftId) {
            startFreshDraft();
          }
        }
      })
      .catch((err) => {
        console.warn('Draft sync notice:', err?.message);
        if (draft.status === 'PUBLISHED') {
          startFreshDraft();
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children}</>;
};

/**
 * Single Package Creation Page Component
 * Route: /agency/packages/create
 */
export const PackageCreatePage: React.FC = () => {
  return (
    <PackageWizardProvider>
      <ActiveDraftLoader>
        <WizardLayout>
          <WizardStepSwitcher />
        </WizardLayout>
      </ActiveDraftLoader>
    </PackageWizardProvider>
  );
};

export default PackageCreatePage;
