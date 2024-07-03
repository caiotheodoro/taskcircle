'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Settings2, UserRoundCog, Users } from 'lucide-react';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { Role } from '@/server/schema';

import { ClipboardCrop } from '../molecules/clipboard-crop';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function OrgPanel() {
  const { organization } = useOrganizationStore();
  const router = useRouter();
  const isAdmin = organization?.role === Role.ADMIN;

  if (organization?.slug)
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:invisible">
          <Button variant="outline" size="icon">
            <UserRoundCog className="h-[22px] w-[22px]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-4" align="end">
          <div className="mb-4 p-2 flex flex-col items-start gap-2  rounded-lg">
            <div className="flex items-center gap-4  max-w-48">
              <p
                className="font-medium text-sm truncate"
                title={organization?.name}
              >
                {organization?.name}
              </p>
            </div>
            {organization?.otp && (
              <div className="flex items-center justify-center gap-2 w-full pt-3">
                <ClipboardCrop otp={organization.otp} />
              </div>
            )}
          </div>
          {isAdmin && (
            <>
              <DropdownMenuItem
                className="py-2 px-2 flex items-center font-medium cursor-pointer hover:text-blue-500"
                onClick={() => router.push(`/${organization?.name}/members`)}
              >
                <Users className="mr-4 px-1" />
                Group Members
              </DropdownMenuItem>
              <DropdownMenuItem
                className="py-2 px-2 flex items-center font-medium cursor-pointer hover:text-blue-500"
                onClick={() => router.push(`/${organization?.name}/settings`)}
              >
                <Settings2 className="mr-4 px-1" />
                Group Settings
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
}
