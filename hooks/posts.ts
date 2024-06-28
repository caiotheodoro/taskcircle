import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from '@/server/actions/posts';

export function useGetPosts(organization_name: string) {
  return useQuery({
    queryFn: async () => fetchPosts(organization_name),
    queryKey: ['posts'],
    enabled: !!organization_name,
  });
}
