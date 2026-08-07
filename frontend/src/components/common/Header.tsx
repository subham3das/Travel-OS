import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TopProgressBar } from './ProgressDots';

interface HeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  showProgress?: boolean;
  currentStep?: number;
  totalSteps?: number;
  showSkip?: boolean;
  onSkip?: () => void;
  skipText?: string;
  variant?: 'dark' | 'light';
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack = false,
  onBack,
  showProgress = true,
  currentStep = 1,
  totalSteps = 4,
  showSkip = true,
  onSkip,
  skipText = 'Skip',
  variant = 'dark',
  className = '',
}) => {
  const navigate = useNavigate();
  const isLight = variant === 'light';

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleSkipClick = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={`w-full py-4 px-6 flex items-center justify-between z-20 ${className}`}>
      {/* Left Action: Back Button or spacer */}
      <div className="w-10 flex items-center">
        {showBack ? (
          <button
            onClick={handleBackClick}
            aria-label="Go back"
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors focus:outline-none ${
              isLight
                ? 'text-white hover:bg-white/20'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : null}
      </div>

      {/* Center: Top Progress Bar Line */}
      <div className="flex-1 flex justify-center px-4">
        {showProgress && (
          <TopProgressBar currentStep={currentStep} totalSteps={totalSteps} variant={variant} />
        )}
      </div>

      {/* Right Action: Skip Button */}
      <div className="w-10 flex items-center justify-end">
        {showSkip ? (
          <button
            onClick={handleSkipClick}
            className={`text-sm font-semibold transition-colors focus:outline-none ${
              isLight
                ? 'text-white hover:text-rose-200 drop-shadow-sm'
                : 'text-slate-500 hover:text-[#FF4D6D]'
            }`}
          >
            {skipText}
          </button>
        ) : null}
      </div>
    </header>
  );
};
