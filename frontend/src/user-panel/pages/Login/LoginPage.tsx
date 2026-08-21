import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialButton } from '../../components/common/SocialButton';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';
import { triggerGoogleOAuth } from '../../../utils/googleAuth.util';
import bgAuth from '../../../assets/bg loginsignup.jpg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await userAuthService.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setAuthenticatedUser(data.user);
      showToast('Welcome back to ApnaTrip!', 'success');

      // Existing user logging in -> transfer directly to /home
      if (data.user.onboardingCompleted || data.user.profileCompleted) {
        navigate('/home');
      } else {
        try {
          const onboardingStatus = await userAuthService.getOnboardingStatus();
          if (onboardingStatus?.onboardingComplete) {
            navigate('/home');
          } else if (!data.user.profileCompleted) {
            navigate('/profile-setup');
          } else if (!data.user.preferenceCompleted) {
            navigate('/travel-preferences');
          } else {
            navigate('/home');
          }
        } catch {
          navigate('/home');
        }
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed. Please check your credentials.';
      const lowerMsg = errorMsg.toLowerCase();

      if (lowerMsg.includes('no account') || lowerMsg.includes('create an account')) {
        setErrors({
          email: 'No account found with this email. Please create an account first.',
        });
        showToast('No account found with this email. Please create an account first.', 'error');
      } else if (lowerMsg.includes('incorrect password') || lowerMsg.includes('password')) {
        // Wrong Password: Clear only password field, keep entered email
        setPassword('');
        setErrors({
          password: 'Incorrect password.',
        });
        showToast('Incorrect password.', 'error');
      } else {
        setErrors({ general: errorMsg });
        showToast(errorMsg, 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrors({});

    try {
      const { accessToken } = await triggerGoogleOAuth();
      const data = await userAuthService.googleLogin({
        accessToken,
      });
      setAuthenticatedUser(data.user);

      if (data.isNewUser) {
        showToast('Account created with Google! Complete your profile to get started.', 'success');
        navigate('/profile-setup');
      } else {
        showToast('Welcome back to ApnaTrip!', 'success');
        navigate('/home');
      }
    } catch (err: any) {
      showToast(err.message || 'Google Sign-In failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    showToast('Facebook Login is coming soon.', 'info');
  };

  return (
    <AuthLayout
      heroTitle="Welcome back to your adventure"
      heroSubtitle="Log in to access your saved trips, connect with fellow travelers, and discover exclusive deals."
    >
      {/* Header bar - Only back arrow */}
      <Header
        showBack={true}
        showProgress={false}
        showSkip={false}
      />

      {/* Main Content Form Container */}
      <div className="w-full flex-1 flex flex-col justify-between p-6 sm:p-8 pt-2 sm:pt-4 max-w-md mx-auto relative z-10">
        <div className="space-y-4 sm:space-y-5">
          {/* Top Brand Text */}
          <div className="flex justify-center pb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              ApnaTrip
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Login to continue your adventure
            </p>
          </div>

          {errors.general && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <Input
                isPassword
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-xs font-bold text-[#FF4D6D] hover:underline focus:outline-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              showArrow
              className="mt-2"
            >
              Login
            </Button>
          </form>

          {/* Or Continue With Divider */}
          <div className="flex items-center justify-center gap-3 my-4">
            <div className="h-[1px] bg-slate-200 flex-1 max-w-[70px] sm:max-w-[90px]" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0">
              or continue with
            </span>
            <div className="h-[1px] bg-slate-200 flex-1 max-w-[70px] sm:max-w-[90px]" />
          </div>

          {/* Social Icons (Google & Facebook) */}
          <div className="flex items-center justify-center gap-5 pt-1">
            <SocialButton provider="google" onClick={handleGoogleLogin} />
            <SocialButton provider="facebook" onClick={handleFacebookLogin} />
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm font-medium text-slate-600 pt-1 pb-2">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-bold text-[#FF4D6D] hover:underline focus:outline-none ml-1"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Seamless Bottom Visual Mountain Landscape Artwork */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden mt-auto pointer-events-none">
        <img
          src={bgAuth}
          alt="Travel Mountain Landscape"
          className="w-full h-full object-cover object-top"
        />
        {/* Soft smooth top-fade gradient into white page background */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
      </div>
    </AuthLayout>
  );
};
