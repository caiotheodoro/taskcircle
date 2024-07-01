'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import useOrganizationStore from '@/app/hooks/stores/organization';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { formSchema } from '@/lib/formSchema';
import { createPost } from '@/server/actions/posts';

export default function PostForm() {
  const { toast } = useToast();
  const { organization } = useOrganizationStore();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      org_id: '',
    },
  });

  const { execute, status } = useAction(createPost, {
    onSuccess() {
      toast({
        title: 'Task created!',
        description: 'Your task has been created successfully',
        variant: 'success',
      });

      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
    onError(error) {},
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({
      ...values,
      org_id: organization.id,
    });

    form.reset();
  }

  return (
    <main className="animate-in fade-in-25 duration-300">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 items-end w-full flex gap-5"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Create task</FormLabel>
                <FormMessage />
                <FormControl>
                  <Input placeholder="Wash dishes" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button disabled={status === 'executing'} type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
