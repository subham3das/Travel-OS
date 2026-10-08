import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
} from 'lucide-react';
import { BrandLogo } from '../../../common/brand';
import { useAgencyAuthContext, agencyAuthService } from '../../services/agencyAuth.service';

type OnboardingStep = 'CREATE_ACCOUNT' | 'VERIFY_EMAIL';

interface AgencySignupPageProps {
  initialStep?: OnboardingStep;
}

export const AgencySignupPage: React.FC<AgencySignupPageProps> = ({ initialStep }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAgency } = useAgencyAuthContext();

  const initialState = (location.state as any) || {};

  const [step, setStep] = useState<OnboardingStep>(() => {
    if (initialStep) return initialStep;
    if (location.pathname.includes('verify-email')) return 'VERIFY_EMAIL';
    if (initialState.step === 'VERIFY_EMAIL') return 'VERIFY_EMAIL';
    if (initialState.userId) return 'VERIFY_EMAIL';
    return 'CREATE_ACCOUNT';
  });

  // Step 1: Account Fields
  const [name, setName] = useState(initialState.name || '');
  const [email, setEmail] = useState(initialState.email || '');
  const [phone, setPhone] = useState(initialState.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Verification State
  const [userId, setUserId] = useState<string | null>(initialState.userId || null);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [emailCooldown, setEmailCooldown] = useState(60);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'VERIFY_EMAIL' && emailCooldown > 0) {
      timer = setInterval(() => setEmailCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, emailCooldown]);

  // Validation helpers
  const isPasswordComplex = (pass: string) => {
    return (
      pass.length >= 8 &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /[0-9]/.test(pass) &&
      /[^A-Za-z0-9]/.test(pass)
    );
  };

  // STEP 1: Handle Account Creation
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim().replace(/^\+91/, '').replace(/\D/g, '');

    if (cleanName.length < 3 || cleanName.length > 80) {
      setErrorMessage('Owner full name must be between 3 and 80 characters.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please provide a valid business email address.');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (starts with 6, 7, 8, or 9).');
      return;
    }
    if (!isPasswordComplex(password)) {
      setErrorMessage(
        'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character.'
      );
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms & Privacy Policy to create a partner account.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await agencyAuthService.registerAccount({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        password,
        confirmPassword,
        agreeTerms,
      });

      if (res.data?.userId) {
        setUserId(res.data.userId);
        setEmailCooldown(60);
        setStep('VERIFY_EMAIL');
        setSuccessNotice(`Verification code sent to ${cleanEmail}`);
        navigate('/agency/verify-email', {
          state: { userId: res.data.userId, email: cleanEmail, phone: cleanPhone, name: cleanName },
        });
      } else {
        throw new Error(res.message || 'Account registration failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to register account. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // STEP 2: Handle Email OTP Verification & Auto-Login
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const otpCode = emailOtp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the full 6-digit verification code sent to your email.');
      return;
    }
    if (!userId) return;

    setIsSubmitting(true);

    try {
      const res = await agencyAuthService.verifyEmailOtp(userId, otpCode);
      if (res.data?.token && res.data?.user) {
        // Auto-Login authenticated into JWT session
        const businesses = res.data.businesses || [];
        loginAgency(res.data.user, null, res.data.token, undefined, businesses);

        // Redirect directly to Business Selection
        if (businesses.length === 0) {
          navigate('/agency/partner/select-business', { replace: true });
        } else {
          navigate('/agency/dashboard', { replace: true });
        }
      } else {
        throw new Error(res.message || 'Email verification failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid or expired email verification code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendEmailOtp = async () => {
    if (!userId || emailCooldown > 0) return;
    setErrorMessage(null);
    try {
      await agencyAuthService.resendEmailOtp(userId);
      setEmailCooldown(60);
      setSuccessNotice('New verification code sent to your email.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend code.');
    }
  };

  // OTP Input handler helper
  const handleOtpDigitChange = (
    index: number,
    value: string,
    state: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    nextIdPrefix: string
  ) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const updated = [...state];
    updated[index] = digit;
    setter(updated);

    if (digit && index < 5) {
      const nextInput = document.getElementById(`${nextIdPrefix}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    state: string[],
    prevIdPrefix: string
  ) => {
    if (e.key === 'Backspace' && !state[index] && index > 0) {
      const prevInput = document.getElementById(`${prevIdPrefix}-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Password strength
  const getPasswordStrength = (pass: string): { level: number; label: string; color: string } => {
    if (!pass) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwStrength = getPasswordStrength(password);

  const stepIndex = step === 'CREATE_ACCOUNT' ? 0 : 1;
  const steps = ['Account', 'Email Verification'];

  const trustBadges = [
    { icon: ShieldCheck, label: 'SSL Protected' },
    { icon: Mail, label: 'Email Verified' },
    { icon: Lock, label: 'Secure Login' },
  ];

  const leftBenefits = [
    { emoji: '🏆', title: 'Verified Partner Badge', desc: 'Stand out with official ApnaTrip partner certification.' },
    { emoji: '📊', title: 'Dedicated Dashboard', desc: 'Manage bookings, customers, and revenue in one place.' },
    { emoji: '💳', title: 'Secure Payments', desc: 'Instant settlements via Razorpay with full audit trail.' },
    { emoji: '🎯', title: 'Marketing Support', desc: 'Get featured in searches and marketing campaigns.' },
  ];

  return (
    <div
      className="min-h-screen text-[#0F172A] font-sans"
      style={{ background: 'linear-gradient(160deg, #faf9ff 0%, #f0edff 40%, #faf9ff 100%)' }}
    >
      {/* Nav */}
      <nav className="w-full border-b border-slate-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/agency')}
            className="cursor-pointer"
          >
            <BrandLogo theme="light" className="h-8 w-auto" alt="ApnaTrip" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">Already have an account?</span>
            <button
              type="button"
              onClick={() => navigate('/agency/login')}
              className="text-xs font-bold text-[#583BE8] hover:text-[#4529d8] px-3.5 py-2 rounded-xl hover:bg-purple-50 transition-all cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Step Indicator */}
      <div className="w-full bg-white/60 border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-center gap-0">
          {steps.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    i < stepIndex
                      ? 'bg-emerald-500 text-white'
                      : i === stepIndex
                      ? 'bg-[#583BE8] text-white shadow-md shadow-violet-300/40'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {i < stepIndex ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold ${i === stepIndex ? 'text-[#583BE8]' : 'text-slate-400'}`}>
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-0.5 mb-4 transition-all ${i < stepIndex ? 'bg-emerald-400' : 'bg-slate-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main — two column */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* LEFT — Benefits (desktop only) */}
          <div className="hidden lg:flex flex-col gap-8 pt-4">
            <div>
              <h2 className="text-3xl font-black text-[#0F172A] tracking-tight leading-tight">
                Create Your<br />
                <span className="text-[#583BE8]">Partner Account</span>
              </h2>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed font-medium">
                One secure account to manage all your travel businesses.
              </p>
            </div>

            <div className="space-y-4">
              {leftBenefits.map(({ emoji, title, desc }) => (
                <div key={title} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm shrink-0">
                    {emoji}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0F172A]">{title}</div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-2.5">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100">
                  <Icon className="w-4 h-4 text-[#583BE8] shrink-0" />
                  <span className="text-xs font-semibold text-slate-600">{label}</span>
                </div>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              256-bit SSL encrypted. Your data is safe.
            </div>
          </div>

          {/* RIGHT — Form card */}
          <div className="w-full max-w-[540px] mx-auto lg:mx-0">
            <AnimatePresence mode="wait">

              {/* STEP 1: CREATE ACCOUNT */}
              {step === 'CREATE_ACCOUNT' && (
                <motion.div
                  key="step-create-account"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80 space-y-5"
                >
                  {/* Mobile title */}
                  <div className="lg:hidden text-center space-y-1 pb-1">
                    <BrandLogo theme="light" className="h-8 w-auto mx-auto mb-3" alt="ApnaTrip" />
                    <h1 className="text-xl font-black text-[#0F172A]">Create Your Partner Account</h1>
                    <p className="text-xs text-slate-500 font-medium">One secure account for all your travel businesses.</p>
                  </div>

                  <div className="hidden lg:block pb-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-[#583BE8] text-[11px] font-extrabold uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Secure Signup
                    </span>
                    <h1 className="text-xl font-black text-[#0F172A] mt-2">Create Secure Account</h1>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleCreateAccount} className="space-y-4">
                    {/* Owner Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Owner Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Subham Das"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] text-sm font-semibold text-[#0F172A] transition-all bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Business Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Business Email <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@yourbusiness.com"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] text-sm font-semibold text-[#0F172A] transition-all bg-slate-50/50 focus:bg-white lowercase"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex">
                        <div className="flex items-center gap-1.5 px-3 rounded-l-2xl border border-r-0 border-slate-200 bg-slate-100 text-xs font-black text-slate-600 select-none">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className="w-full pl-3 pr-4 py-3 rounded-r-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] text-sm font-semibold text-[#0F172A] transition-all bg-slate-50/50 focus:bg-white"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min 8 chars, 1 uppercase, 1 symbol"
                          className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 focus:border-[#583BE8] text-sm font-semibold text-[#0F172A] transition-all bg-slate-50/50 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {password && (
                        <div className="space-y-1">
                          <div className="flex gap-1 h-1">
                            {[1, 2, 3, 4].map((bar) => (
                              <div
                                key={bar}
                                className={`flex-1 rounded-full transition-all ${
                                  bar <= pwStrength.level ? pwStrength.color : 'bg-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-[10px] font-bold ${
                            pwStrength.level === 4 ? 'text-emerald-500' :
                            pwStrength.level === 3 ? 'text-blue-500' :
                            pwStrength.level === 2 ? 'text-amber-500' : 'text-rose-500'
                          }`}>
                            {pwStrength.label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Confirm Password <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat password"
                          className={`w-full pl-10 pr-10 py-3 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-[#583BE8]/20 text-sm font-semibold text-[#0F172A] transition-all bg-slate-50/50 focus:bg-white ${
                            confirmPassword && confirmPassword !== password
                              ? 'border-rose-400 focus:border-rose-400'
                              : 'border-slate-200 focus:border-[#583BE8]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8] border-slate-300"
                      />
                      <span className="text-xs text-slate-500 font-medium">
                        I agree to ApnaTrip's{' '}
                        <a href="#" className="font-bold text-[#583BE8] hover:underline">Partner Terms</a>
                        {' '}and{' '}
                        <a href="#" className="font-bold text-[#583BE8] hover:underline">Privacy Policy</a>.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#583BE8] hover:bg-[#482de0] text-white text-sm font-black shadow-lg shadow-[#583BE8]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Create Secure Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center pt-1 border-t border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/agency/login')}
                        className="font-black text-[#583BE8] hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: EMAIL OTP */}
              {step === 'VERIFY_EMAIL' && (
                <motion.div
                  key="step-verify-email"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80 space-y-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-50 text-[#583BE8] flex items-center justify-center mx-auto shadow-md shadow-[#583BE8]/10">
                    <Mail className="w-8 h-8" />
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-[#0F172A]">Verify Your Email</h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      Enter the 6-digit code sent to <br />
                      <span className="font-extrabold text-[#0F172A]">{email}</span>
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-rose-700 text-left">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                  {successNotice && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-700 text-left">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>{successNotice}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyEmail} className="space-y-6">
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {emailOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`email-otp-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpDigitChange(idx, e.target.value, emailOtp, setEmailOtp, 'email-otp')}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e, emailOtp, 'email-otp')}
                          className="w-11 sm:w-12 h-14 rounded-2xl border-2 border-slate-200 text-center font-black text-2xl text-[#0F172A] focus:border-[#583BE8] focus:bg-purple-50/40 focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#583BE8] hover:bg-[#482de0] text-white text-sm font-black shadow-lg shadow-[#583BE8]/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Verify Email Address</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <button
                      type="button"
                      onClick={() => setStep('CREATE_ACCOUNT')}
                      className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Change email</span>
                    </button>
                    <button
                      type="button"
                      disabled={emailCooldown > 0}
                      onClick={handleResendEmailOtp}
                      className="font-bold text-[#583BE8] hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      {emailCooldown > 0 ? `Resend in ${emailCooldown}s` : 'Resend code'}
                    </button>
                  </div>
                </motion.div>
              )}


            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-100 py-6 text-center text-xs text-slate-400 bg-white/40">
        © {new Date().getFullYear()} ApnaTrip Platform Inc. All rights reserved. · Enterprise Partner Network
      </footer>
    </div>
  );
};

export default AgencySignupPage;
