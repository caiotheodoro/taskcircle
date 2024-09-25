import { redirect } from 'next/navigation';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import Nav from '@/components/layouts/nav';
import Footer from '@/components/organisms/footer';
import OrganizationList from '@/components/organisms/organization-list';
import { fetchOrganizations } from '@/server/actions/organization';
import { auth } from '@/server/auth';

export default async function Home() {
  const queryClient = new QueryClient();
  const session = await auth();

  if (!session) redirect('/login');

  await queryClient.fetchQuery({
    queryKey: ['organizations'],
    queryFn: () => fetchOrganizations(),
    staleTime: 1000 * 60 * 10,
  });

  return (
    <div className="p-4 lg:px-20  xl:px-32 sm:px-12 md:px-16 2xl:px-64">
      <Nav />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section className="border-t border-gray-200 p-5 md:p-6 pb-24">
            <OrganizationList />
          </section>
        </HydrationBoundary>
        <Footer />
      </main>
    </div>
  );
}
