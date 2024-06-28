import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import Organizations from '@/components/organisms/organizations';
import { getOrganization } from '@/server/actions/organization';

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
        <Organizations currOrg={organization} />
      </HydrationBoundary>
    </main>
  );
}
