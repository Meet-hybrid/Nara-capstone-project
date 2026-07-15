import { create } from 'zustand';

const useThemeStore = create((set) => ({
  isDark: true,
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
  setDark: (value) => set({ isDark: value }),
}));

export default useThemeStore;
