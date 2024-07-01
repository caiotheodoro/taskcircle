/**
 * v0 by Vercel.
 * @see https://v0.dev/t/iIgepw1JstN
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from 'next/image';

import { Badge } from '../ui/badge';
import Footer from './footer';

export default function ArchitectureReport() {
  const badges = [
    'React Query',
    'Next.js',
    'shadcn/ui',
    'Next Auth',
    'Supabase',
    'Zustand',
    'Tailwind',
    'Drizzle',
  ];
  return (
    <div className="flex flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-12 lg:py-20 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-2 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Architectural Report
                </h1>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="outline"
                    className="bg-primary text-primary-foreground"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-4 md:py-24 lg:py-4 ">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Entity Relationship Diagram
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Data Model
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The data model is made up of 6 tables, which are users,
                  accounts, organizations, user-organizations, organization-
                  invites and posts.
                </p>
              </div>
            </div>
            <div className="mx-auto  max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12 pl-24">
              <Image
                width={1624}
                height={885}
                src="/erd.svg"
                alt="Entity Relationship Diagram"
                className="mx-auto  rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Sequence Diagram
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Cron Job Workflow
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The cron job workflow is responsible for cleaning organization
                  invites that already expired
                </p>
              </div>
            </div>
            <div className="mx-auto  max-w-3xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/sd.svg"
                width={400}
                height={350}
                alt="Sequence Diagram"
                className="mx-auto rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12  md:py-12 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Sequence Diagram
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Real-time broadcasting
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The broadcasting is responsible for showing new posts in real
                  time, also, it broadcasts new invites to the organization
                  administator
                </p>
              </div>
            </div>
            <div className="mx-auto  max-w-3xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Image
                src="/broadcast.svg"
                width={400}
                height={350}
                alt="Sequence Diagram"
                className="mx-auto rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
