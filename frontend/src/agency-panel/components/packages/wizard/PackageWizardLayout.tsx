import React from 'react';
import { DashboardHeader } from '../../dashboard/DashboardHeader';
import { DesktopSidebar } from '../../dashboard/DesktopSidebar';
import { BottomNavigation } from '../../dashboard/BottomNavigation';
import { WizardHeader } from './WizardHeader';
import { WizardProgress } from './WizardProgress';
import { PackageWizardProvider, usePackageWizard } from '../../../context/PackageWizardContext';

interface PackageWizardLayoutProps {
  currentStep: number;
  stepTitle: string;
  children: React.ReactNode;
}

const WizardInnerShell: React.FC<PackageWizardLayoutProps> = ({
  currentStep,
  stepTitle,
  children,
}) => {
  const { resetDraft } = usePackageWizard();

  return (
    <div className="min-h-screen bg-[#FBFBFE] text-[#0F172A] font-sans select-none flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <DesktopSidebar />

      {/* Main Shell */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen pb-32 md:pb-24">
        {/* Wizard Header */}
        <WizardHeader
          currentStep={currentStep}
          stepTitle={stepTitle}
          onDiscard={resetDraft}
        />

        {/* Wizard Stepper Progress Bar */}
        <WizardProgress currentStep={currentStep} />

        {/* Step Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 max-w-3xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export const PackageWizardLayout: React.FC<PackageWizardLayoutProps> = (props) => {
  return (
    <PackageWizardProvider>
      <WizardInnerShell {...props} />
    </PackageWizardProvider>
  );
};

export default PackageWizardLayout;
