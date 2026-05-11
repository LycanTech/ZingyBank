import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Receipt, FileText } from 'lucide-react';

const actions = [
  {
    title: 'Transfer Money',
    description: 'Send funds instantly to any account',
    icon: ArrowLeftRight,
    to: '/transfer',
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-[0_6px_20px_rgba(139,92,246,0.35)]',
  },
  {
    title: 'Pay Bills',
    description: 'Manage bills and utility payments',
    icon: Receipt,
    to: '/payments',
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-[0_6px_20px_rgba(99,102,241,0.35)]',
  },
  {
    title: 'View Statements',
    description: 'Download and review your statements',
    icon: FileText,
    to: '/statements',
    gradient: 'from-fuchsia-500 to-pink-600',
    shadow: 'shadow-[0_6px_20px_rgba(217,70,239,0.35)]',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="relative glass-surface rounded-2xl card-glow-hover group overflow-hidden p-6"
        >
          {/* Corner glow orb */}
          <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full bg-linear-to-br ${action.gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />

          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-2xl bg-linear-to-br ${action.gradient} ${action.shadow} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}
          >
            <action.icon className="w-5 h-5 text-white" />
          </div>

          <h3 className="text-sm font-semibold text-bank-text mb-1 tracking-tight">{action.title}</h3>
          <p className="text-xs text-bank-muted leading-relaxed">{action.description}</p>

          {/* Shimmer on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-white/4 to-transparent" />
        </Link>
      ))}
    </div>
  );
};
