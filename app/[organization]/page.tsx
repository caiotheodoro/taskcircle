import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import CententralizedContent from '@/components/molecules/cententralized-content';
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
    queryFn: () => getOrganization({ org_name: organization }),
    staleTime: 1000 * 60 * 10,
  });

  if (!/^[a-zA-Z0-9-]{1,40}$/.test(organization)) {
    return (
      <CententralizedContent>
        <h1 className="text-2xl font-bold text-center">
          Invalid organization name
        </h1>
        <p className="text-center">
          The organization name must be between 1 and 40 characters long and can
          only contain letters, numbers and hyphens (-).
        </p>
      </CententralizedContent>
    );
  }

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Organizations currOrg={organization} />
      </HydrationBoundary>
    </main>
  );
}
