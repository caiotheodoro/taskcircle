import { useQuery } from '@tanstack/react-query';

import { fetchPosts } from '@/server/actions/create-post';

export function useGetPosts() {
  return useQuery({
    queryFn: async () => fetchPosts(),
    queryKey: ['posts'],
  });
}
