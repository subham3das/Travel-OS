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
  const { updateStep1, updateStep2, updateStep3, updateStepDepartures, updateStep5 } = usePackageWizard();

  useEffect(() => {
    if (!packageId) return;

    agencyPackagesService
      .getPackageById(packageId)
      .then((pkg) => {
        if (!pkg) return;
        const mappedType: PackageType = pkg.packageType || 'Adventure';
        const mappedDifficulty: TripDifficulty =
          pkg.tripDifficulty === 'Challenging'
            ? 'Difficult'
            : (pkg.tripDifficulty as TripDifficulty) || 'Moderate';

        updateStep1({
          packageName: pkg.packageName || pkg.title || '',
          shortDescription: (pkg.description || '').slice(0, 140),
          packageType: mappedType,
          tripDifficulty: mappedDifficulty,
        });

        updateStep2({
          primaryDestination: pkg.destination ? pkg.destination.split(',')[0] : '',
          pickupCity: pkg.pickupLocation || '',
          dropOffCity: pkg.dropOffLocation || '',
        });

        updateStep3({
          originalPrice: pkg.originalPrice || pkg.price || 0,
          discountedPrice: pkg.price || 0,
          maxTravelers: pkg.maxTravelers || 20,
        });

        if (pkg.upcomingDepartures && pkg.upcomingDepartures.length > 0) {
          updateStepDepartures({
            departures: pkg.upcomingDepartures.map((d: any, i: number) => ({
              id: d.id || `dep-${i + 1}`,
              departureDate: d.departureDate || '',
              departureTime: d.departureTime || '09:00',
              timezone: 'Asia/Kolkata (IST)',
              pickupLocation: d.pickupLocation || 'Airport',
              reportingTime: d.reportingTime || '07:30 AM',
              bookingClosingDate: d.bookingClosingDate || '',
              bookingClosingTime: '23:59',
              maximumTravelers: d.maximumTravelers || pkg.maxTravelers || 20,
              bookedTravelers: d.bookedTravelers || d.seatsFilled || 0,
              availableSeats: d.availableSeats || 20,
              status: d.status || 'Upcoming',
              returnDate: d.returnDate || '',
              returnTime: d.returnTime || '09:00',
            })),
          });
        }

        if (pkg.coverImage) {
          updateStep5({
            coverImage: pkg.coverImage,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to load package for edit:', err);
      });
  }, [packageId, updateStep1, updateStep2, updateStep3, updateStepDepartures, updateStep5]);

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
