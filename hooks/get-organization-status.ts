import { useQuery } from '@tanstack/react-query';

import { getOrganization } from '@/server/actions/posts';

export function useGetOrganizations(organization_name: string) {
  return useQuery({
    queryFn: async () => getOrganization({ organization_name }),
    queryKey: ['organizations'],
    staleTime: 1000 * 60 * 5,
    select: (data) => data?.data,
  });
}
