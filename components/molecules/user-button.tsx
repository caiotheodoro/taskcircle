'use client';

import { useRouter } from 'next/navigation';

import { LogOut, Settings } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { Role } from '@/server/schema';

export const UserButton = ({ user }: Session) => {
  const { organization } = useOrganizationStore();
  const router = useRouter();
  const isAdmin = organization?.role === Role.ADMIN;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus-visible:invisible">
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className="text-sm font-bold">
            {getInitials(user?.name || '')}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4" align="end">
        <div className="mb-4 p-2 flex flex-col items-start gap-2  rounded-lg">
          <div className="flex items-center gap-4">
            <p className="font-medium text-sm">{user?.name}</p>
          </div>
          <span className="text-xs text-secondary-foreground">
            {user?.email}
          </span>
        </div>
        <DropdownMenuItem
          className="py-2 px-2 flex items-center font-medium cursor-pointer hover:text-blue-500"
          onClick={() => router.push(`/settings`)}
        >
          <Settings className="mr-4 px-1" />
          Account Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          className="py-2 px-2 flex items-center font-medium hover:text-destructive cursor-pointer"
          onClick={() => signOut({ callbackUrl: '/login' })}
        >
          <LogOut className="mr-4 px-1" /> Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
