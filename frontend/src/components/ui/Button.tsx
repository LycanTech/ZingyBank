import React from 'react';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-zingy-600 hover:bg-zingy-700 text-white focus:ring-zingy-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-bank-text focus:ring-gray-400',
  outline: 'border border-bank-border hover:bg-gray-50 text-bank-text focus:ring-zingy-500',
  ghost: 'hover:bg-gray-100 text-bank-text focus:ring-gray-400',
  danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-lg',
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
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
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
