'use client';

import { useCallback } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useGetOrgSettings } from '@/hooks/settings';
import { changeDeletejobSettings } from '@/server/actions/settings';
import { SettingsKey } from '@/server/schema';

import { useToast } from '../ui/use-toast';

export function OrgSettingsPage() {
  const { organization } = useOrganizationStore();
  const { toast } = useToast();
  const queryCLient = useQueryClient();
  const { data, error: settingsError } = useGetOrgSettings(organization.name);

  const { execute: executeChangeDeletejobStatus, status } = useAction(
    changeDeletejobSettings,
    {
      onSuccess(data) {
        if (!data.error)
          toast({
            title: 'Settings updated.',
            description: 'Your settings have been updated successfully',
            variant: 'success',
          });

        queryCLient.invalidateQueries({
          queryKey: ['settings'],
        });
      },
    },
  );

  const handleChangeStatus = useCallback(
    (status: boolean) => {
      executeChangeDeletejobStatus({
        org_id: organization.id,
        enabled: status,
      });
    },
    [executeChangeDeletejobStatus, organization.id],
  );

  if (settingsError) return settingsError.message;

  const deleteJob = data?.success?.find(
    (setting) => setting.key === SettingsKey.DELETE_CHECKED_POSTS,
  );

  if (data.success)
    return (
      <div className="w-full max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Group Settings</CardTitle>
            <CardDescription>Manage your group preferences.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="delete-posts">
                  Enable delete checked posts after 24 hours
                </Label>
                <Switch
                  id="delete-posts"
                  disabled={status === HookActionStatus.EXECUTING}
                  defaultChecked={deleteJob?.enabled || false}
                  onCheckedChange={() =>
                    handleChangeStatus(!deleteJob?.enabled)
                  }
                />
              </div>
              <div className="text-sm text-muted-foreground">
                Automatically delete any posts you have marked as checked after
                24 hours.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
}
