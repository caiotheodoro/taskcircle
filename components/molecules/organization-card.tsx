'use client';

import Link from 'next/link';

import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UsersIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';

import { CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { deleteOrg } from '@/server/actions/organization';
import { Role } from '@/server/schema';

import { DeleteWithConfirmation } from './delete-with-confirmation';

interface OrganizationCardProps {
  name: string;
  description: string;
  slug: string;

  id: string;

  role: string;
}

export function OrganizationCard({
  description,
  name,
  slug,
  id,
  role,
}: Readonly<OrganizationCardProps>) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { execute: executeDeleteOrg } = useAction(deleteOrg, {
    onSuccess() {
      toast({
        title: 'Organization deleted.',
        description: 'Your task has been deleted successfully',
        variant: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['organizations'],
      });
    },
  });

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
        {role === Role.ADMIN && (
          <DeleteWithConfirmation onDelete={() => executeDeleteOrg({ id })} />
        )}
      </CardContent>
    </motion.div>
  );
}
