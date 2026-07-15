import { create } from 'zustand';

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  isVerified: false,
  accessToken: null,
  refreshToken: null,

  login: (tokens) =>
    set({
      isAuthenticated: true,
      accessToken: tokens.access,
      refreshToken: tokens.refresh,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      isVerified: false,
      accessToken: null,
      refreshToken: null,
    }),

  setVerified: () => set({ isVerified: true }),
}));

export default useAuthStore;
