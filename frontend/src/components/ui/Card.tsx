import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: {
    title: string;
    action?: React.ReactNode;
  };
  glow?: boolean;
}

const paddingClasses: Record<string, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  header,
  glow = false,
}) => {
  return (
    <div
      className={`glass-surface rounded-2xl ${glow ? 'card-glow' : ''} ${className}`}
    >
      {header && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <h3 className="text-base font-semibold text-bank-text tracking-tight">{header.title}</h3>
          {header.action && <div>{header.action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
