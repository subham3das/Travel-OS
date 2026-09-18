import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Lock, Eye, EyeOff, Check, X, ArrowRight, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { agencyApiClient } from '../../services/agencyApiClient';
import { useToast } from '../../providers/ToastProvider';

export const AgencyResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const { showSuccess } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Requirement validations
  const requirements = useMemo(() => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { label: 'One number (0-9)', met: /\d/.test(password) },
      { label: 'One special character (!@#$%^&*)', met: /[^A-Za-z0-9]/.test(password) },
    ];
  }, [password]);

  const allRequirementsMet = requirements.every((r) => r.met);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isFormValid = allRequirementsMet && passwordsMatch && token.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (!allRequirementsMet) {
      setError('Please fulfill all password security requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await agencyApiClient.post(
        '/agencies/auth/reset-password',
        {
          token,
          password: password.trim(),
          confirmPassword: confirmPassword.trim(),
        },
        { requiresAuth: false }
      );

      setIsSuccess(true);
      showSuccess(
        'Password Reset Successful',
        'Your password has been updated successfully. Please log in with your new password.'
      );

      // Auto redirect to login after brief animation
      setTimeout(() => {
        navigate('/agency/login', { replace: true });
      }, 2500);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(
        err.message ||
          'Reset link has expired or is invalid. Please request a new password reset link.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Missing token view
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">
            Invalid Reset Link
          </h2>
          <p className="mt-2 text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
            This password reset link is invalid or incomplete. Please request a new link from the forgot password page.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-100 rounded-3xl text-center space-y-4">
            <Link
              to="/agency/forgot-password"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25 hover:bg-[#492de0] transition-all"
            >
              <span>Request New Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/agency/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Agency Login</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand / Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#583BE8] text-white shadow-lg shadow-[#583BE8]/30 mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">
          Create New Password
        </h2>
        <p className="mt-1.5 text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
          Choose a strong, secure password for your ApnaTrip Agency Partner account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-100 rounded-3xl"
        >
          {isSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Password Reset Successful!
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Your password has been updated. Redirecting you to login...
              </p>
              <div className="pt-2">
                <Link
                  to="/agency/login"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25"
                >
                  <span>Go to Login Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-colors"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-2xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:bg-white transition-colors ${
                      confirmPassword && !passwordsMatch
                        ? 'border-rose-300 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#583BE8]'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-1 text-[11px] font-bold text-rose-500">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Requirements Checklist */}
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">
                  Password Requirements:
                </span>
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px]">
                    {req.met ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                    )}
                    <span className={req.met ? 'text-emerald-700 font-bold' : 'text-slate-500'}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || !isFormValid}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25 hover:bg-[#492de0] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                <Link
                  to="/agency/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancel and Return to Login</span>
                </Link>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AgencyResetPasswordPage;
