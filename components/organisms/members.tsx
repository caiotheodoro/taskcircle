'use client';

import { useQueryClient } from '@tanstack/react-query';
import { TrashIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import UserCard from '@/components/atoms/user-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useGetUsersAndInvites } from '@/hooks/organization';
import {
  changePendingInvite,
  deleteMembership,
} from '@/server/actions/membership';
import { OrganizationInviteStatus } from '@/server/schema';

export function Members() {
  const { organization } = useOrganizationStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, error: orgError } = useGetUsersAndInvites(organization.name);

  const { execute } = useAction(changePendingInvite, {
    onSuccess(data) {
      if (!data?.error)
        toast({
          title: 'Invite Updated.',
          description: 'The invite status has been updated successfully!',
          variant: 'success',
        });

      queryClient.invalidateQueries({
        queryKey: ['users-and-invites'],
      });
    },
  });

  const handleChangeInvite = (
    user_id: string,
    status: OrganizationInviteStatus,
  ) => {
    execute({
      org_id: organization.id,
      user_id,
      status,
    });
  };

  const { execute: executeDeleteMembership } = useAction(deleteMembership, {
    onSuccess(data) {
      if (!data.error)
        toast({
          title: 'Member removed.',
          description: 'The member has been removed successfully.',
          variant: 'success',
        });

      queryClient.invalidateQueries({
        queryKey: ['users-and-invites'],
      });
    },
  });

  if (orgError) return orgError.message;

  if (data?.success?.users)
    return (
      <div className="flex  w-full">
        <div className="flex flex-1 flex-col">
          <main className="flex-1 p-4 md:p-6">
            <div className="grid gap-8">
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Users</h2>
                </div>
                <div className="mt-4 grid gap-4">
                  {data?.success.users?.length > 0 ? (
                    data?.success.users.map((user) => {
                      const { user: orgUser } = user;

                      return (
                        <UserCard
                          email={orgUser.email}
                          name={orgUser.name}
                          profileImage={orgUser.image}
                          key={orgUser.id}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                            onClick={() =>
                              executeDeleteMembership({
                                org_id: organization.id,
                                user_id: orgUser.id,
                              })
                            }
                          >
                            <TrashIcon className="h-5 w-5" />
                            <span className="sr-only">Remove user</span>
                          </Button>
                        </UserCard>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center p-8 text-center">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          No Users Found
                        </h3>
                        <p className="text-muted-foreground">
                          You haven&apos;t added any users yet.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Pending Invites</h2>
                </div>
                <div className="mt-4 grid gap-4">
                  {data?.success.invites?.length > 0 ? (
                    data?.success.invites.map((user) => {
                      const { user: orgUser } = user;

                      return (
                        <UserCard
                          email={orgUser.email}
                          name={orgUser.name}
                          profileImage={orgUser.image}
                          key={orgUser.id}
                        >
                          <div className="ml-auto flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleChangeInvite(
                                  orgUser.id,
                                  OrganizationInviteStatus.REJECTED,
                                )
                              }
                            >
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleChangeInvite(
                                  orgUser.id,
                                  OrganizationInviteStatus.ACCEPTED,
                                )
                              }
                            >
                              Accept
                            </Button>
                          </div>
                        </UserCard>
                      );
                    })
                  ) : (
                    <div className="flex items-center justify-center p-8 text-center">
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          No Invites Found
                        </h3>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
}
