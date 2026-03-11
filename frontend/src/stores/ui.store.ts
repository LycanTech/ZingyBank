import { create } from 'zustand';

interface UiState {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenu: (open: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  mobileMenuOpen: false,
  setMobileMenu: (open: boolean) => set({ mobileMenuOpen: open }),
}));
