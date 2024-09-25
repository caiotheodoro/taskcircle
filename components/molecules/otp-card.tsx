import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { requestMembershipSchema } from '@/lib/formSchema';
import { requestMembership } from '@/server/actions/membership';
import { MessageService } from '@/server/messages/generic';
import { OrganizationService } from '@/server/messages/organization';

import { OtpInput } from './otp-input';
import { SubmitButton } from './submit-button';

export function OtpCard() {
  const { organization } = useOrganizationStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof requestMembershipSchema>>({
    resolver: zodResolver(requestMembershipSchema),
    defaultValues: {
      org_id: '',
    },
  });

  const { execute, status } = useAction(requestMembership, {
    onSuccess(data) {
      if (!data.error) {
        toast({
          title: 'Membership Requested!',
          description: 'Wait for the organization to accept your request',
          variant: 'success',
        });

        queryClient.invalidateQueries({
          queryKey: ['organization-status'],
        });
      }

      if (data.error === MessageService.LIMIT_REACHED)
        toast({
          title: 'Error!',
          description:
            'You have reached the limit of requests, please try again later',
          variant: 'destructive',
        });
      if (data.error === OrganizationService.INVALID_OTP)
        toast({
          title: 'Wrong code!',
          description: `You have ${data.retries} retries left`,
          variant: 'destructive',
        });
    },
    onError() {
      toast({
        title: 'Error!',
        description: 'An error occurred while requesting membership',
        variant: 'destructive',
      });
    },
  });

  function onSubmit(values: z.infer<typeof requestMembershipSchema>) {
    execute({
      ...values,
      org_id: organization.id,
    });
    form.reset();
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-4 w-full fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Group Claimed!</h1>
        <p className="text-muted-foreground">
          Enter the group code to join the group
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 flex flex-col gap-8 items-center">
            <OtpInput control={form.control} />
            <SubmitButton
              status={status}
              inviteStatus={organization.inviteStatus}
            >
              {organization?.inviteStatus || 'Join Group'}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}
