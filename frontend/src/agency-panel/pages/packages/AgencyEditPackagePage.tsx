import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
import { getDetailedPackageById } from '../../data/packageDetails';
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

const EditPackageDataPreloader: React.FC = () => {
  const { packageId } = useParams<{ packageId: string }>();
  const { updateStep1, updateStep2, updateStep3, updateStepDepartures, updateStep5 } = usePackageWizard();

  useEffect(() => {
    const pkg = getDetailedPackageById(packageId || 'pkg-ladakh-1');
    if (pkg) {
      const mappedType: PackageType = 'Adventure';
      const mappedDifficulty: TripDifficulty = pkg.tripDifficulty === 'Challenging' ? 'Difficult' : (pkg.tripDifficulty as TripDifficulty);

      updateStep1({
        packageName: pkg.packageName,
        shortDescription: pkg.description.slice(0, 140),
        packageType: mappedType,
        tripDifficulty: mappedDifficulty,
      });

      updateStep2({
        primaryDestination: pkg.destination.split(',')[0] || pkg.destination,
        pickupCity: 'Leh Airport',
        dropOffCity: 'Leh Airport',
      });

      updateStep3({
        originalPrice: pkg.originalPrice,
        discountedPrice: pkg.price,
        minTravelers: pkg.minTravelers,
        maxTravelers: pkg.maxTravelers,
      });

      if (pkg.upcomingDepartures && pkg.upcomingDepartures.length > 0) {
        updateStepDepartures({
          departures: pkg.upcomingDepartures.map((d, i) => ({
            id: d.id || `dep-${i + 1}`,
            departureDate: d.departureDate === '15 Jun 2024' ? '2026-09-10' : '2026-09-24',
            departureTime: '09:00',
            timezone: 'Asia/Kolkata (IST)',
            pickupLocation: pkg.accommodation.pickupLocation || 'Leh Airport (IXL)',
            reportingTime: '07:30 AM',
            bookingClosingDate: d.departureDate === '15 Jun 2024' ? '2026-09-05' : '2026-09-19',
            bookingClosingTime: '23:59',
            minimumTravelers: pkg.minTravelers || 8,
            maximumTravelers: pkg.maxTravelers || 20,
            bookedTravelers: d.seatsFilled || 0,
            availableSeats: (pkg.maxTravelers || 20) - (d.seatsFilled || 0),
            status: d.status === 'READY_FOR_TRIP' ? 'Sold Out' : 'Upcoming',
            returnDate: d.departureDate === '15 Jun 2024' ? '2026-09-16' : '2026-09-30',
            returnTime: '09:00',
          })),
        });
      }

      updateStep5({
        coverImage: pkg.coverImage,
      });
    }
  }, [packageId]);

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
