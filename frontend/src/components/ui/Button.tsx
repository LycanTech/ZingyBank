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
    'bg-gradient-to-r from-zingy-600 to-indigo-600 hover:from-zingy-500 hover:to-indigo-500 text-white shadow-[0_0_16px_rgba(147,51,234,0.3)] hover:shadow-[0_0_20px_rgba(147,51,234,0.5)] focus:ring-zingy-500',
  secondary:
    'bg-bank-border hover:bg-zingy-900 text-bank-text focus:ring-zingy-500',
  outline:
    'border border-bank-border hover:bg-bank-border text-bank-text focus:ring-zingy-500',
  ghost:
    'hover:bg-bank-border text-bank-text focus:ring-zingy-500',
  danger:
    'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white focus:ring-red-500',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
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
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bank-bg disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
