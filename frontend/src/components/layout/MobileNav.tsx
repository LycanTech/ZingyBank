import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  CreditCard,
  MoreHorizontal,
} from 'lucide-react';

const mobileNavItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/more', label: 'More', icon: MoreHorizontal },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-bank-border">
      <div className="flex items-center justify-around h-16">
        {mobileNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-xs font-medium transition-colors ${
                isActive ? 'text-zingy-600' : 'text-bank-muted'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
