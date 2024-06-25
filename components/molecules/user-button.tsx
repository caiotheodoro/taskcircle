'use client';

import { LogOut } from 'lucide-react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { FaUser } from 'react-icons/fa';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserButton = ({ user }: Session) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback>
            <FaUser className="text-white" />
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
          className="py-2 px-2 flex items-center font-medium hover:text-destructive cursor-pointer "
          onClick={() => signOut()}
        >
          <LogOut className="mr-4 px-1" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};