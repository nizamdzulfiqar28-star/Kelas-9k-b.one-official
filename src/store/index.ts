import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
}));

interface MusicState {
  isPlaying: boolean;
  volume: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
}

export const useMusicStore = create<MusicState>((set) => ({
  isPlaying: false,
  volume: 0.5,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setVolume: (volume) => set({ volume }),
}));
