'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

import usePersistStore from '@/app/hooks/stores/persist';
import { Card, CardContent, CardMotion } from '@/components/ui/card';

import { Button } from '../ui/button';
import { DeleteWithConfirmation } from './delete-with-confirmation';

interface OrganizationCardProps {
  name: string;
  description: string;
  slug: string;
}

export function OrganizationCard({
  description,
  name,
  slug,
}: Readonly<OrganizationCardProps>) {
  return (
    <motion.div
      layout
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      className="group relative overflow-hidden rounded-lg bg-background transition-all hover:shadow-lg border-2 border-secondary"
    >
      <Link
        href={`/${name}`}
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">Access group</span>
      </Link>
      <CardContent className="p-6 grid gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-primary rounded-md p-3 flex items-center justify-center">
            <UsersIcon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-semibold">{slug}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
        <div className="text-sm text-muted-foreground">/{name}</div>
        <DeleteWithConfirmation onDelete={() => console.log('deleted!')} />
      </CardContent>
    </motion.div>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
