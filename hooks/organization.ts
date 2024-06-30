import { useQuery } from '@tanstack/react-query';

import {
  fetchOrganizations,
  getOrganization,
  listUsersAndPendingInvites,
} from '@/server/actions/organization';

export function useGetOrganizationStatus(org_name: string) {
  return useQuery({
    queryFn: async () => getOrganization({ org_name }),
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

export function useGetUsersAndInvites(org_name: string) {
  return useQuery({
    queryFn: async () => listUsersAndPendingInvites({ org_name }),
    queryKey: ['users-and-invites'],
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
  });
}
