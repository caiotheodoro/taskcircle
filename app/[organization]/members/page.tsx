import React from 'react';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { Members } from '@/components/organisms/members';
import { listUsersAndPendingInvites } from '@/server/actions/organization';

interface ManageProps {
  params: {
    organization: string;
  };
}

export default async function Manage({
  params: { organization },
}: Readonly<ManageProps>) {
  console.log(organization);
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['users-and-invites'],
    queryFn: () => listUsersAndPendingInvites({ org_name: organization }),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Members />
      </HydrationBoundary>
    </main>
  );
}
