'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';

import { MapComponent } from '@/app/map';
import { FirebaseProvider } from '@/components/firebase-context';
import { LocationProvider } from '@/components/location-context';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className='h-full w-full'>
      <Suspense fallback={<div>Loading...</div>}>
        <QueryClientProvider client={queryClient}>
          <FirebaseProvider>
            <LocationProvider>
              <MapComponent />
            </LocationProvider>
          </FirebaseProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </Suspense>
    </main>
  );
}
