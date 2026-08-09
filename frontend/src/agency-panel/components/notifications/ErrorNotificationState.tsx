import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorNotificationStateProps {
  onRetry: () => void;
}

export const ErrorNotificationState: React.FC<ErrorNotificationStateProps> = ({ onRetry }) => {
  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-2xs text-center space-y-4 select-none my-6">
      <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-7 h-7" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-black text-[#0F172A]">
          Unable to Load Notifications
        </h3>
        <p className="text-xs font-semibold text-slate-400">
          We encountered a connection issue while fetching your agency activity updates. Please try again.
        </p>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black inline-flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Retry Loading</span>
      </button>
    </div>
  );
};

export default ErrorNotificationState;
