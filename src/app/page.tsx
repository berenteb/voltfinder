'use client';
import 'mapbox-gl/dist/mapbox-gl.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Suspense } from 'react';
import { MapProvider } from 'react-map-gl';

import { MapPage } from '@/app/map-page';
import { FirebaseProvider } from '@/components/firebase-context';
import { LoadingScreen } from '@/components/loading-screen';
import { LocationProvider } from '@/components/location-context';

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className='h-full w-full'>
      <Suspense fallback={<LoadingScreen />}>
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
      </Suspense>
    </main>
  );
}
