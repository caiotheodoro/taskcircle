import React from 'react';

import { redirect } from 'next/navigation';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { Members } from '@/components/organisms/members';
import { listUsersAndPendingInvites } from '@/server/actions/membership';
import { auth } from '@/server/auth';

interface ManageProps {
  params: {
    organization: string;
  };
}

export default async function Manage({
  params: { organization },
}: Readonly<ManageProps>) {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.fetchQuery({
    queryKey: ['users-and-invites'],
    queryFn: () => listUsersAndPendingInvites({ org_name: organization }),
    staleTime: 1000 * 60 * 10,
  });

  if (!session) redirect('/login');

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Members />
      </HydrationBoundary>
    </main>
  );
}
