import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { useUiStore } from '@/stores/ui.store';

export const AppLayout: React.FC = () => {
  const { sidebarCollapsed } = useUiStore();

  return (
    <div className="min-h-screen bg-bank-bg">
      <Sidebar />

      <div
        className={`transition-all duration-200 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <TopBar />

        <main className="p-4 md:p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileNav />
    </div>
  );
};
