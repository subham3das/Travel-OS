import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, CheckCircle2, Circle } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SocialButton } from '../../components/common/SocialButton';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';
import bgAuth from '../../../assets/bg loginsignup.jpg';

const GOOGLE_CLIENT_ID = '834655621185-i6933kmn8cssb9mib6sgtbuh5u1c852t.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthenticatedUser } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-400' };
    if (score === 2) return { score: 2, label: 'Medium', color: 'bg-amber-400' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email address is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the Terms & Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await userAuthService.register({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        confirmPassword,
        acceptTerms: agreeTerms,
      });

      setAuthenticatedUser(data.user);
      showToast('Account created successfully! Welcome to ApnaTrip.', 'success');
      navigate('/profile-setup');
    } catch (err: any) {
      const errorMsg = err.message || 'Registration failed. Please try again.';
      if (errorMsg.toLowerCase().includes('email')) {
        setErrors({ email: errorMsg });
      } else if (errorMsg.toLowerCase().includes('phone')) {
        setErrors({ phone: errorMsg });
      } else if (errorMsg.toLowerCase().includes('password')) {
        setErrors({ password: errorMsg });
      } else {
        setErrors({ general: errorMsg });
      }
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    try {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: async (response: { credential: string }) => {
            try {
              const data = await userAuthService.googleLogin({
                credential: response.credential,
              });
              setAuthenticatedUser(data.user);
              showToast('Account created with Google successfully!', 'success');
              navigate('/profile-setup');
            } catch (err: any) {
              showToast(err.message || 'Google authentication failed.', 'error');
            } finally {
              setLoading(false);
            }
          },
        });

        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            fallbackGoogleSignup();
          }
        });
      } else {
        await fallbackGoogleSignup();
      }
    } catch (err: any) {
      showToast(err.message || 'Google authentication is currently unavailable.', 'error');
      setLoading(false);
    }
  };

  const fallbackGoogleSignup = async () => {
    try {
      const googleEmail = email.includes('@') ? email.trim() : prompt('Enter your Google email address:');
      if (!googleEmail) {
        setLoading(false);
        return;
      }

      const data = await userAuthService.googleLogin({
        email: googleEmail.toLowerCase(),
        name: fullName.trim() || 'Traveler',
      });
      setAuthenticatedUser(data.user);
      showToast('Account created with Google successfully!', 'success');
      navigate('/profile-setup');
    } catch (err: any) {
      showToast(err.message || 'Google authentication failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookSignup = () => {
    showToast('Facebook login is coming soon!', 'info');
  };

  return (
    <AuthLayout
      heroTitle="Create your account & join ApnaTrip"
      heroSubtitle="Start planning your dream vacations, connecting with local guides, and exploring top destinations."
    >
      {/* Header bar - Only back arrow */}
      <Header
        showBack={true}
        showProgress={false}
        showSkip={false}
      />

      {/* Main Form Content Container */}
      <div className="w-full flex-1 flex flex-col justify-between p-6 md:p-8 max-w-md mx-auto relative z-10">
        <div className="space-y-5">
          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Create your account
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Join ApnaTrip and start your journey with amazing experiences.
            </p>
          </div>

          {errors.general && (
            <div className="p-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-3.5">
            <Input
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
              error={errors.fullName}
              required
            />

            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              error={errors.email}
              required
            />

            <Input
              type="tel"
              placeholder="Phone number (+91...)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4" />}
              error={errors.phone}
              required
            />

            <div className="space-y-1.5">
              <Input
                isPassword
                placeholder="Password (min 8 chars, 1 uppercase, 1 number, 1 special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                error={errors.password}
                required
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="flex items-center gap-2 px-1 pt-1">
                  <div className="flex-1 flex gap-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                    <div className={`h-full flex-1 transition-all ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                    <div className={`h-full flex-1 transition-all ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">{strength.label}</span>
                </div>
              )}
            </div>

            <Input
              isPassword
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              required
            />

            {/* Terms Checkbox */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className="flex items-start gap-2 text-left focus:outline-none group cursor-pointer"
              >
                {agreeTerms ? (
                  <CheckCircle2 className="w-5 h-5 text-[#FF4D6D] fill-[#FF4D6D]/10 shrink-0 mt-0.5" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-600 font-medium leading-tight">
                  I agree to the{' '}
                  <span className="text-[#FF4D6D] font-bold hover:underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-[#FF4D6D] font-bold hover:underline">Privacy Policy</span>
                </span>
              </button>
              {errors.terms && (
                <p className="text-xs font-medium text-red-500 ml-7 mt-1">{errors.terms}</p>
              )}
            </div>

            <Button type="submit" loading={loading} showArrow className="mt-3">
              Create Account
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
            <SocialButton provider="google" onClick={handleGoogleSignup} />
            <SocialButton provider="facebook" onClick={handleFacebookSignup} />
          </div>

          {/* Login Link */}
          <p className="text-center text-sm font-medium text-slate-600 pt-1 pb-4">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#FF4D6D] hover:underline focus:outline-none ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Seamless Bottom Visual Mountain Landscape Artwork */}
      <div className="relative w-full h-40 sm:h-48 overflow-hidden mt-auto pointer-events-none">
        <img
          src={bgAuth}
          alt="Travel Landscape Balloons"
          className="w-full h-full object-cover object-top"
        />
        {/* Soft smooth top-fade gradient into white page background */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
      </div>
    </AuthLayout>
  );
};
