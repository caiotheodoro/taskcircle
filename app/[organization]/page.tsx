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

  //verify if the organization name is valid (less than 40 characters, only letters and numbers and -)
  if (!/^[a-zA-Z0-9-]{1,40}$/.test(organization)) {
    return (
      <div className="mx-auto max-w-md space-y-6 p-4 w-full  fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-2xl font-bold text-center">
          Invalid organization name
        </h1>
        <p className="text-center">
          The organization name must be between 1 and 40 characters long and can
          only contain letters, numbers and hyphens (-)
        </p>
      </div>
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
