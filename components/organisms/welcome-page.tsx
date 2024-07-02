import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { newOrgSchema } from '@/lib/formSchema';

import { Form, FormField, FormItem, FormMessage } from '../ui/form';

export default function WelcomePage() {
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
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-6">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Collaborate on tasks with your group
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Organize your group&apos;s tasks and projects in one place.
                    Create groups, assign tasks, and track progress together!
                  </p>
                </div>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex gap-2 max-w-96">
                      <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <Input
                              type="text"
                              placeholder="Group name"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button variant="default" className="w-40" type="submit">
                        Create/Enter a Group
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
              <div className="flex flex-col gap-6 items-center mt-10">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-80">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-green-300">
                        AC
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">Take out the trash</h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow md:ml-44 min-w-80  -ml-14">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback>DA</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold line-through">
                        Do the laundry
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-80">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-pink-400">
                        BE
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold">Buy groceries</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
