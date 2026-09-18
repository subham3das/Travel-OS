import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, Lock, Check, X, ArrowRight } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { agencyApiClient, AgencyApiResponse } from '../../services/agencyApiClient';

/**
 * Agency Mandatory First Login Password Creation Page
 * Route: /agency/create-new-password
 */
export const AgencyCreatePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { agency, loginAgency, agencyUser, token } = useAgencyAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation rules
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const isFormValid =
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    hasSpecial &&
    passwordsMatch &&
    currentPassword.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please fulfill all password security requirements.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await agencyApiClient.post<{ agency: any }>(
        '/agencies/auth/change-password',
        {
          currentPassword: currentPassword.trim(),
          newPassword: newPassword.trim(),
          confirmPassword: confirmPassword.trim(),
        },
        { requiresAuth: true }
      );

      if (response.success) {
        const updatedAgency = response.data?.agency || {
          ...agency,
          passwordChanged: true,
        };

        // Update local auth context
        if (agencyUser && token) {
          loginAgency(agencyUser, updatedAgency, token);
        }

        // Proceed to Dashboard
        navigate('/agency/dashboard', { replace: true });
      } else {
        setError(response.message || 'Failed to update password. Please check current password.');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.message || 'Failed to set password. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-4 py-8 font-sans select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Security Header Banner */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#583BE8] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#583BE8]/25">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">
            Set Up Your Permanent Password
          </h1>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
            Welcome to ApnaTrip! For your account security, please create a new permanent password to activate your Partner Portal access.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Agency Badge */}
          <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate">
                {agency?.agencyDisplayName || agency?.name || 'Partner Agency'}
              </p>
              <p className="text-[11px] font-medium text-slate-500 truncate">
                Login ID: <strong>{agency?.loginEmail || agency?.email || agencyUser?.email}</strong>
              </p>
            </div>
            {agency?.agencyId && (
              <span className="text-[10px] font-black uppercase text-[#583BE8] bg-white px-2 py-1 rounded-lg border border-purple-200">
                {agency.agencyId}
              </span>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Temporary / Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Temporary Password</label>
              <div className="relative">
                <input
                  type={showCurrentPwd ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter temporary password sent to email"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPwd(!showCurrentPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showCurrentPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPwd ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create strong permanent password"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPwd(!showNewPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Password Rules Checklist */}
            <div className="grid grid-cols-2 gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] font-semibold">
              <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-600' : 'text-slate-400'}`}>
                {hasMinLength ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>8+ characters</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600' : 'text-slate-400'}`}>
                {hasUpper ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>1 Uppercase</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-600' : 'text-slate-400'}`}>
                {hasLower ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>1 Lowercase</span>
              </div>
              <div className={`flex items-center gap-1.5 ${hasNumber && hasSpecial ? 'text-emerald-600' : 'text-slate-400'}`}>
                {hasNumber && hasSpecial ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                <span>Number & Symbol</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white font-extrabold text-sm shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Securing Account...</span>
                </>
              ) : (
                <>
                  <span>Save Password & Access Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgencyCreatePasswordPage;
