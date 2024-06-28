'use client';

import React from 'react';

import { AnimatePresence } from 'framer-motion';

import { useGetOrganizations } from '@/hooks/organization';

import { OrganizationCard } from '../component/organization-card';
import { Skeleton } from '../ui/skeleton';

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

  if (organizations?.success)
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6  pt-5">
        <AnimatePresence presenceAffectsLayout>
          {organizations?.success?.map((org) => {
            const { organization } = org;

            return (
              <OrganizationCard
                key={organization.id}
                description={organization.description}
                name={organization.name}
                slug={organization.slug}
              />
            );
          })}
        </AnimatePresence>
      </section>
    );
}
