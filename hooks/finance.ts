import { useQuery } from '@tanstack/react-query';

import { fetchFinances } from '@/server/actions/finance';

export function useGetFinances() {
  return useQuery({
    queryFn: async () => fetchFinances(),
    queryKey: ['finances'],
    staleTime: 1000 * 60 * 5,
  });
}
