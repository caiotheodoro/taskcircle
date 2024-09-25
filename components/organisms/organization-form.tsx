'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Organization } from '@/app/hooks/stores/organization';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { orgSchema } from '@/lib/formSchema';
import { createOrganization } from '@/server/actions/organization';

interface OrganizationFormProps {
  organization: Organization;
}
export function OrganizationForm({ organization }: OrganizationFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof orgSchema>>({
    resolver: zodResolver(orgSchema),
    defaultValues: {
      description: '',
      name: organization?.name,
      slug: organization?.slug,
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
      queryClient.invalidateQueries({
        queryKey: ['organizations'],
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
          Register {organization?.name}
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
                    <FormLabel>Group Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a slug for your group"
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
