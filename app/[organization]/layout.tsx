'use client';

import React, { useEffect } from 'react';

import { redirect } from 'next/navigation';

import { useSession } from 'next-auth/react';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { useGetOrganizationStatus } from '@/hooks/organization';

interface LayoutProps {
  children: React.ReactNode;
  params: {
    organization: string;
  };
}
export default function Layout({
  children,
  params: { organization },
}: Readonly<LayoutProps>) {
  const session = useSession();

  if (!session) redirect('/login');

  const { data, error: orgError } = useGetOrganizationStatus(organization);

  const { setOrganization } = useOrganizationStore();

  useEffect(() => {
    setOrganization(
      data?.organization ?? {
        name: organization,
      },
    );
  }, [organization, setOrganization, data]);

  if (orgError) return orgError.message;

  return children;
}
