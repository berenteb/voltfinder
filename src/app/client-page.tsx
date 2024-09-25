'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MapProvider } from 'react-map-gl';

import { MapPage } from '@/app/map-page';
import { FirebaseProvider } from '@/components/firebase-context';
import { LocationProvider } from '@/components/location-context';

const queryClient = new QueryClient();

export function ClientPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseProvider>
        <LocationProvider>
          <MapProvider>
            <MapPage />
          </MapProvider>
        </LocationProvider>
      </FirebaseProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
