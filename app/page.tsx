import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';

import Footer from '@/components/organisms/footer';
import OrganizationList from '@/components/organisms/organization-list';
import { fetchOrganizations } from '@/server/actions/organization';

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.fetchQuery({
    queryKey: ['organizations'],
    queryFn: () => fetchOrganizations(),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <main>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <section className="border-t border-gray-200 p-5 md:p-6 ">
          <OrganizationList />
        </section>
      </HydrationBoundary>
      <Footer />
    </main>
  );
}
