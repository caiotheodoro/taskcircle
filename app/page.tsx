import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import Footer from '@/components/organisms/footer';
import Nav from '@/components/organisms/nav';
import OrganizationList from '@/components/organisms/organization-list';
import { fetchOrganizations } from '@/server/actions/organization';

export default async function Home() {
  const queryClient = new QueryClient();

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
