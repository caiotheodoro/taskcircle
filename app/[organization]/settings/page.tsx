import React from 'react';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import CententralizedContent from '@/components/molecules/cententralized-content';
import { OrgSettingsPage } from '@/components/organisms/org-settings';
import { listSettings } from '@/server/actions/settings';

interface SettingsProps {
  params: {
    organization: string;
  };
}
export default async function OrgSettings({
  params: { organization },
}: Readonly<SettingsProps>) {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['settings'],
    queryFn: () => listSettings({ org_name: organization }),
    staleTime: 1000 * 60 * 10,
  });

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
