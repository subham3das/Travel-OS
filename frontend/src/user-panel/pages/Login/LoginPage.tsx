import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { BrandLogo } from '../../../common/brand';
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
      {/* Top Header bar with clean back button */}
      <Header
        showBack={true}
        showProgress={false}
        showSkip={false}
      />

      {/* Main Content Form Container: Centered, Clean SaaS Spacing */}
      <div className="w-full flex-1 flex flex-col justify-center px-6 sm:px-10 py-6 max-w-[440px] mx-auto z-10">
        <div className="space-y-6">
          {/* Top Brand Logo */}
          <div className="flex justify-center">
            <BrandLogo theme="light" className="h-10 sm:h-12 w-auto" alt="ApnaTrip" />
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Log in to continue your adventure and access your trips
            </p>
          </div>

          {errors.general && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
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
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                error={errors.password}
                autoComplete="current-password"
              />
              <div className="flex justify-end pr-1 pt-0.5">
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
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#FF4D6D] to-[#FF3358] hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-[#FF4D6D]/20 transition-all cursor-pointer mt-1"
            >
              Login
            </Button>
          </form>

          {/* Or Continue With Divider */}
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px bg-slate-200/80 flex-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              or continue with
            </span>
            <div className="h-px bg-slate-200/80 flex-1" />
          </div>

          {/* Social Icons (Google & Facebook) */}
          <div className="flex items-center justify-center gap-4">
            <SocialButton provider="google" onClick={handleGoogleLogin} />
            <SocialButton provider="facebook" onClick={handleFacebookLogin} />
          </div>

          {/* Signup Link */}
          <p className="text-center text-xs sm:text-sm font-medium text-slate-500 pt-1">
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

      {/* Subtle bottom spacing to ensure perfect vertical balance */}
      <div className="h-6 shrink-0" />
    </AuthLayout>
  );
};
