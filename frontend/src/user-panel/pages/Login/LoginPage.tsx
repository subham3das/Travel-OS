import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Logo } from '../../components/common/Logo';
import { SocialButton } from '../../components/common/SocialButton';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import bgAuth from '../../../assets/bg loginsignup.jpg';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { emailOrPhone?: string; password?: string } = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      login({
        name: 'Subham Das',
        email: emailOrPhone,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        location: 'Dibrugarh, Assam',
      });
      navigate('/profile-setup');
    }, 1000);
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

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            <Input
              type="text"
              placeholder="Email or Phone number"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.emailOrPhone}
            />

            <div className="space-y-1.5">
              <Input
                isPassword
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
              />
              <div className="flex justify-end pr-1">
                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your email!', 'success')}
                  className="text-xs font-bold text-[#FF4D6D] hover:underline focus:outline-none cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} showArrow className="mt-2">
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

          {/* Social Icons */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <SocialButton provider="google" onClick={() => navigate('/profile-setup')} />
            <SocialButton provider="apple" desktopOnly onClick={() => navigate('/profile-setup')} />
            <SocialButton provider="facebook" onClick={() => navigate('/profile-setup')} />
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
