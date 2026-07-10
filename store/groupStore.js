import { create } from 'zustand';

const useGroupStore = create((set) => ({
  group: null,
  members: [],
  isLoading: false,

  setGroup: (group) => set({ group }),

  setMembers: (members) => set({ members }),

  clearGroup: () => set({ group: null, members: [] }),
}));

export default useGroupStore;
