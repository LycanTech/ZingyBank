import React from 'react';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
  success: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  credit: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  cancelled: 'bg-red-100 text-red-800',
  debit: 'bg-red-100 text-red-800',
  overdue: 'bg-red-100 text-red-800',
  inactive: 'bg-gray-100 text-gray-800',
  closed: 'bg-gray-100 text-gray-800',
  frozen: 'bg-blue-100 text-blue-800',
  locked: 'bg-blue-100 text-blue-800',
};

interface BadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, children, className = '' }) => {
  const colorClass = STATUS_COLORS[status.toLowerCase()] || 'bg-gray-100 text-gray-800';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
};
