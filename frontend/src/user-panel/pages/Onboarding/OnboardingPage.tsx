import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { OnboardingCard } from '../../components/auth/OnboardingCard';

export const OnboardingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < 2) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      navigate('/login');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    navigate('/login');
  };

  return (
    <AuthLayout
      heroTitle="Discover, Connect, and Travel with ApnaTrip"
      heroSubtitle="Your ultimate travel companion for exploring world's best places and joining vibrant traveler communities."
    >
      {/* Header bar on top of all onboarding screens */}
      <Header
        showBack={currentSlide > 0}
        onBack={handleBack}
        showProgress={true}
        currentStep={currentSlide + 1}
        totalSteps={4}
        showSkip={true}
        onSkip={handleSkip}
        variant={currentSlide === 0 ? 'light' : 'dark'}
        className={currentSlide === 0 ? 'absolute top-0 inset-x-0 z-30' : ''}
      />

      {/* Main Onboarding Carousel Card */}
      <OnboardingCard
        currentSlide={currentSlide}
        onNext={handleNext}
        onSelectSlide={(index) => setCurrentSlide(index)}
        onNavigateLogin={() => navigate('/login')}
      />
    </AuthLayout>
  );
};
