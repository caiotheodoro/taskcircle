import React from 'react';

import { redirect } from 'next/navigation';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import CententralizedContent from '@/components/molecules/cententralized-content';
import { OrgSettingsPage } from '@/components/organisms/org-settings';
import { listSettings } from '@/server/actions/settings';
import { auth } from '@/server/auth';

interface SettingsProps {
  params: {
    organization: string;
  };
}
export default async function OrgSettings({
  params: { organization },
}: Readonly<SettingsProps>) {
  const queryClient = new QueryClient();
  const session = await auth();

  await queryClient.fetchQuery({
    queryKey: ['settings'],
    queryFn: () => listSettings({ org_name: organization }),
    staleTime: 1000 * 60 * 10,
  });

  if (!session) redirect('/login');

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CententralizedContent>
          <OrgSettingsPage />
        </CententralizedContent>
      </HydrationBoundary>
    </main>
  );
}
