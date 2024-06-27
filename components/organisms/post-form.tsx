'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import usePersistStore from '@/app/hooks/stores/persist';
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
import { formSchema } from '@/lib/formSchema';
import { createPost } from '@/server/actions/posts';

export default function PostForm() {
  const { organization } = usePersistStore();
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      currentOrg: organization,
    },
  });

  const { execute, status } = useAction(createPost, {
    onSuccess(data) {
      if (data?.error) console.log(data.error);
      if (data?.success) {
        console.log('post created');
        queryClient.invalidateQueries();
      }
    },
    onExecute(data) {
      console.log('creating post....');
    },
    onSettled(data) {
      console.log('post created');
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    execute({
      ...values,
      currentOrg: organization,
    });
    form.reset();
  }

  return (
    <main>
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
                <FormControl>
                  <Input placeholder="Wash dishes" {...field} />
                </FormControl>
                <FormMessage />
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
