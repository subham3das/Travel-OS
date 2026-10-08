import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Check, X } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { BrandLogo } from '../../../common/brand';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';
import bgAuth from '../../../assets/bg loginsignup.jpg';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const { showToast } = useToast();

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenErrorMessage, setTokenErrorMessage] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate reset token on mount
  useEffect(() => {
    let isMounted = true;

    const checkToken = async () => {
      if (!token || token.trim() === '') {
        if (isMounted) {
          setVerifying(false);
          setTokenValid(false);
          setTokenErrorMessage('No password reset token was provided in the link.');
        }
        return;
      }

      try {
        const result = await userAuthService.verifyResetToken(token.trim());
        if (isMounted) {
          setTokenValid(true);
          setMaskedEmail(result?.email || '');
          setVerifying(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setTokenValid(false);
          setTokenErrorMessage(
            err.message || 'Your password reset link has expired or has already been used.'
          );
          setVerifying(false);
        }
      }
    };

    checkToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Validation rules
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const isFormValid =
    hasMinLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecial &&
    password === confirmPassword &&
    confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      if (!hasMinLength || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
        setError(
          'Password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.'
        );
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await userAuthService.resetPassword(token.trim(), password, confirmPassword);
      setSuccess(true);
      showToast('Password updated successfully! Please log in.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password. The link may have expired.');
      showToast(err.message || 'Failed to reset password.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Create New Password"
      heroSubtitle="Your new password must meet our security standards and be different from previous passwords."
    >
      {/* Header bar */}
      <Header
        showBack={true}
        onBack={() => navigate('/login')}
        showProgress={false}
        showSkip={false}
      />

      {/* Main Container */}
      <div className="w-full flex-1 flex flex-col justify-between p-6 sm:p-8 pt-2 sm:pt-4 max-w-md mx-auto relative z-10">
        <div className="space-y-4 sm:space-y-5">
          {/* Top Brand Logo */}
          <div className="flex justify-center pb-1">
            <BrandLogo theme="light" className="h-10 sm:h-11 w-auto" alt="ApnaTrip" />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              Choose a strong, secure password for your traveler account.
            </p>
          </div>

          {/* 1. Verifying Token State */}
          {verifying ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-slate-600 font-medium">
                Verifying password reset link security...
              </p>
            </div>
          ) : !tokenValid ? (
            /* 2. Token Expired or Invalid State */
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-rose-900">Link Expired or Invalid</h4>
                <p className="text-xs sm:text-sm text-rose-700 leading-relaxed font-medium">
                  {tokenErrorMessage ||
                    'This password reset link has expired (15-minute validity) or has already been used.'}
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <Button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="w-full bg-[#FF4D6D] hover:bg-[#E11D48] text-white"
                >
                  Send New Reset Link
                </Button>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Login</span>
                </Link>
              </div>
            </div>
          ) : success ? (
            /* 3. Password Successfully Changed State */
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-emerald-900">Password Reset Complete!</h4>
                <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed font-medium">
                  Your password has been successfully updated. All previous sessions have been logged
                  out for your security.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Proceed to Login
                </Button>
              </div>
            </div>
          ) : (
            /* 4. Active Reset Password Form */
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {maskedEmail && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#FF4D6D]" />
                  <span>Account: {maskedEmail}</span>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
                  {error}
                </div>
              )}

              {/* New Password */}
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError('');
                  }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Checklist */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password Requirements:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div
                    className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>8+ characters</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {hasUppercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>1 uppercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {hasLowercase ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>1 lowercase letter</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {hasNumber ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>1 number (0-9)</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>1 special symbol</span>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 ${password && confirmPassword && password === confirmPassword ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}
                  >
                    {password && confirmPassword && password === confirmPassword ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    <span>Passwords match</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={submitting}
                disabled={!isFormValid || submitting}
                showArrow
                className="mt-2"
              >
                Reset Password
              </Button>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-[#FF4D6D] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Seamless Bottom Visual Mountain Landscape Artwork */}
      <div className="relative w-full h-44 sm:h-52 overflow-hidden mt-auto pointer-events-none">
        <img
          src={bgAuth}
          alt="Travel Mountain Landscape"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent" />
      </div>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
