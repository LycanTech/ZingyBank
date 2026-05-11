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
    <header className="h-16 glass-surface border-b border-white/6 flex items-center justify-between px-4 md:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileMenu(true)}
          className="md:hidden p-2 rounded-xl text-bank-muted hover:bg-white/[0.07] hover:text-bank-text transition-all duration-150"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-xl text-bank-muted hover:bg-white/[0.07] hover:text-bank-text transition-all duration-150">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-linear-to-br from-violet-400 to-fuchsia-400 rounded-full shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
        </button>

        <div className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center text-sm font-semibold shadow-[0_0_12px_rgba(139,92,246,0.45)]">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-bank-text tracking-tight">
            {firstName || 'User'}
          </span>
        </div>
      </div>
    </header>
  );
};
