import { HydrationBoundary } from '@tanstack/react-query';

export default async function Home() {
  return (
    <main>
      <HydrationBoundary>oi</HydrationBoundary>
    </main>
  );
}
