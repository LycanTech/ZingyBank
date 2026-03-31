import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Receipt,
  Landmark,
  CreditCard,
  FileText,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
} from 'lucide-react';
import { useUiStore } from '@/stores/ui.store';
import { useAuthStore } from '@/stores/auth.store';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/accounts', label: 'Accounts', icon: Wallet },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/payments', label: 'Payments', icon: Receipt },
  { to: '/loans', label: 'Loans', icon: Landmark },
  { to: '/cards', label: 'Cards', icon: CreditCard },
  { to: '/statements', label: 'Statements', icon: FileText },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminRoles = ['ADMIN', 'MANAGER', 'COMPLIANCE_OFFICER'];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, mobileMenuOpen, setMobileMenu } = useUiStore();
  const { roles } = useAuthStore();
  const isAdmin = roles.some((r) => adminRoles.includes(r));

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zingy-900 text-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-zingy-800">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 bg-white rounded-lg flex items-center justify-center">
            <span className="text-zingy-600 font-bold text-xl">Z</span>
          </div>
          {!sidebarCollapsed && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              ZingyBank
            </span>
          )}
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileMenu(false)}
          className="ml-auto p-1 rounded-lg hover:bg-zingy-800 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-zingy-700 text-white'
                  : 'text-zingy-100 hover:bg-zingy-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Observability section — admin/manager only */}
      {isAdmin && (
        <div className="px-2 pb-2 border-t border-zingy-800 pt-3">
          {!sidebarCollapsed && (
            <p className="px-3 mb-1 text-xs font-semibold text-zingy-400 uppercase tracking-wider">
              Observability
            </p>
          )}
          <NavLink
            to="/observability"
            onClick={() => setMobileMenu(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-zingy-700 text-white'
                  : 'text-zingy-100 hover:bg-zingy-800 hover:text-white'
              }`
            }
          >
            <Activity className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && <span>Monitoring</span>}
          </NavLink>
        </div>
      )}

      {/* Collapse toggle - desktop only */}
      <div className="hidden md:block p-2 border-t border-zingy-800">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full px-3 py-2 rounded-lg text-zingy-200 hover:bg-zingy-800 hover:text-white transition-colors duration-150"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:block fixed inset-y-0 left-0 z-30 transition-all duration-200 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenu(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 z-50">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
