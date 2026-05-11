import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-bank-text/80 mb-2 tracking-tight"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-bank-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`block w-full rounded-xl border bg-white/5 px-4 py-3 text-sm text-bank-text placeholder:text-bank-muted/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-zingy-500/40 focus:border-zingy-500/60 focus:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed ${
              icon ? 'pl-11' : ''
            } ${
              rightIcon ? 'pr-11' : ''
            } ${
              error
                ? 'border-danger/40 focus:ring-danger/30 focus:border-danger/60'
                : 'border-white/10'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-danger/80">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
