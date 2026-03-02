import { create } from "zustand";

interface AppState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  chatOpen: boolean;
  toggleChat: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  chatOpen: false,
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
}));
