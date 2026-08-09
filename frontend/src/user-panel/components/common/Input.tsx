import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  error?: string;
  isPassword?: boolean;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      leftIcon,
      error,
      isPassword = false,
      containerClassName = '',
      className = '',
      type = 'text',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-sm font-medium text-slate-700 ml-1">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {/* Left Icon Pill */}
          {leftIcon && (
            <div className="absolute left-3 z-10 w-9 h-9 rounded-full bg-slate-100/90 flex items-center justify-center text-slate-500 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full h-14 rounded-[18px] bg-white border text-slate-900 placeholder:text-slate-400 font-medium text-base transition-all duration-200 focus:outline-none
              ${leftIcon ? 'pl-14' : 'pl-5'}
              ${isPassword ? 'pr-12' : 'pr-5'}
              ${
                error
                  ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                  : 'border-slate-200/90 hover:border-slate-300 focus:border-[#FF4D6D] focus:ring-4 focus:ring-[#FF4D6D]/10'
              }
              shadow-sm
              ${className}
            `}
            {...props}
          />

          {/* Show/Hide Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}
        </div>

        {/* Error message */}
        {error && (
          <span className="text-xs font-medium text-red-500 ml-2 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
