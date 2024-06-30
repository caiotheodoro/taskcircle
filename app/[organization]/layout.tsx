'use client';

import React, { useEffect } from 'react';

import { useGetOrganizationStatus } from '@/hooks/organization';

import useOrganizationStore from '../hooks/stores/organization';

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
