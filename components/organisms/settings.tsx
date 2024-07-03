'use client';

import { useCallback, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { HookActionStatus } from '@/app/utils/get-org-status';
import { Button } from '@/components/ui/button';
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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useToast } from '../ui/use-toast';

export function SettingsPage() {
  const { organization } = useOrganizationStore();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
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
      onSettled() {
        console.log('settled');
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

  return (
    <div className="w-full max-w-xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account preferences.</CardDescription>
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
                onCheckedChange={() => handleChangeStatus(!deleteJob?.enabled)}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Automatically delete any posts you have marked as checked after 24
              hours.
            </div>
          </div>
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete your account?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and cannot be undone. All your data will
              be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete Account</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
