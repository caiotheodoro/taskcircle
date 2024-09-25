import { AnimatePresence } from 'framer-motion';
import { TrashIcon } from 'lucide-react';

import { EmptyState } from '@/components/atoms/empty-state';
import UserCard from '@/components/atoms/user-card';
import { Button } from '@/components/ui/button';

interface UserListProps {
  users: any[];
  onDelete: (userId: string) => void;
}

export function UserList({ users, onDelete }: UserListProps) {
  if (users.length === 0) {
    return (
      <EmptyState
        title="No Users Found"
        description="You haven't added any users yet."
      />
    );
  }

  return (
    <AnimatePresence presenceAffectsLayout>
      {users.map((user) => (
        <UserCard
          email={user.user.email}
          name={user.user.name}
          profileImage={user.user.image}
          key={user.user.id}
        >
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            onClick={() => onDelete(user.user.id)}
          >
            <TrashIcon className="h-5 w-5" />
            <span className="sr-only">Remove user</span>
          </Button>
        </UserCard>
      ))}
    </AnimatePresence>
  );
}
