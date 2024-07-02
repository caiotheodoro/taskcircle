import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { newOrgSchema } from '@/lib/formSchema';

import { Form, FormField, FormItem, FormMessage } from '../ui/form';

export function OrgDialog() {
  const { push: redirect } = useRouter();

  const form = useForm<z.infer<typeof newOrgSchema>>({
    resolver: zodResolver(newOrgSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof newOrgSchema>) {
    redirect(`/${values.name}`);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create/Find A Group</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Place the /name</DialogTitle>
              <DialogDescription>
                Tip: You can access your group by visiting the /name in the URL.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-2 w-full">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Input type="text" placeholder="Group name" {...field} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create/Enter a Group</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
