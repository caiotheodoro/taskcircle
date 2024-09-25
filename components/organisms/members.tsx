'use client';

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { SectionHeader } from '@/components/atoms/section-header';
import { InviteList } from '@/components/molecules/invite-list';
import { UserList } from '@/components/molecules/user-list';
import { useToast } from '@/components/ui/use-toast';
import { useGetUsersAndInvites } from '@/hooks/organization';
import {
  changePendingInvite,
  deleteMembership,
} from '@/server/actions/membership';
import { createClient } from '@/server/real-time/client';
import { listenToInvites } from '@/server/real-time/watchers';
import { OrganizationInviteStatus } from '@/server/schema';

export function Members() {
  const { organization } = useOrganizationStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, error: orgError } = useGetUsersAndInvites(organization.name);

  const { execute: executeChangePendingInvite } = useAction(
    changePendingInvite,
    {
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
    },
  );

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

  const handleChangeInvite = (
    user_id: string,
    status: OrganizationInviteStatus,
  ) => {
    executeChangePendingInvite({
      org_id: organization.id,
      user_id,
      status,
    });
  };

  const handleDeleteMembership = (user_id: string) => {
    executeDeleteMembership({
      org_id: organization.id,
      user_id,
    });
  };

  useEffect(() => {
    const supabase = createClient();
    const channel = listenToInvites(supabase, organization.id, () => {
      queryClient.invalidateQueries({
        queryKey: ['users-and-invites'],
      });
    });
    return () => {
      supabase.removeChannel(channel);
    };
  }, [organization.id, queryClient]);

  if (orgError) return orgError.message;

  if (!data?.success?.users) return null;

  return (
    <div className="flex w-full">
      <div className="flex flex-1 flex-col">
        <main className="flex-1 p-4 md:p-6">
          <div className="grid gap-8">
            <div>
              <SectionHeader title="Users" />
              <div className="mt-4 grid gap-4">
                <UserList
                  users={data.success.users}
                  onDelete={handleDeleteMembership}
                />
              </div>
            </div>
            <div>
              <SectionHeader title="Pending Invites" />
              <div className="mt-4 grid gap-4">
                <InviteList
                  invites={data.success.invites}
                  onChangeInvite={handleChangeInvite}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
