import { create } from 'zustand';

type Organization = {
  id?: string;
  description?: string;
  name: string;
  otp?: string;
  slug?: string;
  role?: string;
};
interface IOrganizationStore {
  organization: Organization;
  setOrganization: (organization: Organization) => void;
}

const initialState = {
  organization: {
    id: '',
    description: '',
    name: '',
    otp: '',
    slug: '',
    role: '',
  },
};

const useOrganizationStore = create<IOrganizationStore>((set) => ({
  ...initialState,
  setOrganization: (organization) => set({ organization }),
}));

export default useOrganizationStore;
