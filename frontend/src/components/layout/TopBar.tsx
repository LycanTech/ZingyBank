import React from 'react';
import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';

export const TopBar: React.FC = () => {
  const { firstName, email } = useAuthStore();
  const { setMobileMenu } = useUiStore();

  const initials = firstName
    ? firstName.charAt(0).toUpperCase()
    : email
      ? email.charAt(0).toUpperCase()
      : 'U';

  return (
    <header className="h-16 bg-white border-b border-bank-border flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenu(true)}
          className="md:hidden p-2 rounded-lg text-bank-muted hover:bg-gray-100 hover:text-bank-text transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-bank-muted hover:bg-gray-100 hover:text-bank-text transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zingy-600 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zingy-600 text-white flex items-center justify-center text-sm font-semibold">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-bank-text">
            {firstName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};
