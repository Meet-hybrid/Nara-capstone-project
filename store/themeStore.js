import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDark: false,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setDark: (value) => set({ isDark: value }),
}));

export default useThemeStore;
