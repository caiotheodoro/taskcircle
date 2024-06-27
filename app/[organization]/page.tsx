import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import usePersistStore from '@/app/hooks/stores/persist';
import Organizations from '@/components/organisms/organizations';
import PostForm from '@/components/organisms/post-form';
import Posts from '@/components/organisms/posts';
import { fetchOrganizations, getOrganization } from '@/server/actions/posts';

interface OrganizationProps {
  params: {
    organization: string;
  };
}

export default async function Organization({
  params: { organization },
}: Readonly<OrganizationProps>) {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganization({ organization_name: organization }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        {/* <PostForm /> */}
        <Organizations currOrg={organization} />
        {/* <Posts /> */}
      </HydrationBoundary>
    </main>
  );
}
