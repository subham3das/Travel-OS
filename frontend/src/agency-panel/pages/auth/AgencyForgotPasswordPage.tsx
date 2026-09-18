import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { agencyApiClient } from '../../services/agencyApiClient';

export const AgencyForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid registered agency email address.');
      return;
    }

    setIsLoading(true);

    try {
      await agencyApiClient.post(
        '/agencies/auth/forgot-password',
        { email: email.trim().toLowerCase() },
        { requiresAuth: false }
      );
      // Always transition to success state to prevent email enumeration
      setIsSubmitted(true);
    } catch (err: any) {
      // If server returned a rate limit error (429), surface it; otherwise show generic success
      if (err.statusCode === 429 || err.status === 429) {
        setError(err.message || 'Too many password reset requests. Please try again after 1 hour.');
      } else {
        // Fallback to secure message to prevent user enumeration
        setIsSubmitted(true);
      }
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
          Forgot your password?
        </h2>
        <p className="mt-1.5 text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
          Enter your registered email address and we'll send you a secure password reset link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-100 rounded-3xl"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    <span>{error}</span>
                  </motion.div>
                )}

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
                      disabled={isLoading}
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading || !email.trim()}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-[#583BE8] text-white text-xs font-extrabold shadow-md shadow-[#583BE8]/25 hover:bg-[#492de0] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center py-2"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-[#0F172A] mb-2">
                  Check your email
                </h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  If an account exists with this email, we've sent password reset instructions.
                </p>
                <p className="text-[11px] text-slate-400 font-medium mb-6">
                  The link will expire automatically in <strong className="text-slate-600">15 minutes</strong>. If you don't receive an email within a few minutes, please check your spam folder.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="text-xs font-bold text-[#583BE8] hover:underline"
                >
                  Try another email address
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link
              to="/agency/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#583BE8] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Agency Login</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AgencyForgotPasswordPage;
