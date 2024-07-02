'use client';

import { useState } from 'react';

import { Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Role } from '@/server/schema';

interface DeleteWithConfirmationProps {
  onDelete: () => void;
  role: Role;
}

export function DeleteWithConfirmation({
  onDelete,
  role,
}: Readonly<DeleteWithConfirmationProps>) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [timer, setTimer] = useState(null);
  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
      setTimer(
        setTimeout(() => {
          setConfirmDelete(false);
        }, 5000),
      );
    }
  };

  const leaveText = role === Role.MEMBER ? 'Leave' : 'Delete';
  return (
    <Button
      variant={confirmDelete ? 'destructive' : 'outline'}
      onClick={handleDelete}
      className=" ml-auto z-10"
    >
      {confirmDelete ? 'Are you sure?' : leaveText}{' '}
      <Trash2Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
