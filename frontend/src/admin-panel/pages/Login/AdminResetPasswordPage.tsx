import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { resetPasswordAdminService } from '../../services/adminAuth.service';

export const AdminResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Requirements checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial && isMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid or missing password reset token. Please request a new reset link.');
      return;
    }

    if (!isValid) {
      setError('Please ensure your new password satisfies all security requirements.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await resetPasswordAdminService(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Unable to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-4 text-[#6356E5]">
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">TravelOS</h1>
          <p className="text-xs font-bold text-indigo-200/80 uppercase tracking-widest mt-1">
            Super Admin Portal • Security Recovery
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 relative overflow-hidden"
        >
          {isSuccess ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-900">Password Reset Complete</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Your administrator password has been updated securely. All previous device sessions have been revoked.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-black shadow-lg shadow-[#6356E5]/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Proceed to Administrator Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : !token ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900">Invalid Reset Link</h3>
                <p className="text-xs text-slate-500 font-medium">
                  This reset link is missing a secure verification token. Please initiate a new password reset request.
                </p>
              </div>
              <Link
                to="/admin/login"
                className="inline-block text-xs font-bold text-[#6356E5] hover:underline"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1 text-center mb-5">
                <h2 className="text-lg font-black text-slate-900">Create New Password</h2>
                <p className="text-xs text-slate-400 font-semibold">
                  Choose a strong, unique password for your account
                </p>
              </div>

              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* New Password */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    disabled={isSubmitting}
                    className="w-full px-3.5 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Rules Checklist */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1 text-[10px] text-slate-500 font-medium">
                <span className="font-bold text-slate-700 block mb-1">Security Standards:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${hasMinLength ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                    <span className={hasMinLength ? 'text-slate-800 font-bold' : ''}>Min 8 chars</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${hasUpper ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                    <span className={hasUpper ? 'text-slate-800 font-bold' : ''}>1 Uppercase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${hasLower ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                    <span className={hasLower ? 'text-slate-800 font-bold' : ''}>1 Lowercase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${hasNumber && hasSpecial ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                    <span className={hasNumber && hasSpecial ? 'text-slate-800 font-bold' : ''}>Number & Symbol</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] disabled:bg-slate-300 text-white text-xs font-black shadow-lg shadow-[#6356E5]/25 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Set New Password</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
