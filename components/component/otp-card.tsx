import { zodResolver } from '@hookform/resolvers/zod';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { Button } from '@/components/ui/button';
import { requestMembershipSchema } from '@/lib/formSchema';
import { requestMembership } from '@/server/actions/organization';
import { MessageService } from '@/server/messages/generic';
import { OrganizationService } from '@/server/messages/organization';

import { Form, FormField, FormItem } from '../ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp';
import { useToast } from '../ui/use-toast';

export function OtpCard() {
  const { organization } = useOrganizationStore();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof requestMembershipSchema>>({
    resolver: zodResolver(requestMembershipSchema),
    defaultValues: {
      org_id: '',
    },
  });

  const { execute, status } = useAction(requestMembership, {
    onSuccess(data) {
      console.log(data);
      if (!data.error)
        toast({
          title: 'Membership Requested!',
          description: 'Wait for the organization to accept your request',
          variant: 'success',
        });

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
    <div className="mx-auto max-w-md space-y-6 p-4 w-full  fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold">Group Claimed!</h1>
        <p className="text-muted-foreground">
          Enter the group code to join the group
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 flex flex-col gap-8 items-center">
            <FormField
              name="otp"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <InputOTP
                    maxLength={5}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    className="text-3xl"
                    {...field}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full max-w-56"
              disabled={status === 'executing'}
            >
              Join Group
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
