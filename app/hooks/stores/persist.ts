import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PersistState {
  organization: string;
  setOrganization: (organization: string) => void;
}

const usePersistStore = create<PersistState>()(
  persist(
    (set) => ({
      organization: '',
      setOrganization: (organization) => set({ organization }),
    }),
    {
      name: 'persist-store',
    },
  ),
);

export default usePersistStore;
