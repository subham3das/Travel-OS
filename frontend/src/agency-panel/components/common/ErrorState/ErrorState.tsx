import React from 'react';
import { motion } from 'framer-motion';
import {
  WifiOff,
  ServerCrash,
  ShieldAlert,
  Lock,
  FileQuestion,
  Clock,
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export type ErrorVariant =
  | 'Network Error'
  | 'Server Error'
  | 'Unauthorized'
  | 'Forbidden'
  | '404 Not Found'
  | 'Session Expired'
  | 'No Internet'
  | 'Rate Limited';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  description?: string;
  onRetry?: () => void;
  showBackBtn?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'Server Error',
  title,
  description,
  onRetry,
  showBackBtn = true,
  className = '',
}) => {
  const navigate = useNavigate();

  const getErrorContent = () => {
    switch (variant) {
      case 'Network Error':
        return {
          icon: <WifiOff className="w-8 h-8 text-amber-500" />,
          defaultTitle: 'Network Connection Lost',
          defaultDesc: 'Unable to reach Travel OS servers. Please check your network connection.',
        };
      case 'Unauthorized':
        return {
          icon: <Lock className="w-8 h-8 text-rose-500" />,
          defaultTitle: 'Authentication Required',
          defaultDesc: 'Your session token is unauthenticated. Please log into your agency account.',
        };
      case 'Forbidden':
        return {
          icon: <ShieldAlert className="w-8 h-8 text-rose-600" />,
          defaultTitle: 'Access Forbidden',
          defaultDesc: 'You do not have administrative permission to view or manage this section.',
        };
      case '404 Not Found':
        return {
          icon: <FileQuestion className="w-8 h-8 text-[#583BE8]" />,
          defaultTitle: 'Page Not Found',
          defaultDesc: 'The requested trip, booking or package record could not be found.',
        };
      case 'Session Expired':
        return {
          icon: <Clock className="w-8 h-8 text-amber-600" />,
          defaultTitle: 'Session Expired',
          defaultDesc: 'Your security login session has timed out. Please log in again to continue.',
        };
      case 'No Internet':
        return {
          icon: <WifiOff className="w-8 h-8 text-rose-500" />,
          defaultTitle: 'No Internet Connection',
          defaultDesc: 'Your device appears to be offline. Reconnect to Wi-Fi or cellular data.',
        };
      case 'Rate Limited':
        return {
          icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
          defaultTitle: 'Request Limit Exceeded',
          defaultDesc: 'Too many requests sent. Please pause a moment before retrying.',
        };
      case 'Server Error':
      default:
        return {
          icon: <ServerCrash className="w-8 h-8 text-rose-500" />,
          defaultTitle: 'Internal Server Error',
          defaultDesc: 'Something went wrong on our end. Our engineering team has been alerted.',
        };
    }
  };

  const content = getErrorContent();
  const finalTitle = title || content.defaultTitle;
  const finalDesc = description || content.defaultDesc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 text-center space-y-4 shadow-2xs select-none max-w-lg mx-auto ${className}`}
    >
      <div className="w-16 h-16 rounded-3xl bg-rose-50 flex items-center justify-center mx-auto shadow-xs">
        {content.icon}
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A]">{finalTitle}</h3>
        <p className="text-xs font-semibold text-slate-400 leading-relaxed">{finalDesc}</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-2xl bg-[#583BE8] hover:bg-[#472bd1] text-white text-xs font-black shadow-md shadow-[#583BE8]/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}

        {showBackBtn && (
          <button
            type="button"
            onClick={() => navigate('/agency/dashboard')}
            className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-extrabold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back to Dashboard</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorState;
