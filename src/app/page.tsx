import 'mapbox-gl/dist/mapbox-gl.css';

import { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientPage } from '@/app/client-page';
import { metadata as RootMetadata } from '@/app/layout';
import { getPoolDetails } from '@/common/services/dcs.service';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const id = searchParams?.id;
  if (!id) {
    return RootMetadata;
  }

  const charger = await getPoolDetails([Array.isArray(id) ? id[0] : id]);

  if (!charger) {
    return RootMetadata;
  }

  const location = charger[0].poolLocations[0];
  const name = location.poolLocationNames?.[0].name ?? '';

  return {
    ...RootMetadata,
    title: `${name} | Voltfinder`,
  };
}

export default function Home() {
  return (
    <main className='h-full w-full'>
      <Suspense fallback={<LoadingScreen />}>
        <ClientPage />
      </Suspense>
    </main>
  );
}
