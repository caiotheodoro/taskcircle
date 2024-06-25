import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import PostForm from '@/components/organisms/post-form';
import Posts from '@/components/organisms/posts';
import { fetchPosts } from '@/server/actions/create-post';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });
  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostForm />
        <Posts />
      </HydrationBoundary>
    </main>
  );
}
