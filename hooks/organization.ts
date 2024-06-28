import { useQuery } from '@tanstack/react-query';

import {
  fetchOrganizations,
  getOrganization,
} from '@/server/actions/organization';

export function useGetOrganizationStatus(organization_name: string) {
  return useQuery({
    queryFn: async () => getOrganization({ organization_name }),
    queryKey: ['organization-status'],
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
  });
}

export function useGetOrganizations() {
  return useQuery({
    queryFn: async () => fetchOrganizations(),
    queryKey: ['organizations'],
    staleTime: 1000 * 60 * 5,
  });
}
