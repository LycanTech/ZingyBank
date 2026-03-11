import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="mb-4 text-bank-muted">{icon}</div>
      )}
      <h3 className="text-lg font-semibold text-bank-text mb-1">{title}</h3>
      <p className="text-sm text-bank-muted max-w-sm mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
