import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { agencyApiClient, AgencyApiResponse } from '../../services/agencyApiClient';
import { AgencyVerificationStatus } from '../../types/agency';

export const AgencyLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAgency } = useAgencyAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await agencyApiClient.post<{
        token: string;
        user: any;
        agency: any;
        mustChangePassword?: boolean;
      }>('/agencies/auth/login', {
        email: email.trim(),
        password: password.trim(),
      }, { requiresAuth: false });

      if (response.data && response.data.token) {
        const { token, user, agency, mustChangePassword } = response.data;
        loginAgency(user, agency, token);

        const status = agency.verificationStatus as AgencyVerificationStatus;
        const isApproved =
          status === AgencyVerificationStatus.APPROVED ||
          (status as any) === 'VERIFIED' ||
          agency.status === 'ACTIVE';

        if (isApproved) {
          if (mustChangePassword || agency.passwordChanged === false) {
            navigate('/agency/create-new-password', { replace: true });
          } else {
            const hasSeenAnim = localStorage.getItem('apnatrip_agency_seen_approval_anim') === 'true';
            if (!hasSeenAnim) {
              navigate('/agency/onboarding/submitted');
            } else {
              navigate('/agency/dashboard');
            }
          }
        } else if (status === AgencyVerificationStatus.PENDING) {
          navigate('/agency/onboarding');
        } else if (status === AgencyVerificationStatus.REJECTED) {
          navigate('/agency/application-rejected');
        } else {
          navigate('/agency/verification-pending');
        }
      } else {
        setError(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Agency login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans select-none">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand / Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#583BE8] text-white shadow-lg shadow-[#583BE8]/30 mb-4">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-[#0F172A]">
          ApnaTrip Partner Portal
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Access your verified agency command center & operations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-100 rounded-3xl"
        >
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Registered Agency Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@youragency.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:border-[#583BE8] focus:bg-white transition-colors"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/agency/forgot-password"
                  className="text-[11px] font-bold text-[#583BE8] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25 hover:bg-[#492de0] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>ApnaTrip Partner Verification System</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Want to partner with ApnaTrip?{' '}
              <Link to="/agency/onboarding" className="text-[#583BE8] font-bold hover:underline">
                Register Your Agency
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencyLoginPage;
