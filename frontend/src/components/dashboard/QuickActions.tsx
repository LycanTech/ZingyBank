import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Receipt, FileText } from 'lucide-react';

const actions = [
  {
    title: 'Transfer Money',
    description: 'Send money between accounts or to others',
    icon: ArrowLeftRight,
    to: '/transfer',
    gradient: 'from-zingy-600 to-red-900',
  },
  {
    title: 'Pay Bills',
    description: 'Make bill and utility payments easily',
    icon: Receipt,
    to: '/payments',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    title: 'View Statements',
    description: 'Download and review your statements',
    icon: FileText,
    to: '/statements',
    gradient: 'from-zingy-700 to-rose-900',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="relative bg-bank-card rounded-xl border border-bank-border hover:border-zingy-800 card-glow-hover transition-all duration-200 group overflow-hidden p-5"
        >
          {/* Subtle background glow */}
          <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-linear-to-br ${action.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${action.gradient} flex items-center justify-center mb-3 shadow-[0_4px_12px_rgba(190,18,60,0.3)]`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-bank-text mb-0.5">{action.title}</h3>
          <p className="text-xs text-bank-muted">{action.description}</p>
        </Link>
      ))}
    </div>
  );
};
