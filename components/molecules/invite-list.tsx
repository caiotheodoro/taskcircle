import { EmptyState } from '@/components/atoms/empty-state';
import UserCard from '@/components/atoms/user-card';
import { Button } from '@/components/ui/button';
import { OrganizationInviteStatus } from '@/server/schema';

interface InviteListProps {
  invites: any[];
  onChangeInvite: (userId: string, status: OrganizationInviteStatus) => void;
}

export function InviteList({ invites, onChangeInvite }: InviteListProps) {
  if (invites.length === 0) {
    return <EmptyState title="No Invites Found" />;
  }

  return (
    <>
      {invites.map((invite) => (
        <UserCard
          email={invite.user.email}
          name={invite.user.name}
          profileImage={invite.user.image}
          key={invite.user.id}
        >
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChangeInvite(
                  invite.user.id,
                  OrganizationInviteStatus.REJECTED,
                )
              }
            >
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() =>
                onChangeInvite(
                  invite.user.id,
                  OrganizationInviteStatus.ACCEPTED,
                )
              }
            >
              Accept
            </Button>
          </div>
        </UserCard>
      ))}
    </>
  );
}
