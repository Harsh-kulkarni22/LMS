import { create } from "zustand";

interface ToastState {
  message: string | null;
  showToast: (message: string, durationMs?: number) => void;
  hideToast: () => void;
  durationMs: number;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  durationMs: 4200,
  showToast: (message, durationMs = 4200) => {
    set({ message, durationMs });
  },
  hideToast: () => set({ message: null }),
}));
