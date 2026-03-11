import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bank-bg flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-zingy-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
        <span className="text-white font-bold text-2xl">Z</span>
      </div>

      <h1 className="text-7xl font-extrabold text-zingy-600 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-bank-text mb-2">Page not found</h2>
      <p className="text-bank-muted mb-8 max-w-md">
        The page you are looking for does not exist or has been moved. Let us get you back on track.
      </p>

      <Link to="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>

      <p className="mt-12 text-xs text-bank-muted">
        ZingyBank - Banking Made Simple
      </p>
    </div>
  );
};

export default NotFoundPage;
