import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, AlertCircle, RefreshCw } from 'lucide-react';
import { AdminGoogleButton } from './AdminGoogleButton';
import { AdminSecurityNotice } from './AdminSecurityNotice';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { loginAdminService, loginWithGoogleService } from '../../services/adminAuth.service';

export const AdminLoginCard: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAdminAuth();

  const [loginId, setLoginId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [loginIdError, setLoginIdError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  const handlePasswordToggle = () => setShowPassword((prev) => !prev);

  const validateForm = (): boolean => {
    let valid = true;
    setLoginIdError(null);
    setPasswordError(null);
    setServerError(null);

    if (!loginId.trim()) {
      setLoginIdError('Login ID or Email is required.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    return valid;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading || isGoogleLoading) return;

    setIsLoading(true);

    try {
      const res = await loginAdminService(loginId, password);

      if (res.admin.role !== 'SUPER_ADMIN') {
        setServerError('You do not have permission to access the Admin Portal.');
        setIsLoading(false);
        return;
      }

      loginAdmin(res.admin, res.token, res.refreshToken);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setServerError(err?.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading || isGoogleLoading) return;
    setIsGoogleLoading(true);
    setServerError(null);

    try {
      const res = await loginWithGoogleService();

      if (res.admin.role !== 'SUPER_ADMIN') {
        setServerError('You do not have permission to access the Admin Portal.');
        setIsGoogleLoading(false);
        return;
      }

      loginAdmin(res.admin, res.token, res.refreshToken);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setServerError(
        err?.message || 'This Google account is not authorized to access the Admin Portal.'
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] space-y-6 select-none">
      {/* Heading */}
      <div className="space-y-1.5 text-left">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          Welcome Back
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
          Sign in to access the Admin Portal.
        </p>
      </div>

      {/* Global Server Error */}
      {serverError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
          <button
            type="button"
            onClick={() => setServerError(null)}
            className="text-rose-500 hover:text-rose-700 text-xs font-black cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} noValidate className="space-y-4 text-left">
        {/* Field 1: Login ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#583BE8]" />
            <span>Login ID / Email</span>
          </label>
          <input
            type="text"
            disabled={isLoading || isGoogleLoading}
            value={loginId}
            onChange={(e) => {
              setLoginId(e.target.value);
              if (loginIdError) setLoginIdError(null);
            }}
            placeholder="admin@apnatrip.com"
            className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all ${
              loginIdError
                ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500'
                : 'border-slate-200 focus:border-[#583BE8] focus:bg-white focus:ring-4 focus:ring-[#583BE8]/10'
            }`}
          />
          {loginIdError && (
            <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{loginIdError}</span>
            </p>
          )}
        </div>

        {/* Field 2: Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#583BE8]" />
              <span>Password</span>
            </label>
            <a
              href="#forgot-password"
              onClick={(e) => {
                e.preventDefault();
                alert('Contact system administrator to reset Admin Portal credentials.');
              }}
              className="text-[11px] font-bold text-[#583BE8] hover:underline cursor-pointer"
            >
              Forgot Password?
            </a>
          </div>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              disabled={isLoading || isGoogleLoading}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              placeholder="••••••••••••"
              className={`w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 border text-xs sm:text-sm font-semibold text-[#0F172A] placeholder-slate-400 focus:outline-none transition-all ${
                passwordError
                  ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500'
                  : 'border-slate-200 focus:border-[#583BE8] focus:bg-white focus:ring-4 focus:ring-[#583BE8]/10'
              }`}
            />
            <button
              type="button"
              disabled={isLoading || isGoogleLoading}
              onClick={handlePasswordToggle}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{passwordError}</span>
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              disabled={isLoading || isGoogleLoading}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded text-[#583BE8] focus:ring-[#583BE8] border-slate-300 cursor-pointer"
            />
            <span>Remember Me</span>
          </label>
        </div>

        {/* Primary Action: Sign In */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full py-3.5 px-6 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#583BE8]/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="w-full border-t border-slate-200" />
        <span className="absolute bg-white px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          OR
        </span>
      </div>

      {/* Google SSO Button */}
      <AdminGoogleButton
        onClick={handleGoogleLogin}
        disabled={isLoading}
        isLoading={isGoogleLoading}
      />

      {/* Security Notice */}
      <AdminSecurityNotice />
    </div>
  );
};

export default AdminLoginCard;
