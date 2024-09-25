import { Organization } from '../hooks/stores/organization';

export interface OrganizationResponse {
  data: {
    data: {
      status: string;
      organization: Organization;
    };
  };
}
