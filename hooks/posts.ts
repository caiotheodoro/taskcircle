import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPosts } from '@/server/actions/posts';

const POSTS_PER_PAGE = 10;

export function useGetPosts(org_id: string) {
  return useInfiniteQuery({
    queryKey: ['posts', org_id],
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      fetchPosts(org_id, pageParam, POSTS_PER_PAGE),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.success && lastPage.success.length === POSTS_PER_PAGE) {
        return allPages.length;
      }
      return undefined;
    },
    enabled: !!org_id,
  });
}
