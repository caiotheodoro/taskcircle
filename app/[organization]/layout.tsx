import React from 'react';

import { redirect } from 'next/navigation';

import { auth } from '@/server/auth';

type LayoutProps = {
  children: React.ReactNode;
  params: { organization: string };
};

export default async function Layout({ children }: LayoutProps) {
  const session = await auth();

  if (!session) redirect('/login');

  return <>{children}</>;
}
