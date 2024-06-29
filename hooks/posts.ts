import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from '@/server/actions/posts';

export function useGetPosts(org_id: string) {
  return useQuery({
    queryFn: async () => fetchPosts(org_id),
    queryKey: ['posts'],
    enabled: !!org_id,
  });
}
