import React from 'react';

import { redirect } from 'next/navigation';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import { Members } from '@/components/organisms/members';
import Nav from '@/components/organisms/nav';
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
    <div className="p-4 lg:px-20  xl:px-32 sm:px-12 md:px-16 2xl:px-64">
      <Nav />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Members />
        </HydrationBoundary>
      </main>
    </div>
  );
}
