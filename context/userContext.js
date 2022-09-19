import create from 'zustand';

export const useUser = create((set, get) => ({
  Id: 0,
  setId: (newId) => set({ Id: newId }),
  canCreate: false,
  setCanCreate: (newCreateState) => set({ canCreate: newCreateState }),
  projects: [],
  setProjects: (newProjects) => set({ projects: newProjects }),
}));
