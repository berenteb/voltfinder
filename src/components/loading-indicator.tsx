'use client';

import { TbLoader, TbRefresh } from 'react-icons/tb';

import { Button } from '@/components/button';
import { useChargers } from '@/hooks/use-chargers';

export function LoadingIndicator() {
  const { chargePointDetailsQuery, chargePointsQuery } = useChargers();

  const onRefresh = () => chargePointDetailsQuery.refetch();

  const isLoading = chargePointsQuery.isFetching || chargePointDetailsQuery.isFetching;

  return (
    <div className='absolute mx-auto top-5 left-0 right-0 flex justify-center z-10'>
      <Button disabled={isLoading} onClick={onRefresh} className='flex gap-2 p-2 rounded-md items-center'>
        {isLoading ? <TbLoader className='animate-spin' /> : <TbRefresh />}
        {isLoading ? 'Frissítés...' : 'Frissítés'}
      </Button>
    </div>
  );
}
