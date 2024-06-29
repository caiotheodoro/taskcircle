/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/lZXJRs1TLqS
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import usePersistStore from '@/app/hooks/stores/persist';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { orgSchema } from '@/lib/formSchema';
import { createOrganization } from '@/server/actions/organization';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { useToast } from '../ui/use-toast';

export function OrganizationForm() {
  const { organization } = usePersistStore();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      description: '',
      name: '',
      slug: '',
    },
  });

  const { execute, status } = useAction(createOrganization, {
    onSuccess() {
      toast({
        title: 'Organization Created.',
        description: 'Your organization has been created successfully',
        className: 'bg-green-500',
      });

      queryClient.invalidateQueries({
        queryKey: ['organization-status'],
      });
    },
  });

  function onSubmit(values: z.infer<typeof orgSchema>) {
    execute({
      ...values,
      name: organization.name,
    });
    form.reset();
  }

  return (
    <Card className="w-full max-w-3xl mx-auto  fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Register {organization.name}
        </CardTitle>
        <CardDescription>Get started with your to-doing!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <div className="grid gap-1.5">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Organization Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a unique slug for your organization"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1.5">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col">
                    <FormLabel>Group Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="max-h-16"
                        placeholder="Describe your group"
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={status === 'executing'}>
              Register
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
