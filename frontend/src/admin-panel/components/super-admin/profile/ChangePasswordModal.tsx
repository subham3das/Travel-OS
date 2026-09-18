import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Eye,
  EyeOff,
  Check,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Mail,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { adminProfileManagementService } from '../../../services/adminProfileManagement.service';
import { forgotPasswordAdminService } from '../../../services/adminAuth.service';
import { useAdminAuth } from '../../../context/AdminAuthContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  adminEmail?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  adminEmail,
  onClose,
  onSuccess,
}) => {
  const { admin } = useAdminAuth();
  const effectiveEmail = adminEmail || admin?.email || 'das01subhamj@gmail.com';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Forgot password flow states
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<'confirm' | 'success'>('confirm');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotError, setForgotError] = useState('');

  if (!isOpen) return null;

  // Masked email generator (e.g., das01subhamj@gmail.com -> da**********@gmail.com)
  const maskEmail = (emailStr: string) => {
    if (!emailStr || !emailStr.includes('@')) return 'da**********@gmail.com';
    const [local, domain] = emailStr.split('@');
    if (local.length <= 2) {
      return `${local.charAt(0)}*@${domain}`;
    }
    const prefix = local.slice(0, 2);
    const asterisks = '*'.repeat(Math.max(4, local.length - 2));
    return `${prefix}${asterisks}@${domain}`;
  };

  const maskedEmail = maskEmail(effectiveEmail);

  // Real-time security criteria checks
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      setError('Current password is required.');
      return;
    }
    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setError(
        'New password must meet all security requirements (min 8 chars, uppercase, lowercase, number, and special symbol).'
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    if (currentPassword === newPassword) {
      setError('New password cannot be identical to your current password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      await adminProfileManagementService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetLink = async () => {
    setForgotError('');
    setIsSendingReset(true);
    try {
      await forgotPasswordAdminService(effectiveEmail);
      setForgotStep('success');
    } catch (err: any) {
      setForgotError(
        err?.message || 'Unable to send verification email. Please try again in a few moments.'
      );
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleCloseForgotModal = () => {
    setIsForgotModalOpen(false);
    setForgotStep('confirm');
    setForgotError('');
  };

  const handleDone = () => {
    handleCloseForgotModal();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          onClick={() => {
            if (!isSubmitting) onClose();
          }}
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center border border-purple-100 shadow-2xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A]">Change Password</h3>
                <p className="text-xs text-slate-400 font-semibold">Rotate your administrator credentials</p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 font-bold text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Current Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Current Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotStep('confirm');
                    setForgotError('');
                    setIsForgotModalOpen(true);
                  }}
                  className="text-[10px] font-bold text-[#6356E5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Forgot current password?</span>
                </button>
              </div>

              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                required
              />
            </div>

            {/* New Password */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 8 chars with uppercase, number & symbol"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  disabled={isSubmitting}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#6356E5] focus:bg-white shadow-2xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Security Rules Checklist */}
            <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 space-y-1 text-[10px] text-slate-500 font-medium">
              <span className="font-bold text-slate-700 block mb-1">Password Requirements:</span>
              <div className="grid grid-cols-2 gap-1">
                <div className="flex items-center gap-1.5">
                  <Check className={`w-3 h-3 ${hasMinLength ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                  <span className={hasMinLength ? 'text-slate-800 font-bold' : ''}>Min 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className={`w-3 h-3 ${hasUpper ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                  <span className={hasUpper ? 'text-slate-800 font-bold' : ''}>1 Uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className={`w-3 h-3 ${hasLower ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                  <span className={hasLower ? 'text-slate-800 font-bold' : ''}>1 Lowercase letter</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className={`w-3 h-3 ${hasNumber && hasSpecial ? 'text-emerald-500 stroke-[3]' : 'text-slate-300'}`} />
                  <span className={hasNumber && hasSpecial ? 'text-slate-800 font-bold' : ''}>Number & Symbol</span>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] disabled:bg-slate-300 text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5" />
                )}
                <span>{isSubmitting ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </form>

          {/* ── FORGOT CURRENT PASSWORD SECURE CONFIRMATION & SUCCESS MODAL ── */}
          <AnimatePresence>
            {isForgotModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 z-20"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 10 }}
                  className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 max-w-sm w-full space-y-4 text-center select-none"
                >
                  {forgotStep === 'confirm' ? (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6356E5] flex items-center justify-center mx-auto border border-purple-100 shadow-2xs">
                        <ShieldAlert className="w-6 h-6" />
                      </div>

                      <div className="space-y-1.5 text-left">
                        <h4 className="text-base font-black text-[#0F172A] text-center">
                          Forgot Current Password?
                        </h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          You cannot recover your current password because passwords are securely encrypted. To create a new password, we'll verify your identity by sending a password reset link to your registered administrator email.
                        </p>
                      </div>

                      {/* Display Masked Verification Email */}
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verification Email
                        </span>
                        <span className="text-xs font-mono font-black text-slate-800 block">
                          {maskedEmail}
                        </span>
                      </div>

                      {forgotError && (
                        <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold text-left flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{forgotError}</span>
                        </div>
                      )}

                      <div className="pt-2 flex items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={handleCloseForgotModal}
                          disabled={isSendingReset}
                          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 text-xs font-extrabold cursor-pointer transition-all"
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          onClick={handleSendResetLink}
                          disabled={isSendingReset}
                          className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] disabled:bg-slate-400 text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          {isSendingReset ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending verification email...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5" />
                              <span>Send Reset Link</span>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>

                      <div className="space-y-2 text-center">
                        <h4 className="text-base font-black text-[#0F172A]">
                          Verification Email Sent
                        </h4>
                        <div className="text-xs text-slate-500 font-medium space-y-1.5 leading-relaxed">
                          <p>We've sent a secure password reset link to</p>
                          <p className="font-mono font-black text-slate-800 text-xs bg-slate-50 py-1.5 px-2.5 rounded-xl border border-slate-200">
                            {maskedEmail}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            The link is valid for <span className="font-bold text-slate-700">15 minutes</span>.
                          </p>
                          <p className="text-[11px]">
                            For your security, you'll need to create a new password using that email.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 flex items-center justify-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => window.open('https://mail.google.com', '_blank')}
                          className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                          <span>Open Gmail</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDone}
                          className="px-5 py-2.5 rounded-2xl bg-[#6356E5] hover:bg-[#5244e0] text-white text-xs font-extrabold shadow-md shadow-[#6356E5]/25 cursor-pointer transition-all"
                        >
                          Done
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
