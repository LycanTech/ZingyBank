import React from 'react';

const STATUS_COLORS: Record<string, string> = {
  active:     'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  completed:  'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  success:    'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  approved:   'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  credit:     'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  pending:    'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  processing: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  in_review:  'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  failed:     'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  rejected:   'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  cancelled:  'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  debit:      'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  overdue:    'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  inactive:   'bg-bank-border text-bank-muted ring-1 ring-bank-border',
  closed:     'bg-bank-border text-bank-muted ring-1 ring-bank-border',
  frozen:     'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30',
  locked:     'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30',
};

interface BadgeProps {
  status: string;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, children, className = '' }) => {
  const colorClass =
    STATUS_COLORS[status.toLowerCase()] || 'bg-bank-border text-bank-muted ring-1 ring-bank-border';

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
};
