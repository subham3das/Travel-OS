import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAgencyAuth } from '../../hooks/useAgencyAuth';
import { AgencyVerificationStatus } from '../../types/agency';
import { getSubmittedApplication } from '../../services/agencyOnboarding.service';

/**
 * Agency Login Page
 * Route: /agency/login
 */
export const AgencyLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAgency } = useAgencyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email && password) {
      const submittedApp = getSubmittedApplication();
      const status = (submittedApp?.status as AgencyVerificationStatus) || AgencyVerificationStatus.UNDER_REVIEW;

      loginAgency(
        {
          id: 'ag-usr-001',
          agencyId: 'ag-001',
          name: 'Agency Owner',
          email,
          phone: '',
          role: 'owner',
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'ag-001',
          name: submittedApp?.agencyName || 'My Agency',
          slug: 'my-agency',
          email,
          phone: '',
          country: 'India',
          verificationStatus: status,
          applicationId: submittedApp?.applicationId,
          applicationSubmittedAt: submittedApp?.submittedAt,
          rating: 0,
          reviewCount: 0,
          totalPackages: 0,
          totalBookings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        'mock-token-dev'
      );

      // Route according to AgencyVerificationStatus enum switch
      switch (status) {
        case AgencyVerificationStatus.PENDING:
          navigate('/agency/onboarding');
          break;
        case AgencyVerificationStatus.UNDER_REVIEW:
          navigate('/agency/verification-pending');
          break;
        case AgencyVerificationStatus.APPROVED: {
          const hasSeenAnim = localStorage.getItem('apnatrip_agency_seen_approval_anim') === 'true';
          if (!hasSeenAnim) {
            navigate('/agency/onboarding/submitted');
          } else {
            navigate('/agency/dashboard');
          }
          break;
        }
        case AgencyVerificationStatus.REJECTED:
          navigate('/agency/application-rejected');
          break;
        default:
          navigate('/agency/verification-pending');
          break;
      }
    } else {
      setError('Please enter your email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center px-4 font-sans select-none">
      <div className="w-full max-w-md space-y-6">
        {/* Back */}
        <button
          onClick={() => navigate('/agency')}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Agency Portal
        </button>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Agency Sign In</h1>
            <p className="text-xs font-medium text-slate-400">Access your agency portal</p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs font-bold text-rose-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agency@example.com"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-[#0F172A] focus:outline-none focus:border-[#583BE8] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#583BE8] hover:bg-[#492de0] text-white font-extrabold text-sm shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer"
            >
              Sign In to Agency Portal
            </button>
          </form>

          <p className="text-center text-xs font-medium text-slate-400">
            Not registered?{' '}
            <button
              onClick={() => navigate('/agency/onboarding')}
              className="text-[#583BE8] font-bold cursor-pointer"
            >
              Register your agency
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgencyLoginPage;
