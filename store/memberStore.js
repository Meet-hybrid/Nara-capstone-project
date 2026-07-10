import { create } from 'zustand';

const useMemberStore = create((set) => ({
  member: null,
  dashboard: null,
  isLoading: false,

  setMember: (member) => set({ member }),

  setDashboard: (dashboard) => set({ dashboard }),

  clearMember: () => set({ member: null, dashboard: null }),
}));

export default useMemberStore;
