import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    'bg-gradient-to-r from-violet-600 via-zingy-500 to-fuchsia-500 hover:from-violet-500 hover:via-zingy-400 hover:to-fuchsia-400 text-white shadow-[0_4px_20px_rgba(139,92,246,0.40)] hover:shadow-[0_6px_32px_rgba(139,92,246,0.55)] focus:ring-zingy-500',
  secondary:
    'bg-white/[0.07] border border-white/[0.12] hover:bg-white/[0.11] text-bank-text focus:ring-zingy-500',
  outline:
    'border border-white/[0.15] hover:bg-white/[0.07] text-bank-text focus:ring-zingy-500',
  ghost:
    'hover:bg-white/[0.07] text-bank-text focus:ring-zingy-500',
  danger:
    'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white shadow-[0_4px_16px_rgba(239,68,68,0.35)] hover:shadow-[0_6px_24px_rgba(239,68,68,0.45)] focus:ring-red-500',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-[15px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bank-bg disabled:opacity-40 disabled:cursor-not-allowed tracking-tight ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Spinner size="sm" className="mr-2 text-current" />
      )}
      {children}
    </button>
  );
};
