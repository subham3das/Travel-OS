import React from 'react';
import { DesktopSidebar } from '../dashboard/DesktopSidebar';
import { WizardHeader } from './WizardHeader';
import { WizardProgress } from './WizardProgress';
import { WizardFooter } from './WizardFooter';
import { usePackageWizard } from '../../hooks/usePackageWizard';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({ children }) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    resetDraft,
    isCurrentStepValid,
  } = usePackageWizard();

  const handlePrevious = () => {
    prevStep();
  };

  const handleNext = () => {
    if (isCurrentStepValid) {
      if (currentStep < 9) {
        nextStep();
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-24">
        {/* Wizard Header */}
        <WizardHeader
          currentStep={currentStep}
          onPrevStep={prevStep}
          onDiscard={resetDraft}
        />

        {/* Wizard Stepper Progress Bar */}
        <WizardProgress currentStep={currentStep} />

        {/* Step Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Sticky Bottom Action Footer (Steps 1-8) */}
      {currentStep < 9 && (
        <WizardFooter
          currentStep={currentStep}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isNextDisabled={!isCurrentStepValid}
          nextLabel={currentStep === 8 ? 'Preview & Publish' : 'Next'}
        />
      )}
    </div>
  );
};

export default WizardLayout;
