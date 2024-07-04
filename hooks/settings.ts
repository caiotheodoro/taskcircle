import { useQuery } from '@tanstack/react-query';

import { listSettings } from '@/server/actions/settings';

export function useGetOrgSettings(org_name: string) {
  return useQuery({
    queryFn: async () => listSettings({ org_name }),
    queryKey: ['settings'],
    staleTime: 1000 * 60 * 10,
    select: (data) => data.data,
  });
}
