import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showArrow?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = true,
  showArrow = true,
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none select-none';
  
  const sizeStyles = {
    sm: 'h-11 px-5 text-sm rounded-[14px]',
    md: 'h-14 px-6 text-base rounded-[18px]',
    lg: 'h-16 px-8 text-lg rounded-[20px]',
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-coral text-white shadow-coral hover:shadow-lg active:opacity-95',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300',
    outline: 'border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-600 hover:text-[#FF4D6D] hover:bg-rose-50/50',
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.015 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.985 }}
      className={`
        ${baseStyles}
        ${sizeStyles}
        ${variantStyles}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <span className="flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span>{children}</span>
          {showArrow && variant === 'primary' && (
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </span>
      )}
    </motion.button>
  );
};
