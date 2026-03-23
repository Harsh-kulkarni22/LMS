import { create } from "zustand";

interface VideoState {
  currentVideoId: string | null;
  setCurrentVideo: (id: string) => void;
  autoplaying: boolean;
  setAutoplaying: (val: boolean) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideoId: null,
  setCurrentVideo: (id) => set({ currentVideoId: id }),
  autoplaying: true,
  setAutoplaying: (val) => set({ autoplaying: val })
}));
