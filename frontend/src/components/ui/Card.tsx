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
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
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
      className={`bg-bank-card rounded-xl border border-bank-border ${glow ? 'card-glow' : 'shadow-sm'} ${className}`}
    >
      {header && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-bank-border">
          <h3 className="text-lg font-semibold text-bank-text">{header.title}</h3>
          {header.action && <div>{header.action}</div>}
        </div>
      )}
      <div className={paddingClasses[padding]}>{children}</div>
    </div>
  );
};
