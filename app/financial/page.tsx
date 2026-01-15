import { redirect } from 'next/navigation';

import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import Nav from '@/components/layouts/nav';
import Footer from '@/components/organisms/footer';
import FinancePage from '@/components/pages/finance-page';
import { fetchFinances } from '@/server/actions/finance';
import { auth } from '@/server/auth';

export default async function Financial() {
  const queryClient = new QueryClient();
  const session = await auth();

  if (!session) redirect('/login');

  await queryClient.fetchQuery({
    queryKey: ['finances'],
    queryFn: () => fetchFinances(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="p-4 lg:px-20 xl:px-32 sm:px-12 md:px-16 2xl:px-64">
      <Nav />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <section className="border-t border-gray-200 p-5 md:p-6 pb-24 mb-10">
            <FinancePage />
          </section>
        </HydrationBoundary>
        <Footer />
      </main>
    </div>
  );
}
