'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MapComponent } from '@/app/map';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className='h-full w-full'>
      <QueryClientProvider client={queryClient}>
        <MapComponent />
      </QueryClientProvider>
    </main>
  );
}