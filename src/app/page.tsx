import 'mapbox-gl/dist/mapbox-gl.css';

import { Metadata } from 'next';
import { Suspense } from 'react';

import { ClientPage } from '@/app/client-page';
import { metadata as RootMetadata } from '@/app/layout';
import { getMobilitiLocations } from '@/common/services/mobiliti.service';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const id = searchParams?.id;
  if (!id) {
    return RootMetadata;
  }

  const chargers = await getMobilitiLocations();

  const charger = chargers.find((c) => c.id === id);

  if (!charger) {
    return RootMetadata;
  }

  const name = charger.name;

  return {
    ...RootMetadata,
    title: name,
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
