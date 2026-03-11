import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Receipt, FileText } from 'lucide-react';

const actions = [
  {
    title: 'Transfer Money',
    description: 'Send money between accounts or to others',
    icon: ArrowLeftRight,
    to: '/transfer',
  },
  {
    title: 'Pay Bills',
    description: 'Make bill and utility payments easily',
    icon: Receipt,
    to: '/payments',
  },
  {
    title: 'View Statements',
    description: 'Download and review your statements',
    icon: FileText,
    to: '/statements',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="bg-white rounded-xl border border-bank-border shadow-sm p-5 hover:shadow-md transition-shadow duration-200 group"
        >
          <div className="w-11 h-11 rounded-full bg-zingy-50 flex items-center justify-center mb-3 group-hover:bg-zingy-100 transition-colors">
            <action.icon className="w-5 h-5 text-zingy-600" />
          </div>
          <h3 className="text-sm font-semibold text-bank-text mb-0.5">{action.title}</h3>
          <p className="text-xs text-bank-muted">{action.description}</p>
        </Link>
      ))}
    </div>
  );
};
