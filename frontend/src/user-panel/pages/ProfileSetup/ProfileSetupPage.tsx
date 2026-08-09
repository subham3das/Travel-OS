import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, Sparkles } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeProfile } = useAuth();
  const [tagline, setTagline] = useState('Passionate about mountain treks & hidden beaches');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Adventure', 'Solo Traveler']);
  const [loading, setLoading] = useState(false);

  const travelStyles = [
    'Backpacker',
    'Luxury Explorer',
    'Adventure',
    'Solo Traveler',
    'Family Trips',
    'Cultural',
    'Roadtripper',
    'Foodie Travel',
  ];

  const toggleStyle = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      completeProfile({ bio: tagline });
      navigate('/travel-preferences');
    }, 800);
  };

  const handleSkip = () => {
    completeProfile({ bio: tagline });
    navigate('/travel-preferences');
  };

  return (
    <AuthLayout
      heroTitle="Set up your traveler passport"
      heroSubtitle="Connect with like-minded travelers and discover tailored travel itineraries designed for your vibe."
    >
      <Header
        showBack={true}
        showProgress={true}
        currentStep={4}
        totalSteps={4}
        showSkip={true}
        skipText="Skip for now"
        onSkip={handleSkip}
      />

      <div className="w-full flex-1 flex flex-col justify-between p-6 md:p-8 max-w-md mx-auto z-10">
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#FF4D6D] text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Final Step</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Complete your profile
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Personalize your travel experience to get tailored recommendations.
            </p>
          </div>

          <form onSubmit={handleComplete} className="space-y-6">
            {/* Avatar Upload Container */}
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-soft flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-tr from-rose-400 to-amber-300 flex items-center justify-center text-white font-extrabold text-2xl">
                    AT
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#FF4D6D] text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">Upload profile photo</span>
            </div>

            {/* Travel Tagline */}
            <Input
              label="Travel Bio / Tagline"
              placeholder="e.g. Seeking hidden waterfalls & local street food"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />

            {/* Select Travel Style Chips */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Select your Travel Vibe (Choose 2 or more)
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {travelStyles.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleStyle(style)}
                      className={`
                        px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 focus:outline-none
                        ${
                          isSelected
                            ? 'bg-[#FF4D6D] text-white shadow-coral scale-105'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      <span>{style}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button type="submit" loading={loading} showArrow className="mt-4">
              Complete Setup
            </Button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};
