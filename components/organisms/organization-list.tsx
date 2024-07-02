'use client';

import React from 'react';

import { AnimatePresence } from 'framer-motion';

import { OrganizationCard } from '@/components/molecules/organization-card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetOrganizations } from '@/hooks/organization';

import WelcomePage from './welcome-page';

export default function OrganizationList() {
  const { data: organizations, error, isLoading } = useGetOrganizations();

  if (error) return error.message;

  if (isLoading)
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6  pt-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-[228px] w-full rounded-xl" />
        ))}
      </section>
    );

  if (organizations?.success?.length === 0) return <WelcomePage />;
  if (organizations?.success)
    return (
      <>
        <h1 className="text-3xl font-bold">Your groups</h1>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6  pt-5">
          <AnimatePresence presenceAffectsLayout>
            {organizations?.success?.map((org) => {
              const { organization, role } = org;

              return (
                <OrganizationCard
                  key={organization.id}
                  {...organization}
                  role={role}
                />
              );
            })}
          </AnimatePresence>
        </section>
      </>
    );
}
