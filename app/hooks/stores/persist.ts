import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Organization = {
  id?: string;
  description?: string;
  name: string;
  otp?: string;
  slug?: string;
  role?: string;
};
interface PersistState {
  organization: Organization;
  setOrganization: (organization: Organization) => void;
}

const usePersistStore = create<PersistState>()(
  persist(
    (set) => ({
      organization: {
        id: '',
        description: '',
        name: '',
        otp: '',
        slug: '',
        role: '',
      },
      setOrganization: (organization) => set({ organization }),
    }),
    {
      name: 'persist-store',
    },
  ),
);

export default usePersistStore;
