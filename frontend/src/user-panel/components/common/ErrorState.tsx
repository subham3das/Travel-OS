import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, WifiOff, Lock, FileQuestion, RefreshCw } from 'lucide-react';

export type ErrorVariant = 'network' | 'offline' | 'unauthorized' | 'notfound' | 'generic';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'generic',
  title,
  message,
  onRetry,
}) => {
  const getVariantDetails = () => {
    switch (variant) {
      case 'network':
        return {
          icon: <WifiOff className="w-8 h-8 text-amber-600" />,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-100',
          defaultTitle: 'Connection Error',
          defaultMessage: 'Unable to reach ApnaTrip servers. Please check your internet connection and try again.',
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
          defaultTitle: 'You are currently Offline',
          defaultMessage: 'Some features may be limited while offline. Reconnect to sync your latest trip data.',
        };
      case 'unauthorized':
        return {
          icon: <Lock className="w-8 h-8 text-purple-600" />,
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-100',
          defaultTitle: 'Access Restricted',
          defaultMessage: 'Please log in or verify your account credentials to view this page.',
        };
      case 'notfound':
        return {
          icon: <FileQuestion className="w-8 h-8 text-sky-600" />,
          bgColor: 'bg-sky-50',
          borderColor: 'border-sky-100',
          defaultTitle: 'Page or Item Not Found',
          defaultMessage: 'The trip, package, or destination you requested could not be located.',
        };
      default:
        return {
          icon: <AlertCircle className="w-8 h-8 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-100',
          defaultTitle: 'Something Went Wrong',
          defaultMessage: 'An unexpected issue occurred while processing your request. Please try again.',
        };
    }
  };

  const details = getVariantDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-white rounded-3xl p-8 sm:p-12 border border-slate-100/90 shadow-2xs text-center flex flex-col items-center justify-center space-y-4 my-4"
    >
      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${details.bgColor} border ${details.borderColor} flex items-center justify-center shrink-0`}>
        {details.icon}
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="text-base sm:text-lg font-black text-[#0F172A] tracking-tight">
          {title || details.defaultTitle}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed">
          {message || details.defaultMessage}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="py-3 px-6 rounded-2xl bg-[#6356E5] hover:bg-[#5245d6] text-white text-xs sm:text-sm font-extrabold shadow-md shadow-[#6356E5]/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  );
};
