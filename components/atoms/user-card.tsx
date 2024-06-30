import React from 'react';

import { TrashIcon } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface UserCardProps {
  name: string;
  email: string;
  profileImage: string;

  children?: React.ReactNode;
}
export default function UserCard({
  email,
  name,
  profileImage,
  children,
}: Readonly<UserCardProps>) {
  return (
    <Card className="flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={profileImage} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="grid gap-0.5">
          <div className="font-medium">{name}</div>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
      </div>
      {children}
    </Card>
  );
}
