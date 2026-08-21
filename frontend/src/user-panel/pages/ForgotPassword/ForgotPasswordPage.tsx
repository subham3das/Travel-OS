import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/common/Header';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import { userAuthService } from '../../services/userAuth.service';
import bgAuth from '../../../assets/bg loginsignup.jpg';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await userAuthService.forgotPassword(email.trim().toLowerCase());
      setSubmitted(true);
      showToast('Password reset link has been sent to your email.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send password reset email.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      heroTitle="Reset your password"
      heroSubtitle="Enter your registered email address and we'll send you instructions to reset your password."
    >
      {/* Header bar */}
      <Header
        showBack={true}
        onBack={() => navigate('/login')}
        showProgress={false}
        showSkip={false}
      />

      {/* Main Content Form Container */}
      <div className="w-full flex-1 flex flex-col justify-between p-6 sm:p-8 pt-2 sm:pt-4 max-w-md mx-auto relative z-10">
        <div className="space-y-4 sm:space-y-5">
          {/* Top Brand Text */}
          <div className="flex justify-center pb-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              ApnaTrip
            </span>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
              Forgot Password
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium">
              We'll send you a link to reset your account password.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-emerald-900">Check your email</h4>
              <p className="text-xs text-emerald-700 font-medium">
                We have sent password reset instructions to <strong>{email}</strong>.
              </p>
              <Button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-3 w-full"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <Input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                error={error}
                required
              />

              <Button type="submit" loading={loading} showArrow className="mt-2">
                Send Reset Link
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
